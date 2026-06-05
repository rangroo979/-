import { Bot, TrendingUp, Sparkles, Compass, HelpCircle, ArrowRight, MessageSquare, AlertCircle } from "lucide-react";
import { SajuProfile } from "../types";

interface CelestialDashboardProps {
  profile: SajuProfile;
  onNavigateToTab: (tabId: string) => void;
}

export default function CelestialDashboard({ profile, onNavigateToTab }: CelestialDashboardProps) {
  const { name, dayMaster, dayMasterElement, identityNickname, lunasolar, pillars, elements, dailyLuckScore, dailyLuckExplanation, mbti } = profile;

  // Find the primary element to display highlighted badge
  const elementKoreanNames: {[key: string]: string} = {
    wood: "목(木 - 나무)",
    fire: "화(火 - 불)",
    earth: "토(土 - 흙)",
    metal: "금(金 - 쇠)",
    water: "수(水 - 물)"
  };

  const elementColors: {[key: string]: string} = {
    wood: "bg-emerald-500",
    fire: "bg-amber-500",
    earth: "bg-yellow-600",
    metal: "bg-slate-400",
    water: "bg-blue-400"
  };

  const elementTextColors: {[key: string]: string} = {
    wood: "text-emerald-600",
    fire: "text-amber-600",
    earth: "text-yellow-600",
    metal: "text-slate-500",
    water: "text-blue-600"
  };

  return (
    <div id="celestial-dashboard-view" className="w-full space-y-8 animate-fade-in font-sans">
      
      {/* Hero Labeling Identity Section */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 pointer-events-none mix-blend-multiply"
             style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(79, 70, 229, 0.08) 0%, transparent 70%)" }}>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
          
          {/* Avatar Ring Aura */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-indigo-200 p-1 flex-shrink-0 bg-indigo-50 flex items-center justify-center relative shadow-sm">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
              <Sparkles className="w-10 h-10 text-indigo-600 relative z-10 animate-spin-slow" />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]"></div>
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50">
              <span className="w-2 h-2 rounded-full bg-indigo-650 animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-700 font-bold">정체성 우주 직조 완료</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-glow leading-tight">
              {identityNickname.split("&")[0].trim() || "천성의 수호자"}
            </h2>
            <p className="text-sm font-sans font-medium text-slate-500">
              {identityNickname.split("&")[1] ? identityNickname.split("&")[1].trim() : `${name} 님의 고유 기류`}
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
              <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600 flex items-center gap-1.5 font-semibold">
                <span className="text-indigo-600 font-bold">{pillars.yearKorean}년</span> {pillars.yearAnimal}
              </span>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-semibold animate-none">
                <span className="text-indigo-600 font-bold">{mbti}</span> 영혼 설계 기질
              </span>
              {lunasolar && (
                <span className="font-mono text-[11px] px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hidden sm:inline-block font-semibold">
                  {lunasolar}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Saju Analytics Subsystem (Grid spacing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Circular Daily Luck Progression */}
        <section className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/10 pointer-events-none"></div>
          <h3 className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase w-full text-left mb-6 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600" />
            일일 기운 흐름 (Cosmic Flow)
          </h3>

          <div className="relative w-44 h-44 flex items-center justify-center rounded-full bg-slate-50 shadow-inner">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                strokeWidth="5"
                stroke="#e2e8f0"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                strokeWidth="5"
                stroke="#4F46E5"
                fill="transparent"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * dailyLuckScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block font-serif text-5xl font-bold text-indigo-600 leading-none mb-1">
                {dailyLuckScore}
              </span>
              <span className="inline-block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                행운지수 %
              </span>
            </div>
          </div>

          <p className="font-serif text-lg text-slate-900 mt-6 text-center font-bold">
            {dailyLuckScore >= 80 ? "★ 상서롭고 무량한 흐름" : "◆ 중용의 조화로운 흐름"}
          </p>
          <p className="text-xs font-sans text-slate-500 text-center mt-2 max-w-[280px] leading-relaxed">
            {dailyLuckExplanation}
          </p>
        </section>

        {/* Right Side: Four Pillars Saju Matrix Box */}
        <section className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              핵심 우주 매트릭스 (사주팔자 四柱八字)
            </h3>
            <span className="text-[10px] font-mono text-indigo-600 border border-indigo-150 px-2.5 py-0.5 rounded-full bg-indigo-50 font-bold">
              일간주간 중심 분석
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 flex-grow">
            
            {/* Year Pillar column */}
            <div className="flex flex-col gap-2">
              <div className="text-center font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                년주 (뿌리)
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center group hover:border-indigo-300 transition-colors">
                <span className="text-2xl font-serif font-bold text-slate-800 mb-1">{pillars.yearStem}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">하늘 통로</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center group hover:border-indigo-300 transition-colors relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500/20 animate-none"></div>
                <span className="text-2xl font-serif font-bold text-indigo-600 mb-1">{pillars.yearBranch}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">{pillars.yearKorean.substring(1)} (생)</span>
              </div>
            </div>

            {/* Month Pillar column */}
            <div className="flex flex-col gap-2">
              <div className="text-center font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                월주 (기류)
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center group hover:border-indigo-300 transition-colors">
                <span className="text-2xl font-serif font-bold text-slate-800 mb-1">{pillars.monthStem}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">환경 대기</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center">
                <span className="text-2xl font-serif font-bold text-slate-800 mb-1">{pillars.monthBranch}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">{pillars.monthKorean.substring(1)}</span>
              </div>
            </div>

            {/* Day Pillar column (Highlighted / Day Master!) */}
            <div className="flex flex-col gap-2 relative">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-xl border border-indigo-500/15 pointer-events-none -m-1"></div>
              <div className="text-center font-mono text-[9px] text-indigo-600 font-bold uppercase tracking-wider z-10">
                일주 (나/본성)
              </div>
              <div className="bg-white border border-indigo-300 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center z-10 shadow-sm">
                <span className="text-3xl font-serif font-bold text-indigo-700 mb-1">{pillars.dayStem}</span>
                <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-full">{dayMasterElement}</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center z-10">
                <span className="text-2xl font-serif font-bold text-slate-800 mb-1">{pillars.dayBranch}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">{pillars.dayKorean.substring(1)}</span>
              </div>
            </div>

            {/* Hour Pillar column */}
            <div className="flex flex-col gap-2">
              <div className="text-center font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                시주 (정렬시)
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center opacity-70">
                <span className="text-2xl font-serif font-bold text-slate-800 mb-1">{pillars.hourStem}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">말년 지향</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-center flex-1 flex flex-col justify-center items-center opacity-70">
                <span className="text-2xl font-serif font-bold text-slate-800 mb-1">{pillars.hourBranch}</span>
                <span className="text-[10px] font-sans text-slate-400 font-medium">{pillars.hourKorean.substring(1)}</span>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* Saju Elemental Balance & Action Steps row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saju Five Elements 분포도 */}
        <section className="glass-panel rounded-2xl p-6">
          <h3 className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            천상 오행 분포도 (Five Elements)
          </h3>
          
          <div className="space-y-4">
            
            {/* Wood element row */}
            <div className="flex items-center gap-3">
              <div className="w-14 text-xs font-mono font-bold text-slate-600 text-right">목(木)</div>
              <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full relative transition-all duration-700" style={{ width: `${elements.wood}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className={`w-10 text-xs font-mono font-semibold text-right text-emerald-600`}>
                {elements.wood}%
              </div>
            </div>

            {/* Fire element row */}
            <div className="flex items-center gap-3">
              <div className="w-14 text-xs font-mono font-bold text-slate-600 text-right">화(火)</div>
              <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full relative transition-all duration-700" style={{ width: `${elements.fire}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className={`w-10 text-xs font-mono font-semibold text-right text-amber-600`}>
                {elements.fire}%
              </div>
            </div>

            {/* Earth element row */}
            <div className="flex items-center gap-3">
              <div className="w-14 text-xs font-mono font-bold text-slate-600 text-right">토(土)</div>
              <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 rounded-full relative transition-all duration-700" style={{ width: `${elements.earth}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className={`w-10 text-xs font-mono font-semibold text-right text-yellow-600`}>
                {elements.earth}%
              </div>
            </div>

            {/* Metal element row */}
            <div className="flex items-center gap-3">
              <div className="w-14 text-xs font-mono font-bold text-slate-600 text-right">금(金)</div>
              <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full relative transition-all duration-700" style={{ width: `${elements.metal}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className={`w-10 text-xs font-mono font-semibold text-right text-slate-500`}>
                {elements.metal}%
              </div>
            </div>

            {/* Water element row */}
            <div className="flex items-center gap-3">
              <div className="w-14 text-xs font-mono font-bold text-slate-600 text-right">수(水)</div>
              <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full relative transition-all duration-700" style={{ width: `${elements.water}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className={`w-10 text-xs font-mono font-semibold text-right text-blue-600`}>
                {elements.water}%
              </div>
            </div>

          </div>
        </section>

        {/* Quick Navigate Triggers */}
        <section className="flex flex-col gap-4">
          
          {/* Action: 2026 Yearly strategy */}
          <button
            onClick={() => onNavigateToTab("report")}
            className="flex-1 text-left glass-panel rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-400/50 hover:bg-slate-50/20 transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-indigo-550/5 to-transparent pointer-events-none transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-150 group-hover:border-indigo-300 transition-colors shrink-0">
                <Compass className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-slate-900 group-hover:text-indigo-650 transition-colors mb-1 leading-snug">
                  병오년(丙午) 연간 영혼 전략
                </h4>
                <p className="text-xs font-sans text-slate-500 leading-relaxed">
                  다가오는 일생의 주요 계절성 전환점 예측 및 타임라인
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 relative z-10" />
          </button>

          {/* Action: Saju chatbot */}
          <button
            onClick={() => onNavigateToTab("chat")}
            className="flex-1 text-left glass-panel rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-400/50 hover:bg-indigo-50/20 transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-indigo-550/5 to-transparent pointer-events-none transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-150 group-hover:border-indigo-300 transition-colors shrink-0">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-slate-900 group-hover:text-indigo-650 transition-colors mb-1 leading-snug">
                  데스티니 위버 AI 수수 채팅
                </h4>
                <p className="text-xs font-sans text-slate-500 leading-relaxed">
                  나의 Saju 명리 및 MBTI 결을 완전하게 학습한 오라클 솔루션
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 relative z-10" />
          </button>

        </section>

      </div>

    </div>
  );
}
