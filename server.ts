import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

interface TimelineItem {
  id: string;
  period: string;
  title: string;
  elementFocus: string;
  description: string;
  type: 'spring' | 'summer' | 'autumn' | 'winter';
}

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

// Lazy-initialization of GoogleGenAI client to avoid crashes on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("Missing valid GEMINI_API_KEY environment variable.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Check if Gemini API Key is available
function hasGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!(key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "");
}

// ----------------------------------------------------
// Core Saju Math & Fallback Engine
// ----------------------------------------------------

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const STEMS_HANGEUL = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEMS_ELEMENTS = [
  "양목", "음목", "양화", "음화", "양토", "음토", "양금", "음금", "양수", "음수"
];

const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const BRANCHES_HANGEUL = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const BRANCHES_ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const BRANCHES_ELEMENT_KOR = [
  "자수 (수)", "축토 (토)", "인목 (목)", "묘목 (목)", "진토 (토)", "사화 (화)",
  "오화 (화)", "미토 (토)", "신금 (금)", "유금 (금)", "술토 (토)", "해수 (수)"
];

// Map stems or branches to elements
function getElementFromStem(stem: string): "wood" | "fire" | "earth" | "metal" | "water" {
  const i = STEMS.indexOf(stem);
  if (i === 0 || i === 1) return "wood";
  if (i === 2 || i === 3) return "fire";
  if (i === 4 || i === 5) return "earth";
  if (i === 6 || i === 7) return "metal";
  return "water";
}

function getElementFromBranch(branch: string): "wood" | "fire" | "earth" | "metal" | "water" {
  const i = BRANCHES.indexOf(branch);
  if (i === 2 || i === 3) return "wood";  // 寅, 卯
  if (i === 5 || i === 6) return "fire";  // 巳, 午
  if (i === 1 || i === 4 || i === 7 || i === 10) return "earth"; // 丑, 辰, 未, 戌
  if (i === 8 || i === 9) return "metal"; // 申, 酉
  return "water"; // 子, 亥
}

