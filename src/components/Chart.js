import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Revenue",
        data: data.map((item) => item.revenue || item.total || 0),
        backgroundColor: "#F38315",
        borderColor: "#e57309",
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 24,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        yAxisID: 'y'
      },
      {
        label: "Sales",
        data: data.map((item) => item.sales || 0),
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 24,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        yAxisID: 'y1'
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // We'll show legend in the header instead
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === "Revenue") {
                label += `$${Number(context.parsed.y).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              } else {
                label += `${Number(context.parsed.y).toLocaleString()} sales`;
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
            family: "'Inter', system-ui, sans-serif",
            weight: '400',
          },
          padding: 8,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
            family: "'Inter', system-ui, sans-serif",
            weight: '400',
          },
          padding: 8,
          callback: function(value) {
            return `$${Number(value).toLocaleString()}`;
          },
        },
        title: {
          display: true,
          text: 'Revenue ($)',
          color: '#6b7280',
          font: {
            size: 11,
            family: "'Inter', system-ui, sans-serif",
            weight: '500',
          },
          padding: { bottom: 10 }
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
            family: "'Inter', system-ui, sans-serif",
            weight: '400',
          },
          padding: 8,
          callback: function(value) {
            return `${Number(value).toLocaleString()}`;
          },
        },
        title: {
          display: true,
          text: 'Sales (units)',
          color: '#6b7280',
          font: {
            size: 11,
            family: "'Inter', system-ui, sans-serif",
            weight: '500',
          },
          padding: { bottom: 10 }
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    },
  };

  return (
    <div className="relative" style={{ height: '400px' }}>
      <Bar data={chartData} options={options} />
      
      {/* Custom Statistics Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200">
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#F38315]"></div>
            <span className="text-gray-600">
              Avg Revenue: ${(data.reduce((sum, item) => sum + (item.revenue || item.total || 0), 0) / data.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">
              Avg Sales: {Math.round(data.reduce((sum, item) => sum + (item.sales || 0), 0) / data.length).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;