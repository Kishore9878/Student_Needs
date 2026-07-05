import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { sortCategoryWise } from '../../../utils/Expenses/seperator';
import { ChartContainer, ChartTooltip } from '../../dashboard/shared/ChartContainer';
import { chartColors } from '../../../utils/chartPalette';

export function CategoryPieChart({ exdata }) {
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const totalexp = sortCategoryWise(exdata, categories);

  const chartData = categories
    .map((cat, index) => ({ name: cat, value: totalexp[index] }))
    .filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const isEmpty = chartData.length === 0;

  return (
    /* No glass-card wrapper — Home.jsx ExpCard provides the card shell */
    <div style={{ display: "flex", flexDirection: "column", height: "320px", padding: "20px" }}>
      {/* Single title */}
      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.01em", flexShrink: 0 }}>
        Expenses by Category
      </h3>

      {/* Body: chart left + legend right */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", gap: "16px", minHeight: 0 }}>
        {isEmpty ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data available</p>
          </div>
        ) : (
          <>
            {/* Donut chart — left 50% */}
            <div style={{ flex: "0 0 48%", height: "100%", minHeight: 0 }}>
              <ChartContainer height="100%" minHeight={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="52%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<ChartTooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />}
                  />
                </PieChart>
              </ChartContainer>
            </div>

            {/* Custom legend — right 52% */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", minWidth: 0 }}>
              {chartData.map((item, index) => {
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                const color = chartColors[index % chartColors.length];
                return (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    {/* Color dot */}
                    <span style={{
                      width: "12px", height: "12px", borderRadius: "50%",
                      background: color, flexShrink: 0,
                      boxShadow: `0 0 0 3px ${color}22`,
                    }} />
                    {/* Category name */}
                    <span style={{
                      flex: 1, fontSize: "13px", fontWeight: "600",
                      color: "var(--text-primary)", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {item.name}
                    </span>
                    {/* Amount + percent */}
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                        ₹{item.value.toLocaleString()}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "5px" }}>
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}