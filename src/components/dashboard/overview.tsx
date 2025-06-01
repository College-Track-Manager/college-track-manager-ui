import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StatsCard } from '../ui/stats-card';
import { FileText, Users, DollarSign, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const applicationData = {
  labels: ['الطب', 'الهندسة', 'العلوم', 'الحاسب', 'التجارة'],
  datasets: [
    {
      label: 'عدد الطلبات',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const statusData = {
  labels: ['مقبول', 'مرفوض', 'معلق', 'يحتاج تعديل'],
  datasets: [
    {
      data: [45, 15, 25, 15],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderWidth: 1,
    },
  ],
};

const stats = [
  {
    title: 'طلبات جديدة',
    value: 24,
    icon: FileText,
    trend: { value: 12, isPositive: true },
    description: 'في آخر 24 ساعة'
  },
  {
    title: 'طلبات معلقة',
    value: 15,
    icon: Clock,
    description: 'تحتاج إلى مراجعة'
  },
  {
    title: 'مدفوعات حديثة',
    value: '12,450 ريال',
    icon: DollarSign,
    trend: { value: 8, isPositive: true },
    description: 'هذا الأسبوع'
  },
  {
    title: 'إجمالي الطلاب',
    value: 156,
    icon: Users,
    trend: { value: 5, isPositive: true },
    description: 'هذا الشهر'
  }
];

export const Overview = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الطلبات حسب التخصص</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={applicationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حالة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
