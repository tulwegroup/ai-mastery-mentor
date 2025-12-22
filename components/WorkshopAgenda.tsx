
import React from 'react';
import { Profession } from '../types';

interface Props {
  profession: Profession;
}

const WorkshopAgenda: React.FC<Props> = ({ profession }) => {
  const getContent = (prof: Profession) => {
    switch (prof) {
      case 'Accountant':
        return {
          title: "The Financial Forensic Architect",
          subtitle: "Mastering AI for IFRS Compliance, GRA Tax Analysis, and Audit Automation",
          track: "Accounting Track",
          sessions: [
            {
              time: "09:00 - 10:30",
              title: "Session 1: ICAG and AI Ethics",
              points: [
                "The Ethical Accountant: Confidentiality in the age of LLMs.",
                "Act 896 Compliance: Mapping the GRA Tax Code into AI workflows.",
                "R-I-S-E: Financial precision through structured prompting."
              ]
            },
            {
              time: "10:45 - 12:30",
              title: "Session 2: IFRS & Disclosure Automation",
              points: [
                "IFRS 16/17 Lab: Using AI to draft complex disclosure notes.",
                "Precision Audit: Finding variances in messy General Ledgers."
              ]
            },
            {
              time: "13:30 - 15:00",
              title: "Session 3: GRA Tax Lab",
              points: [
                "The Tax Optimizer: Identifying tax saving opportunities under Ghanaian Law.",
                "Audit Simulation: AI-assisted sample selection and risk flagging.",
                "Standardizing Trial Balance reconciliations."
              ]
            },
            {
              time: "15:15 - 16:30",
              title: "Session 4: Scaling the ICAG Mentor",
              points: [
                "Prompt Libraries: Standardizing audit working papers.",
                "Continuous ICAG CPD: Staying updated with new financial standards."
              ]
            }
          ]
        };
      case 'Banker':
        return {
          title: "The Algorithmic Banker",
          subtitle: "Mastering AI for Risk Analysis, Compliance, and Data Synthesis",
          track: "Finance Track",
          sessions: [
            {
              time: "09:00 - 10:30",
              title: "Session 1: The AI-Driven Finance Sector",
              points: [
                "Beyond Spreadsheets: Gemini as a Senior Risk Analyst.",
                "BoG Regulations: Data privacy and the Banking Act requirements.",
                "R-I-S-E: Core methodology for financial precision."
              ]
            },
            {
              time: "10:45 - 12:30",
              title: "Session 2: Synthetic Data Mastery",
              points: [
                "Interactive Lab: Turning 100-page bank statements into risk summaries.",
                "Precision Prompting: Handling sensitive customer data within BoG guidelines."
              ]
            },
            {
              time: "13:30 - 15:00",
              title: "Session 3: Advanced Financial Workflows",
              points: [
                "Credit Policy Lab: Sifting through internal policies for loan exceptions.",
                "The 'Stress-Test' Prompt: Asking AI to simulate market volatility impacts.",
                "BoG Prudential Reporting: Cross-referencing internal data vs regulatory returns."
              ]
            },
            {
              time: "15:15 - 16:30",
              title: "Session 4: The In-House Financial AI Mentor",
              points: [
                "Golden Prompt Libraries: standardizing KYC and AML report generation.",
                "Continuous Mentorship: Scaling AI Studio across the department."
              ]
            }
          ]
        };
      case 'Journalist':
        return {
          title: "The Digital Investigator",
          subtitle: "AI for Fact-Checking, Investigative Logic, and Newsroom Efficiency",
          track: "Media Track",
          sessions: [
            {
              time: "09:00 - 10:30",
              title: "Session 1: AI and the GJA Code of Ethics",
              points: [
                "Augmented Journalism: Gemini as a Research Assistant.",
                "Ethics & Verification: Combating AI-generated disinformation with AI.",
                "R-I-S-E: The logic of investigative inquiry."
              ]
            },
            {
              time: "10:45 - 12:30",
              title: "Session 2: Sifting the Signal from Noise",
              points: [
                "Interactive Lab: Extracting leads from 500-page document dumps.",
                "Prompting for Fairness: Ensuring AI doesn't introduce bias in reporting."
              ]
            },
            {
              time: "13:30 - 15:00",
              title: "Session 3: The Investigative Workflow",
              points: [
                "Fact-Check Lab: Cross-referencing government press releases with public data.",
                "The 'Devil's Advocate' Prompt: Testing story hypotheses before publication.",
                "Statutory Mapping: Navigating Ghana's Right to Information (RTI) Act."
              ]
            },
            {
              time: "15:15 - 16:30",
              title: "Session 4: The Modern Newsroom Stack",
              points: [
                "Prompt Libraries: Automating transcription summaries and headlines.",
                "Newsroom Mentor: Implementing AI Studio for real-time fact checking."
              ]
            }
          ]
        };
      case 'Executive':
        return {
          title: "The Augmented Executive",
          subtitle: "Generative AI for Board Strategy, Governance, and Operations",
          track: "Leadership Track",
          sessions: [
            {
              time: "09:00 - 10:30",
              title: "Session 1: Executive AI Strategy",
              points: [
                "AI-First Leadership: Gemini as a Strategic Chief of Staff.",
                "Governance in Ghana: Corporate data security and sovereign data concerns.",
                "R-I-S-E: High-level framing for complex decision-making."
              ]
            },
            {
              time: "10:45 - 12:30",
              title: "Session 2: Board-Ready Intelligence",
              points: [
                "Interactive Lab: Condensing quarterly reports into 1-page Board briefs.",
                "Strategic Constraints: Keeping AI focused on core KPIs and Act 992."
              ]
            },
            {
              time: "13:30 - 15:00",
              title: "Session 3: Operational Efficiency Lab",
              points: [
                "Workflow Lab: Automating standard operating procedure (SOP) drafting.",
                "The 'Competitive Edge' Prompt: Analyzing market shifts via GSE/BoG data.",
                "Crisis Simulations: Using AI to draft response strategies for market shocks."
              ]
            },
            {
              time: "15:15 - 16:30",
              title: "Session 4: Building an AI-Powered Culture",
              points: [
                "Library of Golden Prompts: Scaling efficiency across C-Suite functions.",
                "Leadership Onboarding: Integrating AI Studio into the daily executive workflow."
              ]
            }
          ]
        };
      case 'Lawyer':
      default:
        return {
          title: "The AI-Powered Counsel",
          subtitle: "Mastering Generative AI for Legal Research, Drafting, and Strategy",
          track: "Legal Track",
          sessions: [
            {
              time: "09:00 - 10:30",
              title: "Session 1: The New Legal Frontier",
              points: [
                "The AI Revolution in Law: Gemini as a 'Junior Associate'.",
                "Ethics in Ghana: Privacy, Attorney-Client Privilege, and Hallucinations.",
                "R-I-S-E: Introduction to the core prompting methodology."
              ]
            },
            {
              time: "10:45 - 12:30",
              title: "Session 2: Mastering the Master Prompt",
              points: [
                "Interactive Lab: Transforming 'Summarize this' into World-Class prompts.",
                "Prompting for Precision: Setting constraints for legal facts."
              ]
            },
            {
              time: "13:30 - 15:00",
              title: "Session 3: Advanced Legal Workflows",
              points: [
                "Document Analysis Lab: Hands-on with lease/service agreements.",
                "The 'Adversarial' Prompt: Finding client's argument weaknesses.",
                "Statutory Mapping: Act 992 and other Ghanaian statutes."
              ]
            },
            {
              time: "15:15 - 16:30",
              title: "Session 4: Building Your In-House Legal AI",
              points: [
                "Creating a Prompt Library: Storing 'Golden Prompts' for NDAs and Minutes.",
                "Onboarding the Mentor: Using the AI Studio tool 24/7."
              ]
            }
          ]
        };
    }
  };

  const content = getContent(profession);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">{content.title}</h2>
          <div className="bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            {content.track}
          </div>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">{content.subtitle}</p>
      </div>
      <div className="space-y-6">
        {content.sessions.map((session, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-indigo-500/30">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900 shadow-sm shadow-indigo-500/50"></div>
            <div className="text-[10px] font-mono font-bold text-indigo-400 mb-1">{session.time}</div>
            <h4 className="text-sm font-bold text-slate-100 mb-2">{session.title}</h4>
            <ul className="text-xs text-slate-400 space-y-1.5">
              {session.points.map((p, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mastery Roadmap 2025</div>
        <div className="flex -space-x-2">
            {[1,2,3].map(n => <div key={n} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900"></div>)}
        </div>
      </div>
    </div>
  );
};

export default WorkshopAgenda;
