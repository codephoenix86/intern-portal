import {
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SkillDemandPoint {
  skill: string;
  count: number;
}

interface SkillDemandChartProps {
  data: SkillDemandPoint[];
}

const BAR_COLORS = [
  "hsl(217, 71%, 53%)",
  "hsl(162, 72%, 40%)",
  "hsl(35, 92%, 56%)",
  "hsl(275, 60%, 56%)",
  "hsl(0, 72%, 51%)",
  "hsl(196, 75%, 46%)",
];

const SkillDemandChart = ({ data }: SkillDemandChartProps) => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">
        Skills You Use Most
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="35%">
          <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar
            dataKey="count"
            barSize={20}
            radius={[4, 4, 0, 0]}
          >
            {data.map((item, index) => (
              <Cell
                key={`skill-${item.skill}-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillDemandChart;
