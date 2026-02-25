
import React from 'react';
import { UserProfile, HealthLog } from '../types';
import { COLORS } from '../constants';
import { Heart, Activity, ShieldCheck, AlertCircle, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { translations } from '../translations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CaregiverViewProps {
  profile: UserProfile;
  logs: HealthLog[];
}

const CaregiverView: React.FC<CaregiverViewProps> = ({ profile, logs }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const permissions = profile.caregiver.permissions;
  const lastLog = logs[logs.length - 1];

  const chartData = logs.slice(-7).map(log => ({
    time: new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
    mood: log.moodLevel,
    pain: log.painLevel,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-inner"><ShieldCheck size={20} /></div>
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Authorized Caregiver Portal</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Monitoring {profile.name}'s Recovery</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <Calendar size={18} />
              <span>Schedule Check-in</span>
           </button>
           <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <MessageCircle size={18} />
              <span>Message {profile.name}</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          icon={<Heart className="text-rose-500" />} 
          label="Current Mood" 
          value={permissions.canViewMood ? (lastLog?.moodLevel || 'N/A') : 'Hidden'} 
          sub="Based on last log"
          color="rose"
        />
        <StatCard 
          icon={<Activity className="text-emerald-500" />} 
          label="Pain Level" 
          value={permissions.canViewPhysical ? (lastLog?.painLevel || 'N/A') : 'Hidden'} 
          sub="0-10 Scale"
          color="emerald"
        />
        <StatCard 
          icon={<ShieldCheck className="text-blue-500" />} 
          label="Recovery Phase" 
          value={profile.currentPhase} 
          sub={profile.maternityStage}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Healing Pulse (Last 7 Days)</h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                 <div className="flex items-center gap-2 text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500" /> Mood</div>
                 <div className="flex items-center gap-2 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Pain</div>
              </div>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '15px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '800' }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="#f43f5e" strokeWidth={4} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="pain" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                    <AlertCircle size={14} className="text-amber-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Immediate Action Required</span>
                 </div>
                 <h3 className="text-2xl font-bold tracking-tight">Emergency Support</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">If you notice any red flags like sudden high fever, severe bleeding, or extreme mood shifts, use the SOS trigger immediately.</p>
                 <button className="flex items-center gap-2 text-amber-400 font-bold text-sm group-hover:translate-x-2 transition-transform">
                    View Red Flag Guide <ArrowRight size={16} />
                 </button>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <AlertCircle size={200} />
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <div className="space-y-4">
                 {profile.completedActivities.slice(-3).map((actId, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-500"><ShieldCheck size={20} /></div>
                      <div className="flex-1">
                         <p className="text-xs font-bold text-slate-900">Activity Completed</p>
                         <p className="text-[10px] text-slate-400 font-medium">ID: {actId}</p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Today</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-md transition-all space-y-4">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 flex items-center justify-center`}>{icon}</div>
    <div className="space-y-1">
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
       <p className="text-[10px] text-slate-400 font-medium italic">{sub}</p>
    </div>
  </div>
);

export default CaregiverView;
