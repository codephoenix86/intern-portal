export interface Training {
  id: number;
  title: string;
  level: string;
  duration: string;
  skills: string[];
}

export interface MentorClass {
  id: number;
  topic: string;
  date: string;
  time: string;
}

export interface Student {
  id: number;
  name: string;
  skill: string;
  progress: number;
}

export interface Assignment {
  id: number;
  title: string;
  deadline: string;
  submissions: string;
}

export interface ProgressData {
  id: number;
  name: string;
  skill: string;
  score: number;
}

export interface Message {
  id: number;
  student: string;
  msg: string;
}

export interface SidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}
