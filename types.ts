import type { LucideIcon } from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  description: string; // Problem solved
  role: string;
  images: string[];
  techStack: string[];
  liveLink?: string;
  repoLink?: string;
  challenges: string;
  longDescription: string;
  features: string[];
}

export interface SkillItem {
  name: string;
}

export interface SkillCategory {
  title: string;
  skills: SkillItem[];
  iconName: string; // Changed to string for serialization
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed to string for serialization
  longDescription: string;
  features: string[];
}

export interface HeroData {
  headline: string;
  subheadline: string;
  roles: string[];
  backgroundImages: string[];
  profileImage: string;
}

export interface AboutCard {
  title: string;
  description: string;
  iconName: string;
}

export interface AboutData {
  title: string;
  bio1: string;
  bio2: string;
  stats: {
    experienceYears: string;
    projectsCompleted: string;
    deliverySpeed: string;
  };
  imageUrl: string;
  cards: AboutCard[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  youtube: string;
}

export interface AppSettings {
  social: SocialLinks;
  email: string;
  adminProfileImage: string;
  resumeUrl?: string; // Base64 Data URI for the PDF
  location?: string;
  contactHeading?: string;
  contactDescription?: string;
}

export interface AppData {
  hero: HeroData;
  about: AboutData;
  skills: SkillCategory[];
  services: Service[];
  projects: Project[];
  messages: Message[];
  settings: AppSettings;
}