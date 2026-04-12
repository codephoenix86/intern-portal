import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  FileSearch,
  Route,
  RadioReceiver,
  Star,
  ChevronLeft,
  ChevronRight,
  Telescope,
  Flame,
} from "lucide-react";
import { appIconLg } from "@/lib/app-icon-class";
import { APP_DISPLAY_NAME } from "@/constants/brand";

const feat = appIconLg;

// --- Mock Data ---
const features = [
  {
    icon: <FileSearch className={feat()} />,
    title: "AI Resume Matching",
    desc: "Our AI analyzes your resume and matches you with the most relevant internships automatically.",
  },
  {
    icon: <Route className={feat()} />,
    title: "Skill Tracking",
    desc: "Evaluate your skills, track progress, and follow personalized improvement roadmaps.",
  },
  {
    icon: <RadioReceiver className={feat()} />,
    title: "Real-Time Updates",
    desc: "Get instant notifications on application status changes and recruiter responses.",
  },
];

const stats = [
  { value: "10,000+", label: "Active Internships" },
  { value: "50,000+", label: "Students Placed" },
  { value: "2,000+", label: "Top Companies" },
  { value: "95%", label: "Satisfaction Rate" },
];

const testimonials = [
  {
    name: "Priya M.",
    role: "SDE Intern at Google",
    quote: `${APP_DISPLAY_NAME} matched me with my dream internship in just 2 weeks. The AI resume analysis was spot on!`,
  },
  {
    name: "Rahul K.",
    role: "Data Science Intern",
    quote:
      "The skill tracking feature helped me identify gaps and improve before applying. Highly recommended!",
  },
  {
    name: "Anita S.",
    role: "Recruiter at TechCorp",
    quote:
      "We reduced our screening time by 60% with the AI match scoring. Best hiring tool we've used.",
  },
  {
    name: "John D.",
    role: "Product Intern at Uber",
    quote:
      "The platform is incredibly intuitive. I found an internship that matched my exact skill set.",
  },
  {
    name: "Sarah L.",
    role: "UX Designer",
    quote:
      "I love the clean interface and how easy it is to track my applications.",
  },
];

const trendingCards = [
  {
    id: 1,
    title: "Placement Courses with AI",
    desc: "Get placed at Amazon, Flipkart, Samsung and 200+ companies.",
    type: "gradient",
  },
  {
    id: 2,
    title: "GenZ Career Masterclass",
    desc: "Attend, Get Assessed, Get Certified.",
    type: "white",
  },
  {
    id: 3,
    title: "Special College Offer",
    desc: "Flat 80% OFF on all online trainings.",
    type: "gradient-reverse",
  },
  {
    id: 4,
    title: "Full Stack Development",
    desc: "Master React, Node, and AI integration.",
    type: "white",
  },
  {
    id: 5,
    title: "Data Science Bootcamp",
    desc: "Learn Python, ML, and Analytics.",
    type: "white",
  },
];

const companies = [
  { id: 1, src: "/images/company1.png", alt: "Company 1" },
  { id: 2, src: "/images/company2.png", alt: "Company 2" },
  { id: 3, src: "/images/company3.png", alt: "Company 3" },
  { id: 4, src: "/images/company4.png", alt: "Company 4" },
  { id: 5, src: "/images/company5.png", alt: "Company 5" },
];

