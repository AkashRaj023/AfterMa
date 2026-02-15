import React, { useState } from 'react';
import { UserProfile, Appointment, CommunityCircle } from '../types';
import { 
  Users, Calendar, Heart, Stethoscope, Phone, ShieldCheck, Landmark, Globe, Star, Info, ChevronRight, MessageCircle, X, RotateCcw, ExternalLink, Zap, Shield, TrendingUp, Clock, CheckCircle2, Lock
} from 'lucide-react';
import { COLORS, HELPLINES, NGO_DATA, EXPERT_DATA } from '../constants';
import { translations } from '../translations';

interface CareConnectProps {
  profile: UserProfile;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  circles: CommunityCircle[];
  setCircles: React.Dispatch<React.SetStateAction<CommunityCircle[]>>;
  addNotification: (title: string, text: string) => void;
}

const INSURANCE_PLANS = [
  { bank: 'SBI', logo: 'S', plan: 'Janani Raksha Health Cover', range: '₹5L - ₹10L', highlights: ['Full Hospitalization', 'Mental Health Support', 'In-Home Nursing'], approval: '88%', processing: '5 Days', count: '12k+', eligibility: 'Moms 18+', theme: 'BLUE' },
  { bank: 'HDFC Bank', logo: 'H', plan: 'Maternity Extension Plan', range: '₹3L - ₹15L', highlights: ['Cashless Recovery Assist', 'Expert Consultations', 'Medication Coverage'], approval: '92%', processing: '3 Days', count: '18k+', eligibility: 'Moms 21+', theme: 'BLUE' },
  { bank: 'ICICI Bank', logo: 'I', plan: 'New Mother Essential', range: '₹2L - ₹8L', highlights: ['Postpartum Physio Inclusion', 'Safe Shield Protection', 'Lactation Specialist Access'], approval: '78%', processing: '4 Days', count: '8k+', eligibility: 'Moms 18+', theme: 'YELLOW' },
  { bank: 'Axis Bank', logo: 'A', plan: 'AfterMa Wellness Plan', range: '₹5L - ₹20L', highlights: ['Priority Triage Assist', 'Holistic Wellness Rider', 'Emergency Red Flag Cover'], approval: '85%', processing: '6 Days', count: '10k+', eligibility: 'Moms 25+', theme: 'PURPLE' },
];

