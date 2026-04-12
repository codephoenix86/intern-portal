import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { hashPassword } from "../utils/hash.utils.js";
// ── Models ──
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Course } from "../models/course.model.js";
import { LiveSession } from "../models/live-session.model.js";
import { Application } from "../models/application.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Notification } from "../models/notification.model.js";
import { Connection } from "../models/connection.model.js";
/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
};
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const futureDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d;
};
const pastDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
};
const dateStr = (d) => d.toISOString().split("T")[0];
const timeStr = () => `${String(randInt(9, 20)).padStart(2, "0")}:00`;
/* ═══════════════════════════════════════════════════════
   REALISTIC DATA POOLS
   ═══════════════════════════════════════════════════════ */
const FIRST_NAMES = [
    "Aarav",
    "Vivaan",
    "Aditya",
    "Vihaan",
    "Arjun",
    "Sai",
    "Reyansh",
    "Ayaan",
    "Krishna",
    "Ishaan",
    "Rohan",
    "Karan",
    "Rahul",
    "Nikhil",
    "Ananya",
    "Diya",
    "Myra",
    "Sara",
    "Aanya",
    "Aadhya",
    "Priya",
    "Neha",
    "Shruti",
    "Kavya",
    "Riya",
    "Pooja",
    "Meera",
    "Tanvi",
    "Amit",
    "Raj",
    "Vikram",
    "Suresh",
    "Deepak",
    "Manish",
    "Pranav",
    "Siddharth",
    "Harsh",
    "Gaurav",
    "Akash",
    "Naveen",
];
const LAST_NAMES = [
    "Sharma",
    "Verma",
    "Patel",
    "Gupta",
    "Singh",
    "Kumar",
    "Reddy",
    "Nair",
    "Joshi",
    "Mehta",
    "Agarwal",
    "Mishra",
    "Chauhan",
    "Yadav",
    "Das",
    "Lohar",
    "Pandey",
    "Saxena",
    "Chopra",
    "Malhotra",
    "Banerjee",
    "Mukherjee",
    "Roy",
    "Iyer",
    "Menon",
];
const COLLEGES = [
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIIT Hyderabad",
    "IIIT Sonepat",
    "BITS Pilani",
    "NIT Trichy",
    "NIT Warangal",
    "NIT Surathkal",
    "DTU Delhi",
    "NSUT Delhi",
    "VIT Vellore",
    "SRM Chennai",
    "MNNIT Allahabad",
    "IIIT Bangalore",
    "PEC Chandigarh",
    "Jadavpur University",
    "College of Engineering Pune",
];
const BRANCHES = [
    "Computer Science",
    "CSE",
    "Information Technology",
    "ECE",
    "Electrical Engineering",
    "Mechanical Engineering",
    "AI & ML",
    "Data Science",
    "Software Engineering",
    "Cyber Security",
];
const LOCATIONS = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Chandigarh",
    "Noida",
    "Gurugram",
    "Indore",
    "Bhopal",
    "Kochi",
];
const STUDENT_SKILLS_POOL = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
    "React",
    "React.js",
    "Next.js",
    "Angular",
    "Vue.js",
    "Svelte",
    "Node.js",
    "Express.js",
    "Fastify",
    "NestJS",
    "Django",
    "Flask",
    "Spring Boot",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Elasticsearch",
    "Docker",
    "Kubernetes",
    "AWS",
    "AWS EC2",
    "AWS S3",
    "GCP",
    "Azure",
    "Git",
    "GitHub Actions",
    "CI/CD",
    "Jenkins",
    "Terraform",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "SASS",
    "Bootstrap",
    "REST API",
    "GraphQL",
    "gRPC",
    "WebSocket",
    "Jest",
    "Mocha",
    "Supertest",
    "Cypress",
    "Selenium",
    "Linux",
    "Shell Scripting",
    "Nginx",
    "Apache Kafka",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "Data Analysis",
    "Figma",
    "Adobe XD",
];
const STUDENT_PROJECTS_POOL = [
    "E-commerce platform with React and Node.js",
    "Real-time chat application using WebSocket",
    "Task management app with drag-and-drop",
    "Weather forecasting dashboard with API integration",
    "Blog platform with markdown support",
    "URL shortener microservice",
    "Social media analytics dashboard",
    "Food delivery app UI clone",
    "Video streaming platform prototype",
    "AI-powered resume parser",
    "Personal portfolio website",
    "Expense tracker with charts and reports",
    "Online code editor with live preview",
    "Inventory management system",
    "Student attendance system with QR codes",
    "Cryptocurrency price tracker",
    "Recipe finder app with API integration",
    "Fitness tracking mobile app",
    "News aggregator with sentiment analysis",
    "Multi-tenant SaaS boilerplate",
];
const ACHIEVEMENTS_POOL = [
    "Google Summer of Code 2024 participant",
    "Won Smart India Hackathon 2024",
    "Top 100 in ICPC regionals",
    "Published research paper on ML at IEEE conference",
    "6-star on CodeChef (2400+ rating)",
    "LeetCode Knight (2000+ rating)",
    "Codeforces Expert (1600+ rating)",
    "Won college-level hackathon 3 times",
    "Contributed to open-source project with 1000+ stars",
    "Completed AWS Solutions Architect certification",
    "Microsoft Azure Fundamentals certified",
    "Selected for MLH Fellowship",
    "Tech lead for college fest website",
    "Open source contributor to React.js",
    "Speaker at local tech meetup",
];
const BIOS_STUDENT = [
    "Aspiring Backend and DevOps Engineer",
    "Full-stack developer passionate about building scalable applications",
    "Machine Learning enthusiast with a love for data",
    "Frontend developer focused on creating beautiful user experiences",
    "Competitive programmer and problem solver",
    "Cloud-native developer interested in microservices",
    "Open source contributor and tech community builder",
    "Mobile app developer with React Native experience",
    "Systems programmer interested in low-level optimization",
    "Passionate about AI/ML and its real-world applications",
];
const EXPERIENCE_SUMMARIES = [
    "Built a full production-grade chat API and solved 700+ DSA problems",
    "Interned at a startup building their core payment microservice",
    "6 months experience as a frontend developer at a SaaS company",
    "Contributed to 5+ open source projects on GitHub",
    "Led a team of 4 for college final year project",
    "Freelanced building websites for local businesses",
    "Research assistant in NLP lab for 8 months",
    "Built and deployed 3 full-stack projects used by 500+ users",
    "Worked on data pipeline optimization at a mid-size company",
    "Teaching assistant for Data Structures course",
];
const COMPANIES = [
    "TechNova Solutions",
    "CloudBridge Inc.",
    "DataVerse Analytics",
    "InnoStack Technologies",
    "ByteCraft Labs",
    "QuantumLeap AI",
    "NexGen Software",
    "CodeCraft Solutions",
    "PixelPerfect Design",
    "GreenTech Innovations",
    "CyberShield Security",
    "AgileMind Consulting",
    "Fintech Pro",
    "HealthTech India",
    "EduSpark",
    "RapidGrow Startup",
    "SkyHigh Cloud",
    "SmartOps Tech",
    "DevForge Solutions",
    "InfoBridge Systems",
];
const COMPANY_EMAILS_DOMAINS = [
    "technova.io",
    "cloudbridge.com",
    "dataverse.in",
    "innostack.tech",
    "bytecraft.dev",
    "quantumleap.ai",
    "nexgen.software",
    "codecraft.in",
    "pixelperfect.design",
    "greentech.in",
    "cybershield.io",
    "agilemind.co",
    "fintechpro.in",
    "healthtech.co.in",
    "eduspark.io",
    "rapidgrow.in",
    "skyhigh.cloud",
    "smartops.tech",
    "devforge.io",
    "infobridge.in",
];
const JOB_TITLES = [
    "Frontend Developer Intern",
    "Backend Developer Intern",
    "Full Stack Developer Intern",
    "Machine Learning Intern",
    "Data Science Intern",
    "DevOps Engineer Intern",
    "Mobile App Developer Intern",
    "UI/UX Design Intern",
    "Cloud Engineering Intern",
    "QA & Testing Intern",
    "Cyber Security Intern",
    "Product Management Intern",
    "Technical Content Writer Intern",
    "React Developer Intern",
    "Python Developer Intern",
    "Java Developer Intern",
    "Data Analyst Intern",
    "Software Engineer Intern",
    "AI Research Intern",
    "Blockchain Developer Intern",
];
const JOB_DESCRIPTIONS = [
    "Join our dynamic team to work on cutting-edge web applications. You'll collaborate with senior engineers, participate in code reviews, and ship features to production.",
    "We're looking for a passionate intern to help build and maintain our cloud infrastructure. Experience with Docker, Kubernetes, or AWS is a plus.",
    "Work on our machine learning pipeline to improve recommendation algorithms. Strong Python and statistics background required.",
    "Help us design and develop beautiful, responsive user interfaces using React and Tailwind CSS. Attention to detail is key.",
    "Join our backend team to develop RESTful APIs and microservices using Node.js and PostgreSQL. Performance optimization experience is a bonus.",
    "Assist in developing and testing mobile applications using React Native. Cross-platform experience preferred.",
    "Work with our data team to analyze large datasets and create insightful dashboards and reports.",
    "Help automate our CI/CD pipeline and improve deployment processes. Experience with GitHub Actions or Jenkins preferred.",
    "Contribute to our open-source projects and help maintain developer documentation.",
    "Work on security audits and help implement best practices for application security.",
];
const JOB_REQUIREMENTS = [
    "Currently pursuing B.Tech/B.E. in CS/IT or related field",
    "Strong understanding of data structures and algorithms",
    "Familiarity with Git and version control",
    "Good communication skills",
    "Ability to work in a team environment",
    "Self-motivated and eager to learn",
    "Available for at least 3 months",
    "Portfolio or GitHub profile preferred",
    "Knowledge of agile development practices",
    "Strong analytical and problem-solving skills",
];
const MENTOR_EXPERTISE_POOL = [
    "Web Development",
    "React.js",
    "Node.js",
    "Python",
    "Machine Learning",
    "Data Structures",
    "Algorithms",
    "System Design",
    "Cloud Computing",
    "DevOps",
    "Docker",
    "Kubernetes",
    "AWS",
    "Database Design",
    "SQL",
    "MongoDB",
    "TypeScript",
    "Java",
    "Spring Boot",
    "Android Development",
    "iOS Development",
    "Flutter",
    "Competitive Programming",
    "DSA",
    "Data Science",
    "NLP",
    "Computer Vision",
    "Cybersecurity",
    "Blockchain",
    "Product Management",
    "UI/UX Design",
    "Career Guidance",
    "Interview Preparation",
    "Resume Building",
];
const MENTOR_BIOS = [
    "Senior Software Engineer at Google with 8+ years of experience. Passionate about mentoring the next generation of developers.",
    "Ex-Amazon SDE-2, now full-time mentor and content creator. Helped 500+ students crack product-based company interviews.",
    "Full-stack developer turned educator. Building courses on modern web development. IIT Delhi alumni.",
    "ML researcher and mentor. Published 10+ papers in top conferences. Love simplifying complex AI concepts.",
    "DevOps specialist with experience at Netflix. Teaching cloud infrastructure and deployment best practices.",
    "Competitive programming coach. 3x ICPC regionalist. Guardian on Codeforces.",
    "Data scientist at Microsoft. Mentoring students in data analysis, visualization, and ML fundamentals.",
    "Startup founder and CTO. Helping students build real-world projects and understand startup culture.",
    "Cybersecurity expert with 6+ years in the field. OSCP certified. Teaching ethical hacking and security.",
    "Mobile development specialist. Built apps with 1M+ downloads. Mentoring on React Native and Flutter.",
];
const COURSE_TITLES = [
    "Complete React.js Masterclass 2025",
    "Node.js Backend Development from Scratch",
    "Data Structures & Algorithms in JavaScript",
    "Machine Learning with Python - Beginner to Advanced",
    "System Design for Interviews",
    "Full Stack MERN Project: Build an E-commerce App",
    "Docker & Kubernetes: DevOps Essentials",
    "AWS Cloud Practitioner Crash Course",
    "TypeScript Complete Guide",
    "MongoDB Masterclass: Schema Design & Optimization",
    "Python for Data Science",
    "Advanced CSS & Tailwind CSS",
    "GraphQL with Apollo: Complete Guide",
    "Competitive Programming Bootcamp",
    "Interview Preparation: Coding + System Design",
];
const COURSE_CATEGORIES = [
    "Web Development",
    "Backend Development",
    "Data Structures",
    "Machine Learning",
    "System Design",
    "Full Stack",
    "DevOps",
    "Cloud Computing",
    "Programming Languages",
    "Database",
    "Data Science",
    "Frontend",
    "API Development",
    "Competitive Programming",
    "Interview Prep",
];
const SESSION_TOPICS = [
    "Introduction to React Hooks and State Management",
    "Building REST APIs with Express.js",
    "Dynamic Programming Patterns Explained",
    "System Design: Design a URL Shortener",
    "Docker Containerization Workshop",
    "AWS Lambda & Serverless Architecture",
    "Git & GitHub Best Practices",
    "How to Crack FAANG Interviews",
    "Introduction to Machine Learning",
    "Database Indexing and Query Optimization",
    "Resume Review and Career Guidance Session",
    "Live Coding: Build a Real-time Chat App",
    "Understanding OAuth 2.0 and JWT",
    "Microservices Architecture Deep Dive",
    "Kubernetes 101: Getting Started",
    "Mock Interview: Data Structures Round",
    "Web Security Fundamentals",
    "Introduction to GraphQL",
    "Python for Automation",
    "Open Source Contribution Workshop",
];
/* ═══════════════════════════════════════════════════════
   MAIN SEED FUNCTION
   ═══════════════════════════════════════════════════════ */