const Index = () => {
  // --- Refs ---
  const companyRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // --- State for Pausing ---
  const [isTrendingPaused, setIsTrendingPaused] = useState(false);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  // --- Smooth Scroll Hook ---
  const useSmoothScroll = (
    ref: React.RefObject<HTMLDivElement>,
    isPaused: boolean,
    speed: number = 1,
  ) => {
    useEffect(() => {
      let animationFrameId: number;

      const animate = () => {
        if (ref.current && !isPaused) {
          const container = ref.current;
          container.scrollLeft += speed;

          // INFINITE LOOP LOGIC
          if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
          }
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, ref, speed]);
  };

  // Apply Scroll Logic
  useSmoothScroll(companyRef, false, 0.6); // Companies (No pause needed)
  useSmoothScroll(trendingRef, isTrendingPaused, 0.8);
  useSmoothScroll(testimonialRef, isTestimonialPaused, 0.5);

  // Manual Button Scroll Handler
  const handleManualScroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.15),_transparent_50%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.15),_transparent_50%)]">
      {/* Utility Style to ensure no-scrollbar works cross-browser */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Telescope className="h-4 w-4 stroke-[1.65]" />
                AI-powered career platform
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Launch Your Career with
                <span className="gradient-text">
                  {" "}
                  Smart Internship Matching
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover internships, improve your skills, track applications
                and get hired faster — all in one intelligent platform.
              </p>
              <div className="flex gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="gradient-primary text-primary-foreground border-0 px-8"
                  >
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
                <img
                  src="images/hero-1.png"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HIRING COMPANIES STRIP (UPDATED) --- */}
      <section className="border-y border-border/60 bg-card py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 font-semibold mb-8">
            <span className="font-display text-3xl font-bold text-primary">10K+</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wide">
              Openings Daily
            </span>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-card to-transparent" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-card to-transparent" />

            <div
              ref={companyRef}
              // UPDATED: Used 'overflow-hidden' instead of 'overflow-x-auto'.
              // This completely kills the scrollbar but keeps JS scrolling active.
              className="flex items-center gap-16 overflow-hidden whitespace-nowrap"
            >
              {[...companies, ...companies].map((company, index) => (
                <img
                  key={`${company.id}-${index}`}
                  src={company.src}
                  className="h-10 hover:scale-110 transition-transform duration-300 cursor-pointer object-contain"
                  alt={company.alt}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Why {APP_DISPLAY_NAME}?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powered by AI to make internship discovery, application, and
              hiring smarter and faster.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-6 hover-lift text-center"
              >
                <div className="inline-flex p-3 rounded-xl gradient-primary text-primary-foreground mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
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
                <p className="text-3xl sm:text-4xl font-bold gradient-text">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRENDING NOW SECTION --- */}
      <section
        className="py-20 bg-muted/30 overflow-hidden"
        onMouseEnter={() => setIsTrendingPaused(true)}
        onMouseLeave={() => setIsTrendingPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-12">
            <h2 className="flex items-center gap-2 text-3xl font-bold">
              Trending now
              <Flame className="h-8 w-8 stroke-[1.5] text-primary" aria-hidden />
            </h2>

            {/* Manual Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleManualScroll(trendingRef, "left")}
                className="rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleManualScroll(trendingRef, "right")}
                className="rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

            <div
              ref={trendingRef}
              className="flex gap-6 overflow-x-auto pb-8 no-scrollbar"
              style={{ scrollBehavior: isTrendingPaused ? "smooth" : "auto" }}
            >
              {[...trendingCards, ...trendingCards].map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className={`min-w-[360px] flex-shrink-0 rounded-2xl p-6 shadow-xl transition duration-300 hover:scale-[1.02] ${
                    card.type === "gradient"
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : card.type === "gradient-reverse"
                        ? "bg-gradient-to-br from-accent to-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground shadow-card"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p
                    className={`text-sm mb-4 ${card.type === "white" ? "text-muted-foreground" : "opacity-90"}`}
                  >
                    {card.desc}
                  </p>
                  <Button
                    variant={card.type === "white" ? "default" : "secondary"}
                  >
                    {card.type === "white" ? "Register Now" : "Know More"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section
        className="py-20 overflow-hidden"
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => setIsTestimonialPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Students & Recruiters
          </h2>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
              ref={testimonialRef}
              className="flex gap-6 overflow-x-auto pb-8 no-scrollbar"
              style={{
                scrollBehavior: isTestimonialPaused ? "smooth" : "auto",
              }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={i}
                  className="min-w-[320px] flex-shrink-0 glass-card rounded-xl p-6 hover-lift"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-chart-4 text-chart-4"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
