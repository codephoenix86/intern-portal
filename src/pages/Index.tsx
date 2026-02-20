import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Briefcase, Brain, BarChart3, Zap, Star, ArrowRight } from "lucide-react";
import { internships } from "@/data/mockData"; // ✅ IMPORTANT FIX

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
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.15),_transparent_50%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.15),_transparent_50%)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                🚀 AI-Powered Career Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Launch Your Career with
                <span className="gradient-text"> Smart Internship Matching</span>
              </h1>

              <p className="text-lg text-muted-foreground">
                Discover internships, improve your skills, track applications and get hired faster — all in one intelligent platform.
              </p>

              <div className="flex gap-4">
                <Link to="/register">
                  <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8">
                    Get Started
                  </Button>
                </Link>

                <Link to="/internships">
                  <Button size="lg" variant="outline" className="px-8">
                    Explore Internships
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative h-[420px] hidden lg:block">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                <img src="images/hero-1.png" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Hiring Companies Strip */}
<section className="bg-primary py-6 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center gap-8 text-white font-semibold mb-4">
      <span className="text-2xl font-bold">10K+</span>
      <span className="text-sm opacity-80">Openings Daily</span>
    </div>

    <div className="overflow-hidden">
      <div className="auto-scroll items-center gap-16">

        <img src="/images/company1.png" className="h-10 opacity-80" />
        <img src="/images/company2.png" className="h-10 opacity-80" />
        <img src="/images/company3.png" className="h-10 opacity-80" />
        <img src="/images/company4.png" className="h-10 opacity-80" />
        <img src="/images/company5.png" className="h-10 opacity-80" />

        {/* Duplicate for smooth infinite */}
        <img src="/images/company1.png" className="h-10 opacity-80" />
        <img src="/images/company2.png" className="h-10 opacity-80" />
        <img src="/images/company3.png" className="h-10 opacity-80" />

      </div>
    </div>
  </div>
</section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Why InternPortal?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powered by AI to make internship discovery, application, and hiring smarter and faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover-lift text-center">
                <div className="inline-flex p-3 rounded-xl gradient-primary text-primary-foreground mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
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

      {/* Trending Internships */}
      {/* <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">🔥 Trending Internships</h2>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {internships.slice(0, 5).map((i) => (
              <div key={i.id} className="min-w-[300px] glass-card rounded-xl p-5 hover-lift">
                <h3 className="font-semibold text-foreground">{i.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{i.company}</p>
                <p className="text-xs text-primary font-semibold mt-2">
                  {i.matchScore}% Match
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      {/* Trending Now Section */}
<section className="py-20 bg-muted/30 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
      Trending Now
      <span className="text-primary">📈</span>
    </h2>

    <div className="overflow-hidden">
      <div className="auto-scroll w-max">

        {/* Card 1 */}
        <div className="min-w-[360px] bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">Placement Courses with AI</h3>
          <p className="text-sm opacity-90 mb-4">Get placed at Amazon, Flipkart, Samsung and 200+ companies.</p>
          <Button variant="secondary">Know More</Button>
        </div>

        {/* Card 2 */}
        <div className="min-w-[360px] bg-white rounded-2xl p-6 shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-bold text-foreground mb-2">GenZ Career Masterclass</h3>
          <p className="text-sm text-muted-foreground mb-4">Attend, Get Assessed, Get Certified.</p>
          <Button>Register Now</Button>
        </div>

        {/* Card 3 */}
        <div className="min-w-[360px] bg-gradient-to-br from-accent to-primary text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">Special College Offer</h3>
          <p className="text-sm opacity-90 mb-4">Flat 80% OFF on all online trainings.</p>
          <Button variant="secondary">Know More</Button>
        </div>

        {/* Duplicate cards for infinite effect */}
        <div className="min-w-[360px] bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-6 shadow-xl" />
        <div className="min-w-[360px] bg-white rounded-2xl p-6 shadow-xl" />
        <div className="min-w-[360px] bg-gradient-to-br from-accent to-primary text-white rounded-2xl p-6 shadow-xl" />

      </div>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Students & Recruiters
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover-lift">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-chart-4 text-chart-4" />
                  ))}
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
    </div>
  );
};

export default Index;