import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { STATUS_PIE_DATA } from "@/constants/recruiter.constants";
import type { StatusPieItem } from "@/types/recruiter.types";

type ApplicantStatusChartProps = {
  data?: StatusPieItem[];
};

const ApplicantStatusChart = ({ data }: ApplicantStatusChartProps) => {
  const chartData = data && data.length > 0 ? data : STATUS_PIE_DATA;
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">
        Applicant Status Distribution
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicantStatusChart;
