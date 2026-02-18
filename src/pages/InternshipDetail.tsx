import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { internships } from "@/data/mockData";
import { MapPin, Clock, Users, Building2, ArrowLeft, CheckCircle } from "lucide-react";

const InternshipDetail = () => {
  const { id } = useParams();
  const internship = internships.find(i => i.id === id);

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-muted-foreground">Internship not found.</p>
          <Link to="/internships"><Button variant="outline" className="mt-4">Back to Listings</Button></Link>
        </div>
      </div>
    );
  }

  const similar = internships.filter(i => i.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/internships" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{internship.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {internship.company}
              </div>
            </div>
            <MatchScoreBadge score={internship.matchScore} size="lg" />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{internship.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{internship.duration}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{internship.applicants} applicants</span>
            <span className="font-semibold text-foreground">{internship.stipend}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {internship.skills.map(s => <SkillTag key={s} skill={s} />)}
          </div>

          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground mb-6">{internship.description}</p>

          <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
          <ul className="space-y-1.5 mb-6">
            {internship.requirements.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> {r}
              </li>
            ))}
          </ul>

          <Button size="lg" className="gradient-primary text-primary-foreground border-0">Apply Now</Button>
        </div>

        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Similar Internships</h2>
            <div className="grid gap-4">
              {similar.map(i => <InternshipCard key={i.id} {...i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;
