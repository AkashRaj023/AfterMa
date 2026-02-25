
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, Zap, Clock, ChevronRight, Play, CheckCircle2, 
  Lock, ArrowRight, Info, Calendar, TrendingUp, AlertCircle,
  Timer, Flame, Award, Heart, Download, Share2, FileText,
  Stethoscope, ShieldCheck, ChevronLeft, RefreshCw, Calculator,
  Sparkles, Baby, Search, X, Droplet, Ruler, Gauge, BarChart3,
  CheckCircle, Target, Smile, Edit3, Moon, Pill, Frown, Laugh
} from 'lucide-react';
import { UserProfile, RecoveryActivity, ExerciseLog, HealthLog } from '../types';
import { COLORS } from '../constants';
import { translations } from '../translations';

interface CareJourneyProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onToggleActivity: (id: string) => void;
  activities: RecoveryActivity[];
  exerciseLogs: ExerciseLog[];
  setExerciseLogs: React.Dispatch<React.SetStateAction<ExerciseLog[]>>;
  logs: HealthLog[];
  onAddLog: () => void;
}

const CareJourney: React.FC<CareJourneyProps> = ({ 
  profile, 
  setProfile, 
  onToggleActivity, 
  activities, 
  exerciseLogs, 
  setExerciseLogs,
  logs,
  onAddLog
}) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'Journey' | 'PeriodLog' | 'HealthSummary'>('Journey');
  const [selectedActivity, setSelectedActivity] = useState<RecoveryActivity | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showTTCLogic, setShowTTCLogic] = useState(false);
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriod, setLastPeriod] = useState("");
  const [ttcResult, setTtcResult] = useState<any>(null);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isTTC = profile.maternityStage === 'TTC';
  const isPostpartum = profile.maternityStage === 'Postpartum';

  // Quick Log State for Period Log tab
  const [quickLog, setQuickLog] = useState<Partial<HealthLog>>({
    periodFlow: 'None',
    isOvulating: false,
    crampsLevel: 0,
    moodLevel: 5,
    symptoms: [],
    notes: ''
  });

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleStartActivity = (activity: RecoveryActivity) => {
    setSelectedActivity(activity);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleCompleteActivity = () => {
    if (!selectedActivity) return;
    
    const newLog: ExerciseLog = {
      id: Date.now().toString(),
      activityId: selectedActivity.id,
      duration: Math.floor(timer / 60),
      intensity: profile.journeySettings.pace,
      timestamp: Date.now(),
      completed: true
    };

    setExerciseLogs(prev => [...prev, newLog]);
    onToggleActivity(selectedActivity.id);
    setIsTimerRunning(false);
    setSelectedActivity(null);
    setTimer(0);
  };

  const calculateTTC = () => {
    if (!lastPeriod) return;
    const lmp = new Date(lastPeriod);
    const ovulation = new Date(lmp);
    ovulation.setDate(lmp.getDate() + (cycleLength - 14));
    
    const testDate = new Date(ovulation);
    testDate.setDate(ovulation.getDate() + 14);

    setTtcResult({
      ovulation: ovulation.toLocaleDateString(),
      testDate: testDate.toLocaleDateString(),
      chance: "High"
    });
  };

  const downloadClinicalReport = () => {
    const reportData = {
      patient: profile.name,
      stage: profile.maternityStage,
      summary: {
        avgMood: (logs.reduce((acc, l) => acc + l.moodLevel, 0) / (logs.length || 1)).toFixed(1),
        avgPain: (logs.reduce((acc, l) => acc + l.painLevel, 0) / (logs.length || 1)).toFixed(1),
        totalKegels: logs.reduce((acc, l) => acc + l.kegelCount, 0),
        hydrationRate: ((logs.reduce((acc, l) => acc + l.waterIntake, 0) / (logs.length || 1)) / 10 * 100).toFixed(0) + '%',
      },
      periodLogs: logs.filter(l => l.periodFlow && l.periodFlow !== 'None').map(l => ({
        date: new Date(l.timestamp).toLocaleDateString(),
        flow: l.periodFlow,
        cramps: l.crampsLevel,
        ovulating: l.isOvulating
      })),
      symptoms: Array.from(new Set(logs.flatMap(l => l.symptoms)))
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AfterMa_Clinical_Report_${profile.name.replace(' ', '_')}.json`;
    a.click();
    alert("Structured Clinical Report generated for OB-GYN review.");
  };

  const progress = activities.length > 0 ? (profile.completedActivities.length / activities.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 lg:space-y-12 pb-32 animate-in relative">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-3">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{isTTC ? "Conception Journey" : "Care Journey"}</h2>
          <p className="text-slate-400 font-medium italic text-base lg:text-lg opacity-80 leading-relaxed">"{isTTC ? "Optimizing your body for a healthy start." : t.physical.subtitle}"</p>
        </div>
        <div className="flex gap-4">
           {isTTC && (
             <button onClick={() => setShowTTCLogic(true)} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
               <Calculator size={18} /> Fertility Insights
             </button>
           )}
        </div>
      </div>

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-16 lg:top-20 z-30 flex justify-center w-full pointer-events-none">
        <div className="inline-flex gap-1.5 bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] pointer-events-auto mt-4">
          <button 
            onClick={() => setActiveTab('Journey')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'Journey' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <Target size={14} /> Journey
          </button>
          <button 
            onClick={() => setActiveTab('PeriodLog')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'PeriodLog' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <Droplet size={14} /> Period Log
          </button>
          <button 
            onClick={() => setActiveTab('HealthSummary')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'HealthSummary' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <BarChart3 size={14} /> Health Summary
          </button>
        </div>
      </div>

      {activeTab === 'Journey' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
          {activities.map((activity) => (
            <ActivityCard 
              key={activity.id} 
              act={activity} 
              theme={theme} 
              isDone={profile.completedActivities.includes(activity.id)} 
              onClick={() => handleStartActivity(activity)} 
            />
          ))}
        </div>
      )}

      {activeTab === 'PeriodLog' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-14 rounded-[3rem] border border-white/60 shadow-sm space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Log Your Cycle</h3>
                  <p className="text-slate-400 font-medium italic">Record your daily observations for precise clinical tracking.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Date</label>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl relative">
                      <Calendar size={20} className="text-slate-400" />
                      <input 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="bg-transparent font-bold text-slate-900 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mood Profile</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                      <div className="flex gap-3">
                        {[
                          { val: 2, icon: <Frown size={22} />, color: 'text-rose-500' },
                          { val: 5, icon: <Smile size={22} />, color: 'text-amber-500' },
                          { val: 8, icon: <Laugh size={22} />, color: 'text-emerald-500' }
                        ].map(({ val, icon, color }) => (
                          <button 
                            key={val}
                            onClick={() => setQuickLog(p => ({...p, moodLevel: val}))}
                            className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center border-2 ${
                              quickLog.moodLevel === val 
                                ? `bg-slate-900 border-slate-900 text-white shadow-xl scale-110` 
                                : `bg-white border-slate-100 ${color} hover:border-slate-200 hover:scale-105`
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs font-bold text-slate-900">{quickLog.moodLevel! > 7 ? 'Radiant' : quickLog.moodLevel! > 4 ? 'Balanced' : 'Low'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current State</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flow Intensity</label>
                  <div className="flex flex-wrap gap-3">
                    {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setQuickLog(p => ({...p, periodFlow: f as any}))}
                        className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border transition-all ${quickLog.periodFlow === f ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Symptom Cluster</label>
                  <div className="flex flex-wrap gap-2">
                    {['Nausea', 'Aching', 'Swelling', 'Insomnia', 'Cramps', 'Bloating'].map(s => (
                      <button 
                        key={s}
                        onClick={() => {
                          const current = quickLog.symptoms || [];
                          const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
                          setQuickLog(p => ({...p, symptoms: updated}));
                        }}
                        className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase border transition-all ${quickLog.symptoms?.includes(s) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                  <textarea 
                    value={quickLog.notes}
                    onChange={e => setQuickLog(p => ({...p, notes: e.target.value}))}
                    placeholder="Any specific observations for your doctor..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-100 min-h-[120px]"
                  />
                </div>

                <button 
                  onClick={onAddLog}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Edit3 size={20} /> Commit Entry
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-14 rounded-[3rem] border border-white/60 shadow-sm space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Observations</h4>
                <div className="space-y-4">
                  {logs.filter(l => l.periodFlow && l.periodFlow !== 'None').slice(-3).map(l => (
                    <div key={l.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><Droplet size={20} /></div>
                        <div>
                          <p className="font-bold text-slate-900">{new Date(l.timestamp).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.periodFlow} Flow • {l.symptoms.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">Cramps: {l.crampsLevel}/10</p>
                        {l.isOvulating && <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">Ovulating</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900 tracking-tight">Cycle Calendar</h4>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['S','M','T','W','T','F','S'].map((d, i) => <span key={`${d}-${i}`} className="text-[10px] font-bold text-slate-300">{d}</span>)}
                    {Array.from({length: 31}).map((_, i) => {
                      const day = i + 1;
                      const hasLog = logs.some(l => new Date(l.timestamp).getDate() === day && l.periodFlow && l.periodFlow !== 'None');
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                            hasLog ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Period Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ovulation Window</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="font-bold text-slate-900 tracking-tight">Cycle Insights</h4>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cycle Variance</p>
                    <p className="text-xl font-bold text-slate-900">±2 Days</p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Clinical Stability</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Ovulation</p>
                    <p className="text-xl font-bold text-slate-900">May 12-16</p>
                    <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-1">Hormonal Peak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'HealthSummary' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-14 rounded-[3rem] border border-white/60 shadow-sm space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Health Summary</h3>
                <p className="text-slate-400 font-medium italic">Clinical analytics and readiness indices for your recovery.</p>
              </div>
              <button 
                onClick={downloadClinicalReport}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all"
              >
                <Download size={18} /> Structured PDF Report
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Hydration Ratio" value={((logs.reduce((acc, l) => acc + l.waterIntake, 0) / (logs.length || 1)) / 10 * 100).toFixed(0) + '%'} sub="Daily Adherence" icon={<Droplet size={18} />} trend="Optimal" />
              <MetricCard label="Sleep Quality" value={((logs.reduce((acc, l) => acc + l.sleepHours, 0) / (logs.length || 1)) / 8 * 100).toFixed(0) + '%'} sub="Rest Efficiency" icon={<Moon size={18} />} trend="Improving" />
              <MetricCard label="Pelvic Index" value={(logs.reduce((acc, l) => acc + l.kegelCount, 0) / (logs.length || 1)).toFixed(1)} sub="Muscle Tone" icon={<Gauge size={18} />} trend="Verified" />
              <MetricCard label="Activity Load" value={logs.length} sub="Log Consistency" icon={<Activity size={18} />} trend="Balanced" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Readiness Indices</h4>
                <div className="space-y-6">
                  <ReportProgressBar label="Tissue Restoration" value={82} color="#10B981" />
                  <ReportProgressBar label="Pelvic Resilience" value={Math.round(progress)} color={theme.primary} />
                  <ReportProgressBar label="Core Alignment" value={65} color="#8B5CF6" />
                </div>
              </div>

              <div className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Behavioral Patterns</h4>
                <div className="space-y-6">
                  <ReportProgressBar label="Hydration Adherence" value={90} color="#3B82F6" />
                  <ReportProgressBar label="Rest Efficiency" value={70} color="#6366F1" />
                  <ReportProgressBar label="Log Consistency" value={85} color="#EC4899" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTTCLogic && (
        <div className="fixed inset-0 z-[140] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
           <div className="max-w-xl w-full bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 lg:p-14 space-y-10 relative">
              <button onClick={() => setShowTTCLogic(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
              <div className="text-center space-y-3">
                 <div className="p-4 bg-purple-50 text-purple-600 rounded-3xl w-fit mx-auto mb-4"><Baby size={32} /></div>
                 <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Cycle Restoration Analytics</h3>
                 <p className="text-sm text-slate-400 font-medium italic">Based on your cycle length and last period date.</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Cycle Length (Days)</label>
                    <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Last Period Start Date</label>
                    <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100" />
                 </div>
                 <button onClick={calculateTTC} className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all">Calculate Dates</button>
              </div>

              {ttcResult && (
                <div className="p-8 bg-purple-50 rounded-[2rem] border border-purple-100 grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Ovulation Window</p>
                      <p className="text-lg font-bold text-slate-900">{ttcResult.ovulation}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Best Test Date</p>
                      <p className="text-lg font-bold text-slate-900">{ttcResult.testDate}</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {selectedActivity && (
        <div className="fixed inset-0 z-[150] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="max-w-2xl w-full text-center space-y-12">
              <div className="space-y-4">
                 <span className="px-4 py-1.5 bg-white/10 text-white rounded-full font-bold text-[10px] uppercase tracking-widest border border-white/10">Active Session</span>
                 <h3 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">{selectedActivity.title}</h3>
                 <p className="text-white/60 font-medium italic text-lg">{selectedActivity.description}</p>
              </div>

              <div className="relative h-64 w-64 lg:h-80 lg:w-80 mx-auto flex items-center justify-center">
                 <div className="absolute inset-0 border-8 border-white/5 rounded-full" />
                 <div className="absolute inset-0 border-8 border-emerald-500 rounded-full transition-all duration-1000" style={{ clipPath: `inset(0 ${100 - (timer % 60 / 60) * 100}% 0 0)` }} />
                 <div className="text-6xl lg:text-8xl font-black text-white tracking-tighter tabular-nums">
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                 </div>
              </div>

              <div className="flex gap-6 justify-center">
                 <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="h-20 w-20 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                    {isTimerRunning ? <Lock size={32} /> : <Play size={32} className="ml-1" />}
                 </button>
                 <button onClick={handleCompleteActivity} className="px-10 py-5 bg-emerald-500 text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Complete Session
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, sub, icon, trend }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
     <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 group-hover:text-slate-900 transition-colors shadow-inner">{icon}</div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{trend}</span>
     </div>
     <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{label}</p>
        <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{sub}</p>
     </div>
  </div>
);

const ReportProgressBar = ({ label, value, color }: any) => (
  <div className="space-y-2.5">
     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
     </div>
     <div className="h-2 w-full bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
     </div>
  </div>
);

const ActivityCard = ({ act, theme, isDone, onClick }: any) => (
  <div onClick={onClick} className={`p-6 rounded-[2.5rem] bg-white border transition-all duration-400 cursor-pointer flex items-start gap-6 hover:translate-y-[-4px] hover:shadow-lg ${isDone ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-50 shadow-sm'}`}>
    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300'}`} style={{ color: !isDone ? theme.primary : '' }}>{isDone ? <CheckCircle2 size={28} /> : <Play size={28} />}</div>
    <div className="flex-1 space-y-2">
      <h4 className={`text-lg font-bold ${isDone ? 'text-emerald-900 opacity-60 line-through' : 'text-slate-800'}`}>{act.title}</h4>
      <p className="text-xs text-slate-400 italic line-clamp-2">"{act.description}"</p>
      <div className="flex items-center gap-4 text-[9px] font-bold uppercase text-slate-300 tracking-widest pt-1"><Clock size={10} /> {act.duration} Min • {act.category}</div>
    </div>
  </div>
);

export default CareJourney;