// Traditional formulaic Saju estimation based on Date
function calculateSajuFallback(birthDate: string, birthTime: string, birthLocation: string, mbti: string, name: string) {
  const dateObj = new Date(birthDate);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = birthTime ? parseInt(birthTime.split(":")[0]) : 12;

  // 1. Year Pillar (년주) - 60 Sexagenary estimation
  // 1984 is 甲子 (Stem index 0, Branch index 0)
  const yearDiff = year - 1984;
  let yearStemIndex = (yearDiff % 10 + 10) % 10;
  let yearBranchIndex = (yearDiff % 12 + 12) % 12;

  // Adjust for Special Year Animal representation in screenshots (e.g. 庚辰년 = 경진(庚辰)년 백룡 / White Dragon)
  // Let's make Zodiac animals colored / special based on color of year stem:
  // 甲/乙 = 청(Blue), 丙/丁 = 적(Red), 戊/己 = 황(Yellow), 庚/辛 = 백(White), 壬/癸 = 흑(Black)
  const stemColors = ["청", "청", "적", "적", "황", "황", "백", "백", "흑", "흑"];
  const yearStem = STEMS[yearStemIndex];
  const yearBranch = BRANCHES[yearBranchIndex];
  const yearKorean = STEMS_HANGEUL[yearStemIndex] + BRANCHES_HANGEUL[yearBranchIndex];
  const yearColor = stemColors[yearStemIndex];
  const yearAnimal = yearColor + BRANCHES_ANIMALS[yearBranchIndex]; // e.g. 백용, 흑쥐

  // 2. Month Pillar (월주) - Estimated formulaically
  const monthStemIndex = ((yearStemIndex * 2 + 2) + month) % 10;
  const monthBranchIndex = (month + 1) % 12; // Starts from 寅 (index 2) in solar terms
  const monthStem = STEMS[monthStemIndex];
  const monthBranch = BRANCHES[monthBranchIndex];
  const monthKorean = STEMS_HANGEUL[monthStemIndex] + BRANCHES_HANGEUL[monthBranchIndex];

  // 3. Day Pillar (일주) - Uses simplified date key calculation
  const epoch = new Date("1970-01-01").getTime();
  const dayDiff = Math.floor((dateObj.getTime() - epoch) / (1000 * 60 * 60 * 24));
  // 1970-01-01 is 戊申 (Stem index 4, Branch index 8)
  const dayStemIndex = (dayDiff + 4) % 10;
  const dayBranchIndex = (dayDiff + 8) % 12;
  const dayStem = STEMS[dayStemIndex];
  const dayBranch = BRANCHES[dayBranchIndex];
  const dayKorean = STEMS_HANGEUL[dayStemIndex] + BRANCHES_HANGEUL[dayBranchIndex];

  // 4. Hour Pillar (시주) - Uses hour mapping index
  const hourIndex = Math.floor(((hour + 1) % 24) / 2);
  const hourStemIndex = ((dayStemIndex * 2) + hourIndex) % 10;
  const hourBranchIndex = hourIndex % 12;
  const hourStem = STEMS[hourStemIndex];
  const hourBranch = BRANCHES[hourBranchIndex];
  const hourKorean = STEMS_HANGEUL[hourStemIndex] + BRANCHES_HANGEUL[hourBranchIndex];

  const pillars = {
    yearStem, yearBranch, yearKorean, yearAnimal,
    monthStem, monthBranch, monthKorean,
    dayStem, dayBranch, dayKorean,
    hourStem, hourBranch, hourKorean
  };

  // 5. Element Balance calculation
  const allParts = [
    getElementFromStem(yearStem), getElementFromBranch(yearBranch),
    getElementFromStem(monthStem), getElementFromBranch(monthBranch),
    getElementFromStem(dayStem), getElementFromBranch(dayBranch),
    getElementFromStem(hourStem), getElementFromBranch(hourBranch)
  ];
  
  const elementCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  allParts.forEach(el => elementCounts[el]++);
  
  // Total parts count is 8. Convert to exact sum of 100%
  const elements = {
    wood: Math.round((elementCounts.wood / 8) * 100),
    fire: Math.round((elementCounts.fire / 8) * 100),
    earth: Math.round((elementCounts.earth / 8) * 100),
    metal: Math.round((elementCounts.metal / 8) * 100),
    water: Math.round((elementCounts.water / 8) * 100)
  };

  // Guarantee they make exactly 100
  const sum = elements.wood + elements.fire + elements.earth + elements.metal + elements.water;
  if (sum !== 100) {
    const diff = 100 - sum;
    elements.wood += diff; // Adjust wood fraction
  }

  // 6. Day Master definition
  const dayMaster = dayStem;
  const dayMasterElement = STEMS_ELEMENTS[dayStemIndex];

  // Select a cosmic identity nickname based on Day Master / MBTI pairing
  // (e.g. MBTI INFJ + Wood = 선구자, 영혼의 설계자 etc.)
  const identityNickname = getIdentityNickname(dayMaster, mbti);

  // Daily Luck Score (reproducible based on date to maintain "authenticity")
  const scoreSeed = (year * 3 + month * 7 + day + hour) % 40 + 60; // range 60 - 100
  const dailyLuckScore = scoreSeed;

  // Custom Korea Destiny explanations based on elements
  const primaryElement = Object.entries(elements).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const dailyLuckExplanation = getLuckExplanation(primaryElement);

  return {
    name: name || "천상의 동반자",
    birthDate,
    birthTime: birthTime || "12:00",
    birthLocation: birthLocation || "대한민국 서울",
    mbti: mbti || "INFJ",
    lunasolar: `음력 ${(year - 1).toString().substring(2)}년 ${month}월 ${day}일`,
    dayMaster,
    dayMasterElement,
    identityNickname,
    pillars,
    elements,
    dailyLuckScore,
    dailyLuckExplanation,
    created_at: new Date().toISOString()
  };
}

