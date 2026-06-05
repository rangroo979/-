/**
 * Types and interfaces for the Destiny Design (운명 설계) App.
 */

export interface SajuPillars {
  yearStem: string;      // 천간 (e.g., 庚)
  yearBranch: string;    // 지지 (e.g., 辰)
  yearKorean: string;    // 한국어 표기 (e.g., 경진)
  yearAnimal: string;    // 동물 표기 (e.g., 백룡)
  
  monthStem: string;     // 천간 (e.g., 壬)
  monthBranch: string;   // 지지 (e.g., 午)
  monthKorean: string;   // 한국어 표기 (e.g., 임오)
  
  dayStem: string;       // 천간 (e.g., 甲)
  dayBranch: string;     // 지지 (e.g., 子)
  dayKorean: string;     // 한국어 표기 (e.g., 갑자)
  
  hourStem: string;      // 천간 (e.g., 丙)
  hourBranch: string;    // 지지 (e.g., 寅)
  hourKorean: string;    // 한국어 표기 (e.g., 병인)
}

export interface ElementBalance {
  wood: number;   // 목(木) %
  fire: number;   // 화(火) %
  earth: number;  // 토(土) %
  metal: number;  // 금(金) %
  water: number;  // 수(水) %
}

export interface SajuProfile {
  name: string;
  birthDate: string;  // YYYY-MM-DD
  birthTime: string;  // HH:MM (24h)
  birthLocation: string;
  mbti: string;
  lunasolar?: string; // 음력 정보
  
  dayMaster: string;  // 일간 (e.g., 甲)
  dayMasterElement: string; // 일간 오행 (e.g., 양목)
  identityNickname: string; // 별칭 (e.g., 선구자, 영혼의 설계자)
  
  pillars: SajuPillars;
  elements: ElementBalance;
  dailyLuckScore: number; // 0-100
  dailyLuckExplanation: string;
  
  created_at: string;
}

export interface TimelineItem {
  id: string;
  period: string; // e.g., "FEB - APR"
  title: string;  // e.g., "조절의 기간 (Moderation)"
  elementFocus: string; // e.g., "화(火) 기운의 조절"
  description: string;
  type: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  // For highly formatted or interactive responses
  sajuDetail?: {
    topic: string;
    flow: string;
    description: string;
  };
}
