import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/StatsCard";
import SkillTag from "@/components/SkillTag";

import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Settings,
} from "lucide-react";

// ---------------- Sidebar Items ----------------
const sidebarItems = [
  { to: "/mentor", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/mentor/trainings", label: "Skill Trainings", icon: <BookOpen className="h-4 w-4" /> },
  { to: "/mentor/classes", label: "Classes", icon: <Video className="h-4 w-4" /> },
  { to: "/mentor/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  { to: "/mentor/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
  { to: "/mentor/progress", label: "Progress", icon: <TrendingUp className="h-4 w-4" /> },
  { to: "/mentor/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { to: "/mentor/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

// ---------------- Layout Wrapper ----------------
const MentorLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg text-foreground">InternPortal</h2>
          <p className="text-xs text-muted-foreground">Mentor Dashboard</p>
        </div>

        <div className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          Mentor Mode Enabled
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};

// ---------------- Pages ----------------

// Dashboard Home
const MentorHome = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            Mentor Profile Completion
          </span>
          <span className="text-sm text-primary font-semibold">80%</span>
        </div>
        <Progress value={80} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Complete your mentor profile to get more student requests.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Students" value="42" icon={<Users className="h-4 w-4" />} trend="+5 this week" />
        <StatsCard title="Trainings" value="12" icon={<BookOpen className="h-4 w-4" />} trend="+2 new" />
        <StatsCard title="Classes" value="6" icon={<Video className="h-4 w-4" />} trend="3 upcoming" />
        <StatsCard title="Assignments" value="18" icon={<ClipboardList className="h-4 w-4" />} trend="pending review" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-lg p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Upcoming Classes
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-foreground font-medium">DSA Bootcamp</span>
              <span className="text-muted-foreground">Today • 6 PM</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-foreground font-medium">Resume Review</span>
              <span className="text-muted-foreground">Tomorrow • 4 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Mock Interview</span>
              <span className="text-muted-foreground">Sunday • 7 PM</span>
            </div>
          </div>

          <Button className="w-full mt-4 gradient-primary text-primary-foreground border-0">
            Schedule New Class
          </Button>
        </div>

        <div className="glass-card rounded-lg p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Top Performing Students
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Aarav Sharma</span>
              <span className="text-primary font-bold">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Anjali Verma</span>
              <span className="text-primary font-bold">88%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Rohan Gupta</span>
              <span className="text-primary font-bold">84%</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View Students
          </Button>
        </div>
      </div>
    </div>
  );
};

// Trainings Page
const MentorTrainings = () => {
  const [search, setSearch] = useState("");

  const trainings = [
    { id: 1, title: "Full Stack Development", level: "Intermediate", duration: "6 Weeks", skills: ["React", "Node.js"] },
    { id: 2, title: "DSA Bootcamp", level: "Beginner", duration: "4 Weeks", skills: ["Arrays", "Graphs"] },
    { id: 3, title: "Machine Learning Basics", level: "Advanced", duration: "8 Weeks", skills: ["Python", "ML"] },
  ];

  const filtered = trainings.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Search trainings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />

        <Button className="gradient-primary text-primary-foreground border-0">
          + Create Training
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="glass-card rounded-lg p-5 hover-lift">
            <h3 className="font-semibold text-foreground">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Level: <span className="font-medium text-foreground">{t.level}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: <span className="font-medium text-foreground">{t.duration}</span>
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {t.skills.map((s) => (
                <SkillTag key={s} skill={s} />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                View
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground border-0">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Classes Page
const MentorClasses = () => {
  const classes = [
    { id: 1, topic: "Arrays & Strings", date: "Today", time: "6:00 PM" },
    { id: 2, topic: "Resume Workshop", date: "Tomorrow", time: "4:00 PM" },
    { id: 3, topic: "Mock Interview", date: "Sunday", time: "7:00 PM" },
  ];

  return (
    <div className="space-y-4">
      <Button className="gradient-primary text-primary-foreground border-0">
        + Schedule Class
      </Button>

      <div className="space-y-3">
        {classes.map((c) => (
          <div key={c.id} className="glass-card rounded-lg p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-foreground">{c.topic}</h3>
              <p className="text-sm text-muted-foreground">
                {c.date} • {c.time}
              </p>
            </div>

            <Button variant="outline">Manage</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Students Page
const MentorStudents = () => {
  const students = [
    { id: 1, name: "Aarav Sharma", skill: "React", progress: 92 },
    { id: 2, name: "Anjali Verma", skill: "DSA", progress: 88 },
    { id: 3, name: "Rohan Gupta", skill: "Python", progress: 84 },
    { id: 4, name: "Neha Singh", skill: "ML", progress: 76 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {students.map((s) => (
        <div key={s.id} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold text-foreground">{s.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Skill Focus: <span className="text-foreground font-medium">{s.skill}</span>
          </p>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="text-primary font-semibold">{s.progress}%</span>
            </div>
            <Progress value={s.progress} className="h-2" />
          </div>

          <Button variant="outline" className="w-full mt-4">
            View Profile
          </Button>
        </div>
      ))}
    </div>
  );
};

// Assignments Page
const MentorAssignments = () => {
  const assignments = [
    { id: 1, title: "React Mini Project", deadline: "3 Days Left", submissions: "18/28" },
    { id: 2, title: "DSA Sheet (50 Questions)", deadline: "1 Week Left", submissions: "32/40" },
    { id: 3, title: "Resume Upload Task", deadline: "2 Days Left", submissions: "14/16" },
  ];

  return (
    <div className="space-y-3">
      <Button className="gradient-primary text-primary-foreground border-0">
        + Create Assignment
      </Button>

      {assignments.map((a) => (
        <div key={a.id} className="glass-card rounded-lg p-5 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-foreground">{a.title}</h3>
            <p className="text-sm text-muted-foreground">Deadline: {a.deadline}</p>
            <p className="text-sm text-muted-foreground">Submissions: {a.submissions}</p>
          </div>

          <Button variant="outline">Review</Button>
        </div>
      ))}
    </div>
  );
};

// Progress Page
const MentorProgress = () => {
  const progressData = [
    { id: 1, name: "Aarav Sharma", skill: "React", score: 92 },
    { id: 2, name: "Anjali Verma", skill: "DSA", score: 88 },
    { id: 3, name: "Rohan Gupta", skill: "Python", score: 84 },
    { id: 4, name: "Neha Singh", skill: "ML", score: 76 },
  ];

  return (
    <div className="space-y-3">
      {progressData.map((p) => (
        <div key={p.id} className="glass-card rounded-lg p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-foreground">{p.name}</h3>
            <span className="text-primary font-bold">{p.score}%</span>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            Skill: <span className="text-foreground font-medium">{p.skill}</span>
          </p>

          <Progress value={p.score} className="h-2" />
        </div>
      ))}
    </div>
  );
};

// Messages Page
const MentorMessages = () => {
  const messages = [
    { id: 1, student: "Rahul Sharma", msg: "Sir can you explain useEffect?" },
    { id: 2, student: "Anjali Verma", msg: "Please review my resume." },
    { id: 3, student: "Rohan Gupta", msg: "Mock interview schedule please." },
  ];

  return (
    <div className="space-y-3 max-w-2xl">
      {messages.map((m) => (
        <div key={m.id} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold text-foreground">{m.student}</h3>
          <p className="text-sm text-muted-foreground mt-1">{m.msg}</p>

          <Button variant="outline" className="mt-4">
            Reply
          </Button>
        </div>
      ))}
    </div>
  );
};

// Settings Page
const MentorSettings = () => {
  return (
    <div className="max-w-lg space-y-4">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Mentor Profile Settings</h3>

        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <Input defaultValue="Mentor Name" className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input defaultValue="mentor@email.com" className="mt-1" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Expertise</label>
          <Input defaultValue="DSA, Web Dev, ML" className="mt-1" />
        </div>

        <Button className="w-full gradient-primary text-primary-foreground border-0">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

// ---------------- Main Dashboard ----------------
const MentorDashboard = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MentorLayout title="Dashboard">
            <MentorHome />
          </MentorLayout>
        }
      />

      <Route
        path="/trainings"
        element={
          <MentorLayout title="Skill Trainings">
            <MentorTrainings />
          </MentorLayout>
        }
      />

      <Route
        path="/classes"
        element={
          <MentorLayout title="Classes">
            <MentorClasses />
          </MentorLayout>
        }
      />

      <Route
        path="/students"
        element={
          <MentorLayout title="My Students">
            <MentorStudents />
          </MentorLayout>
        }
      />

      <Route
        path="/assignments"
        element={
          <MentorLayout title="Assignments">
            <MentorAssignments />
          </MentorLayout>
        }
      />

      <Route
        path="/progress"
        element={
          <MentorLayout title="Progress Tracking">
            <MentorProgress />
          </MentorLayout>
        }
      />

      <Route
        path="/messages"
        element={
          <MentorLayout title="Messages">
            <MentorMessages />
          </MentorLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MentorLayout title="Settings">
            <MentorSettings />
          </MentorLayout>
        }
      />
    </Routes>
  );
};

export default MentorDashboard;