function getIdentityNickname(dayMaster: string, mbti: string): string {
  const nicknameMap: {[key: string]: string} = {
    "甲": "천성의 개척자",
    "乙": "직관적 설계자",
    "丙": "선도적 조율자",
    "丁": "지혜의 수호자",
    "戊": "중립적 조력자",
    "己": "조화로운 안내자",
    "庚": "강인한 조력자",
    "辛": "빛나는 심판관",
    "壬": "심연의 관조자",
    "癸": "생명의 유동자"
  };
  const mbtiQualifiers: {[key: string]: string} = {
    "INFJ": "선구자 (영혼의 설계자)",
    "INFP": "이상가 (내면의 조화자)",
    "ENFJ": "지도자 (빛의 선도자)",
    "ENFP": "탐험가 (창조적 영감자)",
    "INTJ": "전략가 (이성의 지배자)",
    "INTP": "사색가 (진리의 탐구자)",
    "ENTJ": "통솔자 (용맹한 지휘관)",
    "ENTP": "변론가 (지혜의 변혁자)",
    "ISFJ": "수호자 (고요한 안식처)",
    "ISFP": "예술가 (아름다움의 사절)",
    "ESFJ": "외교관 (따뜻한 동행자)",
    "ESFP": "활동가 (기쁨의 수호자)",
    "ISTJ": "현실주의자 (질서의 수호인)",
    "ISTP": "만능재주꾼 (예리한 명장)",
    "ESTJ": "경영자 (올바른 중재인)",
    "ESTP": "모험가 (우주적 역동가)"
  };

  const dayMasterWord = nicknameMap[dayMaster] || "별하늘의 방랑자";
  const mbtiWord = mbtiQualifiers[mbti.toUpperCase()] || "조화로운 자";
  return `${dayMasterWord} & ${mbtiWord}`;
}

function getLuckExplanation(element: string): string {
  switch (element) {
    case "wood":
      return "당신의 목(木) 기운이 오늘의 계절감과 완벽하게 공명하여, 닫혀 있던 막혔던 흐름을 뚫어내고 구조적인 창의성을 비약적으로 촉진시킵니다.";
    case "fire":
      return "당신의 내면에 품은 화(火) 기운이 활활 불타오르면서 열정이 솟구치나, 지나친 소모를 방지하기 위해 중용과 휴식을 취하는 전략이 유효합니다.";
    case "earth":
      return "대지의 토(土) 에너지가 당신의 주위를 무겁고 안전하게 감싸 누릅니다. 금전 거래나 장기 투자를 논의하기에 지극히 상서로운 중심적인 날입니다.";
    case "metal":
      return "새벽이슬 같은 금(金) 기운이 오늘 온 세상을 하얗게 정화해 가르 지릅니다. 불필요한 생각들을 단호히 도려내고 인생의 핵심 가치들에 초점을 맞추세요.";
    case "water":
      default:
      return "당신의 수(水) 기운이 깊고 넓은 오라클 흐름과 완벽에 가깝게 조화를 이루어, 깊은 직관력과 우주적인 내면 통찰력을 자극해 지혜를 불어넣어 줍니다.";
  }
}

// ----------------------------------------------------
// API Route Handlers
// ----------------------------------------------------

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", gemini_connected: hasGeminiKey() });
});

