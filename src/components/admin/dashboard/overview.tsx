import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'إحصائيات الطلبات والقبول',
    },
  },
};

const labels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];

const data = {
  labels,
  datasets: [
    {
      label: 'الطلبات',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'القبول',
      data: [45, 40, 65, 70, 45, 45],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};

export function Overview() {
  return <Bar options={options} data={data} />;
}
