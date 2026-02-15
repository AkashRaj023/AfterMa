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

      <div className="flex-1 bg-white rounded-[3rem] p-10 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col transition-all">
        
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-14 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-12 pb-12 border-b border-slate-50">
                <div className="relative group shrink-0">
                  <div className="h-36 w-36 rounded-[2.5rem] bg-slate-50 shadow-inner overflow-hidden flex items-center justify-center border-4 border-white shadow-2xl transition-all duration-700 group-hover:scale-105">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={56} className="text-slate-200" />
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                       <Camera size={28} className="text-white" />
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3.5 bg-slate-900 shadow-xl rounded-xl text-white hover:scale-110 active:scale-95 transition-all border-4 border-white"
                  >
                    <Upload size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{t.settings.aboutYou}</h3>
                    <p className="text-sm font-medium text-slate-400 mt-1 opacity-80 leading-relaxed italic max-w-md">"{t.settings.identitySub}"</p>
                  </div>
                  <div className="flex wrap gap-3 justify-center sm:justify-start pt-3">
                    <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] border border-slate-100">Identity Verified</span>
                    <span className="px-4 py-1.5 bg-emerald-50 rounded-full text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em] border border-emerald-100/50">Healing Path Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                <Field label={t.settings.fields.name} value={profile.name} onChange={v => updateProfile({ name: v })} />
                <Field label={t.settings.fields.age} type="number" value={profile.age.toString()} onChange={v => updateProfile({ age: parseInt(v) || 0 })} />
                <div className="space-y-3">
                  <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.fields.delivery}</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white appearance-none cursor-pointer"
                      style={{ '--tw-ring-color': currentTheme.primary + '11' } as any}
                      value={profile.deliveryType}
                      onChange={e => updateProfile({ deliveryType: e.target.value as any })}
                    >
                      <option value="normal">Vaginal Delivery</option>
                      <option value="c-section">C-Section Recovery</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-slate-500 transition-colors">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <Field label={t.settings.fields.sos} value={profile.emergencyContact} onChange={v => updateProfile({ emergencyContact: v })} />
              </div>
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="space-y-14 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Journey Configuration</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Fine-tune how AfterMa adapts to your personal recovery pace.</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.journey.paceTitle}</label>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-1.5 rounded-[1.25rem] border border-slate-100 shadow-inner">
                       <button 
                        onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'gentle' } })}
                        className={`py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-md text-slate-900 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                        style={{ color: profile.journeySettings.pace === 'gentle' ? currentTheme.primary : '' }}
                       >Gentle</button>
                       <button 
                        onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'moderate' } })}
                        className={`py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-md text-slate-900 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                        style={{ color: profile.journeySettings.pace === 'moderate' ? currentTheme.primary : '' }}
                       >Moderate</button>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed pl-2 opacity-80">"{t.settings.journey.paceSub}"</p>
                  </div>

                  <div className="space-y-8">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.journey.commitmentTitle}</label>
                    {/* Balanced Daily Commitment Card */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 lg:p-8 space-y-6 shadow-sm group">
                       <div className="px-2">
                         <input 
                          type="range" 
                          min="5" max="60" step="5"
                          value={localCommitment}
                          onChange={(e) => setLocalCommitment(parseInt(e.target.value))}
                          style={{ color: currentTheme.primary }}
                          className="w-full"
                         />
                       </div>
                       
                       <div className="flex items-center justify-between px-2 pt-2">
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter tabular-nums leading-none" style={{ color: currentTheme.primary }}>{localCommitment}</span>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">MIN / DAY</span>
                          </div>
                          <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-300 group-hover:text-emerald-500 transition-colors">
                             <Clock size={18} strokeWidth={2.5} />
                          </div>
                       </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed pl-2 opacity-80">"{t.settings.journey.commitmentSub}"</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-14 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Visual Appearance</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Customize the application UI to suit your preferred aesthetic tone.</p>
               </div>
               
               <div className="space-y-12">
                  <div className="space-y-8">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{t.settings.accent}</label>
                    <div className="flex flex-wrap gap-6 pl-2">
                      {(Object.keys(COLORS) as ThemeAccent[]).map(key => (
                        <button 
                          key={key}
                          onClick={() => changeAccent(key)}
                          disabled={isTransitioning}
                          className={`h-16 w-16 rounded-2xl border-4 transition-all duration-500 relative group flex items-center justify-center active:scale-90 ${profile.accent === key ? 'shadow-lg scale-110' : 'opacity-40 hover:opacity-100 scale-95'}`}
                          style={{ 
                            backgroundColor: COLORS[key].primary, 
                            borderColor: profile.accent === key ? 'white' : 'transparent',
                            boxShadow: profile.accent === key ? `0 10px 25px -5px ${COLORS[key].primary}44` : ''
                          }}
                        >
                          {profile.accent === key && <Check size={28} className="text-white" strokeWidth={4} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8 pt-10 border-t border-slate-50">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">Language Preference</label>
                    <div className="flex wrap gap-5 pl-2">
                       {[
                         { id: 'english', label: 'English (US)' },
                         { id: 'hindi', label: 'Hindi (Devanagari)' }
                       ].map(langOption => (
                         <button 
                          key={langOption.id}
                          onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: langOption.id as Language } })}
                          className={`px-8 py-4 rounded-xl font-bold text-sm tracking-tight transition-all duration-300 border active:scale-95 ${profile.journeySettings.language === langOption.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 shadow-sm'}`}
                         >
                           {langOption.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Notifications</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Manage how and when AfterMa reaches out to support your routine.</p>
               </div>
               
               <div className="bg-slate-50/50 rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                  <NotificationItem icon={<Activity size={20} />} label={t.settings.notifications.exercise} active={profile.notifications.exerciseReminders} onChange={v => updateNotifications('exerciseReminders', v)} theme={currentTheme} />
                  <NotificationItem icon={<Zap size={20} />} label={t.settings.notifications.hydration} active={profile.notifications.hydrationAlerts} onChange={v => updateNotifications('hydrationAlerts', v)} theme={currentTheme} />
                  <NotificationItem icon={<Heart size={20} />} label={t.settings.notifications.mood} active={profile.notifications.moodCheckins} onChange={v => updateNotifications('moodCheckins', v)} theme={currentTheme} />
                  <NotificationItem icon={<Users size={20} />} label={t.settings.notifications.care} active={profile.notifications.careConnectUpdates} onChange={v => updateNotifications('careConnectUpdates', v)} theme={currentTheme} />
               </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-16 animate-in fade-in duration-500">
              <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Privacy & Caregiver</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Control your data sovereignty and manage trusted access permissions.</p>
               </div>
               
               <div className="space-y-14">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-10 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                      <Field label="Trusted Name" value={profile.caregiver.name} onChange={v => updateCaregiver({ name: v })} />
                      <Field label="Relationship" value={profile.caregiver.relationship} onChange={v => updateCaregiver({ relationship: v })} />
                      <Field label="Private Contact" value={profile.caregiver.contact} onChange={v => updateCaregiver({ contact: v })} />
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-2">Access Control (Encrypted)</h4>
                     <div className="bg-slate-50/50 rounded-2xl border border-slate-100 divide-y divide-slate-100">
                        <PermissionRow label={t.settings.privacy.canMood} active={profile.caregiver.permissions.canViewMood} onChange={v => updateCaregiverPermissions('canViewMood', v)} theme={currentTheme} />
                        <PermissionRow label={t.settings.privacy.canPhys} active={profile.caregiver.permissions.canViewPhysical} onChange={v => updateCaregiverPermissions('canViewPhysical', v)} theme={currentTheme} />
                        <PermissionRow label={t.settings.privacy.canMed} active={profile.caregiver.permissions.canViewMedicalHistory} onChange={v => updateCaregiverPermissions('canViewMedicalHistory', v)} theme={currentTheme} />
                        <PermissionRow label={t.settings.privacy.canAppt} active={profile.caregiver.permissions.canViewAppointments} onChange={v => updateCaregiverPermissions('canViewAppointments', v)} theme={currentTheme} />
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="pt-12 mt-14 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3 opacity-40">
             <Shield size={18} className="text-slate-400" />
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Secure Synchronization Active</p>
           </div>
           <button 
            className="px-12 py-5 text-white rounded-2xl font-bold text-sm tracking-tight shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-4 relative overflow-hidden group"
            style={{ 
              backgroundColor: currentTheme.primary, 
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.text}dd)`
            }}
            onClick={() => alert("Sanctuary updated.")}
           >
             <Save size={20} className="relative z-10" /> 
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
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden active:scale-[0.97] group ${
      active ? 'bg-white shadow-md border border-slate-50 text-slate-900 scale-[1.05]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    <div className={`shrink-0 transition-all duration-500 group-hover:scale-110 ${active ? 'text-white p-2 rounded-lg shadow-sm' : 'text-slate-300'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       {React.cloneElement(icon as React.ReactElement, { size: active ? 16 : 20 } as any)}
    </div>
    <span className="tracking-tight">{label}</span>
  </button>
);

const Field = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-3">
    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white"
      style={{ '--tw-ring-color': '#00000005' } as any}
    />
  </div>
);

const NotificationItem = ({ icon, label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className="w-full flex items-center justify-between p-6 hover:bg-white transition-all group active:bg-slate-50/50"
  >
    <div className="flex items-center gap-5">
      <div 
        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 ${active ? 'text-white shadow-md' : 'bg-slate-50 text-slate-200'}`}
        style={{ backgroundColor: active ? theme.primary : '' }}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 18 } as any)}
      </div>
      <span className={`font-bold text-sm leading-tight tracking-tight ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
    </div>
    
    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-transparent shadow-sm' : 'border-slate-100 bg-white'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       {active && <Check size={16} className="text-white" strokeWidth={4} />}
    </div>
  </button>
);

const PermissionRow = ({ label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className="w-full flex items-center justify-between p-6 hover:bg-white transition-all active:bg-slate-50/50"
  >
    <span className={`text-sm font-bold tracking-tight ${active ? 'text-slate-700' : 'text-slate-300'}`}>{label}</span>
    <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all ${active ? 'border-transparent' : 'border-slate-100 bg-white'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       {active && <Check size={14} className="text-white" strokeWidth={4} />}
    </div>
  </button>
);

export default Settings;