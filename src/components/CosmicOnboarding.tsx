import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Navigation, Shield, User } from "lucide-react";
import { SajuProfile } from "../types";

interface CosmicOnboardingProps {
  onAlign: (profile: SajuProfile) => void;
  isLoading: boolean;
}

export default function CosmicOnboarding({ onAlign, isLoading }: CosmicOnboardingProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [mbti, setMbti] = useState("INFJ");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("이 브라우저에서는 위치 서비스가 지원되지 않습니다.");
      return;
    }

    setGpsLoading(true);
    setErrorMsg("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates(`북위 ${latitude.toFixed(4)}도, 동경 ${longitude.toFixed(4)}도`);
        setBirthLocation("현재 GPS 감지 위치 (서울 표준시 보정)");
        setGpsLoading(false);
      },
      (err) => {
        console.error(err);
        setGpsCoordinates("GPS 권한 거부 또는 검색 실패");
        setBirthLocation("대한민국 서울 특별시 (동경 127도 30분 보정)");
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const handleAlignCoords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setErrorMsg("성좌를 계산하기 위해 출생일(날짜)을 반드시 선택해 주세요!");
      return;
    }
    
    setErrorMsg("");
    
    // Call calculation endpoint
    try {
      const response = await fetch("/api/saju/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "익명의 직조자",
          birthDate,
          birthTime: birthTime || "12:00",
          birthLocation: birthLocation || "동경 127도 기준 보정치",
          mbti
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 통신에 실패했습니다.");
      }

      const calculatedProfile = await response.json();
      onAlign(calculatedProfile);
    } catch (err: any) {
      setErrorMsg("우주 좌표 정렬 실패: " + err.message);
    }
  };

  return (
    <div id="cosmic-onboarding-view" className="w-full max-w-2xl mx-auto py-12 px-4">
      {/* Stepper Header */}
      <div className="w-full flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-slate-200 -z-10"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <span className="text-xs font-mono">1</span>
          </div>
          <span className="text-[11px] font-mono text-indigo-600 tracking-wider uppercase font-semibold">우주 인자</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold">
            <span className="text-xs font-mono">2</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold">성좌 직조</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold">
            <span className="text-xs font-mono">3</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold">인생 전략</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 mb-4">
          <Sparkles className="w-4 h-4 text-indigo-650 animate-pulse" />
          <span className="text-xs font-mono text-indigo-700 uppercase tracking-widest font-semibold">ASTRONOMICAL ALIGNMENT</span>
        </div>
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-3 tracking-tight">천문의 정렬</h1>
        <p className="text-sm font-sans text-slate-500 max-w-md mx-auto leading-relaxed">
          태어난 시간과 공간의 우주적 정렬 상태를 분석하여 당신 고유의 오행 결을 해독합니다.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-sans flex items-center gap-2 shadow-sm">
          <span className="font-bold">⚠️</span> {errorMsg}
        </div>
      )}

      {/* Main Alignment Form */}
      <form onSubmit={handleAlignCoords} className="space-y-6">
        <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 relative group transition-all duration-300">
          
          <div className="relative z-10 space-y-6">
            
            {/* Name Input Row */}
            <div className="flex flex-col">
              <label className="text-xs font-mono text-indigo-600 mb-2 uppercase tracking-widest flex items-center gap-2 font-bold">
                <User className="w-4 h-4 text-indigo-500" />
                성물 (이름 혹은 별칭)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="인연의 명칭을 입력해 주세요"
                className="ghost-input w-full py-2 text-lg font-sans placeholder-slate-400 border-b border-slate-200 focus:outline-none"
              />
            </div>

            {/* Date Input */}
            <div className="flex flex-col">
              <label className="text-xs font-mono text-indigo-600 mb-2 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-indigo-500" />
                출생일 (양력 기준)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="ghost-input w-full py-2 text-lg font-sans text-slate-800 border-b border-slate-200 focus:outline-none focus:border-indigo-600"
                style={{ colorScheme: "light" }}
              />
            </div>

            {/* Time Input */}
            <div className="flex flex-col">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-mono text-indigo-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  정밀 태어난 시 (24H)
                </label>
                <button
                  type="button"
                  onClick={() => setBirthTime("12:00")}
                  className="text-xs font-sans text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 transition-all font-semibold"
                >
                  시간을 모름 (대략 12시 정렬)
                </button>
              </div>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="ghost-input w-full py-2 text-lg font-sans text-slate-800 border-b border-slate-200 focus:outline-none focus:border-indigo-600"
                style={{ colorScheme: "light" }}
              />
            </div>

            {/* MBTI Select row */}
            <div className="flex flex-col">
              <label className="text-xs font-mono text-indigo-600 mb-2 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Shield className="w-4 h-4 text-indigo-500" />
                영혼의 경향성 (MBTI 기질)
              </label>
              <select
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono"
              >
                {["INFJ", "INFP", "ENFJ", "ENFP", "INTJ", "INTP", "ENTJ", "ENTP", "ISFJ", "ISFP", "ESFJ", "ESFP", "ISTJ", "ISTP", "ESTJ", "ESTP"].map((type) => (
                  <option key={type} value={type} className="bg-white text-slate-800">{type} 기질</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* GPS Correction Module */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4 border-l-4 border-l-indigo-600 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-grow space-y-2">
            <h3 className="font-sans text-base font-semibold text-slate-900">진태양시 공간 보정</h3>
            <p className="text-xs font-sans text-slate-500 leading-relaxed">
              우리가 태어난 정확한 성좌의 선도를 감지하기 위해 경도 시차를 감도 보정합니다. 현재 위치 감지를 탭해 우주 시차를 정렬하세요.
            </p>
            {gpsCoordinates && (
              <p className="text-xs font-mono text-indigo-700 bg-indigo-50 p-2.5 rounded-lg inline-block border border-indigo-100">
                감지된 위상: {gpsCoordinates}
              </p>
            )}
            <div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gpsLoading}
                className="text-xs font-mono px-4 py-2 mt-1 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-1.5 font-semibold"
              >
                <Navigation className={`w-3 h-3 ${gpsLoading ? "animate-spin" : ""}`} />
                {gpsLoading ? "공간 결 가늠중..." : "현재 우주 좌표 수집"}
              </button>
            </div>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full max-w-sm mx-auto py-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all duration-300 relative overflow-hidden group font-sans font-semibold disabled:opacity-55 cursor-pointer shadow-md shadow-indigo-200/40"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {isLoading ? (
            <span className="flex items-center gap-2 text-xs font-mono tracking-widest">
              우주의 정렬 상태 계산 중...
            </span>
          ) : (
            <>
              <span className="text-xs font-mono tracking-widest">천문 좌표 정렬하기</span>
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
