
import React, { useState } from 'react';

const PRICING_TIERS = [
  {
    name: "Individual Professional",
    description: "Full RISE Tutorial + Digital Certificate",
    price: "1,500",
    features: ["16-Module Curriculum", "Digital Mastery Certificate", "30 Days Prompt Library Access", "Standard Support"]
  },
  {
    name: "Institutional Bulk",
    description: "Per User license for groups of 20+",
    price: "1,100",
    features: ["Custom Firm-Specific Prompts", "Team Progress Dashboard", "Bulk License Management", "Dedicated Onboarding"]
  },
  {
    name: "Corporate Retainer",
    description: "Private Instance for the Firm",
    price: "45,000",
    features: ["Private AI Environment", "In-house 1-day Workshop", "Monthly Prompt Updates", "SLA-backed Support"],
    period: "/ Year"
  },
  {
    name: "Executive Concierge",
    description: "1-on-1 AI Chief of Staff Setup",
    price: "12,000",
    features: ["Private Coaching Sessions", "Strategic Workflow Design", "Direct Proctor Access", "White-glove Deployment"]
  }
];

export const PricingTable: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);

  const handleSecurePackage = (tierName: string) => {
    setSelectedTier(tierName);
    // In a real app, this would redirect to a checkout page or MoMo gateway
    setTimeout(() => {
      alert(`Initiating secure enrollment for ${tierName}. You will be redirected to the payment gateway.`);
      setSelectedTier(null);
    }, 800);
  };

  const handleRequestConsultation = () => {
    setShowConsultModal(true);
    setTimeout(() => {
      setShowConsultModal(false);
      alert("Consultation request sent! An AI Strategy Consultant will contact you within 4 hours.");
    }, 1500);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Investment Roadmap</h2>
        <p className="text-slate-500 font-medium">Strategic pricing for professionals and institutions leading the AI transition in Ghana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_TIERS.map((tier) => (
          <div key={tier.name} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 flex flex-col shadow-sm hover:shadow-2xl hover:border-indigo-500 transition-all group relative">
            {tier.name === "Corporate Retainer" && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
                Most Popular
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{tier.name}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{tier.description}</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-sm font-black text-slate-400 mr-1">GHS</span>
                <span className="text-4xl font-black text-slate-900">{tier.price}</span>
                {tier.period && <span className="text-sm font-bold text-slate-400 ml-1">{tier.period}</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map(f => (
                <li key={f} className="flex gap-3 text-sm font-medium text-slate-600">
                  <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSecurePackage(tier.name)}
              disabled={!!selectedTier}
              className="w-full bg-slate-900 group-hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {selectedTier === tier.name ? 'Processing...' : 'Secure Package'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-black text-indigo-900 mb-1 uppercase tracking-tight">Institutional Adoption</h4>
          <p className="text-indigo-700 text-sm font-medium">Contact our Strategy Team for Ministry or Professional Body-wide deployments.</p>
        </div>
        <button 
          onClick={handleRequestConsultation}
          disabled={showConsultModal}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          {showConsultModal ? 'Sending...' : 'Request Consultation'}
        </button>
      </div>
    </div>
  );
};
