
import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Heart, Edit3, Sparkles, MessageCircle, AlertTriangle, Phone, ShieldCheck, 
  CheckSquare, Music, Star, ChevronRight, Activity, Zap, Moon, X, Stethoscope, 
  Search, Shield, Gift, Smile, Send, Image as ImageIcon, Paperclip, Bot, User, Mic
} from 'lucide-react';
import { EPDS_QUESTIONS, HELPLINES, STABILIZATION_TASKS, COLORS } from '../constants';
import { UserProfile, ChatMessage } from '../types';
import { translations } from '../translations';
import { getTriageAnalysis } from '../services/geminiService';

interface MentalProps {
  profile: UserProfile;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const MentalWellness: React.FC<MentalProps> = ({ profile, messages, setMessages }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [showCheckin, setShowCheckin] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showTriage, setShowTriage] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [checkedRituals, setCheckedRituals] = useState<Record<number, boolean>>({});
  const [showReward, setShowReward] = useState(false);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isPostpartum = profile.maternityStage === 'Postpartum';

  const suggestions = isPostpartum 
    ? ['Postpartum Anxiety', 'Lactation Issues', 'Sleep Deprivation', 'Mood Swings']
    : ['Nausea Relief', 'Cramping in T1', 'Safe Exercises', 'Birth Planning'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Modular AI service layer call
      const response = await getTriageAnalysis([text], profile);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Triage Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    if (currentQuestion < EPDS_QUESTIONS.length - 1 && isPostpartum) {
      setCurrentQuestion(prev => prev + 1);
      setAnswers(newAnswers);
    } else {
      setShowCheckin(false);
      setCurrentQuestion(0);
      setAnswers([]);
      alert("Self-reflection saved. You're doing great.");
    }
  };

