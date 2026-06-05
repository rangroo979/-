import { useState, useEffect } from "react";
import { 
  Home, 
  MapPin, 
  Bot, 
  Clock, 
  Settings, 
  Layers, 
  Compass, 
  Calendar, 
  User, 
  Sparkles, 
  Trash2, 
  Menu,
  ShieldCheck
} from "lucide-react";

import CosmicOnboarding from "./components/CosmicOnboarding";
import CelestialDashboard from "./components/CelestialDashboard";
import OracleChat from "./components/OracleChat";
import YearlyReport from "./components/YearlyReport";
import { SajuProfile } from "./types";

export default function App() {
  const [sajuProfile, setSajuProfile] = useState<SajuProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [loading, setLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean | null>(null);

  // Load custom Saju Profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("destiny_saju_profile");
    if (saved) {
      try {
        setSajuProfile(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved destiny profile", err);
      }
    }

    // Health check on Gemini server Connectivity
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          const data = await response.json();
          setApiKeyStatus(data.gemini_connected);
        }
      } catch (err) {
        console.error("Health check on backend failed", err);
        setApiKeyStatus(false);
      }
    };
    checkHealth();
  }, []);

  const handleProfileAligned = (profile: SajuProfile) => {
    setSajuProfile(profile);
    localStorage.setItem("destiny_saju_profile", JSON.stringify(profile));
    setActiveTab("home");
  };

  const handleResetProfile = () => {
    if (window.confirm("우주 좌표 조율 상태를 전면 초기화하고 처음 단계로 돌아가시겠습니까?")) {
      setSajuProfile(null);
      localStorage.removeItem("destiny_saju_profile");
      setActiveTab("home");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-x-hidden relative flex flex-col pb-20 md:pb-0">
      
      {/* Dynamic Cosmic Backing Grid Spot */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ background: "radial-gradient(circle at 50% -20%, rgba(79, 70, 229, 0.06) 0%, transparent 60%)", opacity: 0.8 }} />

      {/* TopAppBar Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/85 backdrop-blur-xl border-b border-slate-200 max-w-7xl mx-auto md:pl-[344px] md:left-0 md:max-w-none transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-3">
          {sajuProfile && (
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-55 flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
          )}
          <span className="text-lg font-serif font-bold text-indigo-600 tracking-tight text-glow">
            DESTINY DESIGN <span className="font-sans text-xs text-slate-400 font-normal">| 운명 설계</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {apiKeyStatus ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              오라클 연계 가동중
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
              정밀 연산 Fallback 작동중
            </span>
          )}

          {sajuProfile && (
            <button
              onClick={() => setActiveTab("settings")}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center hover:text-indigo-600 transition-all hover:border-indigo-350 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container Core */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full pt-20">
        
        {/* Navigation Sidebar (Desktop view) */}
        {sajuProfile && (
          <nav className="hidden md:flex fixed inset-y-0 left-0 z-20 flex-col p-6 h-full w-80 border-r border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-4 mb-10 pt-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 flex items-center justify-center bg-indigo-50 shadow-sm">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">운명의 직조자</h2>
                <p className="font-mono text-[10px] text-indigo-600 tracking-wider uppercase mt-1 font-semibold">
                  {sajuProfile.pillars.yearKorean}년 {sajuProfile.pillars.yearAnimal}
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  기질: {sajuProfile.mbti} (설계자)
                </p>
              </div>
            </div>

            <div className="text-[10px] font-mono tracking-widest text-slate-400 pl-2 mb-4 uppercase font-bold">
              COSMIC BLUEPRINT
            </div>

            <ul className="flex flex-col gap-2 flex-grow">
              <li>
                <button
                  onClick={() => setActiveTab("home")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    activeTab === "home"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>나의 운명 프로필</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    activeTab === "report"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>2026 병오년 전략</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>오라클 AI 상담</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>설정 및 우주 조율</span>
                </button>
              </li>
            </ul>

            <div className="pt-6 border-t border-slate-200 mt-auto">
              <button
                onClick={handleResetProfile}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all text-xs font-mono tracking-wider text-left cursor-pointer font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>우주 좌표 완전 초기화</span>
              </button>
            </div>
          </nav>
        )}

        {/* Dynamic Inner Main Content with responsive padding offset */}
        <main className={`flex-grow px-4 md:px-8 py-8 ${sajuProfile ? "md:pl-[344px]" : "md:pl-0"} min-h-[calc(100vh-80px)] relative z-10 w-full`}>
          
          {!sajuProfile ? (
            /* First Step Onboarding form client */
            <CosmicOnboarding onAlign={handleProfileAligned} isLoading={loading} />
          ) : (
            /* Switch Tab router screens layout */
            <div className="w-full max-w-4xl mx-auto">
              {activeTab === "home" && (
                <CelestialDashboard profile={sajuProfile} onNavigateToTab={setActiveTab} />
              )}
              {activeTab === "chat" && (
                <OracleChat sajuProfile={sajuProfile} />
              )}
              {activeTab === "report" && (
                <YearlyReport sajuProfile={sajuProfile} />
              )}
              {activeTab === "settings" && (
                <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-8 animate-fade-in">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950 mb-2">우주 성좌 설정</h2>
                    <p className="text-xs font-sans text-slate-500">
                      수집된 좌표 기준과 기치학적 원형 인자들을 명리적으로 미세 역동 조정합니다.
                    </p>
                  </div>

                  <div className="border border-slate-200 p-5 rounded-xl bg-slate-50 space-y-4 font-mono text-xs shadow-inner">
                    <h3 className="font-bold text-indigo-650 flex items-center gap-1.5 uppercase tracking-wider">
                      <Compass className="w-4 h-4" />
                      직조자 기치 정보 요약
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                      <div>
                        <span className="text-slate-400 block">이름</span>
                        <span className="font-bold text-slate-800">{sajuProfile.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">출생 한 시</span>
                        <span className="font-bold text-slate-800">{sajuProfile.birthDate} | {sajuProfile.birthTime}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">출생 기조 장소</span>
                        <span className="font-bold text-slate-800 truncate block">{sajuProfile.birthLocation}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">일간 본성</span>
                        <span className="font-bold text-indigo-600">{sajuProfile.dayMaster} ({sajuProfile.dayMasterElement})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-slate-900 font-semibold">동작 설정 변경</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          const newMbti = prompt("원하시는 명리 시너지 MBTI를 4글자 대문자로 입력하세요:", sajuProfile.mbti);
                          if (newMbti && newMbti.trim().length === 4) {
                            const updated = { ...sajuProfile, mbti: newMbti.toUpperCase().trim() };
                            // Redefine identity index fallback
                            updated.identityNickname = sajuProfile.identityNickname.split("&")[0].trim() + " & " + newMbti.toUpperCase().trim();
                            handleProfileAligned(updated);
                          }
                        }}
                        className="flex-1 py-3.5 text-xs font-mono font-bold tracking-wider border border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all rounded-xl cursor-pointer shadow-sm"
                      >
                        영혼 성격 기질 (MBTI) 변경
                      </button>

                      <button
                        onClick={() => {
                          const newName = prompt("새로운 인연의 호칭명을 입력하세요:", sajuProfile.name);
                          if (newName && newName.trim().length > 0) {
                            const updated = { ...sajuProfile, name: newName.trim() };
                            handleProfileAligned(updated);
                          }
                        }}
                        className="flex-1 py-3.5 text-xs font-mono font-bold tracking-wider border border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all rounded-xl cursor-pointer shadow-sm"
                      >
                        직조인 명식 이름 개명하기
                      </button>
                    </div>

                    <div className="pt-6 border-t border-slate-200 text-center">
                      <button
                        onClick={handleResetProfile}
                        className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-xl font-mono text-xs font-bold tracking-wide transition-all cursor-pointer"
                      >
                        우주 좌표 초기화 후 명식 재산출
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Bottom Navigation (Mobile view only) */}
      {sajuProfile && (
        <nav className="md:hidden fixed bottom-0 w-full z-20 flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom,12px)] h-20 bg-white/95 backdrop-blur-2xl border-t border-slate-200 shadow-lg">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "home" 
                ? "text-indigo-600 font-bold scale-110 drop-shadow-md" 
                : "text-slate-400"
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-mono tracking-wider">홈</span>
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "report" 
                ? "text-indigo-600 font-bold scale-110 drop-shadow-md" 
                : "text-slate-400"
            }`}
          >
            <Layers className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-mono tracking-wider">리포트</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "chat" 
                ? "text-indigo-600 font-bold scale-110 drop-shadow-md" 
                : "text-slate-400"
            }`}
          >
            <Bot className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-mono tracking-wider">AI 상담</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === "settings" 
                ? "text-indigo-600 font-bold scale-110 drop-shadow-md" 
                : "text-slate-400"
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-mono tracking-wider">설정</span>
          </button>
        </nav>
      )}

    </div>
  );
}
