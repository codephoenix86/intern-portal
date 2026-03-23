import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SKILL_DEMAND_DATA } from "@/constants/student.constants";

const SkillDemandChart = () => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">
        Top Skills in Demand
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={SKILL_DEMAND_DATA}>
          <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="hsl(217, 71%, 53%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillDemandChart;
