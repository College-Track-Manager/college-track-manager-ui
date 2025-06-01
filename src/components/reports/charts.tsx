import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data
const trackDistributionData = [
  { name: 'علوم الحاسب', students: 150 },
  { name: 'هندسة البرمجيات', students: 120 },
  { name: 'نظم المعلومات', students: 90 },
  { name: 'أمن المعلومات', students: 80 },
  { name: 'الذكاء الاصطناعي', students: 60 },
];

const monthlyApplicationsData = [
  { month: 'يناير', applications: 45, accepted: 30, rejected: 15 },
  { month: 'فبراير', applications: 60, accepted: 40, rejected: 20 },
  { month: 'مارس', applications: 75, accepted: 50, rejected: 25 },
  { month: 'أبريل', applications: 90, accepted: 60, rejected: 30 },
  { month: 'مايو', applications: 120, accepted: 80, rejected: 40 },
];

const paymentStatusData = [
  { name: 'مكتمل', value: 350 },
  { name: 'معلق', value: 50 },
  { name: 'ملغي', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const TrackDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>توزيع الطلاب حسب المسار</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trackDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#8884d8" name="عدد الطلاب" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const ApplicationsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معدل الطلبات الشهري</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyApplicationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#8884d8"
                name="إجمالي الطلبات"
              />
              <Line
                type="monotone"
                dataKey="accepted"
                stroke="#82ca9d"
                name="الطلبات المقبولة"
              />
              <Line
                type="monotone"
                dataKey="rejected"
                stroke="#ff7300"
                name="الطلبات المرفوضة"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentStatusChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>حالة المدفوعات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
