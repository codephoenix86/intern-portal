import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, PlusCircle, List, Users, Bell, Settings, FileText } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import SkillTag from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dashboardStats, internships, applicants, notifications } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const sidebarItems = [
  { to: "/recruiter", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/recruiter/post", label: "Post Internship", icon: <PlusCircle className="h-4 w-4" /> },
  { to: "/recruiter/listings", label: "My Listings", icon: <List className="h-4 w-4" /> },
  { to: "/recruiter/applicants", label: "Applicants", icon: <Users className="h-4 w-4" /> },
  { to: "/recruiter/notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { to: "/recruiter/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

const statusPie = [
  { name: "Pending", value: 12, color: "hsl(35, 92%, 56%)" },
  { name: "Shortlisted", value: 8, color: "hsl(217, 71%, 53%)" },
  { name: "Interview", value: 5, color: "hsl(162, 72%, 40%)" },
  { name: "Accepted", value: 2, color: "hsl(162, 72%, 30%)" },
  { name: "Rejected", value: 3, color: "hsl(0, 72%, 51%)" },
];

const Overview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Active Listings" value={dashboardStats.recruiter.activeListings} icon={<List className="h-4 w-4" />} />
      <StatsCard title="Total Applicants" value={dashboardStats.recruiter.totalApplicants} icon={<Users className="h-4 w-4" />} trend="+15 this week" />
      <StatsCard title="Shortlisted" value={dashboardStats.recruiter.shortlisted} icon={<FileText className="h-4 w-4" />} />
      <StatsCard title="Interviews" value={dashboardStats.recruiter.interviewsScheduled} icon={<Bell className="h-4 w-4" />} trend="+3 scheduled" />
    </div>
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Applicant Status Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
            {statusPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PostInternship = () => (
  <div className="max-w-2xl space-y-4">
    <div className="glass-card rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-foreground">Post New Internship</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Title</Label><Input placeholder="e.g. Frontend Developer Intern" className="mt-1" /></div>
        <div><Label>Company</Label><Input placeholder="Your company name" className="mt-1" /></div>
        <div><Label>Location</Label><Input placeholder="City, Country" className="mt-1" /></div>
        <div>
          <Label>Type</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent><SelectItem value="remote">Remote</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label>Duration</Label><Input placeholder="e.g. 3 months" className="mt-1" /></div>
        <div><Label>Stipend</Label><Input placeholder="e.g. ₹15,000/month" className="mt-1" /></div>
      </div>
      <div><Label>Required Skills (comma-separated)</Label><Input placeholder="React, TypeScript, Node.js" className="mt-1" /></div>
      <div><Label>Description</Label><Textarea placeholder="Describe the internship role..." className="mt-1" rows={5} /></div>
      <Button className="gradient-primary text-primary-foreground border-0">Publish Internship</Button>
    </div>
  </div>
);

const MyListings = () => (
  <div className="space-y-3">
    {internships.slice(0, 3).map(i => (
      <div key={i.id} className="glass-card rounded-lg p-5 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{i.title}</h4>
          <p className="text-sm text-muted-foreground">{i.applicants} applicants • Posted {i.postedDate}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="outline" className="text-destructive">Close</Button>
        </div>
      </div>
    ))}
  </div>
);

const ApplicantsList = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = statusFilter === "all" ? applicants : applicants.filter(a => a.status === statusFilter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {["all", "Pending", "Shortlisted", "Interview", "Accepted", "Rejected"].map(s => (
          <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)} className="capitalize">
            {s}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="glass-card rounded-lg p-5 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground">{a.name}</h4>
                <p className="text-sm text-muted-foreground">{a.email} • Applied for: {a.appliedFor}</p>
              </div>
              <MatchScoreBadge score={a.matchScore} />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {a.skills.map(s => <SkillTag key={s} skill={s} />)}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
              <div className="bg-muted rounded p-2 text-center">
                <p className="text-muted-foreground">Skill Match</p>
                <p className="font-bold text-foreground">{a.skillMatch}%</p>
              </div>
              <div className="bg-muted rounded p-2 text-center">
                <p className="text-muted-foreground">Experience</p>
                <p className="font-bold text-foreground">{a.experienceMatch}%</p>
              </div>
              <div className="bg-muted rounded p-2 text-center">
                <p className="text-muted-foreground">Education</p>
                <p className="font-bold text-foreground">{a.educationMatch}%</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40"><SelectValue placeholder={a.status} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline">View Resume</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecruiterNotifications = () => (
  <div className="space-y-2 max-w-2xl">
    {notifications.map(n => (
      <div key={n.id} className={`glass-card rounded-lg p-4 ${!n.read ? "border-l-4 border-l-primary" : ""}`}>
        <p className="text-sm text-foreground">{n.message}</p>
        <span className="text-xs text-muted-foreground">{n.time}</span>
      </div>
    ))}
  </div>
);

const RecruiterSettings = () => (
  <div className="max-w-lg space-y-4">
    <div className="glass-card rounded-lg p-5 space-y-4">
      <h3 className="font-semibold text-foreground">Company Settings</h3>
      <div><Label>Company Name</Label><Input defaultValue="TechCorp" className="mt-1" /></div>
      <div><Label>Contact Email</Label><Input defaultValue="hr@techcorp.com" className="mt-1" /></div>
      <Button>Save Changes</Button>
    </div>
  </div>
);

const RecruiterDashboard = () => (
  <Routes>
    <Route path="/" element={<DashboardLayout sidebarItems={sidebarItems} role="recruiter" title="Overview"><Overview /></DashboardLayout>} />
    <Route path="/post" element={<DashboardLayout sidebarItems={sidebarItems} role="recruiter" title="Post Internship"><PostInternship /></DashboardLayout>} />
    <Route path="/listings" element={<DashboardLayout sidebarItems={sidebarItems} role="recruiter" title="My Listings"><MyListings /></DashboardLayout>} />
    <Route path="/applicants" element={<DashboardLayout sidebarItems={sidebarItems} role="recruiter" title="Applicants"><ApplicantsList /></DashboardLayout>} />
    <Route path="/notifications" element={<DashboardLayout sidebarItems={sidebarItems} role="recruiter" title="Notifications"><RecruiterNotifications /></DashboardLayout>} />
    <Route path="/settings" element={<DashboardLayout sidebarItems={sidebarItems} role="recruiter" title="Settings"><RecruiterSettings /></DashboardLayout>} />
  </Routes>
);

export default RecruiterDashboard;
