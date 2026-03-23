import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const AuthLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 mb-8">
      <div className="p-1.5 rounded-lg gradient-primary">
        <GraduationCap className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-bold text-lg text-foreground">InternPortal</span>
    </Link>
  );
};

export default AuthLogo;
