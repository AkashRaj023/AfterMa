
import React, { useState } from 'react';
import { X, Droplet, Moon, Pill, Activity, Smile, Zap, ShieldCheck, Calendar as CalIcon, MessageSquare } from 'lucide-react';
import { PeriodLog, UserProfile } from '../types';
import { COLORS } from '../constants';

interface PeriodLogModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (log: PeriodLog) => void;
}

const PeriodLogModal: React.FC<PeriodLogModalProps> = ({ profile, onClose, onSave }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [log, setLog] = useState<Partial<PeriodLog>>({
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    symptoms: [],
    mood: 'Stable',
    notes: ''
  });

  const flowOptions: PeriodLog['flow'][] = ['Spotting', 'Light', 'Medium', 'Heavy', 'None'];
  const symptomsList = [
    'Cramps', 'Bloating', 'Headache', 'Backache', 'Nausea', 
    'Tender Breasts', 'Acne', 'Fatigue', 'Insomnia'
  ];
  const moodOptions = ['Radiant', 'Stable', 'Irritable', 'Anxious', 'Low'];

  const handleSave = () => {
    const finalLog: PeriodLog = {
      id: Date.now().toString(),
      date: log.date || new Date().toISOString().split('T')[0],
      flow: log.flow || 'Medium',
      symptoms: log.symptoms || [],
      mood: log.mood || 'Stable',
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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Period & Symptom Log</h2>
            <p className="text-sm text-slate-400 font-medium italic">Tracking your cycle with clinical precision and care.</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-900 transition-all"><X size={32} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <CalIcon size={14} /> Log Date
                  </label>
                  <input 
                    type="date" 
                    value={log.date}
                    onChange={e => setLog(p => ({...p, date: e.target.value}))}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Droplet size={14} /> Flow Intensity
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                     {flowOptions.map(f => (
                       <button 
                        key={f}
                        onClick={() => setLog(p => ({...p, flow: f}))}
                        className={`py-4 rounded-2xl font-bold text-[10px] uppercase border transition-all ${log.flow === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                       >
                         {f}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Smile size={14} /> Emotional State
                  </label>
                  <div className="flex flex-wrap gap-2">
                     {moodOptions.map(m => (
                       <button 
                        key={m}
                        onClick={() => setLog(p => ({...p, mood: m}))}
                        className={`px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${log.mood === m ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                       >
                         {m}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity size={14} /> Symptom Cluster
                  </label>
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MessageSquare size={14} /> Personal Notes
                  </label>
                  <textarea 
                    value={log.notes}
                    onChange={e => setLog(p => ({...p, notes: e.target.value}))}
                    placeholder="How are you feeling today? Any specific observations..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-medium text-slate-700 h-32 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all resize-none"
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
             Commit Period Log
           </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodLogModal;
