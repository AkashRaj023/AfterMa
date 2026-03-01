
import React from 'react';
import { UserProfile } from '../types';
import { UserCog, ShieldCheck, Bell, Clock, FileText, Lock, ChevronRight, LogOut } from 'lucide-react';

interface ExpertSettingsProps {
  profile: UserProfile;
  logout: () => void;
}

const ExpertSettings: React.FC<ExpertSettingsProps> = ({ profile, logout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in">
      <header className="pt-10 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portal Settings</h1>
        <p className="text-slate-400 font-medium italic">Manage your professional profile and clinical preferences.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <UserCog size={20} className="text-blue-500" />
              Professional Profile
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-3xl font-black text-slate-400">
                {profile.name[0]}
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-900">{profile.name}</p>
                <p className="text-sm text-slate-400 font-medium">{profile.verification?.specialization || 'Healthcare Professional'}</p>
              </div>
              <button className="ml-auto px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Edit</button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-500" />
              Clinical Compliance
            </h3>
          </div>
          <div className="p-8 space-y-2">
            <SettingsRow icon={<FileText size={18} />} label="Credentials & Licenses" value="Verified" />
            <SettingsRow icon={<Lock size={18} />} label="Data Processing Agreement" value="Signed" />
            <SettingsRow icon={<ShieldCheck size={18} />} label="Professional Indemnity" value="Active" />
          </div>
        </section>

        <section className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <Clock size={20} className="text-purple-500" />
              Availability & Notifications
            </h3>
          </div>
          <div className="p-8 space-y-2">
            <SettingsRow icon={<Clock size={18} />} label="Session Slots" value="Manage" />
            <SettingsRow icon={<Bell size={18} />} label="Urgent Patient Alerts" value="Enabled" />
          </div>
        </section>

        <button 
          onClick={logout}
          className="w-full py-6 bg-rose-50 text-rose-600 rounded-[3rem] border border-rose-100 font-black text-sm uppercase tracking-[0.2em] shadow-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
        >
          <LogOut size={20} /> Terminate Expert Session
        </button>
      </div>
    </div>
  );
};

const SettingsRow = ({ icon, label, value }: any) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
    <div className="flex items-center gap-4">
      <div className="text-slate-300 group-hover:text-slate-900 transition-colors">{icon}</div>
      <span className="font-bold text-slate-600">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{value}</span>
      <ChevronRight size={16} className="text-slate-200" />
    </div>
  </button>
);

export default ExpertSettings;
