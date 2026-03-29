export interface SidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export interface SkillDemandItem {
  skill: string;
  count: number;
}

export interface RoadmapTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface RecommendedCourse {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  url: string;
  tags?: string[];
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}
