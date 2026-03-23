interface ApplicantMatchStatsProps {
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
}

const ApplicantMatchStats = ({
  skillMatch,
  experienceMatch,
  educationMatch,
}: ApplicantMatchStatsProps) => {
  const stats = [
    { label: "Skill Match", value: skillMatch },
    { label: "Experience", value: experienceMatch },
    { label: "Education", value: educationMatch },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 text-xs">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-muted rounded p-2 text-center">
          <p className="text-muted-foreground">{stat.label}</p>
          <p className="font-bold text-foreground">{stat.value}%</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicantMatchStats;
