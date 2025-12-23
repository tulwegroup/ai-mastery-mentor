
import React from 'react';
import { ShieldCheck, Database, Zap, Target, Coffee } from 'lucide-react';

const RISEExplainer: React.FC = () => {
  return (
    <div className="bg-[#12192c] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl space-y-8 md:space-y-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600/10 flex items-center justify-center text-indigo-500 shrink-0 shadow-inner">
          {/* Fix: Replaced invalid md:size prop with Tailwind classes for responsiveness */}
          <Coffee className="w-8 h-8 md:w-11 md:h-11" />
        </div>
        <div className="space-y-3 md:space-y-4 text-center md:text-left">
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
            THE <span className="text-indigo-400">RISE</span> PROTOCOL
          </h3>
          <div className="space-y-3 md:space-y-4 max-w-2xl">
            <p className="text-slate-200 text-sm md:text-lg font-semibold leading-relaxed">
              Talking to AI is like working with a brilliant, but literal, junior associate. RISE is the professional standard for elite prompt engineering.
            </p>
            <p className="text-slate-400 text-[10px] md:text-sm font-medium leading-relaxed border-l-2 border-indigo-500/30 pl-4 md:pl-6 py-1 text-left">
              <span className="text-indigo-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] block mb-1">Definition</span>
              Prompt Engineering is the practice of designing precise, structured instructions that command AI models to perform complex tasks with surgical accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* R-I-S-E Grid - Now Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
        {[
          { l: 'R', n: 'ROLE // PERSONA', d: 'Who is the AI? A Judge? Risk Auditor? Define its authority.', icon: <ShieldCheck size={20}/> },
          { l: 'I', n: 'INPUT // DATA', d: 'What data are we using? Upload case files or paste facts.', icon: <Database size={20}/> },
          { l: 'S', n: 'STEPS // RECIPE', d: 'What is the logic flow? 1. Extract, 2. Validate, 3. Execute.', icon: <Zap size={20}/> },
          { l: 'E', n: 'EXPECTATION // RESULT', d: 'How should it look? A table? A board-ready summary?', icon: <Target size={20}/> }
        ].map((item, i) => (
          <div key={i} className="bg-[#0a0f1e] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 hover:border-indigo-500/20 transition-all group/card">
            <div className="text-indigo-500 mb-6 md:mb-8 group-hover/card:scale-110 transition-transform">{item.icon}</div>
            <div className="space-y-4 md:space-y-6">
               <h4 className="text-white font-black uppercase text-2xl md:text-3xl leading-none">{item.l}</h4>
               <div className="space-y-2 md:space-y-4">
                 <p className="text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-tight">
                   {item.n}
                 </p>
                 <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed font-medium">
                   {item.d}
                 </p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RISEExplainer;
