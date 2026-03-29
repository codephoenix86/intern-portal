import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ApplicationStatusPoint {
  name: string;
  value: number;
  color: string;
}

interface ApplicationStatusChartProps {
  data: ApplicationStatusPoint[];
}

const ApplicationStatusChart = ({ data }: ApplicationStatusChartProps) => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Application Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationStatusChart;
