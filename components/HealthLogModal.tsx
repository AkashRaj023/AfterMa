
import React, { useState } from 'react';
import { X, Droplet, Moon, Pill, Activity, Smile, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { HealthLog, UserProfile } from '../types';
import { COLORS } from '../constants';

interface HealthLogModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (log: HealthLog) => void;
}

const HealthLogModal: React.FC<HealthLogModalProps> = ({ profile, onClose, onSave }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [log, setLog] = useState<Partial<HealthLog>>({
    moodLevel: 5,
    painLevel: 2,
    energyLevel: 5,
    sleepHours: 6,
    waterIntake: 5,
    medicationsTaken: false,
    kegelCount: 0,
    symptoms: [],
    periodFlow: 'None',
    isOvulating: false,
    crampsLevel: 0,
    notes: ''
  });

  const symptomsList = profile.maternityStage === 'Postpartum' 
    ? ['Lochia', 'Breast Pain', 'Pelvic Pressure', 'Fatigue', 'Headache']
    : profile.maternityStage === 'TTC'
      ? ['Cramps', 'Bloating', 'Breast Tenderness', 'Acne', 'Mood Swings']
      : ['Nausea', 'Backache', 'Swelling', 'Insomnia', 'Dizziness'];

  const handleSave = () => {
    const finalLog: HealthLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      moodLevel: log.moodLevel || 5,
      painLevel: log.painLevel || 2,
      energyLevel: log.energyLevel || 5,
      sleepHours: log.sleepHours || 6,
      waterIntake: log.waterIntake || 5,
      medicationsTaken: !!log.medicationsTaken,
      kegelCount: log.kegelCount || 0,
      symptoms: log.symptoms || [],
      isSensitive: profile.incognito,
      periodFlow: log.periodFlow || 'None',
      isOvulating: !!log.isOvulating,
      crampsLevel: log.crampsLevel || 0,
      notes: log.notes || ''
    };
    onSave(finalLog);
  };

  const toggleSymptom = (s: string) => {
    setLog(prev => {
      const current = prev.symptoms || [];
      const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
      return { ...prev, symptoms: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full bg-white rounded-[3.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="p-8 lg:p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Log Your Moment</h2>
            <p className="text-sm text-slate-400 font-medium italic">Capturing your recovery pulse with clinical precision.</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-900 transition-all"><X size={32} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <SliderField 
                label="Mood Balance" 
                icon={<Smile size={18} />} 
                value={log.moodLevel || 5} 
                min={1} max={10} 
                onChange={v => setLog(p => ({...p, moodLevel: v}))} 
                theme={theme}
                labels={['Low', 'Radiant']}
               />
               <SliderField 
                label="Pain Intensity" 
                icon={<Activity size={18} />} 
                value={log.painLevel || 2} 
                min={0} max={10} 
                onChange={v => setLog(p => ({...p, painLevel: v}))} 
                theme={theme}
                labels={['None', 'Severe']}
               />
               <SliderField 
                label="Energy Vitality" 
                icon={<Zap size={18} />} 
                value={log.energyLevel || 5} 
                min={1} max={10} 
                onChange={v => setLog(p => ({...p, energyLevel: v}))} 
                theme={theme}
                labels={['Drained', 'Vibrant']}
               />
            </div>

            <div className="space-y-8">
               <div className="grid grid-cols-2 gap-6">
                  <NumberField label="Sleep" unit="hrs" value={log.sleepHours || 0} onChange={v => setLog(p => ({...p, sleepHours: v}))} icon={<Moon size={16} />} />
                  <NumberField label="Water" unit="cups" value={log.waterIntake || 0} onChange={v => setLog(p => ({...p, waterIntake: v}))} icon={<Droplet size={16} />} />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Daily Vitals</label>
                  <div className="grid grid-cols-1 gap-3">
                     <button 
                      onClick={() => setLog(p => ({...p, medicationsTaken: !p.medicationsTaken}))}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${log.medicationsTaken ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                     >
                        <div className="flex items-center gap-4">
                           <Pill size={20} />
                           <span className="text-sm font-bold">Medications / Supplements</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${log.medicationsTaken ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}`}>
                           {log.medicationsTaken && <ShieldCheck size={14} />}
                        </div>
                     </button>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Period & Cycle Log</label>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-600">Flow Intensity</span>
                           <Droplet size={14} className="text-rose-400" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map(f => (
                             <button 
                              key={f} 
                              onClick={() => setLog(p => ({...p, periodFlow: f as any}))}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${log.periodFlow === f ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                             >
                               {f}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <Sparkles size={16} className="text-amber-400" />
                           <span className="text-xs font-bold text-slate-600">Ovulation Window</span>
                        </div>
                        <button 
                          onClick={() => setLog(p => ({...p, isOvulating: !p.isOvulating}))}
                          className={`w-10 h-5 rounded-full relative transition-all ${log.isOvulating ? 'bg-amber-400' : 'bg-slate-200'}`}
                        >
                           <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${log.isOvulating ? 'left-5.5' : 'left-0.5'}`} />
                        </button>
                     </div>

                     <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-slate-600">Cramps Severity</span>
                           <span className="text-lg font-black text-rose-500">{log.crampsLevel}</span>
                        </div>
                        <input 
                          type="range" min="0" max="10" value={log.crampsLevel} 
                          onChange={e => setLog(p => ({...p, crampsLevel: parseInt(e.target.value)}))}
                          className="w-full accent-rose-500"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Associated Symptoms</label>
                  <div className="flex flex-wrap gap-2">
                     {symptomsList.map(s => (
                       <button 
                        key={s} 
                        onClick={() => toggleSymptom(s)}
                        className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase border transition-all ${log.symptoms?.includes(s) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                       >
                         {s}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                  <textarea 
                    value={log.notes} 
                    onChange={e => setLog(p => ({...p, notes: e.target.value}))}
                    placeholder="Any specific observations for your doctor..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-100 min-h-[120px]"
                  />
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row gap-4">
           <button onClick={onClose} className="flex-1 py-5 bg-white border border-slate-200 rounded-3xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Discard</button>
           <button 
            onClick={handleSave}
            style={{ backgroundColor: theme.primary }}
            className="flex-1 py-5 text-white rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-pink-100 hover:brightness-105 active:scale-95 transition-all"
           >
             Commit Log Entry
           </button>
        </div>
      </div>
    </div>
  );
};

const SliderField = ({ label, icon, value, min, max, onChange, theme, labels }: any) => (
  <div className="space-y-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3 text-slate-900 font-bold">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50" style={{ color: theme.primary }}>{icon}</div>
          <span className="text-sm tracking-tight">{label}</span>
       </div>
       <span className="text-2xl font-black tabular-nums" style={{ color: theme.primary }}>{value}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={e => onChange(parseInt(e.target.value))} 
      className="w-full"
    />
    <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">
       <span>{labels[0]}</span>
       <span>{labels[1]}</span>
    </div>
  </div>
);

const NumberField = ({ label, unit, value, onChange, icon }: any) => (
  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
     <div className="flex items-center gap-3 text-slate-400 font-bold">
        {icon}
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
     </div>
     <div className="flex items-center justify-between">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-300 hover:text-slate-900 transition-all">-</button>
        <div className="flex flex-col items-center">
           <span className="text-2xl font-black text-slate-900 tabular-nums">{value}</span>
           <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{unit}</span>
        </div>
        <button onClick={() => onChange(value + 1)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-300 hover:text-slate-900 transition-all">+</button>
     </div>
  </div>
);

export default HealthLogModal;
