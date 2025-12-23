
import React from 'react';
import { Profession, CurriculumModule, ModuleResult } from '../types';
import { CheckCircle2, Lock, PlayCircle, ArrowRight, BookOpen } from 'lucide-react';

export const CURRICULUM: CurriculumModule[] = [
  // TRACK 1: FOUNDATIONS
  { id: 1, track: 1, cat: 'Foundations', title: 'The RISE Mental Model', desc: 'Moving from a "Chatbot" mindset to an "Engineering" approach.', areas: ['Logic Anchoring', 'Prompt Drift'] },
  { id: 2, track: 1, cat: 'Foundations', title: 'Persona Design', desc: 'Crafting authoritative Roles that command professional precision.', areas: ['Expertise Mapping', 'Tone Calibration'] },
  { id: 3, track: 1, cat: 'Foundations', title: 'Data Ingestion Logic', desc: 'Safe handling of sensitive Inputs according to Ghana Act 843.', areas: ['Anonymization', 'Privacy Guardrails'] },
  { id: 4, track: 1, cat: 'Foundations', title: 'Sequential Steps', desc: 'Building multi-chain logic flows for complex case solving.', areas: ['Logical Chaining', 'Sub-tasking'] },
  
  // TRACK 2: STRUCTURAL
  { id: 5, track: 2, cat: 'Structural', title: 'Output Mastery', desc: 'Defining Expectations for Board Briefings and Technical Reports.', areas: ['Formatting Protocols', 'Validation'] },
  { id: 6, track: 2, cat: 'Structural', title: 'Industry Integration', desc: 'Applying RISE to sector-specific nuances in Ghana.', areas: ['Local Law', 'BoG Compliance'] },
  { id: 7, track: 2, cat: 'Structural', title: 'Document Synthesis', desc: 'Summarizing 100+ page reports into actionable briefs.', areas: ['Key Point Extraction', 'Semantic Search'] },
  { id: 8, track: 2, cat: 'Structural', title: 'Regulatory Auditing', desc: 'Automating compliance checks against national standards.', areas: ['Statute Auditing', 'Reporting Automation'] },
  
  // TRACK 3: SPECIALIZATION
  { id: 9, track: 3, cat: 'Specialization', title: 'Few-Shot Programming', desc: 'Teaching the AI your specific professional "Voice".', areas: ['Pattern Teaching', 'Consistency'] },
  { id: 10, track: 3, cat: 'Specialization', title: 'Fallacy Detection', desc: 'Spotting errors in logic, bias, and reasoning paths.', areas: ['Bias Mitigation', 'Logic Probes'] },
  { id: 11, track: 3, cat: 'Specialization', title: 'Multi-Agent Strategy', desc: 'Orchestrating multiple AI Personas for a single project.', areas: ['Persona Hand-offs', 'Unified Outputs'] },
  { id: 12, track: 3, cat: 'Specialization', title: 'AI Ethics in Ghana', desc: 'Navigating ethical dilemmas and algorithmic transparency.', areas: ['Equity & Fairness', 'Local Impact'] },
  
  // TRACK 4: GOVERNANCE & MASTERY
  { id: 13, track: 4, cat: 'Governance', title: 'Privacy Architecture', desc: 'Infrastructure for high-security data environments.', areas: ['Data Residency', 'Encryption'] },
  { id: 14, track: 4, cat: 'Governance', title: 'Team Orchestration', desc: 'Leading a corporate team toward AI efficiency.', areas: ['Workflow Adoption', 'Policy Drafting'] },
  { id: 15, track: 4, cat: 'Mastery', title: 'Capstone Challenge', desc: 'Solving a major industry crisis using the full RISE stack.', areas: ['Crisis Synthesis', 'Strategic Command'] },
  { id: 16, track: 4, cat: 'Mastery', title: 'Final Accreditation', desc: 'Final board-level evaluation and mastery recognition.', areas: ['Peer Review', 'Board Presentation'] }
];

interface Props {
  profession: Profession;
  completedIds: number[];
  results: Record<number, ModuleResult>;
  onLaunch: (mod: CurriculumModule) => void;
  onReview: (mod: CurriculumModule) => void;
}

const WorkshopAgenda: React.FC<Props> = ({ profession, completedIds, results, onLaunch, onReview }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
      <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 text-indigo-400">
              <BookOpen size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Proctored Mastery Curriculum</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Accreditation Roadmap</h2>
            <p className="text-slate-400 text-base font-medium leading-relaxed max-w-xl">
              Complete the 16 interactive exercises as your Proctor guides you through high-precision RISE prompting.
            </p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-indigo-500/20 text-center space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Syllabus Completion</p>
            <p className="text-5xl font-black text-indigo-500">{Math.round((completedIds.length / 16) * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CURRICULUM.map((mod) => {
          const isCompleted = completedIds.includes(mod.id);
          const isCurrent = (completedIds.length === 0 && mod.id === 1) || (completedIds.length > 0 && mod.id === Math.max(...completedIds) + 1);
          
          return (
            <div 
              key={mod.id} 
              className={`p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden group ${
                isCompleted ? 'bg-slate-900/40 border-indigo-500/20' : 
                isCurrent ? 'bg-slate-900 border-indigo-500 shadow-2xl scale-[1.02]' : 
                'bg-slate-950 border-white/5 opacity-40 grayscale pointer-events-none'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1 text-left">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isCurrent ? 'text-indigo-400' : 'text-slate-600'}`}>
                    Track {mod.track} // Module {mod.id < 10 ? `0${mod.id}` : mod.id}
                  </span>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">{mod.title}</h4>
                </div>
                {isCompleted ? <CheckCircle2 className="text-indigo-500 w-8 h-8" /> : 
                 isCurrent ? <PlayCircle className="text-indigo-500 animate-pulse w-8 h-8" /> : 
                 <Lock className="text-slate-700 w-8 h-8" />}
              </div>
              
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 text-left">{mod.desc}</p>

              {isCurrent ? (
                <button 
                  onClick={() => onLaunch(mod)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  Start Proctored Task <ArrowRight size={18} />
                </button>
              ) : isCompleted ? (
                <button 
                  onClick={() => onReview(mod)}
                  className="w-full bg-slate-800 text-indigo-400 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border border-indigo-500/30 hover:bg-slate-700 transition-all"
                >
                  Review Session Results
                </button>
              ) : (
                <div className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] text-center italic py-2">Module Secured</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkshopAgenda;
