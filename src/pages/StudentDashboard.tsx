import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Search, Star, FileText, Brain, TrendingUp, Kanban, Bell, Settings } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import InternshipCard from "@/components/InternshipCard";
import KanbanBoard from "@/components/KanbanBoard";
import ResumeUpload from "@/components/ResumeUpload";
import SkillTag from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { internships, parsedResume, dashboardStats, skillQuiz, roadmapTasks, recommendedCourses, notifications } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const sidebarItems = [
  { to: "/student", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/student/search", label: "Search Internships", icon: <Search className="h-4 w-4" /> },
  { to: "/student/recommended", label: "Recommended", icon: <Star className="h-4 w-4" /> },
  { to: "/student/resume", label: "Resume", icon: <FileText className="h-4 w-4" /> },
  { to: "/student/skills", label: "Skill Evaluation", icon: <Brain className="h-4 w-4" /> },
  { to: "/student/roadmap", label: "Skill Roadmap", icon: <TrendingUp className="h-4 w-4" /> },
  { to: "/student/applications", label: "Applications", icon: <Kanban className="h-4 w-4" /> },
  { to: "/student/notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { to: "/student/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

const pieData = [
  { name: "Applied", value: 5, color: "hsl(217, 71%, 53%)" },
  { name: "Screening", value: 3, color: "hsl(35, 92%, 56%)" },
  { name: "Interview", value: 2, color: "hsl(162, 72%, 40%)" },
  { name: "Offer", value: 1, color: "hsl(162, 72%, 30%)" },
  { name: "Rejected", value: 1, color: "hsl(0, 72%, 51%)" },
];

const skillDemand = [
  { skill: "React", count: 85 }, { skill: "Python", count: 78 }, { skill: "TypeScript", count: 72 },
  { skill: "Node.js", count: 65 }, { skill: "SQL", count: 60 },
];

// Sub-pages
const DashboardHome = () => (
  <div className="space-y-6">
    {/* Profile completion */}
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Profile Completion</span>
        <span className="text-sm text-primary font-semibold">72%</span>
      </div>
      <Progress value={72} className="h-2" />
      <p className="text-xs text-muted-foreground mt-2">Complete your profile to get better matches</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Applications" value={dashboardStats.student.applicationsSubmitted} icon={<FileText className="h-4 w-4" />} trend="+3 this week" />
      <StatsCard title="Interviews" value={dashboardStats.student.interviewsScheduled} icon={<Star className="h-4 w-4" />} trend="+1 scheduled" />
      <StatsCard title="Profile Views" value={dashboardStats.student.profileViews} icon={<Search className="h-4 w-4" />} trend="+12 this week" />
      <StatsCard title="Match Score" value={`${dashboardStats.student.matchScore}%`} icon={<TrendingUp className="h-4 w-4" />} trend="+5% improvement" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">Application Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">Top Skills in Demand</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={skillDemand}>
            <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(217, 71%, 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const SearchInternships = () => {
  const [keyword, setKeyword] = useState("");
  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(keyword.toLowerCase()) ||
    i.company.toLowerCase().includes(keyword.toLowerCase()) ||
    i.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()))
  );
  return (
    <div className="space-y-4">
      <Input placeholder="Search by title, company, or skill..." value={keyword} onChange={e => setKeyword(e.target.value)} className="max-w-lg" />
      <div className="grid gap-4">
        {filtered.map(i => <InternshipCard key={i.id} {...i} />)}
      </div>
    </div>
  );
};

const RecommendedInternships = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Based on your profile and skills</p>
    <div className="grid gap-4">
      {internships.filter(i => i.matchScore >= 80).map(i => <InternshipCard key={i.id} {...i} />)}
    </div>
  </div>
);

const ResumePage = () => (
  <div className="space-y-6">
    <ResumeUpload />
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Parsed Resume Data</h3>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground ml-2">{parsedResume.name}</span></div>
        <div><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground ml-2">{parsedResume.email}</span></div>
        <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground ml-2">{parsedResume.phone}</span></div>
        <div><span className="text-muted-foreground">Education:</span> <span className="font-medium text-foreground ml-2">{parsedResume.education[0].degree}</span></div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-muted-foreground">Skills:</span>
        <div className="flex flex-wrap gap-1.5 mt-2">{parsedResume.skills.map(s => <SkillTag key={s} skill={s} />)}</div>
      </div>
    </div>
  </div>
);

const SkillEvaluation = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < skillQuiz.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const score = answers.filter((a, i) => a === skillQuiz[i].correct).length;
  const level = score >= 4 ? "Advanced" : score >= 2 ? "Intermediate" : "Beginner";

  if (showResult) {
    return (
      <div className="glass-card rounded-lg p-8 text-center max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h3>
        <p className="text-4xl font-bold gradient-text mb-2">{score}/{skillQuiz.length}</p>
        <p className="text-muted-foreground mb-4">Skill Level: <span className="font-semibold text-primary">{level}</span></p>
        <Progress value={(score / skillQuiz.length) * 100} className="h-3 mb-4" />
        <Button onClick={() => { setCurrentQ(0); setAnswers([]); setShowResult(false); }} variant="outline">Retake Quiz</Button>
      </div>
    );
  }

  const q = skillQuiz[currentQ];
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentQ + 1} of {skillQuiz.length}</span>
        <Progress value={((currentQ) / skillQuiz.length) * 100} className="w-32 h-2" />
      </div>
      <div className="glass-card rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">{q.question}</h3>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm text-foreground">
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillRoadmap = () => {
  const completed = roadmapTasks.filter(t => t.completed).length;
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-foreground">Overall Progress</span>
          <span className="text-sm text-primary font-semibold">{Math.round((completed / roadmapTasks.length) * 100)}%</span>
        </div>
        <Progress value={(completed / roadmapTasks.length) * 100} className="h-2" />
      </div>
      <div className="space-y-2">
        {roadmapTasks.map(t => (
          <div key={t.id} className="glass-card rounded-lg p-4 flex items-center gap-3">
            <input type="checkbox" checked={t.completed} readOnly className="h-4 w-4 rounded border-border text-primary" />
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</p>
              <span className="text-xs text-muted-foreground">{t.category}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Recommended Courses</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {recommendedCourses.map(c => (
            <div key={c.id} className="glass-card rounded-lg p-4 hover-lift">
              <h4 className="font-medium text-sm text-foreground">{c.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{c.provider} • {c.duration}</p>
              <SkillTag skill={c.level} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Applications = () => (
  <div>
    <h3 className="font-semibold text-foreground mb-4">Application Tracker</h3>
    <KanbanBoard />
  </div>
);

const NotificationsPage = () => (
  <div className="space-y-2 max-w-2xl">
    {notifications.map(n => (
      <div key={n.id} className={`glass-card rounded-lg p-4 ${!n.read ? "border-l-4 border-l-primary" : ""}`}>
        <p className="text-sm text-foreground">{n.message}</p>
        <span className="text-xs text-muted-foreground">{n.time}</span>
      </div>
    ))}
  </div>
);

const SettingsPage = () => (
  <div className="max-w-lg space-y-4">
    <div className="glass-card rounded-lg p-5 space-y-4">
      <h3 className="font-semibold text-foreground">Profile Settings</h3>
      <div><label className="text-sm text-muted-foreground">Full Name</label><Input defaultValue="Aarav Sharma" className="mt-1" /></div>
      <div><label className="text-sm text-muted-foreground">Email</label><Input defaultValue="aarav@email.com" className="mt-1" /></div>
      <Button>Save Changes</Button>
    </div>
  </div>
);

const StudentDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Dashboard"><DashboardHome /></DashboardLayout>} />
      <Route path="/search" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Search Internships"><SearchInternships /></DashboardLayout>} />
      <Route path="/recommended" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Recommended"><RecommendedInternships /></DashboardLayout>} />
      <Route path="/resume" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Resume"><ResumePage /></DashboardLayout>} />
      <Route path="/skills" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Skill Evaluation"><SkillEvaluation /></DashboardLayout>} />
      <Route path="/roadmap" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Skill Roadmap"><SkillRoadmap /></DashboardLayout>} />
      <Route path="/applications" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Applications"><Applications /></DashboardLayout>} />
      <Route path="/notifications" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Notifications"><NotificationsPage /></DashboardLayout>} />
      <Route path="/settings" element={<DashboardLayout sidebarItems={sidebarItems} role="student" title="Settings"><SettingsPage /></DashboardLayout>} />
    </Routes>
  );
};

export default StudentDashboard;
