// Reusable left/right branding panel

import { Compass } from "lucide-react";

interface AuthBrandPanelProps {
  title: string;
  description: string;
}

const AuthBrandPanel = ({ title, description }: AuthBrandPanelProps) => {
  return (
    <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-10">
      <div className="text-center text-primary-foreground max-w-md">
        <Compass className="mx-auto mb-6 h-16 w-16 stroke-[1.35] opacity-90" />
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-primary-foreground/80">{description}</p>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
