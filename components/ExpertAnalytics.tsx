
import React from 'react';
import { UserProfile } from '../types';
import { BarChart3, TrendingUp, Users, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

interface ExpertAnalyticsProps {
  profile: UserProfile;
}

const ExpertAnalytics: React.FC<ExpertAnalyticsProps> = ({ profile }) => {
  const data = [
    { name: 'Mon', active: 40, recovery: 24 },
    { name: 'Tue', active: 30, recovery: 13 },
    { name: 'Wed', active: 20, recovery: 98 },
    { name: 'Thu', active: 27, recovery: 39 },
    { name: 'Fri', active: 18, recovery: 48 },
    { name: 'Sat', active: 23, recovery: 38 },
    { name: 'Sun', active: 34, recovery: 43 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in">
      <header className="pt-10 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Analytics</h1>
        <p className="text-slate-400 font-medium italic">Deep insights into recovery trends and clinical outcomes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Recovery Velocity</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Global Trend</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                <Area type="monotone" dataKey="active" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm space-y-8">
          <h3 className="text-xl font-bold text-slate-900">Case Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="recovery" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnalyticsCard icon={<Users className="text-blue-500" />} label="Total Patients" value="156" trend="+12%" />
        <AnalyticsCard icon={<Activity className="text-emerald-500" />} label="Avg. Recovery Rate" value="84%" trend="+5%" />
        <AnalyticsCard icon={<Calendar className="text-purple-500" />} label="Sessions Held" value="1,204" trend="+18%" />
      </div>
    </div>
  );
};

const AnalyticsCard = ({ icon, label, value, trend }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className="text-emerald-500 font-bold text-xs">{trend}</span>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export default ExpertAnalytics;
