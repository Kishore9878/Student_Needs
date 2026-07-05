import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from '../../dashboard/shared/ChartContainer';
import { chartPalette } from '../../../utils/chartPalette';

const MonthlyExpenseChart = ({ exdata }) => {
  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals = Array(12).fill(0);

    if (exdata && exdata.length > 0) {
      exdata.forEach(item => {
        const date = new Date(Date.parse(item.date));
        if (!isNaN(date.getMonth())) {
          monthlyTotals[date.getMonth()] += item.amount;
        }
      });
    }

    const currentMonth = new Date().getMonth();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      data.push({ name: monthNames[m], Expenses: monthlyTotals[m] });
    }

    return data;
  }, [exdata]);

  return (
    /* No glass-card wrapper — Home.jsx ExpCard provides the card shell */
    <div style={{ display: "flex", flexDirection: "column", height: "320px", padding: "20px 20px 12px" }}>
      {/* Header row: single title + dropdown */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>
          Expense Overview
        </h3>
        <select
          style={{
            height: "30px", padding: "0 10px", fontSize: "12px", fontWeight: "600",
            borderRadius: "8px", border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)", color: "var(--text-primary)",
            cursor: "pointer", outline: "none", appearance: "auto",
          }}
        >
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ChartContainer height="100%" minHeight={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="var(--text-secondary)"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k' : v}`}
              width={48}
            />
            <Tooltip
              cursor={{ fill: 'var(--bg-secondary)', radius: 4 }}
              content={<ChartTooltip formatter={(value) => `₹${value.toLocaleString()}`} />}
            />
            <Bar dataKey="Expenses" fill={chartPalette.primary} radius={[5, 5, 0, 0]} barSize={28} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;