
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplet, Moon, Pill, TrendingUp, AlertCircle, 
  CheckCircle2, Plus, Calendar as CalIcon, Activity,
  Leaf, Bell, X, Zap, ArrowRight, Star, Play, Camera, ShieldCheck,
  ChevronLeft, ChevronRight, Baby, Heart, Sparkles, Target, Ruler, Gauge, BarChart3, Download, Smile, Calendar, MessageSquare, Edit3
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Line
} from 'recharts';
import { UserProfile, HealthLog } from '../types';
import { getDailyInspiration } from '../services/geminiService';
import { NUTRITION_GUIDE, RECOVERY_DATABASE, COLORS, SLOGAN } from '../constants';
import { translations } from '../translations';

interface DashboardProps {
  profile: UserProfile;
  logs: HealthLog[];
  onAddLog: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, logs, onAddLog }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [inspiration, setInspiration] = useState(t.dashboard.inspiration);
  const lastLog = logs[logs.length - 1];
  const theme = COLORS[profile.accent] || COLORS.PINK;

  // Pregnancy Progress Logic
  const isPregnant = profile.maternityStage.startsWith('Pregnant');
  const edd = new Date(profile.deliveryDate);
  const today = new Date();
  
  const gestationalAge = useMemo(() => {
    if (!isPregnant) return null;
    const lmp = new Date(edd);
    lmp.setDate(lmp.getDate() - 280); // Estimate LMP from EDD
    const diff = today.getTime() - lmp.getTime();
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    return { weeks, days };
  }, [isPregnant, edd, today]);

  const progressPercent = useMemo(() => {
    if (!isPregnant || !gestationalAge) return 0;
    return Math.min(100, (gestationalAge.weeks / 40) * 100);
  }, [isPregnant, gestationalAge]);

  const milestoneEmoji = useMemo(() => {
    if (!gestationalAge) return '✨';
    const w = gestationalAge.weeks;
    if (w < 4) return '🌱';
    if (w < 8) return '🍓';
    if (w < 12) return '🍋';
    if (w < 16) return '🥑';
    if (w < 20) return '🍌';
    if (w < 24) return '🌽';
    if (w < 28) return '🍆';
    if (w < 32) return '🥥';
    if (w < 36) return '🍉';
    return '👶';
  }, [gestationalAge]);

  useEffect(() => {
    const fetchInspiration = async () => {
      const msg = await getDailyInspiration(lastLog?.moodLevel || 5);
      setInspiration(msg);
    };
    fetchInspiration();
  }, [lastLog, lang]);

  const chartData = useMemo(() => {
    if (logs.length === 0) return [{ time: 'Today', mood: 5, pain: 2 }];
    return logs.slice(-7).map(l => ({
      time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: l.moodLevel,
      pain: l.painLevel
    }));
  }, [logs]);

  const nextActivity = useMemo(() => {
    return RECOVERY_DATABASE
      .filter(a => !a.typeSpecific || a.typeSpecific === profile.deliveryType)
      .filter(a => profile.journeySettings.pace === 'moderate' || a.intensityScale <= 5)
      .find(a => a.phase === profile.currentPhase && !profile.completedActivities.includes(a.id));
  }, [profile.currentPhase, profile.completedActivities, profile.journeySettings.pace, profile.deliveryType]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500 relative pb-20">
      <div 
        className="rounded-[2.5rem] p-8 lg:p-14 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-700 border border-white/20" 
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}bb)` }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-[2rem] bg-white/20 backdrop-blur-2xl border-2 border-white/30 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl lg:text-4xl font-bold text-white">{profile.name[0]}</span>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white">{t.common.welcome}, {profile.name}</h2>
              <p className="opacity-90 max-w-lg italic text-base lg:text-xl leading-relaxed font-medium text-white/90">"{inspiration}"</p>
              <div className="pt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                <div className="flex items-center gap-2.5 bg-white/15 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                  <ShieldCheck size={16} className="text-emerald-300" />
                  <span className="font-bold text-[10px] lg:text-xs text-white uppercase tracking-widest">{SLOGAN}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/15 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                  <Zap size={16} className="text-amber-300" fill="currentColor" />
                  <span className="font-bold text-[10px] lg:text-xs text-white uppercase tracking-widest">{profile.streakCount} {t.dashboard.streakSuffix}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button onClick={onAddLog} className="bg-white/95 backdrop-blur-md px-10 py-5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 shrink-0 text-slate-900 text-sm lg:text-base border border-white">
            <Plus size={20} strokeWidth={3} /> {t.dashboard.logMoment}
          </button>
        </div>
      </div>

      {isPregnant && gestationalAge && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/60 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Pregnancy Journey</h3>
                <p className="text-sm text-slate-400 font-medium italic">Estimated Due Date: {edd.toLocaleDateString()}</p>
              </div>
              <div className="text-4xl animate-bounce-slow">{milestoneEmoji}</div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{gestationalAge.weeks}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">Weeks</span>
                  <span className="text-2xl font-bold text-slate-300 tracking-tighter ml-2">{gestationalAge.days}d</span>
                </div>
                <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{Math.round(progressPercent)}% Complete</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 shadow-lg" 
                  style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.text}aa)` }} 
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">
                <span>Conception</span>
                <span>Trimester 2</span>
                <span>Delivery</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/60 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 tracking-tight">Due Date Calendar</h4>
              <CalIcon size={20} className="text-slate-300" />
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['S','M','T','W','T','F','S'].map((d, i) => <span key={`${d}-${i}`} className="text-[10px] font-bold text-slate-300">{d}</span>)}
              {Array.from({length: 31}).map((_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate();
                const isDue = day === edd.getDate() && today.getMonth() === edd.getMonth();
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isDue ? 'bg-rose-500 text-white shadow-lg scale-110' : 
                      isToday ? 'bg-slate-900 text-white' : 
                      'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Milestone</span>
            </div>
          </div>
        </div>
      )}

      {nextActivity && !profile.journeySettings.isPaused && (
        <div className="bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-white/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-lg transition-all duration-500 cursor-pointer">
          <div className="flex items-center gap-8 w-full lg:w-auto">
              <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0" style={{ backgroundColor: theme.bg, color: theme.primary }}><Play fill="currentColor" size={24} className="ml-1" /></div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50" style={{ color: theme.primary }}>{t.dashboard.nextStep}</span>
                <h3 className="text-xl lg:text-3xl font-bold text-slate-900 leading-tight">{nextActivity.title}</h3>
                <p className="text-sm lg:text-base text-slate-400 font-medium line-clamp-1">{nextActivity.description}</p>
              </div>
          </div>
          <button className="w-full md:w-auto px-10 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 text-white" style={{ backgroundColor: theme.primary, background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}dd)` }}>
            {t.dashboard.startSoftly} <ArrowRight size={20} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <StatCard icon={<Droplet className="text-blue-500" />} label={t.dashboard.stats.hydration} value={`${lastLog?.waterIntake || 0}/10`} color="bg-blue-50/40" />
        <StatCard icon={<Moon className="text-indigo-400" />} label={t.dashboard.stats.rest} value={`${lastLog?.sleepHours || 0}`} unit="hrs" color="bg-indigo-50/40" />
        <StatCard icon={<Pill className="text-emerald-500" />} label={t.dashboard.stats.selfcare} value={lastLog?.medicationsTaken ? "Done" : "1 Task"} color="bg-emerald-50/40" />
        <StatCard icon={<Activity className="text-rose-500" />} label={t.dashboard.stats.kegel} value={`${lastLog?.kegelCount || 0}`} unit="sets" color="bg-rose-50/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.02)] border border-white/60">
          <div className="mb-8 lg:mb-12"><h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{t.dashboard.healingPulse}</h3><p className="text-sm lg:text-base text-slate-400 font-medium opacity-80 mt-1">{t.dashboard.healingPulseSub}</p></div>
          <div className="h-56 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.primary} stopOpacity={0.2}/><stop offset="95%" stopColor={theme.primary} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="time" hide /><YAxis hide domain={[0, 10]} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="mood" stroke={theme.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorMood)" /><Line type="monotone" dataKey="pain" stroke="#94A3B8" strokeWidth={2} strokeDasharray="6 6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-white/60 flex flex-col justify-between group">
          <div className="space-y-4">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-4"><div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner"><Leaf size={24} /></div>{t.dashboard.warmNutrition}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Fueling your recovery with traditional Ayurvedic principles.</p>
          </div>
          <div className="space-y-6 my-10">
              {NUTRITION_GUIDE.slice(0, 2).map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 rounded-[1.75rem] border border-white/80 space-y-4 hover:border-emerald-100 transition-colors">
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">{item.title}</h4>
                  <div className="flex flex-wrap gap-2">{item.items.map(i => <span key={i} className="text-[10px] bg-white px-3 py-1 rounded-full font-bold text-slate-600 shadow-sm border border-slate-100/50">{i}</span>)}</div>
                  <p className="text-xs text-emerald-600 font-bold italic opacity-90 leading-tight">"{item.benefit}"</p>
                </div>
              ))}
          </div>
          <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl font-bold text-sm text-slate-500 hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95">{t.dashboard.recipes}</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit = "", color }: any) => (
  <div className={`p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-white/60 flex flex-col justify-between hover:translate-y-[-6px] transition-all duration-500 cursor-default group ${color} backdrop-blur-sm`}>
    <div className="flex items-center gap-4 text-slate-500 font-bold mb-8"><div className="p-3 bg-white/80 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div><span className="text-[10px] uppercase tracking-[0.2em] line-clamp-1 opacity-60">{label}</span></div>
    <div className="flex items-baseline gap-2"><span className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tighter">{value}</span>{unit && <span className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest">{unit}</span>}</div>
  </div>
);

export default Dashboard;
