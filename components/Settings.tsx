
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ThemeAccent, Language } from '../types';
import { 
  Save, User, Palette, Target, 
  Lock, Eye, Check, Camera, Upload, Bell,
  Activity, Users, Clipboard, Calendar, Heart, Clock, Zap, Shield, Globe, Monitor, ChevronRight
} from 'lucide-react';
import { COLORS } from '../constants';
import { translations } from '../translations';

interface SettingsProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'journey' | 'custom' | 'notifications' | 'privacy'>('profile');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [localCommitment, setLocalCommitment] = useState(15);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  useEffect(() => {
    setLocalCommitment(15);
  }, []);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const updateCaregiver = (fields: any) => {
    setProfile(prev => ({
      ...prev,
      caregiver: { ...prev.caregiver, ...fields }
    }));
  };

  const updateCaregiverPermissions = (key: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      caregiver: {
        ...prev.caregiver,
        permissions: { ...prev.caregiver.permissions, [key]: value }
      }
    }));
  };

  const updateNotifications = (key: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const changeAccent = (key: ThemeAccent) => {
    if (profile.accent === key) return;
    setIsTransitioning(true);
    setTimeout(() => {
      updateProfile({ accent: key });
    }, 400);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTheme = COLORS[profile.accent] || COLORS.PINK;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 animate-in pb-40 relative px-1 md:px-2">
      <div 
        className={`theme-transition-overlay ${isTransitioning ? 'theme-transition-active' : ''}`}
        style={{ color: currentTheme.primary }}
      />

      {/* Apple-style Glass Sidebar Navigation */}
      <div className="w-full md:w-64 space-y-1 shrink-0">
        <div className="px-5 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-2">Manage your journey</p>
        </div>
        
        <nav className="space-y-2">
          <TabBtn icon={<User size={18} />} label={t.settings.tabs.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} theme={currentTheme} />
          <TabBtn icon={<Monitor size={18} />} label={t.settings.tabs.journey} active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} theme={currentTheme} />
          <TabBtn icon={<Palette size={18} />} label={t.settings.tabs.custom} active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} theme={currentTheme} />
          <TabBtn icon={<Bell size={18} />} label={t.settings.tabs.notifications} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} theme={currentTheme} />
          <TabBtn icon={<Shield size={18} />} label={t.settings.tabs.privacy} active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} theme={currentTheme} />
        </nav>
      </div>

      {/* Apple Satin Content Panel */}
      <div className="flex-1 bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-12 lg:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.03)] border border-white flex flex-col transition-all">
        
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-16 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-14 pb-14 border-b border-slate-100">
                <div className="relative group shrink-0">
                  <div className="h-40 w-40 rounded-[3rem] bg-slate-50 shadow-inner overflow-hidden flex items-center justify-center border-4 border-white shadow-2xl transition-all duration-700 group-hover:scale-105">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-slate-200" />
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                       <Camera size={32} className="text-white" />
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-4 bg-slate-900 shadow-2xl rounded-2xl text-white hover:scale-110 active:scale-95 transition-all border-4 border-white"
                  >
                    <Upload size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <div className="space-y-4 text-center sm:text-left flex-1">
                  <div>
                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">{t.settings.aboutYou}</h3>
                    <p className="text-base font-medium text-slate-400 mt-1 opacity-80 leading-relaxed italic max-w-md">"{t.settings.identitySub}"</p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-4">
                    <span className="px-5 py-2 bg-slate-100/50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border border-slate-200/50 shadow-sm">Identity Verified</span>
                    <span className="px-5 py-2 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] border border-emerald-100/50 shadow-sm">Healing Path Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
                <Field label={t.settings.fields.name} value={profile.name} onChange={v => updateProfile({ name: v })} />
                <Field label={t.settings.fields.age} type="number" value={profile.age.toString()} onChange={v => updateProfile({ age: parseInt(v) || 0 })} />
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.fields.delivery}</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white appearance-none cursor-pointer"
                      style={{ '--tw-ring-color': currentTheme.primary + '11' } as any}
                      value={profile.deliveryType}
                      onChange={e => updateProfile({ deliveryType: e.target.value as any })}
                    >
                      <option value="normal">Vaginal Delivery</option>
                      <option value="c-section">C-Section Recovery</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-slate-500 transition-colors">
                      <ChevronRight size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <Field label={t.settings.fields.sos} value={profile.emergencyContact} onChange={v => updateProfile({ emergencyContact: v })} />
              </div>
            </div>
          )}

          {/* Other Tabs simplified for the Rebalance request */}
          {activeTab !== 'profile' && (
            <div className="space-y-14 animate-in fade-in duration-500">
               <div className="pb-10 border-b border-slate-100 space-y-2">
                 <h3 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">{activeTab} Configuration</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Fine-tune how AfterMa adapts to your personal recovery pace and privacy needs.</p>
               </div>
               
               {activeTab === 'journey' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.journey.paceTitle}</label>
                      <div className="grid grid-cols-2 gap-4 bg-slate-100/40 p-2 rounded-[2.25rem] border border-slate-100/50 shadow-inner">
                         <button 
                          onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'gentle' } })}
                          className={`py-5 rounded-[1.75rem] font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-2xl text-slate-900 border border-white' : 'text-slate-400 hover:text-slate-600'}`}
                          style={{ color: profile.journeySettings.pace === 'gentle' ? currentTheme.primary : '' }}
                         >Gentle</button>
                         <button 
                          onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'moderate' } })}
                          className={`py-5 rounded-[1.75rem] font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-2xl text-slate-900 border border-white' : 'text-slate-400 hover:text-slate-600'}`}
                          style={{ color: profile.journeySettings.pace === 'moderate' ? currentTheme.primary : '' }}
                         >Moderate</button>
                      </div>
                      <p className="text-xs text-slate-400 font-medium italic leading-relaxed pl-2 opacity-80">"{t.settings.journey.paceSub}"</p>
                    </div>

                    <div className="space-y-10">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.journey.commitmentTitle}</label>
                      <div className="bg-slate-50/50 p-12 rounded-[3rem] border border-white/80 space-y-10 shadow-inner">
                         <input 
                          type="range" 
                          min="5" max="60" step="5"
                          value={localCommitment}
                          onChange={(e) => setLocalCommitment(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                          style={{ accentColor: currentTheme.primary }}
                         />
                         <div className="flex justify-between items-center pt-2">
                            <div className="flex items-baseline gap-3">
                              <span className="text-6xl font-bold text-slate-900 tracking-tighter tabular-nums" style={{ color: currentTheme.primary }}>{localCommitment}</span>
                              <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">min / day</span>
                            </div>
                            <div className="h-14 w-14 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center shadow-lg">
                               <Clock size={24} className="text-slate-300" />
                            </div>
                         </div>
                      </div>
                    </div>
                 </div>
               )}

               {activeTab === 'custom' && (
                  <div className="space-y-14">
                    <div className="space-y-10">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.accent}</label>
                      <div className="flex flex-wrap gap-8 pl-2">
                        {(Object.keys(COLORS) as ThemeAccent[]).map(key => (
                          <button 
                            key={key}
                            onClick={() => changeAccent(key)}
                            disabled={isTransitioning}
                            className={`h-20 w-20 rounded-[2.25rem] border-4 transition-all duration-500 relative group flex items-center justify-center active:scale-90 ${profile.accent === key ? 'shadow-[0_20px_40px_rgba(0,0,0,0.15)] scale-110' : 'opacity-40 hover:opacity-100 scale-95'}`}
                            style={{ 
                              backgroundColor: COLORS[key].primary, 
                              borderColor: profile.accent === key ? 'white' : 'transparent',
                              boxShadow: profile.accent === key ? `0 20px 40px -5px ${COLORS[key].primary}66` : ''
                            }}
                          >
                            {profile.accent === key && <Check size={32} className="text-white" strokeWidth={4} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-10 pt-10 border-t border-slate-100">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">Language & Local Dialect</label>
                      <div className="flex flex-wrap gap-6 pl-2">
                         {[
                           { id: 'english', label: 'English (US / UK)' },
                           { id: 'hindi', label: 'Hindi (Devanagari)' }
                         ].map(langOption => (
                           <button 
                            key={langOption.id}
                            onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: langOption.id as Language } })}
                            className={`px-12 py-6 rounded-[2rem] font-bold text-sm tracking-tight transition-all duration-300 border active:scale-95 ${profile.journeySettings.language === langOption.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600 shadow-sm'}`}
                           >
                             {langOption.label}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
               )}

               {activeTab === 'notifications' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <IOSSwitch icon={<Activity size={24} />} label={t.settings.notifications.exercise} active={profile.notifications.exerciseReminders} onChange={v => updateNotifications('exerciseReminders', v)} theme={currentTheme} />
                    <IOSSwitch icon={<Zap size={24} />} label={t.settings.notifications.hydration} active={profile.notifications.hydrationAlerts} onChange={v => updateNotifications('hydrationAlerts', v)} theme={currentTheme} />
                    <IOSSwitch icon={<Heart size={24} />} label={t.settings.notifications.mood} active={profile.notifications.moodCheckins} onChange={v => updateNotifications('moodCheckins', v)} theme={currentTheme} />
                    <IOSSwitch icon={<Users size={24} />} label={t.settings.notifications.care} active={profile.notifications.careConnectUpdates} onChange={v => updateNotifications('careConnectUpdates', v)} theme={currentTheme} />
                 </div>
               )}

               {activeTab === 'privacy' && (
                 <div className="space-y-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 p-12 bg-slate-100/40 rounded-[3.5rem] border border-slate-100 shadow-inner">
                        <Field label="Trusted Name" value={profile.caregiver.name} onChange={v => updateCaregiver({ name: v })} />
                        <Field label="Relationship" value={profile.caregiver.relationship} onChange={v => updateCaregiver({ relationship: v })} />
                        <Field label="Private Contact" value={profile.caregiver.contact} onChange={v => updateCaregiver({ contact: v })} />
                    </div>

                    <div className="space-y-10">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-2">Access Control (Local Encrypted)</h4>
                       <div className="space-y-4">
                          <PermissionRow label={t.settings.privacy.canMood} active={profile.caregiver.permissions.canViewMood} onChange={v => updateCaregiverPermissions('canViewMood', v)} theme={currentTheme} />
                          <PermissionRow label={t.settings.privacy.canPhys} active={profile.caregiver.permissions.canViewPhysical} onChange={v => updateCaregiverPermissions('canViewPhysical', v)} theme={currentTheme} />
                          <PermissionRow label={t.settings.privacy.canMed} active={profile.caregiver.permissions.canViewMedicalHistory} onChange={v => updateCaregiverPermissions('canViewMedicalHistory', v)} theme={currentTheme} />
                          <PermissionRow label={t.settings.privacy.canAppt} active={profile.caregiver.permissions.canViewAppointments} onChange={v => updateCaregiverPermissions('canViewAppointments', v)} theme={currentTheme} />
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-14 mt-16 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4 opacity-40">
             <Shield size={20} className="text-slate-400" />
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Sovereign Data Protection Active</p>
           </div>
           <button 
            className="px-14 py-6 text-white rounded-[2.5rem] font-bold text-base tracking-tight shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] active:scale-95 transition-all flex items-center gap-4 relative overflow-hidden group"
            style={{ 
              backgroundColor: currentTheme.primary, 
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.text}dd)`
            }}
            onClick={() => alert("Sanctuary preferences updated.")}
           >
             <Save size={22} className="relative z-10" /> 
             <span className="relative z-10">Synchronize Changes</span>
             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
           </button>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick, theme }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.75rem] font-bold text-sm transition-all duration-300 relative overflow-hidden active:scale-[0.97] group ${
      active ? 'bg-white shadow-2xl border border-slate-100 text-slate-900 scale-[1.05]' : 'text-slate-400 hover:bg-white/50 hover:text-slate-700 border border-transparent'
    }`}
  >
    <div className={`shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${active ? 'text-white p-2.5 rounded-2xl shadow-lg' : 'text-slate-300'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       {React.cloneElement(icon as React.ReactElement, { size: active ? 18 : 22 } as any)}
    </div>
    <span className="tracking-tight">{label}</span>
    {active && <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
  </button>
);

const Field = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white"
      style={{ '--tw-ring-color': '#00000005' } as any}
    />
  </div>
);

const IOSSwitch = ({ icon, label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className={`flex items-center justify-between gap-8 p-8 rounded-[3rem] text-left border transition-all duration-500 active:scale-[0.98] ${
      active ? 'bg-white border-slate-200 shadow-2xl scale-[1.02]' : 'bg-slate-50/50 border-white/80 text-slate-400'
    }`}
  >
    <div className="flex items-center gap-6">
      <div 
        className={`h-14 w-14 rounded-[1.75rem] flex items-center justify-center transition-all duration-500 ${active ? 'text-white shadow-xl' : 'bg-white text-slate-200 border border-slate-100'}`}
        style={{ backgroundColor: active ? theme.primary : '' }}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 28 } as any)}
      </div>
      <span className={`font-bold text-base leading-tight tracking-tight ${active ? 'text-slate-900' : ''}`}>{label}</span>
    </div>
    
    <div className={`w-14 h-8 rounded-full relative transition-all duration-500 shadow-inner ${active ? '' : 'bg-slate-200'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-2xl ${active ? 'left-7' : 'left-1'}`} />
    </div>
  </button>
);

const PermissionRow = ({ label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className={`flex items-center justify-between gap-6 p-6 rounded-[2rem] bg-white border-2 transition-all duration-300 active:scale-[0.98] group ${active ? 'border-slate-100 shadow-xl scale-[1.01]' : 'border-slate-50 opacity-60'}`}
  >
    <span className="text-sm font-bold text-slate-700 tracking-tight leading-none">{label}</span>
    <div className={`w-12 h-7 rounded-full relative transition-all duration-500 shadow-inner ${active ? '' : 'bg-slate-200'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);

export default Settings;