// Calculate Profile (Optionally enriched with Gemini AI)
app.post("/api/saju/calculate", async (req, res) => {
  const { birthDate, birthTime, birthLocation, mbti, name } = req.body;

  if (!birthDate) {
    return res.status(400).json({ error: "생년월일(birthDate) 입력이 필수적입니다." });
  }

  // First calculate the standard offline mathematical components
  const profile = calculateSajuFallback(birthDate, birthTime, birthLocation, mbti, name);

  if (!hasGeminiKey()) {
    // Return standard computed response if Gemini API key isn't provided
    return res.json(profile);
  }

  try {
    const ai = getAiClient();
    
    // Request Gemini to enrich the Saju Analysis and MBTI synergy in a highly personalized mystical tone
    const prompt = `
    다음은 사주 산출 데이터와 MBTI 데이터입니다:
    - 이름: ${profile.name}
    - 생년월일: ${profile.birthDate} - 태어난 시: ${profile.birthTime}
    - 출생지: ${profile.birthLocation}
    - MBTI: ${profile.mbti}
    - 산출된 사주 팔자 (년/월/일/시):
      년주: ${profile.pillars.yearStem}${profile.pillars.yearBranch} (${profile.pillars.yearKorean}년 ${profile.pillars.yearAnimal})
      월주: ${profile.pillars.monthStem}${profile.pillars.monthBranch}
      일주: ${profile.pillars.dayStem}${profile.pillars.dayBranch} (본성 일간: ${profile.dayMaster})
      시주: ${profile.pillars.hourStem}${profile.pillars.hourBranch}
    - 오행 비율: 목(${profile.elements.wood}%), 화(${profile.elements.fire}%), 토(${profile.elements.earth}%), 금(${profile.elements.metal}%), 수(${profile.elements.water}%)

    이 정보를 바탕으로 사주 명리학에 의거한 '선구자' 정체성 분석 요약과 오늘의 천문 기운(행운 지수: ${profile.dailyLuckScore}%)에 대해 한국어로 분석해 주세요.
    결과물은 다음 JSON 형식으로만 반환해 주세요:
    {
      "identityNickname": "정체성에 어울리는 아주 신비하고 직조감 있는 새 칭호 명칭 한 줄",
      "dailyLuckExplanation": "사주 오행 및 일간을 토대로 한 상서로운 오늘의 기운 흐름 한글 요약 (3-4줄 내외로 신비롭고 우아한 어조)",
      "dynamicZodiacSajuDetail": "전체 사주의 흐름과 음양오행의 균형도를 종합적으로 진단하는 매력적 요약 설명"
    }
    `;

    const chatResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(chatResponse.text || "{}");
    
    if (parsedJson.identityNickname) profile.identityNickname = parsedJson.identityNickname;
    if (parsedJson.dailyLuckExplanation) profile.dailyLuckExplanation = parsedJson.dailyLuckExplanation;
    if (parsedJson.dynamicZodiacSajuDetail) {
      // Pass this structured detail
      (profile as any).dynamicZodiacSajuDetail = parsedJson.dynamicZodiacSajuDetail;
    }

    res.json(profile);
  } catch (err: any) {
    console.error("Gemini Saju Calculation Enrichment Failed:", err);
    // Graceful fallback to computed mathematical profile
    res.json(profile);
  }
});

