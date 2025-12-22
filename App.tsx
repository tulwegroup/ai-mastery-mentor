
import React, { useState, useEffect, useRef } from 'react';
import { Message, Profession, UserSession, AppTab } from './types';
import { sendMessageToGemini } from './services/geminiService';
import RISEExplainer from './components/RISEExplainer';
import { PromptLibrary } from './components/PromptLibrary';
import { AccreditationPortal } from './components/AccreditationPortal';
import { PricingTable } from './components/PricingTable';

const MASTER_ID = "PRO-MASTER-2025";

const FormattedMessage: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) return <p className="whitespace-pre-wrap leading-relaxed font-medium">{text}</p>;

  const blocks = text.split(/\n+/);

  return (
    <div className="space-y-4">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed);
        const cleanBlock = isListItem ? trimmed.replace(/^[-*]\s|\d+\.\s/, '') : trimmed;

        const parts = cleanBlock.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        const renderedText = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} className="font-black text-indigo-900 drop-shadow-sm">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={pIdx} className="italic text-slate-600 font-semibold">{part.slice(1, -1)}</em>;
          }
          return part;
        });

        if (isListItem) {
          return (
            <div key={bIdx} className="flex gap-3 pl-2">
              <span className="text-indigo-500 font-black mt-1">•</span>
              <div className="leading-relaxed text-slate-700 font-medium">{renderedText}</div>
            </div>
          );
        }

        return (
          <p key={bIdx} className="leading-relaxed text-slate-700 font-medium">
            {renderedText}
          </p>
        );
      })}
    </div>
  );
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboard, setIsDashboard] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('learning');
  const [profession, setProfession] = useState<Profession>('Other');
  const [userId, setUserId] = useState('');
  const [badges, setBadges] = useState<string[]>([]);
  const [showBadgeToast, setShowBadgeToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('PROF_AI_MENTOR_SESSION');
    if (saved) {
      try {
        const session: UserSession = JSON.parse(saved);
        setUserId(session.userId);
        setProfession(session.profession);
        setBadges(session.badges || []);
        setIsDashboard(false);
        resumeExistingSession(session.profession, session.userId, session.badges || []);
      } catch (e) {
        localStorage.removeItem('PROF_AI_MENTOR_SESSION');
      }
    }
  }, []);

  useEffect(() => {
    if (userId && !isDashboard) {
      const session: UserSession = {
        userId, profession, badges,
        currentTrack: Math.ceil(badges.length / 4),
        currentModule: (badges.length % 4) + 1
      };
      localStorage.setItem('PROF_AI_MENTOR_SESSION', JSON.stringify(session));
    }
  }, [badges, userId, isDashboard, profession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'learning') {
      scrollToBottom();
    }
  }, [messages, activeTab, isLoading]);

  const resumeExistingSession = async (prof: Profession, id: string, existingBadges: string[]) => {
    setIsLoading(true);
    const resumePrompt = `RESUME SESSION. User Profession: ${prof}. User ID: ${id}. Progress: ${existingBadges.length}/16 Modules Cleared.
    1. Welcome the user back professionally.
    2. Acknowledge their specific progress (${existingBadges.length} units cleared).
    3. Provide options: Continue with Module ${(existingBadges.length % 4) + 1} of Track ${Math.ceil((existingBadges.length + 1) / 4)}, Review RISE, or Mastery Archive.`;

    try {
      const response = await sendMessageToGemini([], resumePrompt);
      setMessages([{
        role: 'model',
        parts: [{ text: response.text || "Welcome back. Re-syncing your proctoring profile..." }],
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async (prof: Profession, id: string) => {
    const finalId = id.trim() || MASTER_ID;
    setProfession(prof);
    setUserId(finalId);
    setIsDashboard(false);
    setIsLoading(true);

    const initPrompt = `INITIALIZE SESSION. User Profession: ${prof}. User ID: ${finalId}. 
    1. Welcoming the professional warmly.
    2. Provide a detailed introduction to the R-I-S-E prompting framework.
    3. Use a UNIQUE professional example to illustrate RISE.
    Wait for acknowledgement.`;

    try {
      const response = await sendMessageToGemini([], initPrompt);
      setMessages([{
        role: 'model',
        parts: [{ text: response.text || "Initializing encrypted proctoring channel..." }],
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickAction = async (command: string) => {
    setActiveTab('learning');
    setInput('');
    const userMsg: Message = { role: 'user', parts: [{ text: command }], timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini([...messages, userMsg], command);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.text || "Response error." }], timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    if (confirm("Sign out and clear local session progress?")) {
      localStorage.removeItem('PROF_AI_MENTOR_SESSION');
      setUserId('');
      setProfession('Other');
      setBadges([]);
      setMessages([]);
      setIsDashboard(true);
      setActiveTab('learning');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }], timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(messages, currentInput);
      const text = response.text || "System synchronization delay.";
      
      // Robust badge detection looking for PASS-{PROF}-T{X}-M{Y}
      const badgeMatch = text.match(/PASS-[A-Z]+-T[0-9]-M[0-9]/i);
      if (badgeMatch) {
        const code = badgeMatch[0].toUpperCase();
        if (!badges.includes(code)) {
          setBadges(prev => [...prev, code]);
          setShowBadgeToast(code);
          setTimeout(() => setShowBadgeToast(null), 4000);
        }
      }

      setMessages(prev => [...prev, { role: 'model', parts: [{ text }], timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressTrack = (trackId: number) => {
    const trackPattern = `-T${trackId}-`;
    const trackBadges = badges.filter(b => b.includes(trackPattern));
    
    return (
      <div className="space-y-2" key={trackId}>
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
          <span>Track {trackId}</span>
          <span>{trackBadges.length}/4</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(m => {
            const isDone = trackBadges.length >= m;
            return (
              <div 
                key={m} 
                className={`h-8 flex-1 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                  isDone 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                    : 'bg-slate-800 border-slate-700 text-slate-600'
                }`}
              >
                {isDone ? '✓' : m}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isDashboard) {
    return (
      <div className="h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-['Inter']">
        <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
           <div className="inline-flex items-center gap-4 bg-indigo-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl mb-8">
              <span className="font-black text-4xl">M</span>
              <span className="font-bold text-2xl tracking-tight">Professional AI Mastery Mentor</span>
           </div>
           <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">Mastery Certification <br/><span className="text-indigo-600">for Ghana's Professional Elite</span></h1>
           
           <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Enter Credentials to Start Journey</p>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Enter Enrollment / Membership #" 
                    className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-50 focus:border-indigo-600 text-center font-bold text-lg transition-all"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  {!userId && (
                    <button 
                      onClick={() => setUserId(MASTER_ID)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Use Master ID
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {[
                   { id: 'Lawyer', icon: '⚖️' },
                   { id: 'Banker', icon: '🏦' },
                   { id: 'Accountant', icon: '📊' },
                   { id: 'Journalist', icon: '📰' },
                   { id: 'Executive', icon: '👔' }
                 ].map(p => (
                   <button 
                    key={p.id} 
                    onClick={() => startSession(p.id as Profession, userId)}
                    className="group flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                   >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                    <span className="font-black text-[10px] uppercase tracking-widest text-slate-700 group-hover:text-indigo-600">{p.id}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-['Inter']">
      <aside className="hidden lg:flex w-80 bg-white border-r flex-col p-6 space-y-6 overflow-y-auto shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl">M</div>
          <h2 className="font-black text-xs uppercase tracking-widest text-slate-900">AI Certification</h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-indigo-400 uppercase">CPD Progress</span>
            <span className="text-white text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full font-black">16 MODULES</span>
          </div>
          {[1,2,3,4].map(id => renderProgressTrack(id))}
          <div className="pt-4 border-t border-white/10 text-center">
             <div className="text-4xl font-black text-white">{badges.length} <span className="text-xs font-medium opacity-40">/ 16</span></div>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'learning', label: 'Proctored Learning', icon: '🎓' },
            { id: 'library', label: 'Prompt Treasury', icon: '📂' },
            { id: 'accreditation', label: 'Accreditation', icon: '🏛️' },
            { id: 'pricing', label: 'Corporate Packs', icon: '🏷️' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-100 space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3">Mastery Commands</p>
          <button onClick={() => quickAction("Review the RISE Protocol and the unique professional example.")} className="w-full text-left p-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2">
            <span className="text-lg">💡</span> Review Protocol
          </button>
          <button onClick={() => quickAction("Access the Mastery Archive and list my completed modules.")} className="w-full text-left p-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2">
            <span className="text-lg">📦</span> Mastery Archive
          </button>
        </div>

        <button onClick={handleSignOut} className="mt-auto text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">Sign Out</button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="bg-white border-b p-4 flex justify-between items-center px-8 shrink-0 z-10">
           <div className="flex items-center gap-4">
              <h1 className="font-black text-xs uppercase tracking-widest text-slate-900">{profession} Track</h1>
              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase flex items-center gap-2 border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Session Validated
              </div>
           </div>
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {userId}</div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 bg-[#f8fafc]">
          <div className="flex-1 overflow-y-auto min-h-0 relative">
            {activeTab === 'learning' && (
              <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                     <div className={`max-w-[85%] rounded-[2rem] p-8 md:p-10 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-2xl' : 'bg-white border-2 border-slate-100 text-slate-800'}`}>
                        <FormattedMessage text={msg.parts[0].text} isUser={msg.role === 'user'} />
                     </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-slate-400 font-bold flex items-center gap-4 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      </div>
                      Proctor verifying compliance...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}

            {activeTab === 'library' && (
              <div className="p-8 max-w-5xl mx-auto">
                <PromptLibrary profession={profession} onSelect={(p) => { setInput(p); setActiveTab('learning'); }} />
              </div>
            )}

            {activeTab === 'accreditation' && (
              <div className="p-8 max-w-4xl mx-auto">
                <AccreditationPortal profession={profession} badgeCount={badges.length} userId={userId} />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="p-8 max-w-7xl mx-auto">
                <PricingTable />
              </div>
            )}
          </div>

          {activeTab === 'learning' && (
            <div className="p-6 bg-white border-t shrink-0 z-20">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                 <div className="relative group bg-white rounded-3xl border-2 border-slate-200 focus-within:border-indigo-600 shadow-xl shadow-indigo-100/30 transition-all overflow-hidden">
                   <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Draft your response or command (e.g. 'Ready for Module 1')..."
                    className="w-full p-6 pr-40 outline-none resize-none min-h-[100px] font-medium placeholder:text-slate-300"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(e))}
                   />
                   <button 
                    disabled={isLoading}
                    className="absolute right-4 bottom-4 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                   >
                    Verify RISE
                   </button>
                 </div>
              </form>
              <div className="max-w-4xl mx-auto mt-2 text-center">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Certified Proctored Session • RISE Framework v2.5</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showBadgeToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl border-2 border-indigo-500 animate-in slide-in-from-top-10 duration-500 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xl shadow-lg">🏆</div>
          <div>
            <div className="text-[10px] font-black uppercase text-indigo-400">Accreditation Unlocked</div>
            <div className="font-black text-sm tracking-tight">Module Cleared: {showBadgeToast}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
