import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklySpendingChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'This Week',
        data,
        backgroundColor: 'rgba(52, 211, 153, 0.8)', // emerald
        borderRadius: 4,
      },
      {
        label: 'Last Week',
        data: data.map(val => val * (0.8 + Math.random() * 0.4)), // mock comparison
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 8 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: '#94a3b8' },
        stacked: false,
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94a3b8' },
        stacked: false,
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default WeeklySpendingChart;