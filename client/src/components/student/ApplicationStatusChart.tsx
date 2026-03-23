import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PIE_DATA } from "@/constants/student.constants";

const ApplicationStatusChart = () => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Application Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={PIE_DATA}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {PIE_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationStatusChart;
