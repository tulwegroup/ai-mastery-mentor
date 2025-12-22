
export type Profession = 'Journalist' | 'Banker' | 'Lawyer' | 'Executive' | 'Accountant' | 'Other';

export interface ModuleBadge {
  code: string;
  trackId: number;
  moduleId: number;
}

export interface UserSession {
  userId: string;
  profession: Profession;
  badges: string[];
  currentTrack: number;
  currentModule: number;
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string; inlineData?: { data: string; mimeType: string } }[];
  timestamp: number;
}

export interface LibraryPrompt {
  id: string;
  title: string;
  category: string;
  prompt: string;
}

export type AppTab = 'learning' | 'library' | 'accreditation' | 'pricing';

export interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: string[];
}
