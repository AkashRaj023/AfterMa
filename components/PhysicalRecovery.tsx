
import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase, PeriodLog } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw, Clock, Zap, ChevronRight,
  TrendingUp, Heart, Award, Calendar, FileText, Droplet, Smile, Edit,
  ShieldCheck
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
  const [activeSubTab, setActiveSubTab] = useState<'Journey' | 'Cycle' | 'Report'>('Journey');
  
  const [periodForm, setPeriodForm] = useState<Partial<PeriodLog>>({
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    symptoms: [],
    mood: 'Good',
    notes: ''
  });

  const phaseActivities = activities.filter(a => a.phase === selectedPhase);
  const completedInPhase = phaseActivities.filter(a => profile.completedActivities.includes(a.id)).length;
  const phaseProgress = phaseActivities.length > 0 ? (completedInPhase / phaseActivities.length) * 100 : 0;

  const currentPhaseIndex = PHASES.indexOf(profile.currentPhase);
  const selectedPhaseIndex = PHASES.indexOf(selectedPhase);
  const isLocked = selectedPhaseIndex > currentPhaseIndex;
  
  const theme = COLORS[profile.accent] || COLORS.PINK;

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

  const handlePeriodLog = () => {
    const newLog: PeriodLog = {
      id: Date.now().toString(),
      ...(periodForm as any)
    };
    setProfile(prev => ({
      ...prev,
      periodLogs: [newLog, ...(prev.periodLogs || [])]
    }));
    alert("Cycle details logged safely.");
  };

  const physicalTasks = phaseActivities.filter(a => a.category === 'Physical Recovery');
  const otherTasks = phaseActivities.filter(a => a.category !== 'Physical Recovery');

  return (
    <div className="space-y-10 animate-in max-w-6xl mx-auto pb-32">
      {/* Sub-navigation Switcher */}
      <div className="flex gap-2 bg-white/50 backdrop-blur-xl p-2 rounded-[1.75rem] border border-white/60 w-fit mx-auto md:mx-0 shadow-sm">
        <button 
          onClick={() => setActiveSubTab('Journey')}
          className={`px-8 py-3 rounded-[1.25rem] text-xs font-bold transition-all flex items-center gap-3 active:scale-95 ${activeSubTab === 'Journey' ? 'bg-slate-900 text-white shadow-2xl scale-[1.05]' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <Target size={16} /> Journey
        </button>
        <button 
          onClick={() => setActiveSubTab('Cycle')}
          className={`px-8 py-3 rounded-[1.25rem] text-xs font-bold transition-all flex items-center gap-3 active:scale-95 ${activeSubTab === 'Cycle' ? 'bg-slate-900 text-white shadow-2xl scale-[1.05]' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <Droplet size={16} /> {t.physical.cycleTitle}
        </button>
        <button 
          onClick={() => setActiveSubTab('Report')}
          className={`px-8 py-3 rounded-[1.25rem] text-xs font-bold transition-all flex items-center gap-3 active:scale-95 ${activeSubTab === 'Report' ? 'bg-slate-900 text-white shadow-2xl scale-[1.05]' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <FileText size={16} /> {t.physical.reportTitle}
        </button>
      </div>

      {activeSubTab === 'Journey' && (
        <div className="space-y-12">
          {/* Header Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[3.5rem] border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-12 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="p-5 rounded-[2rem] text-white shadow-xl group-hover:rotate-6 transition-transform border border-white/20" style={{ backgroundColor: theme.primary }}>
                     <Target size={32} />
                   </div>
                   <div className="space-y-1">
                     <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-none">{t.physical.title}</h2>
                     <div className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50/50 px-4 py-2 rounded-xl border border-white mt-2 inline-block tracking-[0.25em] shadow-inner">
                       {selectedPhase} Targeted Pathway
                     </div>
                   </div>
                </div>
                <button 
                  onClick={togglePause}
                  className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest transition-all shadow-sm active:scale-95 border ${
                    profile.journeySettings.isPaused ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-inner' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {profile.journeySettings.isPaused ? <RotateCcw size={16} /> : <Pause size={16} />}
                  {profile.journeySettings.isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">Phase Completion</span>
                    <span className="text-4xl font-bold tracking-tighter tabular-nums" style={{ color: theme.text }}>{Math.round(phaseProgress)}%</span>
                 </div>
                 <div className="h-4 w-full bg-slate-100/50 rounded-full border border-white p-1 shadow-inner overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${phaseProgress}%`, backgroundColor: theme.primary, background: `linear-gradient(90deg, ${theme.primary}, ${theme.text}dd)` }}
                    />
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center space-y-6 hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all group">
               <div className="w-24 h-24 bg-slate-50/50 rounded-full flex items-center justify-center border-4 border-white shadow-inner group-hover:scale-110 transition-transform">
                 <Award size={48} style={{ color: theme.primary }} strokeWidth={2.5} />
               </div>
               <div className="space-y-1">
                 <div className="text-6xl font-bold text-slate-900 tracking-tighter tabular-nums">{completedInPhase * 10}</div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] opacity-80">Healing Points Accumulated</p>
               </div>
               <div className="w-full h-px bg-slate-100/50" />
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{profile.currentPhase} Focus</p>
            </div>
          </div>

          {/* Month Selector Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PHASES.map((p, idx) => {
              const active = selectedPhase === p;
              const locked = idx > currentPhaseIndex;
              return (
                <button 
                  key={p}
                  onClick={() => setSelectedPhase(p)}
                  className={`px-6 py-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center text-center gap-3 active:scale-[0.98] group relative overflow-hidden ${
                    active ? 'bg-white border-white shadow-2xl scale-[1.05] z-10' : 
                    locked ? 'bg-slate-50/40 text-slate-300 border-white/40 cursor-not-allowed opacity-50' :
                    'bg-white/60 text-slate-500 border-white shadow-sm hover:border-slate-200 hover:shadow-xl'
                  }`}
                  style={{ borderColor: active ? theme.primary : '' }}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${active ? '' : 'text-slate-400'}`} style={{ color: active ? theme.primary : '' }}>{p}</span>
                  <span className={`text-base font-bold tracking-tight ${active ? 'text-slate-900' : 'text-slate-500'}`}>Path of Healing</span>
                  {locked && <div className="p-2 bg-white rounded-xl shadow-sm mt-1"><Pause size={14} className="text-slate-200" /></div>}
                  {active && <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: theme.primary }} />}
                </button>
              );
            })}
          </div>

          {/* Tasks Grid Layout Rebalanced */}
          <div className="pt-8">
            {isLocked ? (
              <div className="bg-slate-50/50 backdrop-blur-md p-24 rounded-[3.5rem] border-4 border-dashed border-white flex flex-col items-center text-center space-y-6 shadow-inner animate-in fade-in duration-700">
                 <div className="p-10 bg-white rounded-[2.5rem] shadow-2xl animate-bounce-slow text-slate-100"><Pause size={64} /></div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Phase Restricted</h4>
                    <p className="text-base text-slate-400 font-medium italic opacity-80">"Patience is healing. Complete your current path to unlock this focus."</p>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 px-2">
                     <div className="w-2 h-8 rounded-full shadow-lg" style={{ backgroundColor: theme.primary }} />
                     <h3 className="text-lg font-bold text-slate-900 uppercase tracking-[0.25em]">Physical Recovery</h3>
                  </div>
                  <div className="space-y-6">
                    {physicalTasks.map(act => (
                      <ActivityCard key={act.id} act={act} theme={theme} isDone={profile.completedActivities.includes(act.id)} onClick={() => startSession(act)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 px-2">
                     <div className="w-2 h-8 rounded-full shadow-lg" style={{ backgroundColor: '#A78BFA' }} />
                     <h3 className="text-lg font-bold text-slate-900 uppercase tracking-[0.25em]">Emotional Wellness</h3>
                  </div>
                  <div className="space-y-6">
                    {otherTasks.map(act => (
                      <ActivityCard key={act.id} act={act} theme={theme} isDone={profile.completedActivities.includes(act.id)} onClick={() => startSession(act)} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simplified subtabs for consistency */}
      {activeSubTab !== 'Journey' && (
        <div className="bg-white/70 backdrop-blur-3xl p-12 lg:p-16 rounded-[3.5rem] border border-white shadow-[0_20px_80px_rgba(0,0,0,0.03)] space-y-12 animate-in duration-500">
           <div className="space-y-4">
             <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 flex items-center gap-6 tracking-tight leading-none">
               <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-white shadow-inner" style={{ color: activeSubTab === 'Cycle' ? '#FB7185' : '#60A5FA' }}>
                 {activeSubTab === 'Cycle' ? <Droplet size={40} /> : <FileText size={40} />}
               </div>
               {activeSubTab === 'Cycle' ? "Cycle Tracker" : "Healing Summary"}
             </h2>
             <p className="text-lg text-slate-400 font-medium italic opacity-80 max-w-2xl leading-relaxed">
               {activeSubTab === 'Cycle' ? "Privacy-first transition monitoring as your body returns to its natural rhythm." : "Evidence-based compilation of your healing milestones and recovery trends."}
             </p>
           </div>
           
           <div className="p-24 border-4 border-dashed border-slate-100 rounded-[3rem] text-center space-y-6 opacity-40 grayscale flex flex-col items-center">
              <ShieldCheck size={80} className="text-slate-200" />
              <p className="text-xl font-bold text-slate-400 italic">This secure module is ready for your clinical data integration.</p>
           </div>
        </div>
      )}

      {/* Standardized Session Modal */}
      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-in duration-500">
           <div className="max-w-md w-full bg-white/90 backdrop-blur-3xl rounded-[3.5rem] p-12 text-center space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/50 animate-in zoom-in-95 duration-500">
              <div className="space-y-4">
                 <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{sessionActive.title}</h2>
                 <p className="text-base text-slate-400 italic leading-relaxed opacity-85">"{sessionActive.description}"</p>
              </div>
              <div className="p-12 bg-slate-50/50 rounded-[3rem] border border-white shadow-inner flex flex-col items-center">
                 <div className="text-7xl font-bold tabular-nums tracking-tighter" style={{ color: theme.primary }}>05:00</div>
                 <div className="text-[11px] font-bold uppercase text-slate-400 mt-4 tracking-[0.3em] opacity-60">Session Synchronized</div>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                  style={{ backgroundColor: theme.primary, background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}dd)` }}
                  className="w-full py-6 text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all"
                >
                  Log Session Complete
                </button>
                <button 
                  onClick={() => setSessionActive(null)}
                  className="w-full py-4 text-slate-400 rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
                >
                  Exit Reflection
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ActivityCard = ({ act, theme, isDone, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`p-8 rounded-[2.5rem] bg-white border transition-all duration-500 cursor-pointer group flex items-start gap-8 hover:translate-y-[-8px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] relative overflow-hidden ${
        isDone ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)]'
      }`}
    >
      <div 
        className={`w-16 h-16 rounded-[1.75rem] shrink-0 flex items-center justify-center transition-all duration-500 ${
          isDone ? 'bg-emerald-500 text-white shadow-xl rotate-0' : 'bg-slate-50/50 text-slate-300 group-hover:bg-white group-hover:rotate-12 group-hover:scale-110 border border-transparent group-hover:border-slate-100 shadow-inner'
        }`}
        style={{ color: !isDone ? theme.primary : '' }}
      >
        {isDone ? <CheckCircle size={32} strokeWidth={3} /> : <Play size={32} fill="currentColor" className="ml-1" />}
      </div>
      
      <div className="flex-1 space-y-4 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <h4 className={`text-xl font-bold leading-tight group-hover:text-pink-600 transition-colors tracking-tight ${isDone ? 'text-emerald-900 opacity-60 line-through' : 'text-slate-800'}`}>
            {act.title}
          </h4>
          <span className="text-[10px] font-bold uppercase px-4 py-1.5 bg-slate-100/50 text-slate-400 rounded-xl border border-white whitespace-nowrap tracking-widest shadow-sm">
            {act.frequency}
          </span>
        </div>
        
        <p className="text-sm text-slate-400 font-medium leading-relaxed italic opacity-85 line-clamp-2">"{act.description}"</p>

        <div className="flex items-center gap-8 pt-2">
           <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              <Clock size={16} strokeWidth={2.5} />
              {act.duration} Min
           </div>
           <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              <TrendingUp size={16} strokeWidth={2.5} />
              Level {act.intensityScale}
           </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/20 rounded-full translate-x-12 translate-y-[-10px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
    </div>
  );
};

export default PhysicalRecovery;
