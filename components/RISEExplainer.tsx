
import React from 'react';

const RISEExplainer: React.FC = () => {
  const items = [
    {
      letter: 'R',
      name: 'Role',
      desc: 'Assign a high-level professional persona.',
      example: '"Senior Compliance Officer at Bank of Ghana"'
    },
    {
      letter: 'I',
      name: 'Input',
      desc: 'Provide data, documents, or specific context.',
      example: 'NPA Regulation 2024 (PDF)'
    },
    {
      letter: 'S',
      name: 'Steps',
      desc: 'Define the step-by-step chain of logic.',
      example: '1. Scan for risks. 2. Compare with policy.'
    },
    {
      letter: 'E',
      name: 'Expectation',
      desc: 'Define the exact format and tone.',
      example: 'A 3-column table with risk levels.'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        The R-I-S-E Framework
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.letter} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-lg">
              {item.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{item.name}</span>
              </div>
              <p className="text-sm text-slate-500 mb-1">{item.desc}</p>
              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-indigo-600 border border-slate-200 block mt-1 italic">
                {item.example}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RISEExplainer;
