
export type Profession = 'Lawyer' | 'Banker' | 'Journalist' | 'Accountant' | 'Executive';
export type UserRole = 'User' | 'Admin';

export interface ModuleResult {
  moduleId: number;
  score: number;
  feedback: string;
  timestamp: number;
  history: { role: 'user' | 'model'; text: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  profession: Profession;
  email: string;
  role: UserRole;
  badgeCount: number;
  lastLogin: number;
  completedModules: number[];
  moduleResults: Record<number, ModuleResult>;
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: number;
  isModuleStep?: boolean;
  options?: string[];
}

export type AppTab = 'dashboard' | 'treasury' | 'accreditation' | 'corporate' | 'admin' | 'review-protocol' | 'mastery-archive' | 'current-status';

export interface LibraryPrompt {
  id: string;
  title: string;
  category: string;
  prompt: string;
}

export interface CurriculumModule {
  id: number;
  track: number;
  cat: string;
  title: string;
  desc: string;
  areas: string[];
}
