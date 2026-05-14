import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { sortCategoryWise } from '../../../utils/Expenses/seperator';

ChartJS.register(ArcElement, Tooltip, Legend);

export function CategoryPieChart({ exdata }) {
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const totalexp = sortCategoryWise(exdata, categories);

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Amount (₹)",
        data: totalexp,
        backgroundColor: [
          'rgba(251, 146, 60, 0.7)',  // Orange
          'rgba(96, 165, 250, 0.7)',  // Blue
          'rgba(192, 132, 252, 0.7)', // Purple
          'rgba(129, 140, 248, 0.7)', // Indigo
          'rgba(2fb, 113, 133, 0.7)', // Rose
          'rgba(52, 211, 153, 0.7)',  // Emerald
          'rgba(148, 163, 184, 0.7)', // Slate
        ],
        borderColor: [
          'rgba(251, 146, 60, 1)',
          'rgba(96, 165, 250, 1)',
          'rgba(192, 132, 252, 1)',
          'rgba(129, 140, 248, 1)',
          'rgba(251, 113, 133, 1)',
          'rgba(52, 211, 153, 1)',
          'rgba(148, 163, 184, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += '₹ ' + context.parsed.toLocaleString();
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full min-h-[300px]">
      <h3 className="text-xl font-bold text-white mb-6">Expenses by Category</h3>
      <div className="flex-1 relative w-full h-full min-h-[220px]">
        {totalexp.every(item => item === 0) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No data available</p>
          </div>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
}