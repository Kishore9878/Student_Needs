import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const TrendChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Monthly Spending (₹)',
        data,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)', // brand-primary alpha
        tension: 0.4,
        pointBackgroundColor: '#1E293B',
        pointBorderColor: 'rgba(99, 102, 241, 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94a3b8' }
      }
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TrendChart;