
import React, { useState, useRef } from 'react';
import { UserProfile, RecoveryPace, ThemeAccent, Language } from '../types';
// Added Zap to the import list to fix the missing name error
import { 
  Save, User, Shield, Palette, Target, 
  Lock, Eye, Check, Trash2, Camera, Upload, Bell,
  Activity, Users, Clipboard, Calendar, Heart, Clock, Focus, Zap
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const changeAccent = (key: ThemeAccent) => {
    if (profile.accent === key) return;
    
    // Trigger transition animation
    setIsTransitioning(true);
    setTimeout(() => {
      updateProfile({ accent: key });
    }, 400); // Change mid-animation
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  const toggleGoal = (goalKey: string) => {
    setProfile(prev => {
      const currentGoals = prev.journeySettings.goals || [];
      const newGoals = currentGoals.includes(goalKey)
        ? currentGoals.filter(g => g !== goalKey)
        : [...currentGoals, goalKey];
      return { ...prev, journeySettings: { ...prev.journeySettings, goals: newGoals } };
    });
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

  const currentTheme = COLORS[profile.accent] || COLORS.pink;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 animate-in pb-20 relative">
      {/* Cylindrical Transition Overlay */}
      <div 
        className={`theme-transition-overlay ${isTransitioning ? 'theme-transition-active' : ''}`}
        style={{ color: currentTheme.primary }}
      />

      {/* Dynamic Navigation - More Visible Navigation */}
      <div className="w-full md:w-80 space-y-3">
        <TabBtn icon={<User size={20} />} label={t.settings.tabs.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} theme={currentTheme} />
        <TabBtn icon={<Target size={20} />} label={t.settings.tabs.journey} active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} theme={currentTheme} />
        <TabBtn icon={<Palette size={20} />} label={t.settings.tabs.custom} active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} theme={currentTheme} />
        <TabBtn icon={<Bell size={20} />} label={t.settings.tabs.notifications} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} theme={currentTheme} />
        <TabBtn icon={<Lock size={20} />} label={t.settings.tabs.privacy} active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} theme={currentTheme} />
      </div>

      {/* Main Content Area - Better Contrast & Shadow */}
      <div className="flex-1 bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border-2 border-slate-50 space-y-12 transition-all duration-700">
        
        {activeTab === 'profile' && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-4xl font-black text-gray-900 flex items-center gap-5">
              <div className="p-4 bg-slate-50 rounded-[1.5rem] shadow-sm" style={{ color: currentTheme.primary }}><User size={32} /></div>
              {t.settings.aboutYou}
            </h3>

            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-center gap-10 p-10 bg-slate-50/50 rounded-[3rem] border-2 border-slate-100 shadow-inner">
              <div className="relative group shrink-0">
                <div className="h-36 w-36 rounded-[3rem] bg-white shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white transition-transform group-hover:scale-105">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-slate-200" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-4 bg-white shadow-2xl rounded-2xl text-slate-500 hover:text-pink-500 transition-all border-2 border-slate-50"
                  title="Change Photo"
                >
                  <Camera size={24} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <h4 className="text-2xl font-black text-slate-800">{t.settings.identity}</h4>
                <p className="text-base text-slate-500 font-medium leading-relaxed max-w-sm italic">"{t.settings.identitySub}"</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] mt-3 hover:opacity-70 transition-opacity"
                  style={{ color: currentTheme.primary }}
                >
                  <Upload size={16} /> {t.settings.upload}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <Field label={t.settings.fields.name} value={profile.name} onChange={v => updateProfile({ name: v })} />
              <Field label={t.settings.fields.age} type="number" value={profile.age.toString()} onChange={v => updateProfile({ age: parseInt(v) || 0 })} />
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{t.settings.fields.delivery}</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-6 font-black text-slate-700 focus:ring-4 transition-all shadow-sm"
                  style={{ '--tw-ring-color': currentTheme.primary } as any}
                  value={profile.deliveryType}
                  onChange={e => updateProfile({ deliveryType: e.target.value as any })}
                >
                  <option value="normal">Natural Delivery</option>
                  <option value="c-section">C-Section Journey</option>
                </select>
              </div>
              <Field label={t.settings.fields.sos} value={profile.emergencyContact} onChange={v => updateProfile({ emergencyContact: v })} />
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-12 animate-in fade-in">
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-gray-900 flex items-center gap-5">
                <div className="p-4 bg-slate-50 rounded-[1.5rem]" style={{ color: currentTheme.primary }}><Target size={32} /></div>
                {t.settings.journey.title}
              </h3>
              <p className="text-base text-slate-500 font-medium italic leading-relaxed max-w-2xl">{t.settings.journey.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Refined Pace Control */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3">
                    <Activity size={18} /> {t.settings.journey.paceTitle}
                  </label>
                  <p className="text-[11px] text-slate-500 font-black italic">{t.settings.journey.paceSub}</p>
                </div>
                <div className="flex bg-slate-100 p-2 rounded-[2.5rem] border-2 border-slate-200 shadow-inner">
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'gentle' } })}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                    style={{ color: profile.journeySettings.pace === 'gentle' ? currentTheme.primary : '' }}
                   >Gentle</button>
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'moderate' } })}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                    style={{ color: profile.journeySettings.pace === 'moderate' ? currentTheme.primary : '' }}
                   >Moderate</button>
                </div>
              </div>

              {/* Refined Commitment Control */}
              <div className="space-y-6">
                 <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3">
                    <Clock size={18} /> {t.settings.journey.commitmentTitle}
                  </label>
                  <p className="text-[11px] text-slate-500 font-black italic">{t.settings.journey.commitmentSub}</p>
                </div>
                <div className="flex flex-col items-center gap-6 bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-inner">
                   <div className="w-full flex justify-between items-center mb-[-10px]">
                      <span className="text-[10px] font-black text-slate-300">5m</span>
                      <span className="text-[10px] font-black text-slate-300">30m</span>
                      <span className="text-[10px] font-black text-slate-300">60m</span>
                   </div>
                   <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="5"
                    className="w-full accent-pink-500 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: currentTheme.primary }}
                   />
                   <div className="flex items-center gap-3">
                      <span className="font-black text-4xl tracking-tighter" style={{ color: currentTheme.text }}>15</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Minutes Daily</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Focus Areas Checklist - Practical implementation */}
            <div className="space-y-8 pt-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3">
                    <Focus size={18} /> {t.settings.journey.focusTitle}
                  </label>
                  <p className="text-[11px] text-slate-500 font-black italic">{t.settings.journey.focusSub}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <CheckItem 
                    icon={<Activity size={20} />} 
                    label={t.settings.journey.goals.pelvic} 
                    active={profile.journeySettings.goals?.includes('pelvic')} 
                    onChange={() => toggleGoal('pelvic')} 
                    theme={currentTheme}
                  />
                  <CheckItem 
                    icon={<Target size={20} />} 
                    label={t.settings.journey.goals.core} 
                    active={profile.journeySettings.goals?.includes('core')} 
                    onChange={() => toggleGoal('core')} 
                    theme={currentTheme}
                  />
                  <CheckItem 
                    icon={<Activity size={20} />} 
                    label={t.settings.journey.goals.mobility} 
                    active={profile.journeySettings.goals?.includes('mobility')} 
                    onChange={() => toggleGoal('mobility')} 
                    theme={currentTheme}
                  />
                  <CheckItem 
                    icon={<Zap size={20} />} 
                    label={t.settings.journey.goals.energy} 
                    active={profile.journeySettings.goals?.includes('energy')} 
                    onChange={() => toggleGoal('energy')} 
                    theme={currentTheme}
                  />
                </div>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-4xl font-black text-gray-900 flex items-center gap-5">
              <div className="p-4 bg-slate-50 rounded-[1.5rem]" style={{ color: currentTheme.primary }}><Palette size={32} /></div>
              {t.settings.lookFeel}
            </h3>
            <div className="space-y-8">
              <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{t.settings.accent}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {(Object.keys(COLORS) as ThemeAccent[]).map(key => (
                  <button 
                    key={key}
                    onClick={() => changeAccent(key)}
                    disabled={isTransitioning}
                    className={`p-6 rounded-[3rem] border-4 flex flex-col items-center gap-4 transition-all ${profile.accent === key ? 'shadow-2xl scale-110' : 'bg-slate-50 hover:bg-slate-100 opacity-60'}`}
                    style={{ 
                      borderColor: profile.accent === key ? COLORS[key].primary : 'transparent', 
                      backgroundColor: profile.accent === key ? 'white' : '' 
                    }}
                  >
                    <div className="w-14 h-14 rounded-[1.5rem] shadow-xl border-4 border-white" style={{ backgroundColor: COLORS[key].primary }} />
                    <span className="font-black text-[10px] uppercase tracking-widest">{key}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-8 pt-4">
              <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{t.settings.language}</label>
              <div className="flex flex-wrap gap-6">
                 {['english', 'hindi'].map(langOption => (
                   <button 
                    key={langOption}
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: langOption as Language } })}
                    className={`px-12 py-6 rounded-[2rem] font-black text-base border-4 transition-all shadow-md ${profile.journeySettings.language === langOption ? 'text-white border-white scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                    style={{ backgroundColor: profile.journeySettings.language === langOption ? currentTheme.primary : '' }}
                   >{langOption === 'english' ? 'English (Global)' : 'हिन्दी (भारत)'}</button>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-4xl font-black text-gray-900 flex items-center gap-5">
              <div className="p-4 bg-slate-50 rounded-[1.5rem]" style={{ color: currentTheme.primary }}><Bell size={32} /></div>
              {t.settings.notifications.title}
            </h3>
            <p className="text-base text-slate-500 font-medium italic -mt-8 leading-relaxed max-w-xl">"{t.settings.notifications.subtitle}"</p>
            
            <div className="space-y-6">
               <ToggleRow 
                label={t.settings.notifications.exercise} 
                active={profile.notifications.exerciseReminders} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, exerciseReminders: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.hydration} 
                active={profile.notifications.hydrationAlerts} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, hydrationAlerts: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.mood} 
                active={profile.notifications.moodCheckins} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, moodCheckins: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.care} 
                active={profile.notifications.careConnectUpdates} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, careConnectUpdates: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.sos} 
                active={profile.notifications.sosConfirmations} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, sosConfirmations: v} })} 
                theme={currentTheme}
               />
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-12 animate-in fade-in">
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-gray-900 flex items-center gap-5">
                <div className="p-4 bg-slate-50 rounded-[1.5rem]" style={{ color: currentTheme.primary }}><Lock size={32} /></div>
                {t.settings.privacy.title}
              </h3>
              <p className="text-base text-slate-500 font-medium italic leading-relaxed max-w-xl">"{t.settings.privacy.subtitle}"</p>
            </div>

            <div className="bg-slate-50 p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-inner space-y-10">
               <div className="space-y-2">
                 <h4 className="text-2xl font-black text-slate-800">{t.settings.privacy.caregiverTitle}</h4>
                 <p className="text-sm text-slate-500 font-black italic">{t.settings.privacy.caregiverSub}</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <Field label={t.settings.privacy.name} value={profile.caregiver.name} onChange={v => updateProfile({ caregiver: {...profile.caregiver, name: v} })} />
                 <Field label={t.settings.privacy.relation} value={profile.caregiver.relationship} onChange={v => updateProfile({ caregiver: {...profile.caregiver, relationship: v} })} />
                 <Field label={t.settings.privacy.phone} value={profile.caregiver.contact} onChange={v => updateProfile({ caregiver: {...profile.caregiver, contact: v} })} />
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-2">
                 <h4 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                   {t.settings.privacy.sharingTitle}
                   <Shield className="text-emerald-500" size={28} />
                 </h4>
                 <p className="text-sm text-slate-500 font-black italic">{t.settings.privacy.sharingSub}</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <CheckItem 
                  icon={<Heart size={20} />} 
                  label={t.settings.privacy.canMood} 
                  active={profile.caregiver.permissions.canViewMood} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewMood: v}} })} 
                  theme={currentTheme}
                 />
                 <CheckItem 
                  icon={<Activity size={20} />} 
                  label={t.settings.privacy.canPhys} 
                  active={profile.caregiver.permissions.canViewPhysical} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewPhysical: v}} })} 
                  theme={currentTheme}
                 />
                 <CheckItem 
                  icon={<Clipboard size={20} />} 
                  label={t.settings.privacy.canMed} 
                  active={profile.caregiver.permissions.canViewMedicalHistory} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewMedicalHistory: v}} })} 
                  theme={currentTheme}
                 />
                 <CheckItem 
                  icon={<Calendar size={20} />} 
                  label={t.settings.privacy.canAppt} 
                  active={profile.caregiver.permissions.canViewAppointments} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewAppointments: v}} })} 
                  theme={currentTheme}
                 />
               </div>
            </div>
          </div>
        )}
        
        <div className="pt-12 border-t-2 border-slate-100 flex justify-end">
           <button 
            className="px-14 py-6 text-white rounded-full font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
            style={{ backgroundColor: currentTheme.primary, boxShadow: `0 30px 60px -15px ${currentTheme.primary}77` }}
            onClick={() => alert(t.common.apply)}
           >
             <Save size={24} className="group-hover:rotate-12 transition-transform" /> {t.settings.apply}
           </button>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick, theme }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-10 py-6 rounded-[2.5rem] font-black text-base transition-all border-2 group ${
      active ? 'bg-white shadow-2xl scale-105 border-slate-50' : 'text-slate-400 hover:bg-white/60 border-transparent hover:border-slate-50'
    }`}
    style={{ color: active ? theme.text : '' }}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-slate-50 text-slate-800' : 'text-slate-300'}`} style={{ color: active ? theme.primary : '' }}>
       {icon}
    </div>
    <span className="tracking-tight">{label}</span>
  </button>
);

const Field = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-4">
    <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-6 font-black text-slate-700 focus:ring-4 transition-all shadow-sm focus:bg-white"
    />
  </div>
);

