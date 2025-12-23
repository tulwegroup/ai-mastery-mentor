import React, { useState, useMemo } from 'react';
import { Profession } from '../types';

export const AccreditationPortal: React.FC<{ profession: Profession; badgeCount: number; userId: string }> = ({ profession, badgeCount, userId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getPoints = () => badgeCount * 1.5;
  const getEntity = () => {
    switch (profession) {
      case 'Lawyer': return 'General Legal Council (GLC) / GSL';
      case 'Banker': return 'Chartered Institute of Bankers (CIB) Ghana';
      case 'Accountant': return 'ICAG (Institute of Chartered Accountants Ghana)';
      case 'Journalist': return 'Ghana Journalists Association (GJA)';
      default: return 'Ghana Professional Standards Board';
    }
  };

  const certificateHash = useMemo(() => {
    return Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + 
           Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + 
           new Date().getFullYear();
  }, []);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleClaimCertificate = () => {
    setIsDownloading(true);
    
    // Simulate PDF generation/downloading
    setTimeout(() => {
      const subject = `Certification Submission: ${profession} AI Mastery - ${certificateHash}`;
      const body = `CERTIFICATE OF MASTERY\n\nUser ID: ${userId}\nProfession: ${profession}\nModules Completed: ${badgeCount}/16\nPoints Earned: ${getPoints()} CPD Units\nVerification Hash: ${certificateHash}\n\nThis certifies completion of the R-I-S-E Mastery Protocol in accordance with local professional standards.`;
      
      window.location.href = `mailto:certification@ghana-standards.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      setIsDownloading(false);
      alert("E-Certificate drafted and staged for your email client. Verification Hash: " + certificateHash);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 text-white rounded-[2rem] md:rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-in fade-in">
      <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-black mb-1 md:mb-2 uppercase tracking-tight">Accreditation Portal</h2>
        <p className="text-slate-400 text-xs md:text-sm mb-6 md:mb-8 font-medium">Securely push credits to the {getEntity()} repository.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <div className="bg-white/5 rounded-2xl p-5 md:p-6 border border-white/10 group hover:border-indigo-500/50 transition-colors">
            <div className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">CPD Credits Earned</div>
            <div className="text-3xl md:text-4xl font-black">{getPoints().toFixed(1)} <span className="text-xs font-medium opacity-50 text-white">Units</span></div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 md:p-6 border border-white/10 group hover:border-indigo-500/50 transition-colors">
            <div className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Syllabus Completion</div>
            <div className="text-3xl md:text-4xl font-black">{Math.round((badgeCount / 16) * 100)}%</div>
          </div>
        </div>

        {submitted ? (
          <div className="bg-indigo-600/10 border-2 border-indigo-500 rounded-[2rem] p-6 md:p-8 text-center animate-in zoom-in duration-500 shadow-2xl shadow-indigo-500/10">
            <div className="bg-indigo-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
            </div>
            <h3 className="text-lg md:text-xl font-black mb-1 md:mb-2 text-white uppercase tracking-tight">Certification Validated</h3>
            <p className="text-[10px] md:text-xs text-indigo-200 mb-6 leading-relaxed max-w-sm mx-auto">Mastery Hash: <span className="font-mono bg-white/10 px-2 py-1 rounded text-indigo-300 font-bold">{certificateHash}</span></p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button 
                onClick={handleClaimCertificate} 
                disabled={isDownloading}
                className="bg-indigo-600 text-white px-6 md:px-8 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isDownloading ? 'Processing...' : 'Claim E-Certificate'}
              </button>
              <button onClick={() => setSubmitted(false)} className="text-indigo-300 text-[9px] md:text-xs font-black uppercase tracking-widest hover:text-white transition-colors py-2">Continue Training</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
             <div className="bg-slate-800/50 p-5 md:p-6 rounded-2xl border border-white/5">
                <h4 className="text-[9px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-3 md:mb-4">Official Verification Terms</h4>
                <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed font-medium italic">
                  By submitting units, you confirm all RISE prompts were developed through individual proctored sessions and comply with Ghana Data Protection Act 843.
                </p>
             </div>
            <button 
              disabled={badgeCount === 0 || isSubmitting}
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            >
              {isSubmitting ? 'UPLOADING...' : `PUSH ${getPoints().toFixed(1)} CPD UNITS TO BOARD`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
