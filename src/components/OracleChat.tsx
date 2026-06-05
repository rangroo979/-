import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Compass, AlertCircle } from "lucide-react";
import { SajuProfile, ChatMessage } from "../types";

interface OracleChatProps {
  sajuProfile: SajuProfile;
}

export default function OracleChat({ sajuProfile }: OracleChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `반갑습니다, 우주의 설계도를 따라 실을 자아내는 오라클 '데스티니 위버'입니다. 성스러운 생년월일시 ${sajuProfile.birthDate} ${sajuProfile.birthTime} 정보와 ${sajuProfile.mbti} 기질의 결을 완전하게 해독하여 가슴속에 깊이 각인해 두었습니다. 당신의 길흉화복과 오행 결핍, 혹은 직업공간적 인연 등 무엇이든 별들에게 여쭈어보십시오.`,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sampleChips = [
    "올해 이직운이 주도적으로 열릴까요?",
    "내 MBTI와 가장 운명적인 기류를 자극하는 동료 성격은?",
    "오늘 내 오행 정렬에 귀중한 럭키 컬러와 수호 방향은?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "user_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/oracle/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          sajuProfile: sajuProfile
        })
      });

      if (!response.ok) {
        throw new Error("오라클 망과의 통신 도중에 잡음이 발생했습니다.");
      }

      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      } else {
        throw new Error("올바른 은하 응답을 정밀 획득하지 못했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "통신 오류");
      
      // Mystical Fallback Response to prevent blank states
      const fallbackAiMsg: ChatMessage = {
        id: "fallback_" + Date.now(),
        sender: "ai",
        text: `미안하군요, 일시적으로 성좌의 파동 주파수에 극미한 파형 교란이 발생하여 지혜의 원천에 도달하는 실타래가 살짝 꼬였습니다. 그럼에도 불구하고, 귀하의 내면 속 ${sajuProfile.dayMaster} 기류는 현재 지극히 고귀하고 굳건히 제자리를 파지하고 있음을 늘 인지해 두십시오. 잠시 후 명리의 운율을 다시 정렬해 질문해 보세요.`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="oracle-chat-view" className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative font-sans">
      
      {/* Decorative Aura Spot */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start animate-fade-in"}`}>
            
            {/* Sender Metadata */}
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              {msg.sender === "ai" ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-mono text-indigo-600 tracking-wider uppercase font-bold">오라클 데스티니 위버</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-600 tracking-wider uppercase font-bold">직조자 ({sajuProfile.name})</span>
                </>
              )}
              <span className="text-[9px] font-mono text-slate-400">{msg.timestamp}</span>
            </div>

            {/* Bubble Layout of Mysticism */}
            <div className={`rounded-2xl px-5 py-4 max-w-[85%] text-sm leading-relaxed shadow-sm ${
              msg.sender === "user" 
                ? "bg-indigo-600 text-white rounded-tr-none"
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
            }`}>
              
              {/* Optional 명리 분석 Card Inside AI Bubble */}
              {msg.sajuDetail && (
                <div className="bg-slate-50 rounded-lg p-3.5 mb-4 border border-slate-150 flex flex-col gap-2 shadow-inner font-mono text-xs w-full max-w-sm">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-bold">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>명리 정밀 해석 (用神)</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-white border border-slate-250 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      {msg.sajuDetail.topic}
                    </div>
                    <span className="text-slate-400">→</span>
                    <div className="bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      상서로움: 감도 최상
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-1 italic">
                    {msg.sajuDetail.description}
                  </p>
                </div>
              )}

              <p className={`whitespace-pre-wrap font-sans font-semibold leading-relaxed ${
                msg.sender === "user" ? "text-white" : "text-slate-800"
              }`}>
                {msg.text}
              </p>
            </div>

          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="flex items-center gap-1.5 mb-1.5 px-1 text-slate-500">
              <Bot className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span className="text-[10px] font-mono tracking-wider font-bold">성좌를 헤아리는 중...</span>
            </div>
            <div className="bg-slate-100 rounded-xl rounded-tl-none px-4 py-3 text-xs text-slate-500 font-mono italic">
              별의 파동을 해독하며 지혜를 모으고 있습니다...
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-1.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">오류: {errorMsg}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion Chips Selector */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-nowrap overflow-x-auto gap-2 scrollbar-none">
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="bg-white border border-slate-200 px-4 py-2 rounded-full font-mono text-xs text-slate-600 hover:border-indigo-400 hover:text-indigo-600 active:scale-95 transition-all shrink-0 cursor-pointer shadow-sm font-semibold"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-indigo-600 transition-all rounded-lg shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            placeholder="데스티니 위버에게 운명의 질문을 던지세요..."
            className="w-full bg-transparent px-4 py-3.5 pr-12 text-slate-800 text-sm font-sans focus:outline-none placeholder-slate-400 font-semibold"
          />
          <button
            type="button"
            onClick={() => handleSendMessage(inputText)}
            className="absolute right-2 p-2 text-slate-450 hover:text-indigo-600 active:scale-90 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
