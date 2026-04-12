import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { APP_DISPLAY_NAME } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import {
  ScanLine,
  Compass,
  UsersRound,
  BadgeCheck,
  Telescope,
  Heart,
  Globe,
  Shield,
  Backpack,
  BriefcaseBusiness,
  LampDesk,
  ScrollText,
  Footprints,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface StatItem {
  value: string;
  label: string;
}

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface RoleFeature {
  icon: React.ReactNode;
  role: string;
  color: string;
  features: string[];
}

// ── Data ──────────────────────────────────────────────────────
const stats: StatItem[] = [
  { value: "10,000+", label: "Active Internships" },
  { value: "50,000+", label: "Students Placed" },
  { value: "2,000+", label: "Partner Companies" },
  { value: "95%", label: "Satisfaction Rate" },
];

const values: ValueItem[] = [
  {
    icon: <ScanLine className="h-6 w-6 stroke-[1.55]" />,
    title: "AI-First Approach",
    desc: "We leverage cutting-edge AI to match students with the right opportunities, eliminating guesswork from the hiring process.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Student-Centric",
    desc: "Every feature we build starts with one question — how does this help a student launch their career?",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trust & Transparency",
    desc: "We believe in honest, transparent communication between students, recruiters, and mentors.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Inclusive Platform",
    desc: "We welcome students from all backgrounds, institutions, and disciplines to find opportunities.",
  },
  {
    icon: <Telescope className="h-6 w-6 stroke-[1.55]" />,
    title: "Continuous Growth",
    desc: "We constantly evolve our platform based on real feedback from our community.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6 stroke-[1.55]" />,
    title: "Quality First",
    desc: "We rigorously verify all job postings and mentor credentials to maintain platform integrity.",
  },
];

const team: TeamMember[] = [
  {
    name: "Aarav Sharma",
    role: "Founder & CEO",
    avatar: "/images/team/aarav.png",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  {
    name: "Anjali Verma",
    role: "CTO & AI Lead",
    avatar: "/images/team/anjali.png",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Rohan Gupta",
    role: "Head of Product",
    avatar: "/images/team/rohan.png",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  {
    name: "Neha Singh",
    role: "Lead Designer",
    avatar: "/images/team/neha.png",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

const roleFeatures: RoleFeature[] = [
  {
    icon: <Backpack className="h-6 w-6 stroke-[1.55]" />,
    role: "For Students",
    color: "from-blue-500 to-blue-600",
    features: [
      "AI-powered internship matching",
      "Resume parsing & skill extraction",
      "Real-time application tracking",
      "Skill evaluation & roadmaps",
      "Mentor-led courses & sessions",
      "Verified certificates",
    ],
  },
  {
    icon: <BriefcaseBusiness className="h-6 w-6 stroke-[1.55]" />,
    role: "For Recruiters",
    color: "from-purple-500 to-purple-600",
    features: [
      "Post internships instantly",
      "AI relevance scoring for applicants",
      "Bulk applicant management",
      "Real-time status notifications",
      "Detailed candidate profiles",
      "Analytics dashboard",
    ],
  },
  {
    icon: <LampDesk className="h-6 w-6 stroke-[1.55]" />,
    role: "For Mentors",
    color: "from-emerald-500 to-emerald-600",
    features: [
      "Create & publish courses",
      "Schedule live sessions",
      "Free demo & paid class options",
      "Track student progress",
      "Issue verified certificates",
      "Manage assignments",
    ],
  },
];

// ── Sub Components ────────────────────────────────────────────

const HeroSection = () => (
  <section className="relative overflow-hidden py-20 sm:py-28">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <ScrollText className="h-4 w-4 stroke-[1.65]" />
          Our story
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
          Building the Future of
          <span className="gradient-text"> Internship Discovery</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {APP_DISPLAY_NAME} was founded with a single mission — to eliminate the
          gap between talented students and great opportunities using the power
          of Artificial Intelligence.
        </p>
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-16 bg-muted/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl sm:text-4xl font-bold gradient-text">
              {s.value}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MissionSection = () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Compass className="h-4 w-4 stroke-[1.65]" />
            Our mission
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Democratizing Access to Career Opportunities
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe every student deserves access to quality internship
            opportunities regardless of their college, city, or background.
            Traditional hiring is broken — it's slow, biased, and inefficient.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {APP_DISPLAY_NAME} uses AI to level the playing field. Our
            intelligent matching engine analyzes skills, education, and
            experience to connect students with opportunities that truly fit —
            not just keyword matches.
          </p>
          <Link to="/register">
            <Button className="gradient-primary text-primary-foreground border-0 gap-2">
              Join {APP_DISPLAY_NAME}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Right — Visual */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: <ScanLine className="h-8 w-8 stroke-[1.45] text-primary" />,
              label: "AI matching",
            },
            {
              icon: <UsersRound className="h-8 w-8 stroke-[1.45] text-purple-500" />,
              label: "50K+ community",
            },
            {
              icon: <Footprints className="h-8 w-8 stroke-[1.45] text-emerald-500" />,
              label: "Faster placement",
            },
            {
              icon: <BadgeCheck className="h-8 w-8 stroke-[1.45] text-orange-500" />,
              label: "Verified certs",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-6 text-center hover-lift"
            >
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="text-sm font-semibold text-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ValuesSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          What We Stand For
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our values guide every decision we make — from product features to
          company culture.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <div key={i} className="glass-card rounded-xl p-6 hover-lift">
            <div className="inline-flex p-3 rounded-xl gradient-primary text-primary-foreground mb-4">
              {v.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {v.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {v.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const RoleFeaturesSection = () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Built for Everyone
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Whether you're a student, recruiter, or mentor — {APP_DISPLAY_NAME}{" "}
          has powerful tools built specifically for you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roleFeatures.map((rf, i) => (
          <div
            key={i}
            className="glass-card rounded-xl overflow-hidden hover-lift"
          >
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${rf.color} p-6 text-white`}>
              <div className="flex items-center gap-3">
                {rf.icon}
                <h3 className="text-xl font-bold">{rf.role}</h3>
              </div>
            </div>

            {/* Feature List */}
            <div className="p-6">
              <ul className="space-y-3">
                {rf.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TeamSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Meet the Team
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A passionate group of engineers, designers, and educators working to
          reshape the internship experience.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-6 text-center hover-lift"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-muted border-2 border-primary/20">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image missing
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="w-full h-full flex items-center justify-center gradient-primary text-primary-foreground text-xl font-bold">
                {member.name.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <h3 className="font-semibold text-foreground">{member.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{member.role}</p>

            {/* Social Links */}
            <div className="flex justify-center gap-3 mt-4">
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {member.twitter && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="glass-card rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join thousands of students, recruiters, and mentors already using{" "}
          {APP_DISPLAY_NAME} to build better careers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground border-0 px-8"
            >
              Get Started Free
            </Button>
          </Link>
          <Link to="/internships">
            <Button size="lg" variant="outline" className="px-8">
              Browse Internships
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ── Main Page ─────────────────────────────────────────────────
const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <ValuesSection />
      <RoleFeaturesSection />
      <TeamSection />
      <CTASection />
    </div>
  );
};

export default About;