const CareConnect: React.FC<CareConnectProps> = ({ 
  profile, appointments, setAppointments, circles, setCircles, addNotification 
}) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'Community' | 'Experts' | 'NGOs' | 'Insurance' | 'MyBookings'>('Community');
  const [expertFilter, setExpertFilter] = useState<'Physiotherapy' | 'OB-GYN' | 'Lactation'>('Physiotherapy');
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const handleRSVP = (id: string) => {
    setCircles(prev => prev.map(c => {
      if (c.id === id) {
        if (!c.isJoined) addNotification("Circle Joined", `Welcome to the ${c.name} sisterhood.`);
        return { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 };
      }
      return c;
    }));
  };

  const handleBook = (name: string, type: Appointment['type'], price: string) => {
    const newAppt: Appointment = {
      id: Date.now().toString(),
      specialistName: name,
      type,
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '11:30 AM',
      status: 'Upcoming',
      price
    };
    setAppointments(prev => [...prev, newAppt]);
    addNotification("Session Scheduled", `Confirmed appointment with ${name}. Details in My Sessions.`);
    setActiveSubTab('MyBookings');
  };

  const cancelAppointment = (id: string) => {
    const confirm = window.confirm("Are you sure you want to cancel this healing session?");
    if (confirm) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
      addNotification("Session Cancelled", "Your appointment has been removed from the active schedule.");
    }
  };

  const rescheduleAppointment = (id: string) => {
    const newDate = prompt("Enter new preferred date (YYYY-MM-DD):", "2024-05-15");
    if (newDate) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, status: 'Rescheduled' } : a));
      addNotification("Session Rescheduled", `Your session has been moved to ${newDate}.`);
    }
  };

  const filteredExperts = EXPERT_DATA.filter(e => e.category === expertFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 animate-in pb-32">
      {/* Anchored Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-white p-12 lg:p-16 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.01)] relative overflow-hidden group">
        <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-emerald-100/50">Verified Clinical Support</div>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">{t.care.title}</h2>
          <p className="text-base lg:text-xl text-slate-400 font-medium italic opacity-85 leading-relaxed">"{t.care.subtitle}"</p>
        </div>
        <a 
          href={`tel:${HELPLINES.india.number}`} 
          className="flex items-center gap-4 px-10 py-5 text-white rounded-full font-bold text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 group/sos overflow-hidden relative shrink-0"
          style={{ background: `linear-gradient(135deg, #F43F5E, #BE123C)` }}
        >
          <Phone size={20} className="group-hover/sos:rotate-12 transition-transform" /> {t.care.helpline}
        </a>
        <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.02] pointer-events-none scale-[1.5] group-hover:scale-[1.7] transition-all duration-1000">
           <Heart size={350} />
        </div>
      </div>

      {/* Centered Structured Tabs Container */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1.5 bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-slate-100 sticky top-[64px] lg:top-[80px] z-30">
          <NavButton label={t.care.tabs.community} active={activeSubTab === 'Community'} onClick={() => setActiveSubTab('Community')} theme={theme} icon={<Users size={16} />} />
          <NavButton label={t.care.tabs.experts} active={activeSubTab === 'Experts'} onClick={() => setActiveSubTab('Experts')} theme={theme} icon={<Stethoscope size={16} />} />
          <NavButton label={t.care.tabs.ngo} active={activeSubTab === 'NGOs'} onClick={() => setActiveSubTab('NGOs')} theme={theme} icon={<Heart size={16} />} />
          <NavButton label={t.care.tabs.insurance} active={activeSubTab === 'Insurance'} onClick={() => setActiveSubTab('Insurance')} theme={theme} icon={<ShieldCheck size={16} />} />
          <NavButton label={t.care.tabs.sessions} active={activeSubTab === 'MyBookings'} onClick={() => setActiveSubTab('MyBookings')} theme={theme} icon={<Calendar size={16} />} />
        </div>
      </div>

      <div className="space-y-12">
        {activeSubTab === 'Community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {circles.map(c => (
              <div key={c.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col justify-between hover:translate-y-[-6px]">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner" style={{ color: theme.primary }}>
                      <Users size={24} />
                    </div>
                    <span className="text-[8px] font-bold uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100/40">Sisterhood active</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{c.name}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic opacity-80 line-clamp-3">"{c.description}"</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl w-fit">
                    <Star size={14} className="text-amber-400 fill-amber-400" /> {c.members} {t.care.community.sistersJoined}
                  </div>
                </div>
                <button 
                  onClick={() => handleRSVP(c.id)}
                  className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all mt-8 ${c.isJoined ? 'bg-slate-100 text-slate-400' : 'text-white'}`}
                  style={{ backgroundColor: c.isJoined ? '' : theme.primary }}
                >
                  {c.isJoined ? 'In Circle' : t.care.community.joinSisters}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'Experts' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-fit">
                {['Physiotherapy', 'OB-GYN', 'Lactation'].map((cat) => (
                   <button 
                    key={cat}
                    onClick={() => setExpertFilter(cat as any)}
                    className={`px-8 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${expertFilter === cat ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {cat}
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {filteredExperts.map(expert => (
                 <div key={expert.name} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-500 group relative overflow-hidden shadow-sm hover:translate-y-[-6px]">
                   <div className="space-y-10">
                     <div className="flex items-center gap-8">
                       <div 
                        className="w-20 h-20 rounded-[1.75rem] bg-slate-50 flex items-center justify-center font-bold text-3xl shadow-inner border border-slate-100"
                        style={{ color: theme.primary, backgroundColor: theme.bg }}
                       >
                         {expert.name[0]}
                       </div>
                       <div className="flex-1">
                         <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{expert.name}</h3>
                         <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: theme.primary }}>{expert.role}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase mt-3 tracking-widest bg-slate-50 px-3 py-1 rounded-md w-fit border border-slate-100">{expert.credentials}</p>
                       </div>
                     </div>
                     <div className="p-6 bg-slate-50/40 rounded-2xl border border-slate-100 flex gap-5 shadow-inner relative">
                       <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-300 shrink-0"><Info size={20} /></div>
                       <p className="text-sm font-bold text-slate-600 leading-relaxed italic opacity-85">"{expert.insight}"</p>
                     </div>
                   </div>
                   <div className="flex justify-between items-center pt-10 mt-10 border-t border-slate-50">
                      <div className="space-y-0.5">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">{expert.price}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-widest opacity-60">Session Fee</span>
                      </div>
                      <div className="flex gap-3">
                        <button className="p-4 bg-slate-50 text-slate-300 hover:text-slate-900 rounded-2xl transition-all active:scale-90 border border-slate-100"><MessageCircle size={22} /></button>
                        <button 
                          onClick={() => handleBook(expert.name, expert.role, expert.price)}
                          className="px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 text-white"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {t.care.experts.book}
                        </button>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeSubTab === 'NGOs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
             {NGO_DATA.map(ngo => (
               <div key={ngo.name} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group hover:translate-y-[-6px] h-full">
                  <div className="space-y-8">
                     <div className="p-5 bg-pink-50/50 text-pink-500 rounded-[1.75rem] w-fit border border-pink-100 shadow-inner"><Heart size={28} strokeWidth={2.5} /></div>
                     <div className="space-y-3">
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{ngo.name}</h4>
                        <div className="inline-block px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                           <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{ngo.area}</span>
                        </div>
                     </div>
                  </div>
                  <div className="pt-10 mt-10 border-t border-slate-50 space-y-6">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Verified Direct Line</span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-md text-xs border border-emerald-100/30">{ngo.contact}</span>
                     </div>
                     <button className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-3">
                        Access Support <ExternalLink size={14} />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeSubTab === 'Insurance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
             {INSURANCE_PLANS.map((plan, idx) => {
               const pTheme = (COLORS as any)[plan.theme] || theme;
               return (
                 <div key={plan.bank} className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group relative overflow-hidden h-full">
                    <div className="flex items-start justify-between gap-6 mb-10">
                       <div 
                         className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-2xl border border-slate-100 shadow-inner"
                         style={{ color: pTheme.primary, backgroundColor: pTheme.bg }}
                       >
                         {plan.logo}
                       </div>
                       <div className="flex-1 space-y-1.5">
                          <h4 className="text-xl font-bold text-slate-900 tracking-tight">{plan.bank}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.plan}</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[8px] font-bold uppercase tracking-widest">{plan.eligibility}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-10">
                       <MetricBox icon={<TrendingUp size={14} className="text-emerald-500" />} val={plan.approval} label="Approval" />
                       <MetricBox icon={<Clock size={14} className="text-blue-500" />} val={plan.processing} label="Processing" />
                       <MetricBox icon={<Users size={14} className="text-purple-500" />} val={plan.count} label="Clients" />
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                       <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">Coverage Analytics ({plan.range})</p>
                       <div className="grid grid-cols-1 gap-2.5">
                          {plan.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                               <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                               <span className="text-[13px] font-bold text-slate-600 italic opacity-90">{h}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <button className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3">
                       Evaluate Eligibility <ShieldCheck size={18} />
                    </button>
                 </div>
               );
             })}
          </div>
        )}

        {activeSubTab === 'MyBookings' && (
          <div className="animate-in fade-in duration-500">
            {appointments.length === 0 ? (
              <div className="bg-slate-50 p-20 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6">
                 <div className="p-10 bg-white rounded-full shadow-sm text-slate-100"><Calendar size={64} /></div>
                 <div className="space-y-1">
                    <p className="text-slate-900 font-bold text-2xl tracking-tight">Your calendar is clear</p>
                    <p className="text-sm text-slate-400 font-medium italic">Ready to schedule your next clinical support session?</p>
                 </div>
                 <button onClick={() => setActiveSubTab('Experts')} className="px-10 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all active:scale-95">Explore Specialists</button>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments.map(a => (
                  <div key={a.id} className="p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-8 flex-1 w-full">
                       <div 
                        className="p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 shadow-inner"
                        style={{ color: theme.primary, backgroundColor: theme.bg }}
                       ><Stethoscope size={32} /></div>
                       <div className="space-y-1.5 flex-1">
                         <h4 className="font-bold text-slate-900 text-2xl tracking-tight leading-none">{a.specialistName}</h4>
                         <div className="flex items-center gap-4">
                           <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{a.type}</span>
                           <span className={`px-4 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
                             a.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                           }`}>{a.status}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-5 shrink-0 w-full md:w-auto">
                       <div className="space-y-1 md:text-right">
                         <span className="block text-3xl font-bold text-slate-900 tracking-tight leading-none">{a.date}</span>
                         <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-md border border-slate-100">{a.time}</span>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => rescheduleAppointment(a.id)} className="p-3.5 bg-slate-50 text-slate-300 hover:text-slate-600 rounded-xl transition-all border border-slate-100"><RotateCcw size={18} /></button>
                          <button onClick={() => cancelAppointment(a.id)} className="p-3.5 bg-slate-50 text-slate-300 hover:text-red-500 rounded-xl transition-all border border-slate-100"><X size={18} /></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MetricBox = ({ icon, val, label }: any) => (
  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-1 shadow-inner">
     <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-50 mb-0.5">{icon}</div>
     <span className="text-xs font-bold text-slate-800 tracking-tight">{val}</span>
     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const NavButton = ({ label, active, onClick, theme, icon }: any) => (
  <button 
    onClick={onClick}
    className={`shrink-0 flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-[10px] transition-all border active:scale-[0.97] uppercase ${
      active ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900'
    }`}
  >
    <div className={`transition-all duration-300 ${active ? 'text-white' : ''}`} style={{ color: active ? 'white' : theme.primary }}>
      {icon}
    </div>
    <span className="tracking-tight relative z-10">{label}</span>
  </button>
);

export default CareConnect;