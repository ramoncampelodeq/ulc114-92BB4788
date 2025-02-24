
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Session {
  date: string;
  totalPresent: number;
  totalBrothers: number;
}

interface AttendanceChartProps {
  sessions: Session[];
}

export const AttendanceChart = ({ sessions }: AttendanceChartProps) => {
  const chartData = sessions.map(session => ({
    date: format(new Date(session.date), "dd/MM"),
    presença: (session.totalPresent / session.totalBrothers) * 100
  })).reverse();

  return (
    <div className="bg-card p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Evolução das Presenças</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="presença"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
