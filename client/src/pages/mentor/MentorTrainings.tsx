// client/src/pages/mentor/MentorTrainings.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrainingCard from "@/components/mentor/TrainingCard";
import { MOCK_TRAININGS } from "@/constants/mentor.constant";

const MentorTrainings = () => {
  const [search, setSearch] = useState("");

  const filtered = MOCK_TRAININGS.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Search trainings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />
        <Button className="gradient-primary text-primary-foreground border-0">
          + Create Training
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <TrainingCard key={t.id} training={t} />
        ))}
      </div>
    </div>
  );
};

export default MentorTrainings;
