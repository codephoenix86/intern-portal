import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Briefcase, Brain, BarChart3, Zap, Users, Star, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: <Brain className="h-6 w-6" />, title: "AI Resume Matching", desc: "Our AI analyzes your resume and matches you with the most relevant internships automatically." },
  { icon: <BarChart3 className="h-6 w-6" />, title: "Skill Tracking", desc: "Evaluate your skills, track progress, and follow personalized improvement roadmaps." },
  { icon: <Zap className="h-6 w-6" />, title: "Real-Time Updates", desc: "Get instant notifications on application status changes and recruiter responses." },
];

const stats = [
  { value: "10,000+", label: "Active Internships" },
  { value: "50,000+", label: "Students Placed" },
  { value: "2,000+", label: "Top Companies" },
  { value: "95%", label: "Satisfaction Rate" },
];

const testimonials = [
  { name: "Priya M.", role: "SDE Intern at Google", quote: "InternPortal matched me with my dream internship in just 2 weeks. The AI resume analysis was spot on!" },
  { name: "Rahul K.", role: "Data Science Intern", quote: "The skill tracking feature helped me identify gaps and improve before applying. Highly recommended!" },
  { name: "Anita S.", role: "Recruiter at TechCorp", quote: "We reduced our screening time by 60% with the AI match scoring. Best hiring tool we've used." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Briefcase className="h-4 w-4" />
              Intelligent Internship Discovery
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Find Your Perfect
              <span className="gradient-text"> Internship </span>
              with AI
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered matching, skill evaluation, and real-time tracking — everything you need to launch your career, in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8">
                  Find Internship <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="px-8">
                  Post Internship
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Why InternPortal?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Powered by AI to make internship discovery, application, and hiring smarter and faster.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover-lift text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex p-3 rounded-xl gradient-primary text-primary-foreground mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Trusted by Students & Recruiters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover-lift">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-chart-4 text-chart-4" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="gradient-primary rounded-2xl p-10 sm:p-14">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">Join thousands of students and recruiters already using InternPortal.</p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Find Internships</p><p>Post Internships</p><p>Skill Assessment</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>About Us</p><p>Blog</p><p>Careers</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Help Center</p><p>Contact Us</p><p>FAQ</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Privacy Policy</p><p>Terms of Service</p><p>Cookie Policy</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            © 2025 InternPortal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
