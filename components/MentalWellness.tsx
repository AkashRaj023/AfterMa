
import React, { useState, useEffect } from 'react';
import { Brain, Heart, Edit3, Sparkles, MessageCircle, AlertTriangle, Phone, ShieldCheck, CheckSquare, Music, Star, ChevronRight, Activity, Zap, Moon } from 'lucide-react';
import { EPDS_QUESTIONS, HELPLINES, STABILIZATION_TASKS, COLORS } from '../constants';
import { UserProfile } from '../types';
import { translations } from '../translations';

interface MentalProps {
  profile: UserProfile;
}

const MentalWellness: React.FC<MentalProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [showEPDS, setShowEPDS] = useState(false);
  const [epdsStep, setEpdsStep] = useState(0);
  const [epdsScore, setEpdsScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showHug, setShowHug] = useState(false);
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const handleEPDSAnswer = (points: number) => {
    setEpdsScore(prev => prev + points);
    if (epdsStep < EPDS_QUESTIONS.length - 1) {
      setEpdsStep(epdsStep + 1);
    } else {
      setShowEPDS(false);
      alert(lang === 'hindi' ? `हीलिंग चेक-इन पूरा हुआ। आपकी भावनात्मक स्थिति आपकी स्थिर प्रगति के लिए ध्यान से लॉग की गई है।` : `Healing Check-in Complete. Your emotional state is logged with care for your steady progress.`);
      setEpdsStep(0);
      setEpdsScore(0);
    }
  };

  const toggleTask = (task: string) => {
    setCompletedTasks(prev => {
      const isRemoving = prev.includes(task);
      const next = isRemoving ? prev.filter(t => t !== task) : [...prev, task];
      if (!isRemoving && next.length === STABILIZATION_TASKS.length) {
        setShowHug(true);
      }
      return next;
    });
  };

  useEffect(() => {
    if (showHug) {
      const timer = setTimeout(() => setShowHug(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showHug]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 pb-32 animate-in relative">
      {/* Teddy Bear Hug Animation Overlay */}
      {showHug && (
        <div className="fixed inset-0 pointer-events-none z-[110] flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-2xl p-14 rounded-[4rem] shadow-2xl border border-pink-100 flex flex-col items-center gap-6 animate-in zoom-in-90 duration-500">
            <div className="text-8xl">🧸</div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-pink-600 tracking-tight">{t.mental.hugTitle}</h3>
              <p className="text-pink-400 font-bold mt-1">{t.mental.hugSub}</p>
            </div>
            <div className="flex gap-3 text-pink-200">
               <Star size={24} fill="currentColor" />
               <Star size={32} fill="currentColor" className="scale-125" />
               <Star size={24} fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[3.5rem] shadow-[0_10px_60px_rgba(0,0,0,0.03)] border border-white/60 col-span-1 lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{t.mental.title}</h2>
              <p className="text-slate-400 font-medium italic text-base lg:text-lg opacity-80 leading-relaxed">"{t.mental.subtitle}"</p>
            </div>
            <div className="h-20 w-20 bg-slate-50/50 rounded-[2rem] text-slate-200 flex items-center justify-center shadow-inner border border-white">
               <ShieldCheck size={40} />
            </div>
          </div>
          
          {!showEPDS ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <MentalAction icon={<Heart className="text-rose-400" />} title={t.mental.actions.checkin} subtitle={t.mental.actions.checkinSub} onClick={() => setShowEPDS(true)} theme={theme} />
              <MentalAction icon={<Edit3 className="text-indigo-400" />} title={t.mental.actions.journal} subtitle={t.mental.actions.journalSub} onClick={() => {}} theme={theme} />
              <MentalAction icon={<Sparkles className="text-amber-400" />} title={t.mental.actions.calm} subtitle={t.mental.actions.calmSub} onClick={() => {}} theme={theme} />
              <MentalAction icon={<Music className="text-emerald-400" />} title={t.mental.actions.sounds} subtitle={t.mental.actions.soundsSub} onClick={() => {}} theme={theme} />
            </div>
          ) : (
            <div className="bg-slate-50/70 backdrop-blur-xl rounded-[3rem] p-10 lg:p-12 border border-white shadow-inner animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-12">
                <span className="text-[10px] font-bold text-slate-400 bg-white/80 px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">Phase {epdsStep + 1} of 10</span>
                <button onClick={() => setShowEPDS(false)} className="text-slate-300 font-bold text-xs uppercase hover:text-slate-900 transition-all tracking-widest">{t.common.close}</button>
              </div>
              <h3 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-12 leading-tight tracking-tight">{EPDS_QUESTIONS[epdsStep]}</h3>
              <div className="grid gap-4">
                {[0, 1, 2, 3].map((val) => (
                  <button 
                    key={val}
                    onClick={() => handleEPDSAnswer(val)}
                    className="w-full text-left px-10 py-6 bg-white/90 border-2 border-slate-50 rounded-[2rem] hover:border-slate-300 hover:shadow-xl hover:translate-x-2 transition-all text-slate-700 font-bold text-lg active:scale-[0.98]"
                  >
                    {val === 0 ? "As much as I ever did" : val === 1 ? "Rather less than I used to" : val === 2 ? "Definitely less than I used to" : "Not at all"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New AI Triage Assistance Module */}
          <div className="pt-12 mt-16 border-t border-slate-100 space-y-8">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-slate-900/5 rounded-[1.5rem] border border-slate-100 shadow-inner"><Brain className="text-slate-400" size={28} /></div>
                   <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t.mental.triage.title}</h3>
                      <p className="text-sm font-medium text-slate-400 italic opacity-80">{t.mental.triage.subtitle}</p>
                   </div>
                </div>
                <button className="px-8 py-3.5 bg-white border border-slate-100 rounded-2xl font-bold text-xs text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-95">{t.mental.triage.cta}</button>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <TriageCategory icon={<Activity size={18} />} label={t.mental.triage.categories.mood} />
                <TriageCategory icon={<Zap size={18} />} label={t.mental.triage.categories.anxiety} />
                <TriageCategory icon={<Moon size={18} />} label={t.mental.triage.categories.sleep} />
                <TriageCategory icon={<ShieldCheck size={18} />} label={t.mental.triage.categories.physical} />
             </div>
          </div>

          {/* Stabilization Tasks Section */}
          <div className="pt-12 border-t border-slate-100 space-y-8">
             <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight">
               <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl shadow-inner"><CheckSquare size={24} /></div>
               {t.mental.tasksTitle}
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {STABILIZATION_TASKS.map(task => (
                 <button 
                  key={task}
                  onClick={() => toggleTask(task)}
                  className={`flex items-center gap-5 p-6 rounded-[2rem] text-left border-2 transition-all active:scale-[0.98] ${
                    completedTasks.includes(task) ? 'bg-white border-emerald-500 shadow-xl' : 'bg-slate-50/50 border-slate-50/50 text-slate-500 hover:bg-white hover:border-slate-100'
                  }`}
                 >
                   <div className={`shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                     completedTasks.includes(task) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white border-slate-200'
                   }`}>
                     {completedTasks.includes(task) && <CheckSquare size={18} strokeWidth={3} />}
                   </div>
                   <span className={`font-bold text-sm tracking-tight leading-snug ${completedTasks.includes(task) ? 'text-slate-900' : ''}`}>{task}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar Support Panel */}
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white p-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(244,63,94,0.3)] relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/20 rounded-2xl shadow-xl group-hover:rotate-12 transition-transform backdrop-blur-md"><AlertTriangle className="text-white" size={32} /></div>
                <h3 className="text-3xl font-bold tracking-tight">{t.mental.urgentTitle}</h3>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-rose-100 uppercase tracking-[0.25em]">{HELPLINES.india.name}</p>
                <a href={`tel:${HELPLINES.india.number}`} className="text-4xl font-bold block tracking-tighter hover:scale-105 transition-transform origin-left">
                  {HELPLINES.india.number}
                </a>
              </div>
              <p className="text-sm text-rose-50 leading-relaxed font-medium opacity-90 italic">
                "{t.mental.urgentSub}"
              </p>
              <button className="w-full py-5 bg-white text-rose-600 rounded-[2rem] font-bold text-base shadow-2xl hover:brightness-105 active:scale-95 transition-all">
                {t.mental.connectNow}
              </button>
            </div>
            <Heart size={200} className="absolute bottom-[-60px] right-[-40px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-12 rounded-[3.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white/60 space-y-8 group">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight">
              <div className="p-3 bg-rose-50 text-rose-400 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner"><Brain size={24} /></div>
              {t.mental.checkInTitle}
            </h3>
            <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-white/80 text-center shadow-inner">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">{t.mental.checkInSub}</p>
               <div className="flex justify-between items-center px-2">
                  {['😔', '😐', '🙂', '😊', '🌟'].map((e, i) => (
                    <button key={i} className="text-4xl hover:scale-150 transition-all active:scale-95 drop-shadow-xl hover:rotate-6">{e}</button>
                  ))}
               </div>
               <p className="mt-12 text-[11px] font-bold text-rose-400 italic opacity-80 leading-relaxed">"{t.mental.checkInFoot}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentalAction = ({ icon, title, subtitle, onClick, theme }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-10 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[3rem] hover:border-white shadow-sm hover:shadow-2xl transition-all duration-500 text-center group active:scale-[0.98]"
  >
    <div className="p-6 bg-slate-50 rounded-[1.75rem] mb-6 group-hover:bg-white group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border border-transparent group-hover:border-slate-100">
      {React.cloneElement(icon as React.ReactElement, { size: 32, strokeWidth: 2.5 })}
    </div>
    <span className="font-bold text-slate-900 text-xl mb-1.5 tracking-tight leading-none">{title}</span>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{subtitle}</span>
  </button>
);

const TriageCategory = ({ icon, label }: any) => (
  <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-slate-200 transition-colors shadow-sm">
     <div className="text-slate-300">{icon}</div>
     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default MentalWellness;