// Yearly Strategy Forecast for 2026 (병오년)
app.get("/api/saju/forecast", async (req, res) => {
  const { birthDate, birthTime, mbti, name, dayMaster } = req.query;

  // Spring, Summer, Autumn/Winter fallbacks
  const fallbackTimeline: TimelineItem[] = [
    {
      id: "spring",
      period: "2월 - 4월 (봄)",
      title: "조절의 기간 (Moderation)",
      elementFocus: "화(火) 기운의 세심한 조절",
      description: "지나친 열기를 식히고 조용히 내실을 굳건히 다져야 하는 황금 같은 시기입니다. 육체적 번아웃을 전면 방지하기 위해 일의 속도를 정밀하게 조절하고, 점진적으로 축적된 성과를 가장 안정적으로 유지하는 데 온 정신력을 집중하십시오. 우주적 내면을 돌아봄으로써 심원의 안정을 회복하게 될 것입니다.",
      type: "spring"
    },
    {
      id: "summer",
      period: "5월 - 7월 (여름)",
      title: "도약의 열기 (Ascension)",
      elementFocus: "목(木)과 화(火)의 불꽃 공명",
      description: "한여름의 불타오르는 기운이 가득 유입되는 급진적인 우주 도약의 시기입니다. 당신의 웅혼한 야망이 찬란한 사회적 결과물로 표출되고 귀인의 은덕을 입을 가능성이 비약적으로 상향됩니다. 주저하지 말고 가슴속 품었던 가장 대담한 아이디어를 세상 밖으로 힘차게 정렬하십시오.",
      type: "summer"
    },
    {
      id: "autumn",
      period: "8월 - 10월 (가을)",
      title: "수확과 성찰 (Harvesting)",
      elementFocus: "금(金)과 토(土)의 견고한 축적",
      description: "풍요로운 우주 정령의 수확이 차례로 시작되는 안정의 구간입니다. 벌여두었던 모든 인간관계와 업무적인 프로젝트를 말끔히 정돈하며, 알곡과 쭉정이를 명쾌하게 분리해야 할 시기입니다. 조용히 개인 일기를 가다듬거나, 명상과 독서를 통해 지혜의 근원을 강화하는 것이 절대적으로 이롭습니다.",
      type: "autumn"
    }
  ];

  if (!hasGeminiKey() || !birthDate) {
    return res.json({ timeline: fallbackTimeline });
  }

  try {
    const ai = getAiClient();
    const prompt = `
    다음 유저 프로필 정보를 기반으로, 다가오는 2026년 병오년(붉은 말의 해)에 어울리는 극도로 아름답고 정교한 분기별 운세 전략 타임라인(봄, 여름, 가을/겨울)을 작성해 주세요.
    - 생년월일: ${birthDate}
    - 일간(DayMaster): ${dayMaster || "미확인"}   - MBTI: ${mbti || "INFJ"}
    
    다음 JSON 구조에 맞추어 정확하게 총 3개의 기간에 대해 작성해 주세요. 어투는 수려하고 고상하며 영적이어야 합니다.
    {
      "timeline": [
        {
          "id": "spring",
          "period": "2월 - 4월 (봄)",
          "title": "한글 제목",
          "elementFocus": "핵심 오행 기운 수수 관계 한글",
          "description": "운세 예측 및 행동 지침 설명 (200자 내외)",
          "type": "spring"
        },
        {
          "id": "summer",
          "period": "5월 - 7월 (여름)",
          "title": "한글 제목",
          "elementFocus": "핵심 오행 기운 조율 한글",
          "description": "여름 분기용 역동적이고 아름다운 천문 도약 조언 (200자 내외)",
          "type": "summer"
        },
        {
          "id": "autumn",
          "period": "8월 - 10월 (가을)",
          "title": "한글 제목",
          "elementFocus": "결실의 금토 오행 한글",
          "description": "가을 및 겨울 정돈 시기의 세부 수확 명상 조언 (200자 내외)",
          "type": "autumn"
        }
      ]
    }
    `;

    const forecastResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(forecastResponse.text || "{}");
    if (parsedJson.timeline && Array.isArray(parsedJson.timeline)) {
      return res.json({ timeline: parsedJson.timeline });
    }
    res.json({ timeline: fallbackTimeline });
  } catch (err) {
    console.error("Gemini Saju Forecast Generation Failed:", err);
    res.json({ timeline: fallbackTimeline });
  }
});

