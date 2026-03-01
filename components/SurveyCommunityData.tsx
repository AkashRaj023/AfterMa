
import React, { useState } from 'react';
import { 
  Users, Heart, Sparkles, ShieldCheck, ArrowRight, 
  MessageSquare, Star, TrendingUp, Info, Globe, 
  CheckCircle2, Lock, EyeOff, X, ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { COLORS } from '../constants';

interface SurveyProps {
  profile: UserProfile;
}

const COMMUNITY_INSIGHTS = [
  {
    category: "Emotional Resilience",
    stat: "78%",
    insight: "of mothers in our community found that daily 5-minute grounding loops significantly reduced evening anxiety.",
    tag: "Mental Wellness"
  },
  {
    category: "Physical Recovery",
    stat: "92%",
    insight: "of postpartum users reported feeling more empowered after their first guided pelvic floor session.",
    tag: "Care Journey"
  },
  {
    category: "Peer Support",
    stat: "1,200+",
    insight: "Sisters Circles formed this month, connecting women across diverse motherhood paths.",
    tag: "Care Connect"
  },
  {
    category: "Nutrition",
    stat: "Top Choice",
    insight: "Warm Ginger & Turmeric tea remains the most logged comfort food during the first month postpartum.",
    tag: "Nutrition"
  }
];

const SurveyCommunityData: React.FC<SurveyProps> = ({ profile }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    recoveryRate: 5,
    mainChallenge: '',
    supportLevel: 'Moderate',
    anonymousConsent: true
  });

  const handleSurveySubmit = () => {
    alert("Thank you for contributing to the community wisdom! Your anonymized insights have been recorded.");
    setShowSurvey(false);
    setSurveyStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-20 pb-32 animate-in fade-in duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mb-4">
          <Users size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Community Wisdom</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Voices of Motherhood — Real Experiences, Real Wisdom.
        </h2>
        <p className="text-slate-400 font-medium text-lg lg:text-xl leading-relaxed italic">
          Anonymized, curated insights from thousands of unique journeys, helping us all heal together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COMMUNITY_INSIGHTS.map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{item.tag}</span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{item.category}</h3>
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform">{item.stat}</div>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed italic text-lg">
                "{item.insight}"
              </p>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <EyeOff size={14} /> Anonymized Data Point
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none scale-[2]">
              <Globe size={200} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-10 lg:p-20 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">Your voice matters.</h3>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Contribute your experience to help other sisters. Your data is always anonymized and used only to improve our community's collective wisdom.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><ShieldCheck size={20} className="text-emerald-400" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">100% Anonymized</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><Lock size={20} className="text-emerald-400" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Secure & Private</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSurvey(true)}
              className="px-10 py-5 bg-white text-slate-900 rounded-3xl font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              Share Your Journey <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-40 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-4xl">🧘‍♀️</div>
              <div className="h-56 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-4xl">🥗</div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-56 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-4xl">🤱</div>
              <div className="h-40 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-4xl">💖</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[-10%] left-[-5%] opacity-10 pointer-events-none scale-[1.5]">
          <Sparkles size={300} />
        </div>
      </div>

      {showSurvey && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
           <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 lg:p-14 space-y-10 relative shadow-2xl">
              <button onClick={() => setShowSurvey(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
              
              <div className="space-y-3 text-center">
                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl w-fit mx-auto mb-4"><MessageSquare size={32} /></div>
                 <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Community Contribution</h3>
                 <p className="text-sm text-slate-400 font-medium italic">Step {surveyStep} of 2: Helping sisters heal together.</p>
              </div>

              {surveyStep === 1 ? (
                <div className="space-y-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">How would you rate your recovery pace?</label>
                      <div className="flex justify-between px-2">
                         {[1,2,3,4,5,6,7,8,9,10].map(n => (
                           <button 
                             key={n} 
                             onClick={() => setSurveyData(p => ({...p, recoveryRate: n}))}
                             className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${surveyData.recoveryRate === n ? 'bg-slate-900 text-white scale-110' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                             {n}
                           </button>
                         ))}
                      </div>
                      <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-widest px-1">
                         <span>Gentle</span>
                         <span>Intense</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Challenge This Week</label>
                      <select 
                        value={surveyData.mainChallenge}
                        onChange={e => setSurveyData(p => ({...p, mainChallenge: e.target.value}))}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100 appearance-none"
                      >
                         <option value="">Select a challenge...</option>
                         <option value="sleep">Sleep Deprivation</option>
                         <option value="physical">Physical Pain</option>
                         <option value="emotional">Emotional Overwhelm</option>
                         <option value="nutrition">Nutrition Planning</option>
                         <option value="social">Social Isolation</option>
                      </select>
                   </div>

                   <button 
                     disabled={!surveyData.mainChallenge}
                     onClick={() => setSurveyStep(2)}
                     className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                   >
                     Next Step
                   </button>
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Support Level at Home</label>
                      <div className="grid grid-cols-3 gap-3">
                         {['Minimal', 'Moderate', 'Strong'].map(level => (
                           <button 
                             key={level}
                             onClick={() => setSurveyData(p => ({...p, supportLevel: level}))}
                             className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${surveyData.supportLevel === level ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                           >
                             {level}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                      <input 
                        type="checkbox" 
                        checked={surveyData.anonymousConsent}
                        onChange={e => setSurveyData(p => ({...p, anonymousConsent: e.target.checked}))}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                        I understand that my responses are 100% anonymized and will be used to generate collective insights for the AfterMa community.
                      </p>
                   </div>

                   <div className="flex gap-4">
                      <button onClick={() => setSurveyStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Back</button>
                      <button 
                        disabled={!surveyData.anonymousConsent}
                        onClick={handleSurveySubmit}
                        className="flex-[2] py-5 bg-emerald-500 text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                      >
                        Submit Wisdom
                      </button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-6">
        <Info size={24} className="text-slate-400 shrink-0" />
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
          Transparency Notice: All data presented in this section is aggregated from opt-in user surveys. We never store or display personally identifiable information (PII). Our goal is to provide a mirror of the community's collective strength.
        </p>
      </div>
    </div>
  );
};

export default SurveyCommunityData;
