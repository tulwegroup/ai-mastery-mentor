
import React, { useState } from 'react';
import { Profession, LibraryPrompt } from '../types';

const PROMPT_DATA: Record<Profession, LibraryPrompt[]> = {
  Lawyer: [
    { id: '1', title: 'Adversarial Review', category: 'Litigation', prompt: 'Act as a Senior Litigator. Input: Attached Statement of Claim. Steps: 1. Extract 5 legal weaknesses. 2. Cross-reference Act 25. Expectation: A strategy memo.' },
    { id: '2', title: 'Contract Redlining', category: 'Corporate', prompt: 'Act as a Tier-1 Corporate Lawyer. Input: Commercial Lease. Steps: 1. Find liability gaps. 2. Draft GSL-compliant indemnities. Expectation: Redlined table.' }
  ],
  Accountant: [
    { id: '3', title: 'IFRS Reconciliation', category: 'Audit', prompt: 'Act as ICAG Forensic Auditor. Input: General Ledger vs Bank Statement. Steps: 1. Flag variances over 5k. 2. Verify tax codes. Expectation: Reconciliation Report.' },
    { id: '4', title: 'Tax Planning', category: 'Tax', prompt: 'Act as GRA Tax Specialist. Input: P&L Statement. Steps: 1. Calculate deductible expenses under Act 896. 2. Identify credits. Expectation: Tax calculation schedule.' }
  ],
  Banker: [
    { id: '5', title: 'Credit Analysis', category: 'Lending', prompt: 'Act as Credit Risk Head. Input: SME Financials. Steps: 1. Calculate DSCR. 2. Stress test at 10% rate hike. Expectation: Decision memo.' }
  ],
  Journalist: [
    { id: '6', title: 'Data Sifting', category: 'Investigative', prompt: 'Act as Investigative Data Journalist. Input: 200-page Auditor General Report. Steps: 1. Find "Ghost Name" patterns. 2. Flag procurement breaches. Expectation: Lead sheet.' }
  ],
  Executive: [
    { id: '7', title: 'SWOT Synthesis', category: 'Strategy', prompt: 'Act as Chief Strategy Officer. Input: Annual Competitor Reports. Steps: 1. SWOT synthesis. 2. Resource pivot suggestions. Expectation: 1-page executive brief.' }
  ],
  Other: []
};

export const PromptLibrary: React.FC<{ profession: Profession; onSelect: (p: string) => void }> = ({ profession, onSelect }) => {
  const [filter, setFilter] = useState('');
  const prompts = PROMPT_DATA[profession] || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Prompt Treasury</h3>
        <input 
          type="text" 
          placeholder="Search patterns..." 
          className="text-xs border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.filter(p => p.title.toLowerCase().includes(filter.toLowerCase())).map(p => (
          <div key={p.id} className="border border-slate-100 rounded-xl p-4 hover:border-indigo-200 transition-all group cursor-pointer" onClick={() => onSelect(p.prompt)}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{p.category}</span>
              <button className="opacity-0 group-hover:opacity-100 text-indigo-600 text-[10px] font-bold">USE PROMPT →</button>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{p.title}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 italic">{p.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
