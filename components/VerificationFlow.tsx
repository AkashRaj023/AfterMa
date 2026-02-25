
import React, { useState } from 'react';
import { UserRole, VerificationData, UserProfile } from '../types';
import { 
  ShieldCheck, ArrowRight, FileText, CheckCircle2, 
  Stethoscope, Users, Lock, ChevronRight, AlertCircle, 
  Upload, HelpCircle, FileCheck, Shield
} from 'lucide-react';
import { COLORS } from '../constants';

interface VerificationFlowProps {
  profile: UserProfile;
  onComplete: (data: VerificationData) => void;
  onCancel: () => void;
  initialRole: UserRole;
}

const VerificationFlow: React.FC<VerificationFlowProps> = ({ profile, onComplete, onCancel, initialRole }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [formData, setFormData] = useState<Partial<VerificationData>>({
    roleRequested: initialRole,
    status: 'pending',
    answers: {},
    specialization: ''
  });

  const theme = COLORS[profile.accent] || COLORS.PINK;

  const handleNext = () => setStep(s => s + 1);

  const handleSubmit = () => {
    onComplete({
      ...formData,
      status: 'pending',
      submittedAt: Date.now(),
      roleRequested: role,
    } as VerificationData);
  };

  const isExpert = role === 'expert';

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full bg-white rounded-[3.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isExpert ? 'Expert Verification' : 'Community Creator Onboarding'}
            </h2>
            <p className="text-sm text-slate-400 font-medium italic">
              Step {step} of {isExpert ? 3 : 4} • {isExpert ? 'Professional Credentials' : 'Community Eligibility'}
            </p>
          </div>
          <button onClick={onCancel} className="p-3 text-slate-300 hover:text-slate-900 transition-all">
            <Lock size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 scrollbar-hide">
          
          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500">
              <div className="text-center space-y-4">
                <div className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl w-fit mx-auto shadow-inner">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Verification Engine</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  AfterMa acts as a neutral mediator to ensure the highest quality of care and community safety.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoleCard 
                  active={role === 'expert'} 
                  onClick={() => setRole('expert')}
                  icon={<Stethoscope size={24} />}
                  title="Healthcare Expert"
                  description="Physiotherapists, OB-GYNs, or Lactation Consultants with valid credentials."
                  theme={theme}
                />
                <RoleCard 
                  active={role === 'community_creator'} 
                  onClick={() => setRole('community_creator')}
                  icon={<Users size={24} />}
                  title="Community Creator"
                  description="Lead Sister Support Groups after completing our eligibility validation."
                  theme={theme}
                />
              </div>
            </div>
          )}

          {step === 2 && isExpert && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                  <select 
                    value={formData.specialization}
                    onChange={e => setFormData(p => ({...p, specialization: e.target.value}))}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select your field...</option>
                    <option value="Physiotherapy">Physiotherapy</option>
                    <option value="OB-GYN">OB-GYN</option>
                    <option value="Lactation">Lactation Consultant</option>
                    <option value="Mental Health">Mental Health Specialist</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional License / ID</label>
                  <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-200 transition-all cursor-pointer bg-slate-50/30">
                    <Upload size={32} className="text-slate-300" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">Upload Credentials</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">PDF, JPG or PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && !isExpert && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-amber-600 font-bold">
                  <AlertCircle size={20} />
                  <span className="text-sm">Eligibility Requirements</span>
                </div>
                <p className="text-xs text-amber-700/80 leading-relaxed">
                  To maintain community trust, creators must undergo a background check and demonstrate competency in peer support moderation.
                </p>
              </div>

              <div className="space-y-6">
                <QuestionField 
                  label="Why do you want to start a Sister Support Group?"
                  placeholder="Describe your motivation and experience..."
                  onChange={val => setFormData(p => ({...p, answers: {...p.answers, motivation: val}}))}
                />
                <QuestionField 
                  label="How would you handle a conflict between members?"
                  placeholder="Explain your moderation approach..."
                  onChange={val => setFormData(p => ({...p, answers: {...p.answers, conflict: val}}))}
                />
              </div>
            </div>
          )}

          {step === 3 && isExpert && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500 text-center">
              <div className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 inline-block">
                <FileCheck size={64} className="text-emerald-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">Ready for Review</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Our clinical board will verify your credentials within 24-48 hours. Once approved, you'll gain access to the Clinical Dashboard.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Shield size={14} /> Platform Agreement
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By submitting, you agree to provide evidence-based care and adhere to AfterMa's professional code of conduct.
                </p>
              </div>
            </div>
          )}

          {step === 3 && !isExpert && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <h3 className="text-xl font-bold text-slate-900">Competency Check</h3>
              <div className="space-y-4">
                <CompetencyOption 
                  label="I understand that I am a peer supporter, not a medical professional."
                  checked={!!formData.answers?.peer_ack}
                  onChange={() => setFormData(p => ({...p, answers: {...p.answers, peer_ack: 'yes'}}))}
                />
                <CompetencyOption 
                  label="I agree to escalate any red flags to the AfterMa clinical team immediately."
                  checked={!!formData.answers?.escalation_ack}
                  onChange={() => setFormData(p => ({...p, answers: {...p.answers, escalation_ack: 'yes'}}))}
                />
                <CompetencyOption 
                  label="I will maintain strict confidentiality within my support group."
                  checked={!!formData.answers?.conf_ack}
                  onChange={() => setFormData(p => ({...p, answers: {...p.answers, conf_ack: 'yes'}}))}
                />
              </div>
            </div>
          )}

          {step === 4 && !isExpert && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500 text-center">
              <div className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 inline-block">
                <CheckCircle2 size={64} className="text-emerald-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">Onboarding Complete</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Your application is now in the queue for admin-level oversight. We'll notify you once your creator status is active.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-8 lg:p-12 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-5 bg-white border border-slate-200 rounded-3xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={((isExpert && step === 3) || (!isExpert && step === 4)) ? handleSubmit : handleNext}
            style={{ backgroundColor: theme.primary }}
            className="flex-1 py-5 text-white rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {((isExpert && step === 3) || (!isExpert && step === 4)) ? 'Submit Application' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ active, onClick, icon, title, description, theme }: any) => (
  <button 
    onClick={onClick}
    className={`p-8 rounded-[2.5rem] border-2 text-left transition-all duration-300 flex flex-col gap-4 group ${
      active ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
    }`}
  >
    <div className={`p-4 rounded-2xl w-fit transition-all ${
      active ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-300 group-hover:text-slate-900'
    }`}>
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className={`text-lg font-bold ${active ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
      <p className="text-xs leading-relaxed opacity-70">{description}</p>
    </div>
    <div className={`mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
      active ? 'text-emerald-400' : 'text-slate-300'
    }`}>
      {active ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5" />}
      {active ? 'Selected' : 'Select Role'}
    </div>
  </button>
);

const QuestionField = ({ label, placeholder, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-800 outline-none min-h-[120px] resize-none focus:ring-2 focus:ring-emerald-100 transition-all"
    />
  </div>
);

const CompetencyOption = ({ label, checked, onChange }: any) => (
  <button 
    onClick={onChange}
    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
      checked ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
    }`}
  >
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
      checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white'
    }`}>
      {checked && <CheckCircle2 size={14} />}
    </div>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default VerificationFlow;
