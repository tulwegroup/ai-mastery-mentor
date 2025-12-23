
import React, { useState, useEffect, useRef } from 'react';
import { Message, Profession, AppTab, UserProfile, CurriculumModule, ModuleResult } from './types';
import { sendMessageToGemini, ApiError } from './services/geminiService';
import { dbService } from './services/dbService';
import { 
  GraduationCap, 
  Send,
  Loader2,
  ShieldCheck,
  X,
  Target,
  ArrowRight,
  Archive,
  Target as TargetIcon,
  CheckCircle2,
  Calendar,
  Zap,
  Scale,
  Landmark,
  BarChart3,
  FileText,
  UserCheck,
  Layout,
  Clock,
  Activity,
  Plus,
  Trash2,
  Lock,
  Mail,
  Smartphone,
  Check,
  User,
  Award,
  Sparkles,
  Menu as MenuIcon
} from 'lucide-react';
import WorkshopAgenda, { CURRICULUM } from './components/WorkshopAgenda';
import { PromptLibrary } from './components/PromptLibrary';
import { AccreditationPortal } from './components/AccreditationPortal';
import RISEExplainer from './components/RISEExplainer';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mastery_active_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loginStep, setLoginStep] = useState<'email' | 'loading' | 'code'>('email');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [professionInput, setProfessionInput] = useState<Profession | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [error, setError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<CurriculumModule | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [moduleStep, setModuleStep] = useState(0); 
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Modal State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', profession: 'Lawyer' as Profession });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mastery_active_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('mastery_active_session');
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'dashboard') scrollToBottom();
  }, [messages, isLoading]);

  const handleAuthStep1 = () => {
    setError(null);
    if (!nameInput.trim()) {
      setError("Full professional name is required.");
      return;
    }
    if (!emailInput.includes('@')) {
      setError("Valid professional email required.");
      return;
    }
    if (!professionInput) {
      setError("Select your professional track.");
      return;
    }
    setLoginStep('loading');
    setTimeout(() => {
      setLoginStep('code');
    }, 1500); 
  };

  const handleAuthStep2 = async () => {
    setError(null);
    if (verificationCode !== '1234') {
      setError("Invalid verification code. Master code is 1234.");
      return;
    }

    try {
      const existingUser = await dbService.signIn(emailInput);
      if (existingUser) {
        setUser({ ...existingUser, name: nameInput || existingUser.name, profession: professionInput || existingUser.profession });
      } else {
        const newUser = await dbService.signUp(nameInput, emailInput, professionInput!);
        setUser(newUser);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEnrollMember = () => {
    if (!adminForm.name || !adminForm.email) {
      alert("Name and email required.");
      return;
    }
    dbService.addUser(adminForm.name, adminForm.email, adminForm.profession);
    setShowEnrollModal(false);
    setAdminForm({ name: '', email: '', profession: 'Lawyer' });
  };

  const launchModule = async (mod: CurriculumModule) => {
    if (!user) return;
    setActiveTab('dashboard');
    setActiveModule(mod);
    setIsReviewMode(false);
    setModuleStep(1); 
    setIsLoading(true);
    setMessages([]);
    setIsMobileMenuOpen(false);
    
    try {
      const response = await sendMessageToGemini([], "", "", user.name, user.profession, mod, true);
      const { cleanText, options } = parseOptions(response.text || "");
      setMessages([{ role: 'model', parts: [{ text: cleanText }], options, timestamp: Date.now(), isModuleStep: true }]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewResults = (mod: CurriculumModule) => {
    const result = user?.moduleResults[mod.id];
    if (!result) return;
    setActiveTab('dashboard');
    setActiveModule(mod);
    setIsReviewMode(true);
    setIsMobileMenuOpen(false);
    setMessages(result.history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
      timestamp: Date.now()
    })));
  };

  const parseOptions = (text: string): { cleanText: string; options: string[] } => {
    const lines = text.split('\n');
    const options: string[] = [];
    const cleanLines: string[] = [];
    lines.forEach(line => {
      const match = line.match(/^OPTION\s\d+:\s*(.*)/i);
      if (match) options.push(match[1].trim());
      else cleanLines.push(line);
    });
    return { cleanText: cleanLines.join('\n').trim(), options };
  };

  const handleSendMessage = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading || !user || isReviewMode) return;

    const userMsg: Message = { role: 'user', parts: [{ text: messageText }], timestamp: Date.now() };
    setMessages(prev => [...prev.map(m => ({ ...m, options: undefined })), userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(messages, messageText, "", user.name, user.profession, activeModule || undefined);
      const rawText = response.text || "";
      const { cleanText, options } = parseOptions(rawText);
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: cleanText }], options, timestamp: Date.now() }]);

      const upper = rawText.toUpperCase();
      if (upper.includes("MASTERY CONFIRMED") && activeModule) {
        setShowCelebration(true);
        setTimeout(() => {
          const res: ModuleResult = {
            moduleId: activeModule.id,
            score: 100,
            feedback: "MASTERY CONFIRMED",
            timestamp: Date.now(),
            history: [...messages, userMsg, { role: 'model', parts: [{ text: cleanText }] } as Message].map(m => ({
              role: m.role,
              text: m.parts[0].text
            }))
          };
          const updated = dbService.saveModuleResult(user.id, res);
          if (updated) setUser(updated);
          setActiveModule(null);
          setModuleStep(0);
          setShowCelebration(false);
        }, 4000);
      } else if (upper.includes("INPUT") || upper.includes("I?")) setModuleStep(2);
      else if (upper.includes("STEPS") || upper.includes("S?")) setModuleStep(3);
      else if (upper.includes("EXPECTATION") || upper.includes("E?")) setModuleStep(4);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-4 px-2">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg text-white">M</div>
        <span className="font-black text-sm uppercase tracking-widest text-slate-300">AI Certification</span>
      </div>
      
      <div className="bg-[#12192c] rounded-[2rem] p-6 space-y-4 border border-white/5">
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
           <span className="text-slate-500">Mastery Goal</span>
           <span className="text-indigo-400">16 Modules</span>
         </div>
         <div className="flex gap-1 h-3">
            {[...Array(16)].map((_, i) => (
              <div key={i} className={`flex-1 rounded-full ${user?.completedModules.includes(i+1) ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-[#0a0f1e]'}`}></div>
            ))}
         </div>
         <div className="flex justify-between items-end">
           <p className="text-3xl font-black text-white">{user?.badgeCount || 0}</p>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">UNITS EARNED</p>
         </div>
      </div>

      <nav className="space-y-2">
        <button onClick={() => { setActiveTab('dashboard'); setActiveModule(null); setIsReviewMode(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><GraduationCap size={20} /> Proctored Learning</button>
        <button onClick={() => { setActiveTab('treasury'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'treasury' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}><Archive size={20} className="text-yellow-400" /> Prompt Treasury</button>
        {user?.role === 'Admin' && (
          <button onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}><Lock size={20} className="text-red-400" /> Admin Portal</button>
        )}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-6">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2">Mastery Commands</span>
        <div className="space-y-2">
          <button onClick={() => { setActiveTab('review-protocol'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-2 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'review-protocol' ? 'text-white' : 'text-slate-400 hover:text-white'}`}><Activity size={18} className="text-yellow-400" /> Review Protocol</button>
          <button onClick={() => { setActiveTab('mastery-archive'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-2 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'mastery-archive' ? 'text-white' : 'text-slate-400 hover:text-white'}`}><Archive size={18} className="text-orange-400" /> Mastery Archive</button>
          <button onClick={() => { setActiveTab('current-status'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-2 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'current-status' ? 'text-white' : 'text-slate-400 hover:text-white'}`}><TargetIcon size={18} className="text-red-500" /> Current Status</button>
        </div>
        <button onClick={() => { setUser(null); window.location.reload(); }} className="w-full pt-10 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center hover:text-red-500 transition-colors">Sign Out / End Session</button>
      </div>
    </>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col items-center py-10 md:py-20 px-4 md:px-8 font-['Inter'] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        
        <div className="bg-[#5145cd] text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-700 relative z-10 border border-white/10">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-lg">M</div>
          <span className="font-bold text-base tracking-tight text-white uppercase tracking-widest">Mastery Lab</span>
        </div>

        <div className="text-center space-y-2 mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">Elite Certification</h1>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#5145cd]">For Ghana's Professionals</h2>
        </div>

        <div className="w-full max-w-xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            {loginStep === 'email' ? 'Identification & Credentials' : loginStep === 'loading' ? 'Encrypting Connection' : 'Verification Required'}
          </p>
          
          <div className="space-y-4">
            {loginStep === 'email' && (
              <>
                <div className="space-y-4 text-left">
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <User size={20} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Full Legal Name" 
                      className="w-full bg-[#12192c] border border-white/10 rounded-3xl p-6 md:p-7 pl-14 md:pl-16 text-base md:text-lg font-medium shadow-2xl outline-none transition-all placeholder:text-slate-600 text-white focus:border-indigo-500" 
                      value={nameInput} 
                      onChange={(e) => setNameInput(e.target.value)} 
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Professional Email" 
                      className="w-full bg-[#12192c] border border-white/10 rounded-3xl p-6 md:p-7 pl-14 md:pl-16 text-base md:text-lg font-medium shadow-2xl outline-none transition-all placeholder:text-slate-600 text-white focus:border-indigo-500" 
                      value={emailInput} 
                      onChange={(e) => setEmailInput(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 pt-4">
                  {[
                    { id: 'Lawyer', icon: <Scale size={24} /> },
                    { id: 'Banker', icon: <Landmark size={24} /> },
                    { id: 'Accountant', icon: <BarChart3 size={24} /> },
                    { id: 'Journalist', icon: <FileText size={24} /> },
                    { id: 'Executive', icon: <UserCheck size={24} /> }
                  ].map((prof) => (
                    <button key={prof.id} onClick={() => setProfessionInput(prof.id as Profession)} className={`p-4 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 ${professionInput === prof.id ? 'border-[#5145cd] bg-[#5145cd]/20 text-[#5145cd] shadow-2xl scale-105' : 'border-white/5 bg-[#12192c]/50 text-slate-500 hover:border-white/20'}`}>
                      {prof.icon}
                      <span className="text-[8px] font-black uppercase tracking-widest">{prof.id}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleAuthStep1} 
                  className="w-full mt-6 bg-[#5145cd] py-5 md:py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-[#5145cd]/20 flex items-center justify-center gap-3"
                >
                  Enter The Simulation <ArrowRight size={20} />
                </button>
              </>
            )}

            {loginStep === 'loading' && (
              <div className="py-20 flex flex-col items-center gap-6">
                 <Loader2 size={48} className="animate-spin text-indigo-500" />
                 <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-[0.2em]">Establishing High-Level Connection...</p>
              </div>
            )}

            {loginStep === 'code' && (
              <div className="relative group animate-in zoom-in duration-300">
                <div className="flex justify-center gap-4 mb-8">
                  <Smartphone size={48} className="text-indigo-500" />
                </div>
                <p className="text-sm font-medium text-slate-400 mb-6 leading-relaxed">Authorization packet staged for <span className="text-indigo-400">{emailInput}</span>.<br/>Enter your unique access code.</p>
                <input type="text" maxLength={4} placeholder="0 0 0 0" className="w-full bg-[#12192c] border border-white/10 rounded-3xl p-7 text-center text-3xl md:text-4xl font-black tracking-[0.5em] shadow-2xl outline-none focus:border-indigo-500 text-white" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                <button onClick={handleAuthStep2} className="w-full mt-6 bg-[#5145cd] py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Establish Mastery Link</button>
                <button onClick={() => setLoginStep('email')} className="block mt-4 text-[10px] uppercase font-black text-slate-500 mx-auto hover:text-white transition-colors">Edit Credentials</button>
              </div>
            )}
          </div>
          {error && <div className="text-red-400 text-xs font-bold bg-red-950/20 p-4 rounded-2xl border border-red-900/50">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0f1e] text-slate-100 overflow-hidden font-['Inter'] relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-10 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-indigo-500/30 scale-150 animate-pulse"></div>
            <div className="bg-indigo-600 w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl relative z-10 animate-bounce">
              {/* Fix: Replaced invalid md:size prop with Tailwind classes */}
              <Award className="w-12 h-12 md:w-16 md:h-16" />
            </div>
          </div>
          <div className="mt-8 md:mt-12 text-center space-y-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
              {/* Fix: Replaced invalid md:size prop with standard Tailwind classes for size if needed */}
              <Sparkles className="text-yellow-400 animate-spin-slow hidden md:block w-6 h-6 md:w-8 md:h-8" />
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">MASTERY CONFIRMED</h2>
              {/* Fix: Replaced invalid md:size prop with standard Tailwind classes for size if needed */}
              <Sparkles className="text-yellow-400 animate-spin-slow hidden md:block w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs md:text-sm">Professional Workflow Reengineered</p>
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-[300px] md:w-[340px] bg-[#0a0f1e] border-r border-white/5 flex flex-col p-8 space-y-10 shrink-0 overflow-y-auto custom-scrollbar z-[110] transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0f1e] relative">
        {/* Responsive Header */}
        <header className="h-20 md:h-28 border-b border-white/5 flex items-center justify-between px-6 md:px-14 shrink-0 bg-[#12192c]/40 backdrop-blur-2xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <MenuIcon size={24} />
            </button>
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-1">PROCTORED // {isReviewMode ? 'REVIEW' : 'LIVE'}</span>
              <h2 className="text-sm md:text-xl font-black uppercase tracking-tighter truncate max-w-[150px] md:max-w-none">
                {activeModule ? activeModule.title : activeTab === 'admin' ? 'Elite Registry' : 'Professional Hub'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="bg-[#12192c] px-3 md:px-6 py-2 md:py-3 rounded-full border border-white/5 flex items-center gap-2 md:gap-3">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-300">
                Lvl {Math.floor(user.badgeCount/4) + 1}
              </span>
            </div>
            {(activeModule || activeTab !== 'dashboard') && <button onClick={() => { setActiveTab('dashboard'); setActiveModule(null); setIsReviewMode(false); }} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center transition-all"><X size={16} /></button>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-14 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-48">
              {!activeModule && <><RISEExplainer /><WorkshopAgenda profession={user.profession} completedIds={user.completedModules} results={user.moduleResults} onLaunch={launchModule} onReview={handleReviewResults} /></>}
              
              {activeModule && (
                <div className="bg-[#12192c] border-2 border-indigo-500/20 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden gap-6">
                  <div className="flex items-center gap-4 md:gap-8 relative z-10 w-full md:w-auto">
                    {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0"><Target className="w-6 h-6 md:w-8 md:h-8" /></div>
                    <div>
                      <h4 className="text-sm md:text-lg font-black text-white uppercase tracking-tight mb-1 md:mb-2">{isReviewMode ? 'Historical Archive' : `Simulation: Step ${moduleStep} of 4`}</h4>
                      <div className="flex gap-1.5 md:gap-2">
                        {['R', 'I', 'S', 'E'].map((letter, i) => (
                          <div key={i} className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-[8px] md:text-[10px] ${moduleStep > i ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-900 border border-white/5'}`}>{letter}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {isReviewMode && <span className="bg-orange-500/10 text-orange-400 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase border border-orange-500/20 whitespace-nowrap">Archived Record</span>}
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[95%] md:max-w-[85%] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#12192c] border border-white/5 text-slate-200'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm font-medium">{msg.parts[0].text}</p>
                    {msg.options && !isReviewMode && (
                      <div className="mt-6 md:mt-8 grid grid-cols-1 gap-2 md:gap-3">
                        {msg.options.map((opt, idx) => (
                          <button key={idx} onClick={() => handleSendMessage(opt)} className="w-full text-left p-4 md:p-5 bg-[#0a0f1e]/50 hover:bg-indigo-600 hover:text-white border border-white/10 rounded-xl transition-all font-bold text-[10px] md:text-xs flex items-center justify-between group">
                            <span>{opt}</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
              {isLoading && <div className="flex justify-start animate-pulse"><div className="bg-[#12192c] p-4 md:p-6 rounded-full border border-white/5"><Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-indigo-500" /></div></div>}
              <div ref={messagesEndRef} />
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 animate-in fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Elite Member Registry</h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium">Manage professional licenses and CPD accreditation status.</p>
                </div>
                <button onClick={() => setShowEnrollModal(true)} className="w-full md:w-auto bg-indigo-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"><Plus size={18} /> Enroll New Member</button>
              </div>

              <div className="bg-[#12192c] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] overflow-x-auto shadow-2xl custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white/5 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                      <th className="p-6 md:p-8 text-white">Professional Entity</th>
                      <th className="p-6 md:p-8 text-white">Specialization</th>
                      <th className="p-6 md:p-8 text-white">CPD Units</th>
                      <th className="p-6 md:p-8 text-white">Last Active</th>
                      <th className="p-6 md:p-8 text-white text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dbService.getUsers().map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6 md:p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 font-black text-lg md:text-xl border border-indigo-500/20">{u.name[0]}</div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight text-xs md:text-base">{u.name}</p>
                              <p className="text-[10px] md:text-[11px] text-slate-500 font-medium truncate max-w-[120px] md:max-w-none">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 md:p-8">
                           <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full whitespace-nowrap">{u.profession}</span>
                        </td>
                        <td className="p-6 md:p-8">
                          <div className="flex items-center gap-2">
                             <span className="text-base md:text-lg font-black text-indigo-400">{(u.badgeCount * 1.5).toFixed(1)}</span>
                             <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase">Points</span>
                          </div>
                        </td>
                        <td className="p-6 md:p-8 text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">{new Date(u.lastLogin).toLocaleDateString()}</td>
                        <td className="p-6 md:p-8 text-right">
                           <button onClick={() => { dbService.deleteUser(u.id); setAdminForm({...adminForm}); }} className="p-2 md:p-3 hover:bg-red-500/10 text-slate-600 hover:text-red-500 transition-all rounded-xl border border-transparent hover:border-red-500/20"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'treasury' && <PromptLibrary profession={user.profession} onSelect={(p) => { setActiveTab('dashboard'); setInput(p); }} />}
          {activeTab === 'accreditation' && <AccreditationPortal profession={user.profession} badgeCount={user.badgeCount} userId={user.id} />}
          {activeTab === 'review-protocol' && (
             <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in">
                <div className="bg-[#12192c] border border-white/5 rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-12 space-y-6 md:space-y-8 shadow-2xl">
                   <div className="flex items-center gap-4 md:gap-6">
                      {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20 shadow-inner shrink-0">
                        <Activity className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white">RISE: Operating Procedure</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-4 md:gap-6">
                      {[
                        { step: "01", l: "R", n: "ANCHORING PERSONA", d: "Never initialize without an authoritative role. A 'Counsel' response carries legal weight; 'Generic' carries risk." },
                        { step: "02", l: "I", n: "INPUT HYGIENE", d: "Filtered through Act 843. Scrub private names and PII before ingestion. Data hygiene is mandatory." },
                        { step: "03", l: "S", n: "LOGICAL CHAINING", d: "Break projects into atomic actions: Parse, Fact-check, Synthesis. Logic nodes increase accuracy." },
                        { step: "04", l: "E", n: "OUTPUT PRECISION", d: "Define the geometry. If board briefing, specify Markdown. If raw data, specify Table." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 md:gap-8 p-6 md:p-8 bg-[#0a0f1e] rounded-2xl md:rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
                           <span className="text-2xl md:text-4xl font-black text-indigo-500 italic opacity-50 shrink-0">{item.step}</span>
                           <div className="space-y-1 md:space-y-2">
                              <p className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.l} // {item.n}</p>
                              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">{item.d}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'mastery-archive' && (
             <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-4">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Case Record Archive</h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.completedModules.length} Modules Documented</span>
                </div>
                {user.completedModules.length === 0 ? (
                  <div className="bg-[#12192c] p-10 md:p-20 text-center rounded-[2rem] md:rounded-[3rem] border border-white/5 space-y-4">
                    <Archive size={40} className="mx-auto text-slate-700" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No records found in mastery ledger</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {user.completedModules.map(mid => {
                      const mod = CURRICULUM.find(m => m.id === mid);
                      const res = user.moduleResults[mid];
                      return (
                        <div key={mid} className="bg-[#12192c] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-indigo-500/30 transition-all gap-6">
                           <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform shrink-0">
                                <Check size={24}/>
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-base md:text-xl font-black text-white uppercase tracking-tight truncate max-w-[200px] md:max-w-none">{mod?.title}</h4>
                                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(res.timestamp).toLocaleString()}</p>
                              </div>
                           </div>
                           <button onClick={() => handleReviewResults(mod!)} className="w-full md:w-auto bg-slate-900 border border-white/5 text-slate-400 px-6 py-3 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all text-center">Review Transcript</button>
                        </div>
                      )
                    })}
                  </div>
                )}
             </div>
          )}

          {activeTab === 'current-status' && (
             <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                   <div className="bg-[#12192c] p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl">
                      {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20"><Layout className="w-5 h-5 md:w-6 md:h-6"/></div>
                      <div className="space-y-1">
                         <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mastery Rank</p>
                         <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Level {Math.floor(user.badgeCount/4) + 1}</p>
                      </div>
                   </div>
                   <div className="bg-[#12192c] p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl">
                      {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20"><Clock className="w-5 h-5 md:w-6 md:h-6"/></div>
                      <div className="space-y-1">
                         <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Training</p>
                         <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{user.badgeCount * 45} mins</p>
                      </div>
                   </div>
                   <div className="bg-[#12192c] p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl">
                      {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20"><Activity className="w-5 h-5 md:w-6 md:h-6"/></div>
                      <div className="space-y-1">
                         <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Accreditation</p>
                         <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{(user.badgeCount * 1.5).toFixed(1)} CPD</p>
                      </div>
                   </div>
                </div>

                <div className="bg-[#12192c] border border-white/5 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 space-y-8 md:space-y-10 shadow-3xl">
                   <div className="flex items-center gap-4 md:gap-6">
                      {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                      <Zap className="text-indigo-500 shrink-0 w-6 h-6 md:w-8 md:h-8" />
                      <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Internalization Analytics</h4>
                   </div>
                   
                   <div className="space-y-8 md:space-y-10">
                      {[
                        { label: 'FRAMEWORK PROFICIENCY', val: Math.round((user.badgeCount / 16) * 100), color: 'bg-indigo-500' },
                        { label: 'PRECISION RATING', val: user.badgeCount > 0 ? 98 : 0, color: 'bg-green-500' },
                        { label: 'CASE SYNTHESIS VELOCITY', val: user.badgeCount > 4 ? 92 : user.badgeCount > 0 ? 45 : 0, color: 'bg-yellow-500' }
                      ].map((bar, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] px-2">
                              <span>{bar.label}</span>
                              <span className="text-white">{bar.val}%</span>
                           </div>
                           <div className="w-full h-2 md:h-3 bg-[#0a0f1e] rounded-full overflow-hidden border border-white/5">
                              <div className={`${bar.color} h-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.4)]`} style={{ width: `${bar.val}%` }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Floating Chat Input */}
        {activeTab === 'dashboard' && activeModule && !isReviewMode && (
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-14 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/95 to-transparent z-40">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="max-w-4xl mx-auto relative group">
              <div className="relative bg-[#12192c]/90 border border-white/10 focus-within:border-indigo-500 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl transition-all overflow-hidden p-3 md:p-4 backdrop-blur-2xl">
                <textarea 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Professional response..." 
                  className="w-full bg-transparent p-4 md:p-6 pr-20 md:pr-32 outline-none resize-none min-h-[60px] md:min-h-[100px] text-sm md:text-lg font-medium text-white placeholder:text-slate-700" 
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} 
                />
                {/* Fix: Replaced invalid md:size prop with responsive Tailwind classes */}
                <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-4 md:right-8 bottom-4 md:bottom-8 bg-indigo-600 text-white w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 active:scale-95 hover:bg-indigo-500 transition-all disabled:opacity-50"><Send className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 md:p-8">
           <div className="bg-[#12192c] w-full max-w-lg rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/10 shadow-3xl space-y-6 md:space-y-8 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center">
                 <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Manual Enrollment</h4>
                 <button onClick={() => setShowEnrollModal(false)} className="text-slate-600 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Legal Name</label>
                    <input type="text" className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-indigo-500 text-white font-bold text-sm" value={adminForm.name} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Corporate Email</label>
                    <input type="email" className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-indigo-500 text-white font-bold text-sm" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Professional Track</label>
                    <select className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-indigo-500 text-white font-bold appearance-none text-sm" value={adminForm.profession} onChange={(e) => setAdminForm({...adminForm, profession: e.target.value as Profession})}>
                       {['Lawyer', 'Banker', 'Accountant', 'Journalist', 'Executive'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                 </div>
              </div>
              <button onClick={handleEnrollMember} className="w-full bg-indigo-600 py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 text-white">Authorize Member</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