const ToggleRow = ({ label, active, onChange, theme }: any) => (
  <div className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:shadow-xl border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group">
    <span className="font-black text-slate-800 text-lg group-hover:translate-x-1 transition-transform">{label}</span>
    <button 
      onClick={() => onChange(!active)}
      className={`w-16 h-10 rounded-full relative transition-all duration-300 shadow-inner ${active ? '' : 'bg-slate-300'}`}
      style={{ backgroundColor: active ? theme.primary : '' }}
    >
      <div className={`absolute top-1.5 w-7 h-7 bg-white rounded-full shadow-2xl transition-all duration-300 ${active ? 'left-8' : 'left-1.5'}`} />
    </button>
  </div>
);

const CheckItem = ({ icon, label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className={`flex items-center gap-6 p-8 rounded-[2.5rem] text-left border-4 transition-all group ${
      active ? 'bg-white shadow-2xl scale-[1.03] z-10' : 'bg-slate-50/50 border-transparent text-slate-400 opacity-60 hover:opacity-100 hover:bg-white'
    }`}
    style={{ borderColor: active ? theme.primary : 'transparent' }}
  >
    <div 
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${active ? 'text-white' : 'bg-white text-slate-300'}`}
      style={{ backgroundColor: active ? theme.primary : '' }}
    >
      {active ? <Check size={28} strokeWidth={4} /> : icon}
    </div>
    <span className={`font-black text-lg leading-tight ${active ? 'text-gray-900' : ''}`}>{label}</span>
  </button>
);

export default Settings;
