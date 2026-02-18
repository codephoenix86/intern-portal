import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, Chrome, Briefcase } from "lucide-react";

const Register = () => {
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-10">
        <div className="text-center text-primary-foreground max-w-md">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Join InternPortal</h2>
          <p className="text-primary-foreground/80">Whether you're seeking an internship or hiring talent, we've got you covered.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-1.5 rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">InternPortal</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-1">Create an account</h1>
          <p className="text-muted-foreground mb-6">Select your role to get started</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole("student")}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                role === "student" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <GraduationCap className={`h-6 w-6 mx-auto mb-1.5 ${role === "student" ? "text-primary" : "text-muted-foreground"}`} />
              <p className={`text-sm font-medium ${role === "student" ? "text-primary" : "text-foreground"}`}>Student</p>
              <p className="text-xs text-muted-foreground">Find internships</p>
            </button>
            <button
              onClick={() => setRole("recruiter")}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                role === "recruiter" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <Briefcase className={`h-6 w-6 mx-auto mb-1.5 ${role === "recruiter" ? "text-primary" : "text-muted-foreground"}`} />
              <p className={`text-sm font-medium ${role === "recruiter" ? "text-primary" : "text-foreground"}`}>Recruiter</p>
              <p className="text-xs text-muted-foreground">Hire talent</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" className="pl-10" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@email.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
              Create {role === "student" ? "Student" : "Recruiter"} Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or continue with</span></div>
          </div>

          <Button variant="outline" className="w-full">
            <Chrome className="h-4 w-4 mr-2" /> Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
