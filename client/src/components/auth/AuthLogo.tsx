import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { appIconMd } from "@/lib/app-icon-class";
import { APP_DISPLAY_NAME } from "@/constants/brand";

const AuthLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 mb-8">
      <div className="p-1.5 rounded-lg gradient-primary">
        <Compass className={`${appIconMd()} text-primary-foreground`} />
      </div>
      <span className="font-bold text-lg text-foreground">{APP_DISPLAY_NAME}</span>
    </Link>
  );
};

export default AuthLogo;
