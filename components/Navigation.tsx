
import React, { useState } from 'react';
import { 
  Home, Activity, Heart, Users, BookOpen, 
  Settings, LogOut, UserCheck, Star, X, ShoppingBag,
  LayoutDashboard, BarChart3, UserCog, ShieldCheck, Utensils,
  ChevronRight, ChevronLeft
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
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    { id: 'recipes', label: 'Safe Recipes', icon: Utensils, private: false },
    { id: 'education', label: t.nav.education, icon: BookOpen, private: false },
    { id: 'profile', label: t.nav.settings, icon: Settings, private: true },
    { id: 'membership', label: t.nav.membership, icon: Star, private: true },
  ];

  if (profile.role === 'caregiver' && !isExpert) {
    navItems.unshift({ id: 'caregiver', label: t.nav.caregiver, icon: UserCheck, private: true });
  }

  return (
    <div 
      className={`bg-white h-screen border-r border-gray-100 flex flex-col shadow-sm relative z-50 overflow-hidden transition-all duration-500 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-8 flex items-center justify-between">
        {!isCollapsed && (
          <div className="group cursor-pointer animate-in fade-in duration-500">
            <h1 className="text-2xl font-black text-slate-900 group-hover:scale-105 transition-transform">
              AfterMa
            </h1>
            <p className="text-[10px] mt-1 tracking-widest font-black text-slate-400 uppercase opacity-80">
              {SLOGAN}
            </p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              } ${isCollapsed ? 'justify-center' : ''}`}
              style={{ 
                backgroundColor: isActive ? theme.primary : '', 
                color: isActive ? 'white' : ''
              }}
            >
              <Icon size={18} className={isActive ? '' : 'text-slate-400 group-hover:text-slate-900'} />
              {!isCollapsed && (
                <span className="font-bold text-sm tracking-tight animate-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </div>
              )}
              {!isCollapsed && item.id === 'membership' && profile.membershipPlan === 'plus' && <Star size={12} fill="currentColor" className="ml-auto text-amber-300" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        {profile.authenticated && (
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>{t.common.signOut}</span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
