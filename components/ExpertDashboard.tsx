
import React, { useState } from 'react';
import { UserProfile, Appointment } from '../types';
import { 
  Calendar, MessageCircle, Users, Activity, 
  Clock, ShieldCheck, ChevronRight, Search, 
  Video, FileText, Bell, Star, TrendingUp, 
  CheckCircle2, AlertCircle, MoreHorizontal, Shield
} from 'lucide-react';
import { COLORS } from '../constants';

interface ExpertDashboardProps {
  profile: UserProfile;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ profile }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [activeTab, setActiveTab] = useState<'sessions' | 'queries' | 'rooms' | 'members' | 'logs'>('sessions');

  const stats = [
    { label: 'Active Sessions', value: '12', icon: <Calendar size={18} />, color: 'blue' },
    { label: 'Critical Alerts', value: '2', icon: <AlertCircle size={18} />, color: 'rose' },
    { label: 'Assigned Members', value: '48', icon: <Users size={18} />, color: 'emerald' },
    { label: 'Clinical Accuracy', value: '99%', icon: <ShieldCheck size={18} />, color: 'indigo' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-inner">
               <ShieldCheck size={20} />
             </div>
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Verified Clinical Portal</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Expert Dashboard</h1>
          <p className="text-slate-400 font-medium italic">Welcome back, {profile.name}. Your clinical expertise is making a difference.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all relative">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
           </button>
           <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <Video size={18} />
              <span>Start Live Room</span>
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <DashNavBtn active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} icon={<Calendar size={18} />} label="Manage Sessions" />
          <DashNavBtn active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<FileText size={18} />} label="Clinical Logs" />
          <DashNavBtn active={activeTab === 'queries'} onClick={() => setActiveTab('queries')} icon={<MessageCircle size={18} />} label="Patient Queries" />
          <DashNavBtn active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} icon={<Video size={18} />} label="Support Rooms" />
          <DashNavBtn active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={18} />} label="My Members" />
          
          <div className="pt-10">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold">
                <TrendingUp size={18} className="text-emerald-500" />
                <span className="text-sm">Weekly Impact</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Target Met</span>
                  <span className="text-emerald-600">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content View */}
        <div className="lg:col-span-9 bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm min-h-[600px] relative">
          <div className="absolute top-6 right-10 flex items-center gap-2 text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            <Shield size={10} className="text-emerald-500" />
            Audit Trail Enabled • Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>

          {activeTab === 'sessions' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Upcoming Sessions</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900"><Search size={18} /></button>
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900"><MoreHorizontal size={18} /></button>
                </div>
              </div>
              
              <div className="space-y-4">
                <SessionRow name="Anjali Sharma" type="Postpartum Physio" time="10:30 AM" date="Today" status="Confirmed" />
                <SessionRow name="Priya Patel" type="Lactation Support" time="02:00 PM" date="Today" status="Pending" />
                <SessionRow name="Meera Gupta" type="Pelvic Floor Check" time="11:00 AM" date="Tomorrow" status="Confirmed" />
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Logs & Notes</h3>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest">New Clinical Note</button>
              </div>
              <div className="space-y-4">
                <LogEntry patient="Anjali Sharma" date="23 Feb 2026" type="Physical Assessment" text="Patient reports 20% improvement in pelvic floor strength. Recommended increasing Kegel intensity." />
                <LogEntry patient="Priya Patel" date="22 Feb 2026" type="Lactation Note" text="Observed latching difficulties. Suggested side-lying position. Follow-up in 48 hours." />
                <LogEntry patient="Meera Gupta" date="21 Feb 2026" type="Recovery Metric" text="Energy levels stabilizing. Sleep quality improved to 6.5h avg." />
              </div>
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Queries</h3>
              <div className="space-y-4">
                <QueryCard 
                  name="Sonia K." 
                  text="Is it normal to have mild back pain 3 weeks after C-section when starting the gentle core exercises?" 
                  time="2h ago" 
                  priority="High"
                />
                <QueryCard 
                  name="Ritu M." 
                  text="Can I increase my water intake beyond 3L if I'm breastfeeding twins?" 
                  time="5h ago" 
                  priority="Medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="p-10 bg-slate-50 rounded-full text-slate-200">
                <Video size={64} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">No Active Rooms</h4>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Host a live support room to interact with multiple members simultaneously.</p>
              </div>
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl">Create New Room</button>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MemberCard name="Kavita R." stage="Postpartum (Month 2)" progress={75} />
                <MemberCard name="Neha S." stage="Pregnant (T3)" progress={90} />
                <MemberCard name="Pooja B." stage="Postpartum (Month 1)" progress={40} />
                <MemberCard name="Deepa V." stage="Pregnant (T2)" progress={60} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashNavBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
      active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const SessionRow = ({ name, type, time, date, status }: any) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400 shadow-sm border border-slate-50">
        {name[0]}
      </div>
      <div>
        <p className="font-bold text-slate-900">{name}</p>
        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{type}</p>
      </div>
    </div>
    <div className="flex items-center gap-10">
      <div className="text-right">
        <p className="font-bold text-slate-900 text-sm">{time}</p>
        <p className="text-[10px] font-bold uppercase text-slate-300 tracking-widest">{date}</p>
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
        status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
      }`}>
        {status}
      </div>
      <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><ChevronRight size={20} /></button>
    </div>
  </div>
);

const LogEntry = ({ patient, date, type, text }: any) => (
  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-900">{patient}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {type}</span>
      </div>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{date}</span>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed italic">"{text}"</p>
    <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
      <CheckCircle2 size={12} />
      Verified Entry
    </div>
  </div>
);

const QueryCard = ({ name, text, time, priority }: any) => (
  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 hover:bg-white hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-400 shadow-sm">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-slate-900">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{time}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
        priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
      }`}>
        {priority} Priority
      </span>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed italic">"{text}"</p>
    <div className="flex gap-3">
      <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg">Respond</button>
      <button className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest">Archive</button>
    </div>
  </div>
);

const MemberCard = ({ name, stage, progress }: any) => (
  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-slate-400 shadow-sm">
        {name[0]}
      </div>
      <div>
        <p className="font-bold text-slate-900">{name}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stage}</p>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Recovery Progress</span>
        <span className="text-emerald-600">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
    <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">View Health Summary</button>
  </div>
);

export default ExpertDashboard;
