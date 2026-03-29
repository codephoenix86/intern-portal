import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  Pending: "hsl(35, 92%, 56%)",
  Shortlisted: "hsl(217, 71%, 53%)",
  Interview: "hsl(162, 72%, 40%)",
  Accepted: "hsl(162, 72%, 30%)",
  Rejected: "hsl(0, 72%, 51%)",
};

interface ApplicantStatusChartProps {
  statusBreakdown: { name: string; value: number }[];
}

const ApplicantStatusChart = ({ statusBreakdown }: ApplicantStatusChartProps) => {
  const data = statusBreakdown.map((s) => ({
    ...s,
    color: STATUS_COLORS[s.name] ?? "hsl(220, 14%, 60%)",
  }));
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">
        Applicant Status Distribution
      </h3>
      {!hasData ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          No applicant data yet.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
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

export default ApplicantStatusChart;
