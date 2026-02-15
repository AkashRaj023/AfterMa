
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
      {/* Apple Satin Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-white/70 backdrop-blur-3xl p-12 lg:p-16 rounded-[3.5rem] border border-white/60 shadow-[0_20px_80px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all group hover:shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
        <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm border border-white/50">Verified Clinical Support</div>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-none">{t.care.title}</h2>
          <p className="text-base lg:text-xl text-slate-400 font-medium italic opacity-80 leading-relaxed max-w-lg">"{t.care.subtitle}"</p>
        </div>
        <a 
          href={`tel:${HELPLINES.india.number}`} 
          className="flex items-center gap-4 px-12 py-6 text-white rounded-[2.5rem] font-bold text-base uppercase tracking-widest shadow-2xl transition-all active:scale-95 group/sos overflow-hidden relative shrink-0"
          style={{ background: `linear-gradient(135deg, #F43F5E, #BE123C)` }}
        >
          <Phone size={24} className="group-hover/sos:rotate-12 transition-transform" /> {t.care.helpline}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/sos:translate-y-0 transition-transform duration-500" />
        </a>
        <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.03] pointer-events-none scale-[1.5] group-hover:scale-[1.7] group-hover:rotate-12 transition-all duration-1000">
           <Heart size={350} />
        </div>
      </div>

      {/* Standardized Tab Switcher */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 sticky top-[64px] lg:top-[80px] z-30 bg-white/50 backdrop-blur-2xl rounded-[3rem] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-white/40">
        <NavButton label={t.care.tabs.community} active={activeSubTab === 'Community'} onClick={() => setActiveSubTab('Community')} theme={theme} icon={<Users size={22} />} />
        <NavButton label={t.care.tabs.experts} active={activeSubTab === 'Experts'} onClick={() => setActiveSubTab('Experts')} theme={theme} icon={<Stethoscope size={22} />} />
        <NavButton label={t.care.tabs.ngo} active={activeSubTab === 'NGOs'} onClick={() => setActiveSubTab('NGOs')} theme={theme} icon={<Heart size={22} />} />
        <NavButton label={t.care.tabs.insurance} active={activeSubTab === 'Insurance'} onClick={() => setActiveSubTab('Insurance')} theme={theme} icon={<ShieldCheck size={22} />} />
        <NavButton label={t.care.tabs.sessions} active={activeSubTab === 'MyBookings'} onClick={() => setActiveSubTab('MyBookings')} theme={theme} icon={<Calendar size={22} />} />
      </div>

      <div className="space-y-12">
        {activeSubTab === 'Community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {circles.map(c => (
              <div key={c.id} className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-[3.5rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 group flex flex-col justify-between hover:translate-y-[-10px] relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="p-5 bg-slate-50/50 rounded-[2rem] group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border border-white" style={{ color: theme.primary }}>
                      <Users size={32} />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full tracking-[0.2em] shadow-sm border border-emerald-100/50">Sisterhood active</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{c.name}</h3>
                  <p className="text-base text-slate-500 font-medium leading-relaxed italic opacity-80 line-clamp-3">"{c.description}"</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-slate-50/50 px-5 py-2.5 rounded-2xl w-fit shadow-inner">
                    <Star size={16} className="text-amber-400 fill-amber-400" /> {c.members} {t.care.community.sistersJoined}
                  </div>
                </div>
                <button 
                  onClick={() => handleRSVP(c.id)}
                  className={`w-full py-5 rounded-[2.5rem] font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 relative z-10 mt-10 ${c.isJoined ? 'bg-slate-100 text-slate-400 shadow-none border border-slate-200/50' : 'text-white'}`}
                  style={{ 
                    backgroundColor: c.isJoined ? '' : theme.primary,
                    background: c.isJoined ? '' : `linear-gradient(135deg, ${theme.primary}, ${theme.text}dd)`
                  }}
                >
                  {c.isJoined ? 'In Circle' : t.care.community.joinSisters}
                  {!c.isJoined && <ChevronRight size={22} />}
                </button>
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 opacity-20 rounded-full translate-x-12 translate-y-[-10px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'Experts' && (
          <div className="space-y-14 animate-in fade-in duration-500">
             <div className="flex gap-2 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-white/60 w-fit mx-auto md:mx-0 shadow-sm">
                {['Physiotherapy', 'OB-GYN', 'Lactation'].map((cat) => (
                   <button 
                    key={cat}
                    onClick={() => setExpertFilter(cat as any)}
                    className={`px-10 py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.15em] transition-all active:scale-95 ${expertFilter === cat ? 'bg-slate-900 shadow-2xl text-white' : 'text-slate-400 hover:text-slate-900'}`}
                   >
                     {cat}
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {filteredExperts.map(expert => (
                 <div key={expert.name} className="bg-white/70 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/60 flex flex-col justify-between hover:shadow-[0_60px_100px_rgba(0,0,0,0.06)] transition-all duration-700 group relative overflow-hidden shadow-sm hover:translate-y-[-8px]">
                   <div className="space-y-12 relative z-10">
                     <div className="flex items-center gap-10">
                       <div 
                        className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center font-bold text-4xl shadow-inner group-hover:rotate-6 group-hover:scale-110 transition-all border-4 border-white"
                        style={{ color: theme.primary, backgroundColor: theme.bg }}
                       >
                         {expert.name[0]}
                       </div>
                       <div className="flex-1">
                         <h3 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{expert.name}</h3>
                         <p className="text-sm font-bold uppercase tracking-[0.2em] mt-1.5" style={{ color: theme.primary }}>{expert.role}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-[0.2em] opacity-80 bg-slate-100/50 px-4 py-1.5 rounded-xl w-fit border border-slate-200/50">{expert.credentials}</p>
                       </div>
                     </div>
                     <div className="p-8 bg-white/50 rounded-[2.5rem] border border-white flex gap-6 shadow-inner relative group-hover:border-slate-100 transition-colors">
                       <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:rotate-12 transition-transform"><Info size={24} /></div>
                       <p className="text-base font-bold text-slate-600 leading-relaxed italic opacity-85">"{expert.insight}"</p>
                       <div className="absolute right-6 bottom-6 opacity-5 group-hover:opacity-10 transition-opacity"><Stethoscope size={64} /></div>
                     </div>
                   </div>
                   <div className="flex justify-between items-center pt-12 mt-12 border-t border-slate-100 relative z-10">
                      <div className="space-y-1">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">{expert.price}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-widest opacity-60">Professional Consult</span>
                      </div>
                      <div className="flex gap-4">
                        <button className="p-5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[1.5rem] transition-all shadow-inner active:scale-90 border border-transparent hover:border-slate-200"><MessageCircle size={28} /></button>
                        <button 
                          onClick={() => handleBook(expert.name, expert.role, expert.price)}
                          className="px-10 py-5 rounded-[1.75rem] font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl hover:translate-y-[-4px] active:scale-95 transition-all flex items-center gap-4 text-white"
                          style={{ 
                            backgroundColor: theme.primary,
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}dd)`
                          }}
                        >
                          {t.care.experts.book} <ChevronRight size={24} />
                        </button>
                      </div>
                   </div>
                   <div className="absolute top-[-30%] right-[-15%] w-64 h-64 rounded-full opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform" style={{ backgroundColor: theme.primary }} />
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeSubTab === 'NGOs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in duration-500">
             {NGO_DATA.map(ngo => (
               <div key={ngo.name} className="bg-white/70 backdrop-blur-xl p-10 lg:p-12 rounded-[3.5rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700 flex flex-col justify-between group hover:translate-y-[-10px]">
                  <div className="space-y-10">
                     <div className="p-6 bg-emerald-50/50 text-emerald-500 rounded-[2.25rem] w-fit shadow-inner group-hover:rotate-12 transition-transform border border-emerald-100"><Heart size={36} strokeWidth={2.5} /></div>
                     <div className="space-y-3">
                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{ngo.name}</h4>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.25em] bg-slate-100/50 px-5 py-2 rounded-xl border border-slate-200/50">{ngo.area}</span>
                     </div>
                  </div>
                  <div className="pt-12 mt-12 border-t border-slate-100 space-y-8">
                     <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span className="uppercase tracking-[0.2em] opacity-60">Verified Support</span>
                        <span className="text-emerald-500 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/30">{ngo.contact}</span>
                     </div>
                     <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                        Visit Portal <ExternalLink size={18} />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeSubTab === 'Insurance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 animate-in fade-in duration-500">
             {INSURANCE_PLANS.map((plan, idx) => {
               const pTheme = (COLORS as any)[plan.theme] || theme;
               return (
                 <div key={plan.bank} className="bg-white/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white shadow-[0_10px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_50px_120px_rgba(0,0,0,0.07)] transition-all duration-700 flex flex-col group hover:translate-y-[-10px] relative overflow-hidden">
                    <div className="flex items-start justify-between gap-8 mb-10 relative z-10">
                       <div 
                         className="w-20 h-20 rounded-[1.75rem] bg-slate-50 flex items-center justify-center font-bold text-3xl shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border-4 border-white"
                         style={{ color: pTheme.primary, backgroundColor: pTheme.bg }}
                       >
                         {plan.logo}
                       </div>
                       <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-4">
                             <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{plan.bank}</h4>
                             <span className="px-3 py-1 bg-slate-100/50 text-slate-400 border border-slate-200/50 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em]">{plan.eligibility}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] opacity-80">{plan.plan}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
                       <MetricBox icon={<TrendingUp size={16} className="text-emerald-500" />} val={plan.approval} label="Approval" />
                       <MetricBox icon={<Clock size={16} className="text-blue-500" />} val={plan.processing} label="Time" />
                       <MetricBox icon={<Users size={16} className="text-purple-500" />} val={plan.count} label="Users" />
                    </div>

                    <div className="space-y-4 mb-12 relative z-10 flex-1">
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em] px-1">Analytical Coverage ({plan.range})</p>
                       <div className="grid grid-cols-1 gap-3">
                          {plan.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl group/item hover:border-slate-300 transition-colors">
                               <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                               <span className="text-sm font-bold text-slate-600 italic opacity-90 leading-tight">{h}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="relative z-10 space-y-5">
                       <button className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                          <span className="relative z-10">Verify Eligibility</span>
                          <ShieldCheck size={22} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                       </button>
                    </div>

                    <div className="absolute bottom-[-15%] right-[-10%] opacity-[0.03] group-hover:opacity-10 pointer-events-none transition-all duration-1000 scale-[1.75] group-hover:rotate-45" style={{ color: pTheme.primary }}>
                      <Landmark size={200} />
                    </div>
                 </div>
               );
             })}
          </div>
        )}

        {activeSubTab === 'MyBookings' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {appointments.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-md p-24 rounded-[4rem] border-4 border-dashed border-white/80 flex flex-col items-center text-center space-y-10 shadow-inner opacity-60">
                 <div className="p-12 bg-white rounded-full shadow-2xl animate-bounce-slow text-slate-100"><Calendar size={100} /></div>
                 <div className="space-y-3">
                    <p className="text-slate-900 font-bold text-3xl tracking-tight">Your healing calendar is clear</p>
                    <p className="text-lg text-slate-400 font-medium italic">Ready to take the next step in your recovery journey?</p>
                 </div>
                 <button onClick={() => setActiveSubTab('Experts')} className="px-14 py-6 bg-slate-900 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-[2.5rem] hover:shadow-2xl transition-all active:scale-95 hover:translate-y-[-4px]">Explore Specialists</button>
              </div>
            ) : (
              <div className="grid gap-10">
                {appointments.map(a => (
                  <div key={a.id} className="p-12 bg-white/80 backdrop-blur-xl rounded-[3.5rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]">
                    {a.status === 'Cancelled' && <div className="absolute inset-0 bg-white/80 backdrop-blur-[6px] flex items-center justify-center z-10"><span className="px-12 py-4 bg-red-100 text-red-600 rounded-[2rem] font-bold text-base uppercase tracking-[0.3em] shadow-2xl border border-red-200/50">Session Revoked</span></div>}
                    <div className="flex items-center gap-10 flex-1">
                       <div 
                        className="p-8 bg-slate-50/50 rounded-[2.5rem] group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border border-white"
                        style={{ color: theme.primary, backgroundColor: theme.bg }}
                       ><Stethoscope size={48} /></div>
                       <div className="space-y-3">
                         <h4 className="font-bold text-slate-900 text-3xl tracking-tight leading-none">{a.specialistName}</h4>
                         <p className="text-sm font-bold uppercase text-slate-400 tracking-[0.25em]">{a.type}</p>
                         <div className="flex items-center gap-4 mt-6">
                           <span className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.25em] shadow-sm border ${
                             a.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                             a.status === 'Rescheduled' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                           }`}>{a.status}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-6 shrink-0">
                       <div className="space-y-3 md:text-right">
                         <span className="block text-4xl font-bold text-slate-900 tracking-tighter leading-none">{a.date}</span>
                         <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100/50 px-5 py-2 rounded-xl border border-slate-200/50">{a.time}</span>
                       </div>
                       {a.status !== 'Cancelled' && (
                         <div className="flex gap-4">
                            <button onClick={() => rescheduleAppointment(a.id)} className="p-5 bg-slate-50 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-[1.5rem] transition-all shadow-inner active:scale-90 border border-transparent hover:border-emerald-100"><RotateCcw size={26} /></button>
                            <button onClick={() => cancelAppointment(a.id)} className="p-5 bg-slate-50 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-[1.5rem] transition-all shadow-inner active:scale-90 border border-transparent hover:border-red-100"><X size={26} /></button>
                         </div>
                       )}
                    </div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-slate-100 opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-1000" />
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
  <div className="bg-slate-50/40 p-4 rounded-2xl border border-white/80 flex flex-col items-center text-center space-y-1.5 shadow-inner">
     <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
     <span className="text-xs font-bold text-slate-900 tracking-tight">{val}</span>
     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const NavButton = ({ label, active, onClick, theme, icon }: any) => (
  <button 
    onClick={onClick}
    className={`shrink-0 flex items-center gap-5 px-10 py-5 rounded-[2.5rem] font-bold text-sm transition-all border group active:scale-[0.97] relative overflow-hidden ${
      active ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.05] translate-y-[-4px] z-10' : 'bg-white/80 text-slate-400 border-white/60 hover:bg-white hover:text-slate-900 shadow-sm'
    }`}
  >
    <div className={`transition-all duration-500 group-hover:scale-110 ${active ? 'text-white' : ''}`} style={{ color: active ? 'white' : theme.primary }}>
      {icon}
    </div>
    <span className="tracking-tight font-bold relative z-10">{label}</span>
    {active && <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none bg-genz" />}
  </button>
);

export default CareConnect;