async function seed() {
    console.log("\n🌱 Starting database seed...\n");
    // ── Connect ──
    if (!ENV.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not set");
        process.exit(1);
    }
    await mongoose.connect(ENV.MONGODB_URI, { dbName: "internportal" });
    console.log("✅ Connected to MongoDB\n");
    // ── Clear existing data ──
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
        User.deleteMany({}),
        Job.deleteMany({}),
        Course.deleteMany({}),
        LiveSession.deleteMany({}),
        Application.deleteMany({}),
        Enrollment.deleteMany({}),
        Notification.deleteMany({}),
        Connection.deleteMany({}),
    ]);
    console.log("✅ All collections cleared\n");
    const hashedPassword = await hashPassword("Password@123");
    /* ────────────────────── 1. STUDENTS (20) ────────────────────── */
    console.log("👨‍🎓 Creating students...");
    const studentDocs = [];
    for (let i = 0; i < 20; i++) {
        const firstName = pick(FIRST_NAMES);
        const lastName = pick(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const skills = pickN(STUDENT_SKILLS_POOL, randInt(4, 15));
        const projects = pickN(STUDENT_PROJECTS_POOL, randInt(1, 5));
        const achievements = pickN(ACHIEVEMENTS_POOL, randInt(0, 4));
        studentDocs.push({
            name,
            email: `student${i + 1}@internportal.com`,
            password: hashedPassword,
            role: "student",
            provider: "local",
            avatar: null,
            phone: `+91${randInt(7000000000, 9999999999)}`,
            college: pick(COLLEGES),
            branch: pick(BRANCHES),
            location: pick(LOCATIONS),
            cgpa: `${(Math.random() * 2 + 7).toFixed(1)}`,
            semester: `${randInt(4, 8)}th`,
            bio: pick(BIOS_STUDENT),
            experienceSummary: pick(EXPERIENCE_SUMMARIES),
            studentSkills: skills,
            studentProjects: projects,
            achievements,
            targetJobRole: pick(JOB_TITLES).replace(" Intern", ""),
            targetSalary: randInt(5, 25) * 100000,
            targetCompanies: pickN(COMPANIES, randInt(2, 5)),
            codingProfiles: {
                leetcode: `https://leetcode.com/${firstName.toLowerCase()}${randInt(1, 999)}`,
                codechef: Math.random() > 0.5
                    ? `https://codechef.com/users/${firstName.toLowerCase()}`
                    : null,
                codeforces: Math.random() > 0.5
                    ? `https://codeforces.com/profile/${firstName.toLowerCase()}`
                    : null,
                github: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
                linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
                portfolio: Math.random() > 0.6 ? `https://${firstName.toLowerCase()}.dev` : null,
            },
            resumeUrl: null,
            parsedResume: null,
            profileViews: randInt(0, 200),
            roadmapTasks: [],
            roadmapInterests: pickN(["Web Development", "ML", "DevOps", "Mobile", "Data Science", "Cloud"], randInt(1, 3)),
            profileCompletion: randInt(40, 95),
            isVerified: true,
            isActive: true,
            lastLoginAt: pastDate(randInt(0, 14)),
        });
    }
    const students = await User.insertMany(studentDocs);
    console.log(`   ✅ Created ${students.length} students`);
    /* ────────────────────── 2. RECRUITERS (10) ────────────────────── */
    console.log("🏢 Creating recruiters...");
    const recruiterDocs = [];
    for (let i = 0; i < 10; i++) {
        const firstName = pick(FIRST_NAMES);
        const lastName = pick(LAST_NAMES);
        const companyIndex = i % COMPANIES.length;
        const company = COMPANIES[companyIndex];
        const domain = COMPANY_EMAILS_DOMAINS[companyIndex];
        recruiterDocs.push({
            name: `${firstName} ${lastName}`,
            email: `recruiter${i + 1}@internportal.com`,
            password: hashedPassword,
            role: "recruiter",
            provider: "local",
            avatar: null,
            companyName: company,
            companyEmail: `hr@${domain}`,
            location: pick(LOCATIONS),
            bio: `Talent Acquisition at ${company}. Looking for passionate interns to join our growing team. We offer mentorship, real-world projects, and full-time conversion opportunities.`,
            profileCompletion: randInt(60, 100),
            isVerified: true,
            isActive: true,
            lastLoginAt: pastDate(randInt(0, 7)),
        });
    }
    const recruiters = await User.insertMany(recruiterDocs);
    console.log(`   ✅ Created ${recruiters.length} recruiters`);
    /* ────────────────────── 3. MENTORS (8) ────────────────────── */
    console.log("👩‍🏫 Creating mentors...");
    const mentorDocs = [];
    for (let i = 0; i < 8; i++) {
        const firstName = pick(FIRST_NAMES);
        const lastName = pick(LAST_NAMES);
        mentorDocs.push({
            name: `${firstName} ${lastName}`,
            email: `mentor${i + 1}@internportal.com`,
            password: hashedPassword,
            role: "mentor",
            provider: "local",
            avatar: null,
            expertise: pickN(MENTOR_EXPERTISE_POOL, randInt(4, 10)),
            bio: MENTOR_BIOS[i % MENTOR_BIOS.length],
            location: pick(LOCATIONS),
            profileCompletion: randInt(70, 100),
            isVerified: true,
            isActive: true,
            lastLoginAt: pastDate(randInt(0, 5)),
        });
    }
    const mentors = await User.insertMany(mentorDocs);
    console.log(`   ✅ Created ${mentors.length} mentors`);
    /* ────────────────────── 4. JOBS (25) ────────────────────── */
    console.log("💼 Creating jobs...");
    const jobDocs = [];
    for (let i = 0; i < 25; i++) {
        const recruiter = pick(recruiters);
        const skillCount = randInt(3, 7);
        jobDocs.push({
            recruiterId: recruiter._id,
            title: JOB_TITLES[i % JOB_TITLES.length],
            company: recruiter.companyName ?? pick(COMPANIES),
            location: recruiter.location ?? pick(LOCATIONS),
            workType: pick(["Remote", "Hybrid", "On-site"]),
            duration: `${randInt(2, 6)} months`,
            stipend: `₹${randInt(5, 40) * 1000}/month`,
            skills: pickN(STUDENT_SKILLS_POOL, skillCount),
            description: JOB_DESCRIPTIONS[i % JOB_DESCRIPTIONS.length],
            requirements: pickN(JOB_REQUIREMENTS, randInt(3, 6)),
            isActive: i < 20, // 5 inactive/closed jobs
        });
    }
    const jobs = await Job.insertMany(jobDocs);
    console.log(`   ✅ Created ${jobs.length} jobs`);
    /* ────────────────────── 5. COURSES (12) ────────────────────── */
    console.log("📚 Creating courses...");
    const courses = [];
    for (let i = 0; i < 12; i++) {
        const mentor = mentors[i % mentors.length];
        const isFree = Math.random() > 0.6;
        const amount = isFree ? 0 : randInt(2, 20) * 100;
        const discountPercent = isFree
            ? 0
            : Math.random() > 0.5
                ? randInt(10, 40)
                : 0;
        const modules = Array.from({ length: randInt(3, 8) }, (_, mi) => ({
            title: `Module ${mi + 1}: ${pick([
                "Introduction",
                "Fundamentals",
                "Advanced Concepts",
                "Hands-on Practice",
                "Project",
                "Assessment",
                "Deep Dive",
                "Best Practices",
            ])}`,
            description: "Comprehensive module covering key concepts with practical examples.",
            contentUrl: null,
            contentType: pick(["video", "pdf", "notes"]),
            duration: `${randInt(20, 90)} min`,
            order: mi,
            isFree: mi === 0,
        }));
        // Use .create() one at a time so pre("save") runs and generates slug
        const course = await Course.create({
            mentorId: mentor._id,
            title: COURSE_TITLES[i % COURSE_TITLES.length],
            description: `A comprehensive course covering all essential topics. Perfect for students looking to master the subject. Taught by an industry expert with years of real-world experience. Includes hands-on projects and assignments.`,
            shortDescription: `Master ${COURSE_TITLES[i % COURSE_TITLES.length].split(":")[0]} with hands-on projects`,
            level: pick(["Beginner", "Intermediate", "Advanced"]),
            duration: `${randInt(4, 12)} Weeks`,
            skills: pickN(STUDENT_SKILLS_POOL, randInt(3, 8)),
            category: COURSE_CATEGORIES[i % COURSE_CATEGORIES.length],
            modules,
            thumbnailUrl: null,
            previewVideoUrl: null,
            pricing: {
                amount,
                currency: "INR",
                discountPercent,
                discountedAmount: Math.round(amount * (1 - discountPercent / 100)),
            },
            isPublished: i < 10,
            publishedAt: i < 10 ? pastDate(randInt(5, 60)) : null,
            enrollmentCount: randInt(10, 300),
            completionCount: randInt(2, 50),
            averageRating: +(Math.random() * 1.5 + 3.5).toFixed(1),
            totalRatings: randInt(5, 100),
        });
        courses.push(course);
    }
    console.log(`   ✅ Created ${courses.length} courses`);
    /* ────────────────────── 6. LIVE SESSIONS (20) ────────────────────── */
    console.log("📹 Creating live sessions...");
    const sessionDocs = [];
    for (let i = 0; i < 20; i++) {
        const mentor = pick(mentors);
        const isUpcoming = i < 12; // 12 upcoming, 8 completed
        const sessionDate = isUpcoming
            ? futureDate(randInt(1, 30))
            : pastDate(randInt(1, 30));
        const time = timeStr();
        sessionDocs.push({
            mentorId: mentor._id,
            courseId: Math.random() > 0.5 ? pick(courses)._id : null,
            topic: SESSION_TOPICS[i % SESSION_TOPICS.length],
            description: `Join this interactive session on ${SESSION_TOPICS[i % SESSION_TOPICS.length]}. Q&A included at the end.`,
            date: dateStr(sessionDate),
            time,
            scheduledAt: new Date(`${dateStr(sessionDate)}T${time}:00`),
            duration: pick([45, 60, 90, 120]),
            type: pick(["free_demo", "paid_class"]),
            link: `https://meet.internportal.com/session-${i + 1}`,
            accessCode: Math.random() > 0.5 ? `ACCESS${randInt(1000, 9999)}` : null,
            maxAttendees: pick([50, 100, 200, 500]),
            attendeeCount: randInt(5, 80),
            attendees: pickN(students, randInt(3, 10)).map((s) => s._id),
            status: isUpcoming ? "scheduled" : "completed",
            isCompleted: !isUpcoming,
            completedAt: isUpcoming ? null : sessionDate,
        });
    }
    const sessions = await LiveSession.insertMany(sessionDocs);
    console.log(`   ✅ Created ${sessions.length} live sessions`);
    /* ────────────────────── 7. APPLICATIONS (60) ────────────────────── */
    console.log("📝 Creating applications...");
    const applicationDocs = [];
    const appliedPairs = new Set();
    const activeJobs = jobs.filter((j) => j.isActive);
    for (let i = 0; i < 60; i++) {
        const student = pick(students);
        const job = pick(activeJobs);
        const key = `${student._id}-${job._id}`;
        if (appliedPairs.has(key))
            continue;
        appliedPairs.add(key);
        applicationDocs.push({
            studentId: student._id,
            jobId: job._id,
            status: pick([
                "Applied",
                "Screening",
                "Interview",
                "Offer",
                "Rejected",
            ]),
            matchScore: randInt(30, 95),
        });
    }
    const applications = await Application.insertMany(applicationDocs);
    console.log(`   ✅ Created ${applications.length} applications`);
    /* ────────────────────── 8. ENROLLMENTS (30) ────────────────────── */
    console.log("📖 Creating enrollments...");
    const enrollmentDocs = [];
    const enrolledPairs = new Set();
    const publishedCourses = courses.filter((c) => c.isPublished);
    for (let i = 0; i < 30; i++) {
        const student = pick(students);
        const course = pick(publishedCourses);
        const key = `${student._id}-${course._id}`;
        if (enrolledPairs.has(key))
            continue;
        enrolledPairs.add(key);
        const isCompleted = Math.random() > 0.7;
        const isFree = course.pricing.amount === 0;
        const moduleProgress = course.modules.map((mod, _idx) => ({
            moduleId: mod._id ?? new mongoose.Types.ObjectId(),
            completed: isCompleted || Math.random() > 0.5,
            completedAt: Math.random() > 0.5 ? pastDate(randInt(1, 30)) : null,
            timeSpent: randInt(10, 120),
        }));
        const completedModules = moduleProgress.filter((m) => m.completed).length;
        const progress = course.modules.length > 0
            ? Math.round((completedModules / course.modules.length) * 100)
            : 0;
        enrollmentDocs.push({
            studentId: student._id,
            courseId: course._id,
            mentorId: course.mentorId,
            progress,
            moduleProgress,
            lastAccessedAt: pastDate(randInt(0, 14)),
            status: isCompleted ? "completed" : "active",
            isCompleted,
            completedAt: isCompleted ? pastDate(randInt(1, 20)) : null,
            certificateIssued: isCompleted && Math.random() > 0.5,
            paymentStatus: isFree ? "free" : "paid",
            paymentAmount: isFree ? 0 : course.pricing.discountedAmount,
            enrolledAt: pastDate(randInt(10, 60)),
        });
    }
    const enrollments = await Enrollment.insertMany(enrollmentDocs);
    console.log(`   ✅ Created ${enrollments.length} enrollments`);
    /* ────────────────────── 9. CONNECTIONS (friends + follows) ────────────────────── */
    console.log("🤝 Creating connections...");
    const connectionDocs = [];
    const connectionPairs = new Set();
    // Friend connections between students (15 accepted, 5 pending)
    for (let i = 0; i < 20; i++) {
        const from = pick(students);
        const to = pick(students);
        if (from._id.equals(to._id))
            continue;
        const key1 = `friend-${from._id}-${to._id}`;
        const key2 = `friend-${to._id}-${from._id}`;
        if (connectionPairs.has(key1) || connectionPairs.has(key2))
            continue;
        connectionPairs.add(key1);
        connectionPairs.add(key2);
        connectionDocs.push({
            fromUser: from._id,
            toUser: to._id,
            type: "friend",
            status: i < 15 ? "accepted" : "pending",
        });
    }
    // Follow connections: students → recruiters (25)
    for (let i = 0; i < 25; i++) {
        const from = pick(students);
        const to = pick(recruiters);
        const key = `follow-${from._id}-${to._id}`;
        if (connectionPairs.has(key))
            continue;
        connectionPairs.add(key);
        connectionDocs.push({
            fromUser: from._id,
            toUser: to._id,
            type: "follow",
            status: "accepted",
        });
    }
    // Follow connections: students → mentors (20)
    for (let i = 0; i < 20; i++) {
        const from = pick(students);
        const to = pick(mentors);
        const key = `follow-${from._id}-${to._id}`;
        if (connectionPairs.has(key))
            continue;
        connectionPairs.add(key);
        connectionDocs.push({
            fromUser: from._id,
            toUser: to._id,
            type: "follow",
            status: "accepted",
        });
    }
    const connections = await Connection.insertMany(connectionDocs);
    console.log(`   ✅ Created ${connections.length} connections`);
    /* ────────────────────── 10. NOTIFICATIONS (40) ────────────────────── */
    console.log("🔔 Creating notifications...");
    const notificationDocs = [];
    // Application notifications for students
    for (const app of applications.slice(0, 15)) {
        const statusMessages = {
            Applied: "Your application has been received",
            Screening: "Your application is being reviewed",
            Interview: "You have been shortlisted for an interview",
            Offer: "Congratulations! You received an offer",
            Rejected: "Your application was not selected this time",
        };
        notificationDocs.push({
            userId: app.studentId,
            title: "Application Update",
            message: statusMessages[app.status] ?? "Application status updated",
            type: "application_update",
            priority: app.status === "Offer" ? "high" : "medium",
            read: Math.random() > 0.5,
            readAt: Math.random() > 0.5 ? pastDate(randInt(0, 5)) : null,
            link: "/student/applications",
            actionLabel: "View Application",
        });
    }
    // New applicant notifications for recruiters
    for (const app of applications.slice(0, 10)) {
        const job = jobs.find((j) => j._id.equals(app.jobId));
        if (!job?.recruiterId)
            continue;
        notificationDocs.push({
            userId: job.recruiterId,
            title: "New Applicant",
            message: `New application received for ${job.title}`,
            type: "new_applicant",
            priority: "medium",
            read: Math.random() > 0.6,
            readAt: Math.random() > 0.6 ? pastDate(randInt(0, 3)) : null,
            link: "/recruiter/applicants",
            actionLabel: "View Applicant",
        });
    }
    // Session notifications for students
    for (const session of sessions.slice(0, 8)) {
        const attendee = pick(students);
        notificationDocs.push({
            userId: attendee._id,
            title: "Session Reminder",
            message: `Upcoming session: ${session.topic}`,
            type: "session_reminder",
            priority: "medium",
            read: false,
            link: "/student/sessions",
            actionLabel: "Join Session",
        });
    }
    // Friend request notifications
    const pendingFriendConns = connectionDocs.filter((c) => c.type === "friend" && c.status === "pending");
    for (const conn of pendingFriendConns) {
        notificationDocs.push({
            userId: conn.toUser,
            title: "Friend Request",
            message: "You have a new friend request",
            type: "general",
            priority: "medium",
            read: false,
            senderId: conn.fromUser,
        });
    }
    const notifications = await Notification.insertMany(notificationDocs);
    console.log(`   ✅ Created ${notifications.length} notifications`);
    /* ────────────────────── SUMMARY ────────────────────── */
    console.log("\n" + "═".repeat(50));
    console.log("🎉 Seed completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   👨‍🎓 Students:      ${students.length}`);
    console.log(`   🏢 Recruiters:    ${recruiters.length}`);
    console.log(`   👩‍🏫 Mentors:       ${mentors.length}`);
    console.log(`   💼 Jobs:          ${jobs.length}`);
    console.log(`   📚 Courses:       ${courses.length}`);
    console.log(`   📹 Sessions:      ${sessions.length}`);
    console.log(`   📝 Applications:  ${applications.length}`);
    console.log(`   📖 Enrollments:   ${enrollments.length}`);
    console.log(`   🤝 Connections:   ${connections.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log("");
    console.log("🔑 Login credentials (all users):");
    console.log("   Password: Password@123");
    console.log("");
    console.log("   Students:   student1@internportal.com  → student20@internportal.com");
    console.log("   Recruiters: recruiter1@internportal.com → recruiter10@internportal.com");
    console.log("   Mentors:    mentor1@internportal.com    → mentor8@internportal.com");
    console.log("═".repeat(50) + "\n");
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB\n");
}
/* ────────────────────── RUN ────────────────────── */
seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map