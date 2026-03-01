
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppView, UserProfile, HealthLog, RecoveryActivity, RecoveryPhase, Appointment, CommunityCircle, PeriodLog, MaternityStage, UserRole, ChatMessage, ExerciseLog } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CareJourney from './components/CareJourney';
import MentalWellness from './components/MentalWellness';
import Education from './components/Education';
import Membership from './components/Membership';
import Settings from './components/Settings';
import SOSOverlay from './components/SOSOverlay';
import NotificationPanel from './components/NotificationPanel';
import CareConnect from './components/CareConnect';
import MomKart from './components/Store';
import HealthLogModal from './components/HealthLogModal';
import CaregiverView from './components/CaregiverView';
import ExpertDashboard from './components/ExpertDashboard';
import ExpertAnalytics from './components/ExpertAnalytics';
import ExpertSettings from './components/ExpertSettings';
import Journal from './components/Journal';
import SurveyCommunityData from './components/SurveyCommunityData';
import SafeRecipes from './components/SafeRecipes';
import { Search, Bell, Menu, ShieldCheck } from 'lucide-react';
import { RECOVERY_DATABASE, COLORS } from './constants';
import { translations } from './translations';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('afterma_profile_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse profile from localStorage", e);
    }
    return {
      name: "Guest",
      age: 28,
      deliveryDate: new Date().toISOString(),
      deliveryType: 'normal',
      maternityStage: 'Postpartum',
      authenticated: false,
      role: 'mother',
      accent: 'PINK',
      incognito: false,
      medicalHistory: "",
      emergencyContact: "",
      membershipPlan: 'free',
      currentPhase: 'Month 1',
      completedActivities: [],
      streakCount: 0,
      streakProtectionActive: false,
      lastLoginDate: new Date().toISOString().split('T')[0],
      badges: [],
      caregiver: {
        name: "", relationship: "", contact: "",
        permissions: { canViewMood: true, canViewPhysical: true, canViewMedicalHistory: false, canViewAppointments: true }
      },
      journeySettings: {
        pace: 'gentle',
        preferredTime: 'morning',
        goals: ['improve strength', 'stabilize mood'],
        isPaused: false,
        language: 'english'
      },
      notifications: {
        exerciseReminders: true,
        hydrationAlerts: true,
        moodCheckins: true,
        careConnectUpdates: true,
        sosConfirmations: true
      },
      periodLogs: []
    };
  });

  const [currentView, setView] = useState<AppView>(() => {
    if (profile.authenticated && profile.role === 'expert' && profile.verification?.status === 'verified') {
      return 'expert-dashboard';
    }
    return 'education';
  });

  const [showSOS, setShowSOS] = useState(false);
  const [sosConfirming, setSosConfirming] = useState(false);
  const [showAadhaarVerify, setShowAadhaarVerify] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastClickRef = useRef<number>(0);
  const sosTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [circles, setCircles] = useState<CommunityCircle[]>([
    { id: '1', name: 'New Moms Bonding', members: 124, description: 'Sharing the joys and struggles of the first few months.', isJoined: false },
    { id: '2', name: 'Sleep Solutions', members: 89, description: 'Tips and support for the sleepless nights.', isJoined: false },
    { id: '3', name: 'Emotional Overwhelm', members: 56, description: 'A safe space to talk about the harder days.', isJoined: false },
  ]);

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [triageMessages, setTriageMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('afterma_profile_v4', JSON.stringify(profile));
    document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
  }, [profile, lang]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isExpert = profile.authenticated && profile.role === 'expert' && profile.verification?.status === 'verified';

  const addNotification = (title: string, text: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), title, text, time: 'Just now' }, ...prev]);
  };

  const handleLogin = (role: UserRole = 'mother') => {
    setProfile(prev => ({ 
      ...prev, 
      name: role === 'expert' ? "Dr. Ananya Iyer" : "Aditi Sharma", 
      authenticated: true, 
      role: role,
      verification: role === 'expert' ? { status: 'verified', roleRequested: 'expert' } : prev.verification,
      lastLoginDate: new Date().toISOString().split('T')[0] 
    }));
    
    if (role === 'expert') {
      setView('expert-dashboard');
    } else {
      setView('dashboard');
    }
    
    addNotification(`${t.common.welcome} ${role === 'expert' ? "Dr. Ananya" : "Aditi"}`, `Welcome back to your care journey.`);
  };

  const logout = () => {
    setProfile(prev => ({ ...prev, authenticated: false }));
    setView('education');
  };

  const toggleActivity = (activityId: string) => {
    if (profile.journeySettings.isPaused) return;
    setProfile(prev => {
      const isCompleted = prev.completedActivities.includes(activityId);
      const newCompleted = isCompleted 
        ? prev.completedActivities.filter(id => id !== activityId)
        : [...prev.completedActivities, activityId];
      
      if (!isCompleted) {
        addNotification("Activity Logged", "Your progress has been recorded securely.");
      }
      return { ...prev, completedActivities: newCompleted };
    });
  };

  const triggerSOS = () => {
    setShowSOS(true);
    setSosConfirming(false);
    if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
  };

  const handleSOSClick = () => {
    if (!sosConfirming) {
      setSosConfirming(true);
      sosTimerRef.current = setTimeout(() => {
        setSosConfirming(false);
      }, 2000);
    } else {
      triggerSOS();
    }
  };

  useEffect(() => {
    return () => {
      if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
    };
  }, []);

  const handleSaveLog = (newLog: HealthLog) => {
    setLogs(prev => [...prev, newLog]);
    setShowLogModal(false);
    addNotification("Health Logged", "Your daily metrics have been securely recorded.");
    
    // Streak logic
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      setProfile(prev => ({
        ...prev,
        streakCount: prev.streakCount + 1,
        lastLoginDate: today
      }));
    }
  };

  const filteredActivities = useMemo(() => {
    return RECOVERY_DATABASE
      .filter(a => {
        // Filter by phase strictly based on maternity stage
        if (profile.maternityStage === 'Postpartum') {
          return a.phase.startsWith('Month');
        } else if (profile.maternityStage === 'Pregnant-T1') {
          return a.phase === 'Trimester 1';
        } else if (profile.maternityStage === 'Pregnant-T2') {
          return a.phase === 'Trimester 2';
        } else if (profile.maternityStage === 'Pregnant-T3') {
          return a.phase === 'Trimester 3';
        } else if (profile.maternityStage === 'TTC') {
          return a.phase === 'Pre-conception';
        }
        return true;
      })
      .filter(a => !a.typeSpecific || a.typeSpecific === profile.deliveryType || profile.maternityStage !== 'Postpartum')
      .filter(a => {
        if (profile.journeySettings.pace === 'gentle') {
          return a.intensityScale <= 5 || a.category === 'Emotional Stabilization';
        }
        return true;
      });
  }, [profile.deliveryType, profile.journeySettings.pace, profile.maternityStage]);

  return (
    <div className={`min-h-screen flex transition-colors duration-500 font-sans`} style={{ backgroundColor: theme.bg }}>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 w-64 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-[60] lg:z-50 h-screen`}>
        <Navigation currentView={currentView} setView={setView} profile={profile} logout={logout} onClose={() => setIsMobileMenuOpen(false)} />
      </div>
      
      <main className="flex-1 lg:ml-64 min-h-screen relative flex flex-col">
        <header className="h-16 lg:h-20 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between border-b border-slate-100 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-2xl">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
            {isExpert ? (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Clinical Portal</span>
              </div>
            ) : (
              <div className="relative w-full hidden sm:block">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Search className={`${profile.incognito ? 'text-purple-500' : 'text-gray-400'}`} size={16} />
                </div>
                <input type="text" placeholder={profile.incognito ? "GHOST Mode Active..." : t.common.searchPlaceholder} className={`w-full border rounded-full py-2 pl-10 pr-20 focus:outline-none focus:ring-2 transition-all text-sm ${profile.incognito ? 'bg-purple-50/50 border-purple-200 focus:ring-purple-100' : 'bg-white border-slate-200 focus:ring-pink-100 shadow-sm'}`} />
                <button onClick={() => setProfile(p => ({...p, incognito: !p.incognito}))} className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase px-2 py-1 rounded-full transition-all ${profile.incognito ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>GHOST</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-5 ml-4">
            <div className="relative group">
              <button 
                onClick={handleSOSClick} 
                className={`px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg ${sosConfirming ? 'bg-amber-400 text-black animate-pulse' : 'bg-[#F5C518] text-black shadow-amber-100'}`}
              >
                {sosConfirming ? 'Tap again to confirm SOS' : t.common.sos}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                Your safety matters. Double tap to activate.
              </div>
            </div>
            {profile.authenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors">
                  <Bell size={20} />
                  {notifications.length > 0 && <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white`} style={{ backgroundColor: theme.primary }}></span>}
                </button>
                <button onClick={() => setView('profile')} style={{ backgroundColor: theme.primary }} className="h-8 w-8 lg:h-9 lg:w-9 rounded-full text-white flex items-center justify-center font-bold text-xs lg:text-sm shadow-md border border-white hover:scale-105 transition-transform overflow-hidden">
                  {profile.profilePicture ? <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : profile.name[0]}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 lg:gap-3">
                <button 
                  onClick={() => handleLogin('expert')} 
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-md hover:opacity-90 transition-all active:scale-95"
                >
                  <ShieldCheck size={14} />
                  Expert Login
                </button>
                <button 
                  onClick={() => handleLogin('mother')} 
                  style={{ backgroundColor: theme.primary }} 
                  className="text-white px-5 py-2 rounded-full font-bold text-xs shadow-md hover:opacity-90 transition-all active:scale-95"
                >
                  {t.common.signIn}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
            {/* Expert Views */}
            {isExpert && currentView === 'expert-dashboard' && <ExpertDashboard profile={profile} />}
            {isExpert && currentView === 'expert-analytics' && <ExpertAnalytics profile={profile} />}
            {isExpert && currentView === 'expert-settings' && <ExpertSettings profile={profile} logout={logout} />}

            {/* Mother Views - Restricted for Experts */}
            {!isExpert && (
              <>
                {currentView === 'dashboard' && profile.authenticated && <Dashboard profile={profile} logs={logs} onAddLog={() => setShowLogModal(true)} setView={setView} />}
                {currentView === 'physical' && profile.authenticated && <CareJourney profile={profile} setProfile={setProfile} onToggleActivity={toggleActivity} activities={filteredActivities} exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs} logs={logs} onAddLog={() => setShowLogModal(true)} />}
                {currentView === 'mental' && profile.authenticated && <MentalWellness profile={profile} messages={triageMessages} setMessages={setTriageMessages} onOpenJournal={() => setShowJournal(true)} />}
                {currentView === 'education' && <Education profile={profile} />}
                {currentView === 'momkart' && profile.authenticated && <MomKart profile={profile} />}
                {currentView === 'membership' && <Membership profile={profile} setProfile={setProfile} />}
                {currentView === 'profile' && profile.authenticated && <Settings profile={profile} setProfile={setProfile} />}
                {currentView === 'care-connect' && profile.authenticated && <CareConnect profile={profile} setProfile={setProfile} appointments={appointments} setAppointments={setAppointments} circles={circles} setCircles={setCircles} addNotification={addNotification} />}
                {currentView === 'caregiver' && profile.authenticated && <CaregiverView profile={profile} logs={logs} />}
                {currentView === 'community-wisdom' && <SurveyCommunityData profile={profile} />}
                {currentView === 'recipes' && <SafeRecipes profile={profile} />}
              </>
            )}
          </div>
        </div>

        {showNotifications && <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} onClear={() => setNotifications([])} />}
      </main>
      {showSOS && <SOSOverlay profile={profile} onClose={() => setShowSOS(false)} />}
      {showLogModal && <HealthLogModal profile={profile} onClose={() => setShowLogModal(false)} onSave={handleSaveLog} />}
      {showJournal && <Journal profile={profile} onClose={() => setShowJournal(false)} />}
    </div>
  );
};

export default App;
