
import React, { useRef, useState } from 'react';
import { Book, PlayCircle, HeartPulse, ShieldCheck, Video, FileText, ExternalLink, ArrowRight, Star, X, ChevronRight, MessageSquare, Users } from 'lucide-react';
import { GOVT_SCHEMES } from '../constants';
import { UserProfile } from '../types';
import { translations } from '../translations';
import SurveyCommunityData from './SurveyCommunityData';

interface EducationProps { profile: UserProfile; }

const Education: React.FC<EducationProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const articles = [
    { title: "Understanding the 'Fourth Trimester'", category: "Mental Health", readTime: "5 min", summary: "The transition from pregnancy to motherhood requires a different kind of clinical grace and internal patience." },
    { title: "C-Section Incision Care 101", category: "Physical Recovery", readTime: "8 min", summary: "Gentle techniques to ensure a smooth scar healing process and identifying early warning signs of infection." },
    { title: "Nutrients for Iron Recovery", category: "Nutrition", readTime: "4 min", summary: "Traditional Indian superfoods to rebuild your vitality after blood loss, optimized for modern lifestyles." },
    { title: "Diastasis Recti Self-Check", category: "Physical Recovery", readTime: "6 min", summary: "A step-by-step clinical guide to assessing abdominal separation and safe restorative exercises." },
  ];

  const trustedPicks = [
    { brand: "Mamaearth", product: "Plant-Based Baby Wipes", reason: "Toxin-free & Biodegradable", tag: "Editor's Choice" },
    { brand: "FirstCry", product: "Organic Nursing Pads", reason: "Super absorbent, naturally breathable", tag: "Best Seller" },
    { brand: "Himalaya", product: "Ayurvedic Diaper Cream", reason: "Gentle healing since 1930", tag: "Trusted Heritage" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 animate-in">
      <div className="text-center space-y-6 pt-10">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">{t.education.title}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto italic text-lg font-medium leading-relaxed">{t.education.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickLink icon={<Book className="text-pink-500" size={32} />} label={t.education.quickLinks.guides} onClick={() => setActiveSection('guides')} />
        <QuickLink icon={<PlayCircle className="text-blue-500" size={32} />} label={t.education.quickLinks.videos} onClick={() => setActiveSection('videos')} />
        <QuickLink icon={<HeartPulse className="text-red-500" size={32} />} label={t.education.quickLinks.tips} onClick={() => setActiveSection('tips')} />
        <QuickLink icon={<ShieldCheck className="text-emerald-500" size={32} />} label={t.education.quickLinks.safety} onClick={() => setActiveSection('safety')} />
      </div>

      <section className="space-y-12">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><Users size={24} /></div>
           <div className="space-y-0.5">
             <h2 className="text-2xl lg:text-3xl font-black text-gray-800">Community Wisdom</h2>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Voices of Motherhood</p>
           </div>
        </div>
        <SurveyCommunityData profile={profile} />
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-800">{t.education.newsletterTitle}</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{t.education.newsletterSub}</p>
           </div>
           <button className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest hover:underline transition-all">{t.education.archive} <ArrowRight size={14} /></button>
        </div>
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none -mx-4 px-4 lg:-mx-8 lg:px-8"
        >
           {trustedPicks.map((pick, i) => (
             <div key={i} className="min-w-[85%] md:min-w-[45%] lg:min-w-[31%] snap-start bg-white p-8 rounded-[3rem] border border-gray-50 shadow-md hover:shadow-2xl transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                   <div className="flex justify-between items-start"><span className="text-[8px] font-black uppercase px-3 py-1 bg-pink-50 text-pink-500 rounded-full">{pick.tag}</span><Star size={16} className="text-amber-300" fill="currentColor" /></div>
                   <h4 className="text-lg font-black text-gray-900">{pick.brand}: {pick.product}</h4>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"Because {pick.reason.toLowerCase()} is essential for your peace of mind and delicate care."</p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-pink-500 transition-colors">Learn More <ArrowRight size={12} /></button>
             </div>
           ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-800">{t.education.govtTitle}</h2>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-gray-50 px-4 py-1.5 rounded-full shadow-inner">{t.education.govtSub}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {GOVT_SCHEMES.map(scheme => (
            <div key={scheme.title} className="bg-white p-6 rounded-[2rem] border border-gray-50 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="bg-blue-50 text-blue-500 p-3 rounded-xl shadow-inner w-fit"><FileText size={20} /></div>
                <h3 className="text-xl font-black text-gray-800 leading-tight">{scheme.title}</h3>
                <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-50">
                  <p className="text-[10px] font-black text-blue-700">{scheme.benefit}</p>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                Details <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-800">{t.education.latestResources}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {articles.map((art, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[3rem] border border-gray-50 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all cursor-pointer group shadow-md">
              <div className="w-full sm:w-32 h-32 lg:w-40 lg:h-40 bg-pink-100 rounded-[2rem] shrink-0 overflow-hidden shadow-inner">
                 <img src={`https://picsum.photos/seed/${idx + 10}/400/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Article" />
              </div>
              <div className="space-y-3 flex-1 py-1">
                <div className="flex justify-between items-center"><span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">{art.category}</span><span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{art.readTime} {t.education.read}</span></div>
                <h3 className="text-xl lg:text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors leading-snug">{art.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{art.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {activeSection && (
        <div className="fixed inset-0 z-[160] bg-white/98 backdrop-blur-3xl flex flex-col animate-in slide-in-from-bottom duration-700">
           <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                   {activeSection === 'guides' && <Book size={20} />}
                   {activeSection === 'videos' && <PlayCircle size={20} />}
                   {activeSection === 'tips' && <HeartPulse size={20} />}
                   {activeSection === 'safety' && <ShieldCheck size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none capitalize">{activeSection} Portal</h3>
                  <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-1">Curated Expert Resources</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {Array.from({length: 6}).map((_, i) => (
                   <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer space-y-6">
                      <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative">
                         <img src={`https://picsum.photos/seed/${activeSection}-${i}/600/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Resource" />
                         {activeSection === 'videos' && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><PlayCircle size={48} className="text-white drop-shadow-2xl" /></div>}
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">Expert Verified</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{i + 2}m read</span>
                         </div>
                         <h4 className="text-xl font-bold text-slate-900 leading-tight">Essential {activeSection === 'guides' ? 'Guide to' : activeSection === 'tips' ? 'Tips for' : 'Safety in'} Postpartum Care Vol. {i + 1}</h4>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed italic">"A comprehensive clinical overview of recovery milestones and emotional stabilization techniques."</p>
                      </div>
                      <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all flex items-center justify-center gap-2">
                         Open Resource <ChevronRight size={14} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const QuickLink = ({ icon, label, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 lg:p-8 rounded-[2.5rem] text-center shadow-md border border-gray-50 hover:border-pink-200 hover:shadow-xl transition-all cursor-pointer group">
    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="font-black text-xs lg:text-sm text-gray-800 uppercase tracking-wider">{label}</span>
  </div>
);

export default Education;
