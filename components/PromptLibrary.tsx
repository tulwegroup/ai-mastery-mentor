
import React, { useState } from 'react';
import { Profession, LibraryPrompt } from '../types';

const PROMPT_DATA: Record<Profession, LibraryPrompt[]> = {
  Lawyer: [
    { id: '1', title: 'Adversarial Review', category: 'Litigation', prompt: 'Act as a Senior Litigator. Input: Attached Statement of Claim. Steps: 1. Extract 5 legal weaknesses. 2. Cross-reference Act 25. Expectation: A strategy memo.' },
    { id: '2', title: 'Contract Redlining', category: 'Corporate', prompt: 'Act as a Tier-1 Corporate Lawyer. Input: Commercial Lease. Steps: 1. Find liability gaps. 2. Draft GSL-compliant indemnities. Expectation: Redlined table.' }
  ],
  Banker: [
    { id: '3', title: 'Credit Analysis', category: 'Lending', prompt: 'Act as Credit Risk Head. Input: SME Financials. Steps: 1. Calculate DSCR. 2. Stress test at 10% rate hike. Expectation: Decision memo.' }
  ],
  Journalist: [
    { id: '4', title: 'Data Sifting', category: 'Investigative', prompt: 'Act as Investigative Data Journalist. Input: 200-page Auditor General Report. Steps: 1. Find "Ghost Name" patterns. 2. Flag procurement breaches. Expectation: Lead sheet.' }
  ],
  Accountant: [
    { id: '5', title: 'IFRS Reconciliation', category: 'Audit', prompt: 'Act as ICAG Forensic Auditor. Input: General Ledger vs Bank Statement. Steps: 1. Flag variances over 5k. 2. Verify tax codes. Expectation: Reconciliation Report.' }
  ],
  Executive: [
    { id: '6', title: 'Board Briefing', category: 'Strategy', prompt: 'Act as Chief Strategy Officer. Input: Annual Competitor Reports. Steps: 1. SWOT synthesis. 2. Resource pivot suggestions. Expectation: 1-page executive brief.' }
  ]
};

export const PromptLibrary: React.FC<{ profession: Profession; onSelect: (p: string) => void }> = ({ profession, onSelect }) => {
  const [filter, setFilter] = useState('');
  const prompts = PROMPT_DATA[profession] || [];

  return (
    <div className="bg-[#12192c] rounded-[2.5rem] shadow-2xl border border-white/5 p-10 animate-in fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Prompt Treasury</h3>
          <p className="text-slate-400 text-sm font-medium">Verified patterns for the {profession} sector.</p>
        </div>
        <input 
          type="text" 
          placeholder="Filter patterns..." 
          className="bg-[#0a0f1e] border border-white/5 rounded-xl px-6 py-3 outline-none focus:border-indigo-500 text-sm font-bold w-full md:w-64"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.filter(p => p.title.toLowerCase().includes(filter.toLowerCase())).map(p => (
          <div key={p.id} className="bg-[#0a0f1e] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group cursor-pointer" onClick={() => onSelect(p.prompt)}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{p.category}</span>
              <button className="opacity-0 group-hover:opacity-100 text-indigo-400 text-[9px] font-black uppercase tracking-widest transition-all">Select Pattern →</button>
            </div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{p.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 italic font-medium leading-relaxed">{p.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
