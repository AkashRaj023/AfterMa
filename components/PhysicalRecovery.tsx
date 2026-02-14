
import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw, Clock, Zap, ChevronRight
} from 'lucide-react';
import { PHASES, COLORS } from '../constants';
import { translations } from '../translations';

interface PhysicalProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activities: RecoveryActivity[];
  onToggleActivity: (id: string) => void;
}

const PhysicalRecovery: React.FC<PhysicalProps> = ({ profile, setProfile, activities, onToggleActivity }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [selectedPhase, setSelectedPhase] = useState<RecoveryPhase>(profile.currentPhase);
  const [sessionActive, setSessionActive] = useState<RecoveryActivity | null>(null);

  const phaseActivities = activities.filter(a => a.phase === selectedPhase);
  const completedInPhase = phaseActivities.filter(a => profile.completedActivities.includes(a.id)).length;
  const phaseProgress = phaseActivities.length > 0 ? (completedInPhase / phaseActivities.length) * 100 : 0;

  const currentPhaseIndex = PHASES.indexOf(profile.currentPhase);
  const selectedPhaseIndex = PHASES.indexOf(selectedPhase);
  const isLocked = selectedPhaseIndex > currentPhaseIndex;
  
  const theme = COLORS[profile.accent] || COLORS.pink;

  const startSession = (act: RecoveryActivity) => {
    if (isLocked || profile.journeySettings.isPaused) return;
    setSessionActive(act);
  };

  const togglePause = () => {
    setProfile(prev => ({
      ...prev,
      journeySettings: { ...prev.journeySettings, isPaused: !prev.journeySettings.isPaused }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in pb-20">
      {/* Refined Progress Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-[3rem] border-2 border-slate-100 shadow-lg flex flex-col justify-between space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
               <div className="p-4 rounded-3xl text-white shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: theme.primary }}>
                 <Target size={32} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-gray-900 leading-tight">{t.physical.title}</h2>
                 <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest bg-slate-100 px-3 py-1 rounded-full w-fit mt-1">
                   {t.physical.phase} {currentPhaseIndex + 1}: {profile.currentPhase}
                 </p>
               </div>
            </div>
            <button 
              onClick={togglePause}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${
                profile.journeySettings.isPaused ? 'bg-red-50 text-red-600 border-2 border-red-200' : 'bg-slate-50 text-slate-600 border-2 border-slate-200'
              }`}
            >
              {profile.journeySettings.isPaused ? <RotateCcw size={14} /> : <Pause size={14} />}
              {profile.journeySettings.isPaused ? t.physical.resume : t.physical.pause}
            </button>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">{t.physical.completion}</span>
                <span className="text-3xl font-black" style={{ color: theme.text }}>{Math.round(phaseProgress)}%</span>
             </div>
             <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 p-0.5 shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${phaseProgress}%`, backgroundColor: theme.primary }}
                />
             </div>
          </div>
        </div>

        {/* Improved Phase Focus Stats Card - Fluid Circle */}
        <div className="bg-white p-8 lg:p-10 rounded-[3rem] border-2 border-slate-100 shadow-lg flex flex-col justify-center items-center text-center space-y-6 group hover:border-pink-100 transition-colors">
           <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-md">
                <circle cx="80" cy="80" r="72" stroke="#F1F5F9" strokeWidth="14" fill="transparent" />
                <circle cx="80" cy="80" r="72" stroke={theme.primary} strokeWidth="14" fill="transparent" 
                        strokeDasharray={452.4} strokeDashoffset={452.4 - (452.4 * phaseProgress) / 100} 
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">{t.common.points}</span>
                 <span className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform">{completedInPhase * 10}</span>
              </div>
           </div>
           <div className="space-y-1">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t.physical.activeTitle}</p>
             <p className="text-sm font-black text-slate-700">{selectedPhase}</p>
           </div>
        </div>
      </div>

      {/* Improved Phase Selector - Better Visibility */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
        {PHASES.map((p, idx) => {
          const active = selectedPhase === p;
          const locked = idx > currentPhaseIndex;
          return (
            <button 
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`shrink-0 px-8 py-6 rounded-[2.5rem] border-2 transition-all flex flex-col gap-1 items-start min-w-[220px] relative overflow-hidden group ${
                active ? 'text-white border-transparent shadow-xl scale-105 z-10' : 
                locked ? 'bg-slate-100/40 text-slate-400 border-slate-100 cursor-not-allowed opacity-40' :
                'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-md'
              }`}
              style={{ backgroundColor: active ? theme.primary : '', boxShadow: active ? `0 25px 50px -12px ${theme.primary}66` : '' }}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${active ? 'opacity-80' : 'text-slate-400'}`}>{t.physical.phase} {idx + 1}</span>
              <span className="text-xl font-black whitespace-nowrap leading-none">{p}</span>
              {locked ? (
                 <span className="text-[9px] font-black mt-2 uppercase flex items-center gap-1 opacity-60"><Pause size={10} /> {t.physical.locked}</span>
              ) : active ? (
                 <span className="text-[9px] font-black mt-2 uppercase opacity-80 flex items-center gap-1"><Zap size={10} fill="currentColor" /> Currently Focusing</span>
              ) : (
                 <span className="text-[9px] font-black mt-2 uppercase text-slate-400 group-hover:text-slate-600 transition-colors">View Tasks</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Refined Activities Grid */}
      <div className="space-y-6">
        {isLocked ? (
          <div className="bg-white p-24 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6 shadow-inner animate-in zoom-in-95">
             <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl">
               <Pause size={48} />
             </div>
             <div className="space-y-3">
                <h4 className="text-3xl font-black text-slate-800 tracking-tight">{t.physical.restricted}</h4>
                <p className="text-base text-slate-500 max-w-sm font-medium leading-relaxed italic">{t.physical.restrictedSub}</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {phaseActivities.map(act => {
              const isDone = profile.completedActivities.includes(act.id);
              return (
                <div 
                  key={act.id}
                  onClick={() => startSession(act)}
                  className={`p-10 rounded-[3.5rem] bg-white border-2 transition-all cursor-pointer group relative overflow-hidden shadow-md hover:shadow-2xl ${
                    isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                     <div 
                      className={`p-5 rounded-2xl transition-all shadow-lg ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-800 transition-colors shadow-inner'}`}
                      style={{ color: !isDone && profile.accent === 'pink' ? theme.primary : '' }}
                     >
                        {isDone ? <CheckCircle size={32} /> : <Play size={32} fill="currentColor" />}
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 border border-slate-200 shadow-sm">{act.category}</div>
                        {act.typeSpecific && (
                           <div className="px-3 py-1 bg-amber-50 rounded-full text-[9px] font-black uppercase text-amber-600 border border-amber-100">Specific: {act.typeSpecific}</div>
                        )}
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors tracking-tight">{act.title}</h4>
                    <p className="text-base text-slate-600 font-medium leading-relaxed line-clamp-2">{act.description}</p>
                  </div>

                  <div className="flex items-center gap-8 mt-10 pt-8 border-t-2 border-slate-50">
                     <div className="flex items-center gap-3 text-slate-500">
                        <div className="p-2 bg-slate-50 rounded-lg"><Clock size={18} /></div>
                        <span className="text-xs font-black uppercase tracking-widest">{act.duration} Min</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-500">
                        <div className="p-2 bg-slate-50 rounded-lg"><Zap size={18} /></div>
                        <span className="text-xs font-black uppercase tracking-widest">{t.physical.intensityLabel} {act.intensityScale}/10</span>
                     </div>
                     <div className="ml-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:bg-slate-100 transition-all">
                        <ChevronRight size={24} />
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Session Modal - More Contrast */}
      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="max-w-xl w-full bg-white rounded-[4rem] p-12 lg:p-16 text-center space-y-12 relative shadow-2xl border-4 border-white/20">
              <button onClick={() => setSessionActive(null)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-colors"><RotateCcw size={32} /></button>
              <div className="space-y-6">
                 <h2 className="text-4xl font-black text-gray-900 leading-tight tracking-tight">{sessionActive.title}</h2>
                 <p className="text-lg text-slate-600 font-medium leading-relaxed italic px-4">"{sessionActive.description}"</p>
              </div>
              <div className="p-16 bg-slate-50 rounded-[3.5rem] border-4 border-white shadow-2xl flex flex-col items-center">
                 <div className="text-7xl lg:text-9xl font-black tabular-nums tracking-tighter mb-4 drop-shadow-sm" style={{ color: theme.primary }}>05:00</div>
                 <div className="px-6 py-2 bg-white rounded-full text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-sm">Recovery Timer Active</div>
              </div>
              <button 
                onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                style={{ backgroundColor: theme.primary, boxShadow: `0 25px 50px -15px ${theme.primary}88` }}
                className="w-full py-7 text-white rounded-full font-black text-xl shadow-xl hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest"
              >
                {t.physical.logCompletion}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalRecovery;
