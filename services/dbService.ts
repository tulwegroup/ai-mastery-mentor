import { UserProfile, Profession, ModuleResult } from '../types';

const STORAGE_KEY = 'neon_db_instance_03';

export const dbService = {
  getUsers: (): UserProfile[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  signUp: async (name: string, email: string, profession: Profession): Promise<UserProfile> => {
    const users = dbService.getUsers();
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      profession,
      role: email.toLowerCase().includes('admin') ? 'Admin' : 'User',
      badgeCount: 0,
      lastLogin: Date.now(),
      completedModules: [],
      moduleResults: {}
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  signIn: async (email: string): Promise<UserProfile | null> => {
    const users = dbService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.lastLogin = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return user;
    }
    return null;
  },

  addUser: (name: string, email: string, profession: Profession) => {
    const users = dbService.getUsers();
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      profession,
      role: 'User',
      badgeCount: 0,
      lastLogin: Date.now(),
      completedModules: [],
      moduleResults: {}
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  saveModuleResult: (userId: string, result: ModuleResult) => {
    const users = dbService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      user.moduleResults[result.moduleId] = result;
      if (!user.completedModules.includes(result.moduleId)) {
        user.completedModules.push(result.moduleId);
        user.badgeCount = user.completedModules.length;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return user;
    }
    return null;
  },

  deleteUser: (id: string) => {
    const users = dbService.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