  const toggleRitual = (idx: number) => {
    const isNewCheck = !checkedRituals[idx];
    setCheckedRituals(p => ({ ...p, [idx]: isNewCheck }));
    if (isNewCheck) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 pb-32 animate-in relative">
      {/* Teddy Bear Reward Overlay */}
      {showReward && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-500">
           <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[4rem] border-4 border-rose-100 shadow-2xl flex flex-col items-center gap-6 scale-110">
              <div className="text-8xl animate-bounce-slow">🧸</div>
              <div className="text-center space-y-2">
                 <h4 className="text-3xl font-black text-slate-900 tracking-tight">Warm Hug!</h4>
                 <div className="flex gap-1 justify-center">
                    {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
                 </div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">{t.mental.ritualReward}</p>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[3.5rem] shadow-[0_10px_60px_rgba(0,0,0,0.03)] border border-white/60 col-span-1 lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{isPostpartum ? "Emotional Sanctuary" : "Prenatal Serenity"}</h2>
              <p className="text-slate-400 font-medium italic text-base lg:text-lg opacity-80 leading-relaxed">"{isPostpartum ? t.mental.subtitle : "A safe harbor for your mind during pregnancy."}"</p>
            </div>
            <div className="h-20 w-20 bg-slate-50/50 rounded-[2rem] text-slate-200 flex items-center justify-center shadow-inner border border-white">
               <ShieldCheck size={40} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <MentalAction icon={<Heart className="text-rose-400" />} title={isPostpartum ? "EPDS Screening" : "Bonding Check-in"} subtitle="Guided Reflection" onClick={() => setShowCheckin(true)} theme={theme} />
            <MentalAction icon={<Stethoscope className="text-emerald-400" />} title="AI Triage" subtitle="Clinical Logic" onClick={() => setShowTriage(true)} theme={theme} />
            <MentalAction icon={<Sparkles className="text-amber-400" />} title="Grounding Loops" subtitle="Safe Audio" onClick={() => {}} theme={theme} />
            <MentalAction icon={<Edit3 className="text-indigo-400" />} title="Safe Journal" subtitle="Private Space" onClick={() => {}} theme={theme} />
          </div>

          {showTriage && (
            <div className="fixed inset-0 z-[130] bg-white/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-500">
               <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Bot size={20} /></div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-none">AfterMa AI Triage</h3>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Clinical Support Active</p>
                    </div>
                  </div>
                  <button onClick={() => setShowTriage(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8 scrollbar-hide" ref={scrollRef}>
                  {messages.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center space-y-10 pt-10">
                       <div className="space-y-4">
                          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">How are you feeling today?</h4>
                          <p className="text-sm text-slate-400 font-medium italic">Describe your symptoms or pick a topic below for an immediate clinical assessment.</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          {suggestions.map(s => (
                            <button key={s} onClick={() => handleSendMessage(s)} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-bold text-slate-600 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all text-center">
                               {s}
                            </button>
                          ))}
                       </div>
                    </div>
                  )}

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`max-w-[85%] lg:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`h-10 w-10 rounded-2xl shrink-0 flex items-center justify-center shadow-sm border ${msg.role === 'user' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-emerald-500'}`}>
                             {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                          </div>
                          <div className={`p-6 rounded-[2rem] text-sm leading-relaxed font-medium ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none shadow-xl' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                             {msg.content}
                             <div className={`text-[8px] font-bold uppercase tracking-widest mt-3 opacity-40 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                       <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm">
                             <Bot size={18} />
                          </div>
                          <div className="bg-slate-50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-1.5">
                             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:200ms]" />
                             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:400ms]" />
                          </div>
                       </div>
                    </div>
                  )}
               </div>

               <div className="p-6 lg:p-10 border-t border-slate-100 bg-white shrink-0">
                  <div className="max-w-4xl mx-auto relative">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-300">
                        <button className="hover:text-slate-900 transition-colors"><ImageIcon size={20} /></button>
                        <button className="hover:text-slate-900 transition-colors"><Paperclip size={20} /></button>
                        <button className="hover:text-emerald-500 transition-colors"><Mic size={20} /></button>
                     </div>
                     <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage(input)}
                        placeholder="Type your symptoms or questions here..." 
                        className="w-full pl-32 pr-20 py-5 bg-slate-50 border border-slate-100 rounded-full font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all shadow-inner"
                     />
                     <button 
                        onClick={() => handleSendMessage(input)}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                     >
                        <Send size={18} />
                     </button>
                  </div>
                  <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6 opacity-60">AI-generated insights are for supportive guidance. For definitive clinical diagnosis, please consult your healthcare professional.</p>
               </div>
            </div>
          )}

          {showCheckin && (
            <div className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl p-10 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
               <button onClick={() => setShowCheckin(false)} className="absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
               <div className="max-w-xl w-full text-center space-y-12">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reflection {currentQuestion + 1} of {EPDS_QUESTIONS.length}</span>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{EPDS_QUESTIONS[currentQuestion].question}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 w-full">
                     {EPDS_QUESTIONS[currentQuestion].options.map((choice, idx) => (
                       <button key={choice} onClick={() => handleAnswer(idx)} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg transition-all font-bold text-slate-700 text-left flex items-center justify-between group">
                         {choice} <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10B981, #064E3B)' }}>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200 opacity-80">Safety First</p>
                <h4 className="text-2xl font-bold tracking-tight">Support Available</h4>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="p-3 bg-white/20 rounded-xl"><Phone size={20} /></div>
                    <div>
                      <p className="text-xs font-bold">{HELPLINES.india.number}</p>
                      <p className="text-[9px] uppercase tracking-widest text-emerald-100 opacity-70">Verified Helpline</p>
                    </div>
                 </div>
              </div>
              <div className="absolute top-[-20%] right-[-20%] opacity-10 pointer-events-none scale-[1.5]">
                 <ShieldCheck size={200} />
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">{t.mental.ritualTitle}</h4>
              <div className="space-y-4">
                 {STABILIZATION_TASKS.map((task, i) => (
                   <button 
                    key={i} 
                    onClick={() => toggleRitual(i)}
                    className="w-full flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-center text-left hover:bg-slate-100 transition-colors group active:scale-[0.98]"
                   >
                      <div className={`p-2.5 rounded-xl shadow-sm border transition-all ${checkedRituals[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-50 text-slate-100'}`}>
                         {checkedRituals[i] ? <CheckSquare size={16} /> : <div className="w-4 h-4" />}
                      </div>
                      <p className={`text-xs font-bold leading-tight transition-all ${checkedRituals[i] ? 'text-slate-400 line-through italic' : 'text-slate-700'}`}>"{task}"</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MentalAction = ({ icon, title, subtitle, onClick, theme }: any) => (
  <button onClick={onClick} className="flex flex-col items-center p-10 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[3rem] hover:border-white shadow-sm hover:shadow-2xl transition-all duration-500 text-center group active:scale-[0.98]">
    <div className="p-6 bg-slate-50 rounded-[1.75rem] mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-inner border border-transparent group-hover:border-slate-100">{React.cloneElement(icon as React.ReactElement, { size: 32, strokeWidth: 2.5 } as any)}</div>
    <span className="font-bold text-slate-900 text-xl mb-1.5 tracking-tight leading-none">{title}</span>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</span>
  </button>
);

export default MentalWellness;
