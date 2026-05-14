import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyExpenseChart = ({ exdata }) => {
  const chartData = useMemo(() => {
    // Process the exdata to group by month
    // We will assume exdata has { amount, date }
    // As a fallback simulation, we just sum up recent months if data exists
    
    // Simple grouping by month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals = Array(12).fill(0);
    
    if (exdata && exdata.length > 0) {
      exdata.forEach(item => {
        const date = new Date(Date.parse(item.date));
        if(!isNaN(date.getMonth())) {
          monthlyTotals[date.getMonth()] += item.amount;
        }
      });
    }

    // Get current month to show last 6 months
    const currentMonth = new Date().getMonth();
    const labels = [];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12; // wrap around
      labels.push(monthNames[m]);
      data.push(monthlyTotals[m]);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data,
          backgroundColor: 'rgba(99, 102, 241, 0.8)', // brand-primary
          hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
          borderRadius: 6,
          barThickness: 32,
        },
      ],
    };
  }, [exdata]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // hide legend for this simple bar chart
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        callbacks: {
          label: (context) => `₹ ${context.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          callback: (value) => `₹${value}`
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
        }
      }
    },
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Expense Overview</h3>
        <select className="bg-brand-900 border border-white/10 text-slate-300 text-sm rounded-lg outline-none px-3 py-1 cursor-pointer">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>
      <div className="flex-1 w-full relative min-h-[220px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;