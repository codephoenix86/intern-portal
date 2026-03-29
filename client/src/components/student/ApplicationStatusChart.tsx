import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export interface ApplicationStatusSlice {
  name: string;
  value: number;
  color: string;
}

interface ApplicationStatusChartProps {
  data: ApplicationStatusSlice[];
}

const ApplicationStatusChart = ({ data }: ApplicationStatusChartProps) => {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Application Status</h3>
      {!hasData ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No applications yet — apply to internships to see status breakdown.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationStatusChart;
