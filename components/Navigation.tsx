
import React from 'react';
import { 
  Home, Activity, Heart, Users, BookOpen, 
  Settings, LogOut, UserCheck, Star, X, ShoppingBag,
  LayoutDashboard, BarChart3, UserCog, ShieldCheck
} from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { COLORS, SLOGAN } from '../constants';
import { translations } from '../translations';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  profile: UserProfile;
  logout: () => void;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, profile, logout, onClose }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  
  const isExpert = profile.role === 'expert' && profile.verification?.status === 'verified';

  const navItems = isExpert ? [
    { id: 'expert-dashboard', label: 'Clinical Dashboard', icon: LayoutDashboard, private: true },
    { id: 'expert-analytics', label: 'Patient Analytics', icon: BarChart3, private: true },
    { id: 'expert-settings', label: 'Portal Settings', icon: UserCog, private: true },
  ] : [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home, private: true },
    { id: 'physical', label: t.nav.physical, icon: Activity, private: true },
    { id: 'mental', label: t.nav.mental, icon: Heart, private: true },
    { id: 'care-connect', label: t.nav.care, icon: Users, private: true },
    { id: 'momkart', label: t.nav.momkart, icon: ShoppingBag, private: true },
    { id: 'education', label: t.nav.education, icon: BookOpen, private: false },
    { id: 'profile', label: t.nav.settings, icon: Settings, private: true },
    { id: 'membership', label: t.nav.membership, icon: Star, private: true },
  ];

  if (profile.role === 'caregiver' && !isExpert) {
    navItems.unshift({ id: 'caregiver', label: t.nav.caregiver, icon: UserCheck, private: true });
  }

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col shadow-sm relative z-50 overflow-hidden">
      <div className="p-8 flex items-center justify-between">
        <div className="group cursor-pointer">
          <h1 className="text-2xl font-black text-slate-900 group-hover:scale-105 transition-transform">
            AfterMa
          </h1>
          <p className="text-[10px] mt-1 tracking-widest font-black text-slate-400 uppercase opacity-80">
            {SLOGAN}
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 -mr-4 text-gray-400 hover:text-gray-600 hover:bg-slate-50 rounded-xl"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          if (item.private && !profile.authenticated) return null;
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id as AppView);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              style={{ 
                backgroundColor: isActive ? theme.primary : '', 
                color: isActive ? 'white' : ''
              }}
            >
              <Icon size={18} className={isActive ? '' : 'text-slate-400'} />
              <span className={`font-bold text-sm tracking-tight`}>{item.label}</span>
              {item.id === 'membership' && profile.membershipPlan === 'plus' && <Star size={12} fill="currentColor" className="ml-auto text-amber-300" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        {profile.authenticated && (
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} />
            <span>{t.common.signOut}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