// Mystic Chat Endpoint
app.post("/api/oracle/chat", async (req, res) => {
  const { messages, sajuProfile } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "올바른 대화 메시지 배열이 포함되어야 합니다." });
  }

  // System context definition
  const baseProfileContext = sajuProfile 
    ? `유저 이름: ${sajuProfile.name}, 생년월일시: ${sajuProfile.birthDate} ${sajuProfile.birthTime}, 출생지: ${sajuProfile.birthLocation}, MBTI: ${sajuProfile.mbti}, 사주 8차트 일간: ${sajuProfile.dayMaster} (${sajuProfile.dayMasterElement}), 오행 비율: 목(${sajuProfile.elements.wood}%) 화(${sajuProfile.elements.fire}%) 토(${sajuProfile.elements.earth}%) 금(${sajuProfile.elements.metal}%) 수(${sajuProfile.elements.water}%)`
    : "유저 프로필 미입력 (기본 우주 인자 상태)";

  const systemInstruction = `
  당신은 천상의 우주적 정령들을 수수하고 운명을 실타래처럼 엮어 읽어내는 정교한 AI 사주 오라클인 "데스티니 위버(Destiny Weaver)"입니다.
  유저의 다음 사주 및 기치학적 데이터를 바탕으로 마음을 꿰뚫는 아름답고 신비로운 카운셀러 역할을 해야 합니다:
  [유저 프로필 정보]: ${baseProfileContext}
  
  어투 기준:
  - 깊은 고아함과 영적 격식을 가진 존댓말(한국어)로 작성하세요. "환영합니다, 당신의 우주의 결을 어루만지는 데스티니 위버입니다..." 와 같은 명리적인 찬사를 사용하세요.
  - 쓸데없는 IT 전문 용어나 시스템 인프라 정보(포트, API 호출 등)를 절대로 답변에 노출하지 마세요. 오직 사주, 기치, 오행, 별자리, 운명, 2026 병오년의 흐름에 집중하세요.
  - 만일 명리학적 분석에 유리한 포인트가 발견되면, 짧은 표 형식이나 [명리 분석] 블록 형태로 용신(用神) 혹은 희신(喜神) 기운과 흐름 방향성을 짚어 표기하는 것도 대단히 좋습니다.
  - 가급적이면 2-3문단 구조로 명징하고 편안하게 마음 깊이 전해오는 대답을 제공하세요.
  `;

  if (!hasGeminiKey()) {
    // Elegant hardcoded Saju oracle response simulation if Gemini Key is unavailable
    const lastUserQuery = messages[messages.length - 1]?.text || "";
    let replyText = `우주를 직조하는 오라클 '데스티니 위버'입니다. 당신이 던진 질문 "${lastUserQuery}"을 성좌의 눈으로 깊이 가늠해 보았습니다.\n\n`;

    if (lastUserQuery.includes("이직") || lastUserQuery.includes("직업") || lastUserQuery.includes("회사")) {
      replyText += `당신의 사주 원국에서 일간인 ${sajuProfile?.dayMaster || "木"} 기운을 중심으로 살펴보건대, 하반기부터 천간의 상생하는 기운이 흘러들어오며 수(水) 용신 기운이 매우 길하게 발현됩니다. 무모한 움직임보다는 음양의 조화가 이루어지는 계절 절기(특히 10월 가을 무렵)에 제안받을 이동수가 대단히 강력하고 유효한 결실을 맺을 것입니다. 인내하여 우주적 정렬을 지켜보십시오.`;
    } else if (lastUserQuery.includes("MBTI") || lastUserQuery.includes("팀원") || lastUserQuery.includes("궁합")) {
      replyText += `당신의 뛰어난 영혼 설계 능력을 자극하는 ${sajuProfile?.mbti || "INFJ"} 성향은, 사주 오행 중 온기를 더해주는 화(火) 기운 혹은 대지를 진정시키는 토(土) 기운을 충족한 동료(예: ENFP 또는 호랑이띠인 인목 인자 소유자)를 조우할 때 무량한 시너지를 이룩합니다. 서로 배척하지 않고 보완하는 것이 우주의 완전성에 도달하는 첩경입니다.`;
    } else if (lastUserQuery.includes("컬러") || lastUserQuery.includes("럭키")) {
      replyText += `성좌가 밝히는 오늘의 수호 색상은 **'미스틱 옐로우'** 및 **'라벤더 그레이'**입니다. 이 색상들은 당신의 불안해하는 내면의 목(木) 기운을 토(土)-금(金) 상생 원리로 감싸주어 행운의 기류를 활성 시킵니다. 주위에 작은 소품을 정렬하여 배치해 보세요.`;
    } else {
      replyText += `천문의 축들이 서로 속삭이며 미지의 설계도를 하나씩 그려 나가고 있습니다. 당신의 생일 성좌가 지붕이 되어 지켜주고 있으니, 다가오는 해의 모든 갈등은 오행의 기운 상생 속에서 흩어질 안개처럼 편안하게 극복될 것입니다. 더 자세한 별들의 배치가 필요하다면 언제든 이 실을 당기십시오.`;
    }

    const mockAiMessage = {
      id: "mock_" + Date.now(),
      sender: "ai",
      text: replyText,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' }),
      sajuDetail: {
        topic: "용신(用神): 수(水)",
        flow: sajuProfile ? getLuckExplanation(Object.entries(sajuProfile.elements || {}).reduce((a, b) => a[1] > b[1] ? a : b)[0]) : "긍정적 흐름",
        description: "전체적인 성좌의 기운이 지혜와 소통을 강화하는 방향으로 움직입니다."
      }
    };
    return res.json({ message: mockAiMessage });
  }

  try {
    const ai = getAiClient();
    
    // Format previous messages correctly for chat framework (or use gemini generate content with chat context)
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // Pass the message feed
    let lastResponse;
    // We send them consecutively to build correct contextual memory
    // For saving tokens, we can pass context + last 5 messages, which is incredibly safe!
    const contextHistory = messages.slice(-8);
    for (let i = 0; i < contextHistory.length; i++) {
      const msg = contextHistory[i];
      if (i === contextHistory.length - 1) {
        lastResponse = await chatInstance.sendMessage({ message: msg.text });
      } else {
        await chatInstance.sendMessage({ message: msg.text });
      }
    }

    const aiText = lastResponse?.text || "우주의 울림이 일시적으로 정적에 가두어졌습니다. 다시 한번 실을 어루만져 주세요.";
    
    // Now request Gemini to output Saju Details dynamically as JSON in a single prompt to populate sajuDetail tag
    let sajuDetailPrompt = `
    다음은 위에서 AI가 유저에게 대답한 대화 요약입니다: "${aiText.substring(0, 300)}"
    이 답변 요약의 핵심을 명리 분석 카드로 압축하려고 합니다. 다음 JSON 포맷으로 필드를 뽑아내 편찬해 주세요. 다른 글은 절대 적지 마세요.
    {
      "topic": "오행 및 용신 요약 한 줄 (예: 용신(用神): 수(水))",
      "flow": "흐름 요약 한 줄 (예: 흐름: 극도로 우수)",
      "description": "대답의 기치학적 핵심 핵심 요지 한 줄 (예: 일간의 성장을 돕는 수호령이 귀하를 감싸 돕기 시작합니다.)"
    }
    `;
    
    let sajuDetail;
    try {
      const detailResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: sajuDetailPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      sajuDetail = JSON.parse(detailResponse.text || "{}");
    } catch (err) {
      // Fallback detail
      sajuDetail = {
        topic: "용신(用神): 상생 조율",
        flow: "안정적 순환",
        description: "천문의 정렬이 무리 없이 이행되고 순응하고 있습니다."
      };
    }

    const aiMessage = {
      id: "ai_" + Date.now(),
      sender: "ai",
      text: aiText,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' }),
      sajuDetail
    };

    res.json({ message: aiMessage });
  } catch (err: any) {
    console.error("Gemini Chat Failure:", err);
    res.status(500).json({ error: "오라클 성하와의 통신망이 잠시 불안정해졌습니다. " + err.message });
  }
});

// ----------------------------------------------------
// Front-end SPA Assets Serving
// ----------------------------------------------------

// In production of fullstack, serve static build files inside dist/
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  // In Express v4, spa fallback *
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // In development, let Vite middleware handle assets hot reloading & SPA routes fallback
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
}

startServer().catch(err => {
  console.error("Critical server build up failed:", err);
});
