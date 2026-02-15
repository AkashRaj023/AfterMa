import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase, PeriodLog } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw, Clock, Zap, ChevronRight,
  TrendingUp, Heart, Award, Calendar, FileText, Droplet, Smile, Edit,
  ShieldCheck, BarChart3, Activity, ArrowRight, Plus
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

  const toggleSymptom = (s: string) => {
    setPeriodForm(prev => {
      const symptoms = prev.symptoms || [];
      return {
        ...prev,
        symptoms: symptoms.includes(s) ? symptoms.filter(item => item !== s) : [...symptoms, s]
      };
    });
  };

  const physicalTasks = phaseActivities.filter(a => a.category === 'Physical Recovery');
  const otherTasks = phaseActivities.filter(a => a.category !== 'Physical Recovery');

  return (
    <div className="space-y-10 animate-in max-w-6xl mx-auto pb-32">
      {/* Centered Sub-navigation Switcher */}
      <div className="w-full flex justify-center">
        <div className="inline-flex gap-1.5 bg-white/95 backdrop-blur-xl p-1.5 rounded-full border border-slate-100 shadow-sm sticky top-[64px] lg:top-[80px] z-[35]">
          <SubTabBtn 
            active={activeSubTab === 'Journey'} 
            onClick={() => setActiveSubTab('Journey')} 
            icon={<Target size={14} />} 
            label="Journey" 
            theme={theme}
          />
          <SubTabBtn 
            active={activeSubTab === 'Cycle'} 
            onClick={() => setActiveSubTab('Cycle')} 
            icon={<Droplet size={14} />} 
            label={t.physical.cycleTitle} 
            theme={theme}
          />
          <SubTabBtn 
            active={activeSubTab === 'Report'} 
            onClick={() => setActiveSubTab('Report')} 
            icon={<FileText size={14} />} 
            label={t.physical.reportTitle} 
            theme={theme}
          />
        </div>
      </div>

      {activeSubTab === 'Journey' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-10 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-4 rounded-2xl text-white shadow-lg group-hover:rotate-3 transition-transform" style={{ backgroundColor: theme.primary }}>
                     <Target size={24} />
                   </div>
                   <div className="space-y-1">
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{t.physical.title}</h2>
                     <div className="text-[9px] font-bold uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 mt-2 inline-block tracking-widest shadow-inner">
                       {selectedPhase} Targeted Pathway
                     </div>
                   </div>
                </div>
                <button 
                  onClick={togglePause}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 border ${
                    profile.journeySettings.isPaused ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}
                >
                  {profile.journeySettings.isPaused ? <RotateCcw size={12} /> : <Pause size={12} />}
                  {profile.journeySettings.isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Phase Completion</span>
                    <span className="text-3xl font-bold tracking-tighter tabular-nums leading-none" style={{ color: theme.text }}>{Math.round(phaseProgress)}%</span>
                 </div>
                 <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${phaseProgress}%`, backgroundColor: theme.primary }}
                    />
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-5 hover:shadow-md transition-all">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                 <Award size={32} style={{ color: theme.primary }} strokeWidth={2.5} />
               </div>
               <div className="space-y-1">
                 <div className="text-5xl font-bold text-slate-900 tracking-tighter tabular-nums">{completedInPhase * 10}</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Healing Points</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PHASES.map((p, idx) => {
              const active = selectedPhase === p;
              const locked = idx > currentPhaseIndex;
              return (
                <button 
                  key={p}
                  onClick={() => setSelectedPhase(p)}
                  className={`px-5 py-8 rounded-[2rem] border transition-all duration-300 flex flex-col items-center text-center gap-2 active:scale-95 relative overflow-hidden ${
                    active ? 'bg-white border-slate-900 shadow-md z-10' : 
                    locked ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50' :
                    'bg-white text-slate-500 border-slate-100 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400'}`}>{p}</span>
                  <span className={`text-sm font-bold tracking-tight ${active ? 'text-slate-900' : 'text-slate-500'}`}>Target Path</span>
                  {locked && <Pause size={10} className="text-slate-300 mt-1" />}
                </button>
              );
            })}
          </div>

          <div className="pt-8">
            {isLocked ? (
              <div className="bg-slate-50 p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-5 shadow-inner">
                 <Pause size={48} className="text-slate-200" />
                 <h4 className="text-xl font-bold text-slate-900 tracking-tight">Phase Restricted</h4>
                 <p className="text-sm text-slate-400 font-medium italic opacity-80">Complete current focus to unlock more recovery paths.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                     <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: theme.primary }} />
                     <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Physical Recovery</h3>
                  </div>
                  <div className="space-y-4">
                    {physicalTasks.map(act => (
                      <ActivityCard key={act.id} act={act} theme={theme} isDone={profile.completedActivities.includes(act.id)} onClick={() => startSession(act)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                     <div className="w-1.5 h-5 rounded-full bg-indigo-400" />
                     <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Emotional Well-being</h3>
                  </div>
                  <div className="space-y-4">
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

      {activeSubTab === 'Cycle' && (
        <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start gap-8">
             <div className="space-y-2">
               <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                 <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 border border-rose-100">
                   <Droplet size={24} />
                 </div>
                 Cycle Tracker
               </h2>
               <p className="text-sm text-slate-400 font-medium italic opacity-85">
                 Monitoring your body's return to its natural postpartum rhythm.
               </p>
             </div>
             <button 
              onClick={handlePeriodLog} 
              style={{ backgroundColor: theme.primary }} 
              className="w-full md:w-auto px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               <Plus size={14} /> Save Daily Entry
             </button>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Entry Date</label>
                    <input 
                      type="date" 
                      value={periodForm.date} 
                      onChange={e => setPeriodForm(f => ({...f, date: e.target.value}))}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flow Intensity</label>
                    <div className="grid grid-cols-4 gap-2">
                       {['Spotting', 'Light', 'Medium', 'Heavy'].map(flow => (
                         <button 
                          key={flow}
                          onClick={() => setPeriodForm(f => ({...f, flow: flow as any}))}
                          className={`py-3 rounded-xl font-bold text-[10px] uppercase border transition-all ${periodForm.flow === flow ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                         >
                           {flow}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Recent Symptoms</label>
                    <div className="flex wrap gap-2">
                       {['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne'].map(s => (
                         <button 
                          key={s}
                          onClick={() => toggleSymptom(s)}
                          className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase border transition-all ${periodForm.symptoms?.includes(s) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mood Profile</label>
                    <select 
                      value={periodForm.mood} 
                      onChange={e => setPeriodForm(f => ({...f, mood: e.target.value}))}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-rose-100 transition-all appearance-none cursor-pointer"
                    >
                      <option>Balanced</option>
                      <option>Tired</option>
                      <option>Sensitive</option>
                      <option>Radiant</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Healing Notes</label>
                    <textarea 
                      placeholder="Note physical shifts, pain spikes, or milestones..."
                      value={periodForm.notes}
                      onChange={e => setPeriodForm(f => ({...f, notes: e.target.value}))}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-rose-100 min-h-[140px] transition-all resize-none"
                    />
                 </div>
              </div>
           </div>

           <div className="pt-10 border-t border-slate-50">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Past Entries (Encrypted)</h4>
              <div className="grid gap-3">
                 {profile.periodLogs && profile.periodLogs.length > 0 ? (
                   profile.periodLogs.map(log => (
                     <div key={log.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group hover:bg-white transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                           <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-rose-500 font-bold text-xs">{log.date.split('-')[2]}</div>
                           <div>
                              <p className="text-sm font-bold text-slate-800">{log.flow} Flow • {log.mood}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(log.date).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                           </div>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                           {log.symptoms.map(s => <span key={s} className="text-[8px] font-bold bg-white px-2 py-0.5 rounded border border-slate-100 uppercase whitespace-nowrap">{s}</span>)}
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                     <p className="text-xs text-slate-400 italic">Your secure cycle log is ready for your first daily entry.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'Report' && (
        <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start gap-8">
             <div className="space-y-2">
               <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                 <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-sky-500">
                   <BarChart3 size={24} />
                 </div>
                 Health Summary
               </h2>
               <p className="text-sm text-slate-400 font-medium italic opacity-85">
                 A comprehensive view of your healing journey milestones and clinical progress.
               </p>
             </div>
             <button onClick={() => window.print()} className="w-full md:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Download Report</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryMetric label="Healing Streak" value={`${profile.streakCount} Days`} sub="Consistency Index" icon={<Zap className="text-amber-400" size={18} />} />
              <SummaryMetric label="Avg. Energy" value="7.4 / 10" sub="Weekly Trend: +12%" icon={<Activity className="text-emerald-500" size={18} />} />
              <SummaryMetric label="Activities Logged" value={profile.completedActivities.length.toString()} sub="Milestones Cleared" icon={<CheckCircle className="text-sky-500" size={18} />} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-4">
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-8">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Recovery Index</h4>
                 <div className="space-y-6">
                    <ReportProgressBar label="Pelvic Stability" value={85} color="#0EA5E9" />
                    <ReportProgressBar label="Core Engagement" value={62} color="#10B981" />
                    <ReportProgressBar label="Incision Healing" value={profile.deliveryType === 'c-section' ? 92 : 100} color="#F43F5E" />
                    <ReportProgressBar label="Joint Mobility" value={78} color="#8B5CF6" />
                 </div>
              </div>

              <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Emotional Health Trends</h4>
                 <div className="space-y-4">
                    <IndicatorRow label="Mood Stability" status="Optimistic" icon={<Smile className="text-emerald-500" size={16} />} />
                    <IndicatorRow label="Sleep Quality" status="Improving" icon={<Clock className="text-sky-500" size={16} />} />
                    <IndicatorRow label="Stress Index" status="Manageable" icon={<Heart className="text-rose-500" size={16} />} />
                 </div>
                 <div className="pt-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-inner">
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">"Your healing data shows a consistent trend toward Month 2 stabilization. Physical activity completion is up 15% this week."</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-in duration-300">
           <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-400">
              <div className="space-y-3">
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{sessionActive.title}</h2>
                 <p className="text-sm text-slate-400 italic leading-relaxed opacity-85">"{sessionActive.description}"</p>
              </div>
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner flex flex-col items-center">
                 <div className="text-6xl font-bold tabular-nums tracking-tighter" style={{ color: theme.primary }}>05:00</div>
                 <div className="text-[10px] font-bold uppercase text-slate-300 mt-4 tracking-widest">Active Focus</div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                  style={{ backgroundColor: theme.primary }}
                  className="w-full py-5 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Log Session Complete
                </button>
                <button 
                  onClick={() => setSessionActive(null)}
                  className="w-full py-3 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
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

const SubTabBtn = ({ active, onClick, icon, label, theme }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 active:scale-95 ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
  >
    {React.cloneElement(icon, { className: active ? 'text-white' : '' })}
    {label}
  </button>
);

const SummaryMetric = ({ label, value, sub, icon }: any) => (
  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-5 transition-all hover:bg-white hover:shadow-sm">
     <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 shrink-0">{icon}</div>
     <div className="text-left">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sub}</p>
     </div>
  </div>
);

const ReportProgressBar = ({ label, value, color }: any) => (
  <div className="space-y-2.5">
     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-0.5">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
     </div>
     <div className="h-2 w-full bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
     </div>
  </div>
);

const IndicatorRow = ({ label, status, icon }: any) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
     <div className="flex items-center gap-3">
        <div className="opacity-60">{icon}</div>
        <span className="text-xs font-bold text-slate-700">{label}</span>
     </div>
     <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{status}</span>
  </div>
);

const ActivityCard = ({ act, theme, isDone, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-[2.5rem] bg-white border transition-all duration-400 cursor-pointer group flex items-start gap-6 hover:translate-y-[-4px] hover:shadow-lg relative overflow-hidden ${
        isDone ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-100 shadow-sm'
      }`}
    >
      <div 
        className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-all duration-400 ${
          isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300 group-hover:bg-white border border-transparent group-hover:border-slate-100 shadow-inner'
        }`}
        style={{ color: !isDone ? theme.primary : '' }}
      >
        {isDone ? <CheckCircle size={28} strokeWidth={3} /> : <Play size={28} fill="currentColor" className="ml-1" />}
      </div>
      
      <div className="flex-1 space-y-3 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <h4 className={`text-lg font-bold leading-tight tracking-tight ${isDone ? 'text-emerald-900 opacity-60 line-through' : 'text-slate-800'}`}>
            {act.title}
          </h4>
          <span className="text-[8px] font-bold uppercase px-2.5 py-1 bg-slate-50 text-slate-400 rounded-md border border-slate-100 whitespace-nowrap tracking-widest shadow-inner">
            {act.frequency}
          </span>
        </div>
        
        <p className="text-xs text-slate-400 font-medium leading-relaxed italic opacity-85 line-clamp-2">"{act.description}"</p>

        <div className="flex items-center gap-6 pt-1">
           <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-300">
              <Clock size={12} strokeWidth={2.5} />
              {act.duration} Min
           </div>
           <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-300">
              <TrendingUp size={12} strokeWidth={2.5} />
              Level {act.intensityScale}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalRecovery;