import { useEffect, useState } from "react";
import { Sparkles, Share2, Compass, AlertCircle, Sun, Calendar, ShieldAlert } from "lucide-react";
import { SajuProfile, TimelineItem } from "../types";

interface YearlyReportProps {
  sajuProfile: SajuProfile;
}

export default function YearlyReport({ sajuProfile }: YearlyReportProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/saju/forecast?birthDate=${sajuProfile.birthDate}&birthTime=${sajuProfile.birthTime}&mbti=${sajuProfile.mbti}&name=${sajuProfile.name}&dayMaster=${sajuProfile.dayMaster}`
        );
        if (response.ok) {
          const data = await response.json();
          setTimeline(data.timeline || []);
        }
      } catch (err) {
        console.error("Yearly Forecast Fetch Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [sajuProfile]);

  const handleShareCard = () => {
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
    }, 3000);
  };

  return (
    <div id="yearly-report-view" className="w-full space-y-8 animate-fade-in py-4 font-sans text-slate-800">
      
      {/* Dynamic Header */}
      <section className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-700 uppercase">
            2026 병오년 (丙午) 운세 예조
          </span>
        </div>
        
        {/* Byeong-oh stylish letter */}
        <h1 className="font-serif text-7xl font-extrabold text-indigo-650 select-none text-glow leading-tight">
          丙
        </h1>

        <p className="text-sm font-sans text-slate-500 leading-relaxed font-semibold">
          붉은 말의 해, 병오(丙午)년은 하늘과 땅이 모두 강렬한 화(火) 기운으로 가득 차 무량한 에너지와 뜨거운 열정을 유구합니다. 오행의 세밀한 수수 흐름을 직조하여 당신의 운명적인 영혼 도약 시기를 한발 먼저 대비하십시오.
        </p>
      </section>

      {/* Loading Block */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-400">병오년 성좌 궤도 가공 중...</p>
        </div>
      ) : (
        /* Timeline Container */
        <section className="relative w-full max-w-xl mx-auto py-4">
          
          {/* Central Vertical Connector Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
          
          <div className="flex flex-col gap-10">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={item.id} 
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } group`}
                >
                  {/* Circle Glowing Marker */}
                  <div className={`absolute left-[19px] md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border flex justify-center items-center z-10 bg-white transition-all duration-300 ${
                    item.type === "summer" 
                      ? "border-indigo-600 shadow-md group-hover:scale-110" 
                      : "border-slate-200 group-hover:border-indigo-400"
                  }`}>
                    {item.type === "spring" && <Calendar className="w-4 h-4 text-emerald-500" />}
                    {item.type === "summer" && <Sun className="w-4 h-4 text-indigo-600 fill-indigo-100" />}
                    {item.type === "autumn" && <Compass className="w-4 h-4 text-indigo-600" />}
                  </div>

                  {/* Empty Spacer on Desktop which stagger aligns */}
                  <div className="hidden md:block w-1/2 pr-12 pl-12 text-right">
                    <span className="text-xs font-mono font-bold text-slate-500 tracking-widest block uppercase">
                      {item.period}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 block mt-1 font-bold">{item.elementFocus}</span>
                  </div>

                  {/* Seasonal strategic card */}
                  <div className="w-full pl-[52px] md:pl-0 md:w-1/2">
                    <div className="bg-white border border-slate-250 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 shadow-sm hover:border-indigo-300 hover:shadow-md">
                      {/* Accent gradient flare */}
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      
                      <div className="text-[10px] font-mono font-bold text-slate-400 block md:hidden mb-1.5 uppercase">
                        {item.period} | <span className="text-indigo-600 font-bold">{item.elementFocus}</span>
                      </div>

                      <h3 className={`text-base font-serif font-bold text-slate-900 mb-1.5 ${
                        item.type === "summer" ? "text-indigo-700" : ""
                      }`}>
                        {item.title}
                      </h3>
                      
                      <p className="text-xs font-sans text-slate-650 leading-relaxed font-semibold">
                        {item.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* Share Actions Area */}
      <section className="flex flex-col items-center justify-center gap-3 pt-6 min-h-[90px]">
        {shareSuccess ? (
          <p className="text-xs font-mono text-indigo-800 tracking-wider animate-bounce bg-indigo-50 border border-indigo-200 px-5 py-2.5 rounded-full font-bold">
            공유용 성좌 카드가 장치 사진첩에 안전하게 영구 저장되었습니다.
          </p>
        ) : (
          <button
            onClick={handleShareCard}
            className="px-8 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 rounded-full flex items-center justify-center gap-2.5 font-sans font-bold cursor-pointer active:scale-95 text-xs tracking-wider shadow-md shadow-indigo-200"
          >
            <Share2 className="w-4 h-4 text-indigo-200" />
            카드로 공유하기
          </button>
        )}
      </section>

    </div>
  );
}
