import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#EC4899",
];

/* ── Shared tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      borderRadius: "10px",
      border: "1px solid var(--border-color)",
      background: "var(--card-bg)",
      padding: "10px 14px",
      fontSize: "13px",
      color: "var(--text-primary)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    }}>
      {label && <p style={{ fontWeight: "600", marginBottom: "6px", color: "var(--text-primary)" }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, marginBottom: "2px" }}>
          {p.name}: <span style={{ fontWeight: "700" }}>{p.value}{p.dataKey === "percentage" ? "%" : ""}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Chart card wrapper ── */
function ChartCard({ title, children }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "14px",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 20px 12px",
        borderBottom: "1px solid var(--border-color)",
      }}>
        <p style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "var(--text-secondary)",
          margin: 0,
          letterSpacing: "0.01em",
        }}>
          {title}
        </p>
      </div>
      <div style={{ padding: "16px 12px 20px" }}>
        {children}
      </div>
    </div>
  );
}

export function AttendanceCharts({ bySubject = [], timeline = [], filterSubjectId = "" }) {
  const { theme } = useTheme();

  const barData = bySubject.map((s) => ({
    subject: s.subjectName || s.subject || "Unknown",
    percentage: s.percentage ?? 0,
    presentDays: s.presentDays ?? s.present ?? 0,
    total: s.totalClasses ?? s.total ?? 0,
  }));

  const pieData = barData.filter((d) => d.total > 0);

  const filteredTimeline = filterSubjectId
    ? timeline.filter((t) => String(t.subjectId) === String(filterSubjectId))
    : timeline;

  if (!barData.length && !filteredTimeline.length) {
    return (
      <div style={{
        textAlign: "center",
        padding: "48px 16px",
        color: "var(--text-muted)",
        fontSize: "14px",
      }}>
        Add subjects and mark attendance to see charts.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Bar + Pie side by side */}
      {barData.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {/* Bar chart */}
          <ChartCard title="Attendance % by Subject">
            <div style={{ height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border-color)" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-secondary)", radius: 6 }} />
                  <Bar
                    dataKey="percentage"
                    name="Attendance %"
                    fill="var(--accent)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  >
                    {barData.map((entry, index) => {
                      const color = entry.percentage >= 75 ? "#10B981" : entry.percentage >= 60 ? "#F59E0B" : "#EF4444";
                      return <Cell key={index} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Pie chart */}
          {pieData.length > 0 && (
            <ChartCard title="Attendance Distribution">
              <div style={{ height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="presentDays"
                      nameKey="subject"
                      outerRadius={88}
                      innerRadius={44}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        paddingTop: "8px",
                      }}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}
        </div>
      )}

      {/* Timeline */}
      {filteredTimeline.length > 0 && (
        <ChartCard title={`Attendance Over Time${filterSubjectId ? " (selected subject)" : ""}`}>
          <div style={{ height: "220px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTimeline} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border-color)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  name="Present"
                  dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  name="Absent"
                  dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
}

export default AttendanceCharts;
