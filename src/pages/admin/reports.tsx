import React, { useState } from 'react';
import { FileText, TrendingUp, Users, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const reports = [
  {
    id: '1',
    title: 'تقرير الطلبات الشهري',
    description: 'تحليل تفصيلي لجميع الطلبات المقدمة خلال الشهر',
    icon: FileText,
  },
  {
    id: '2',
    title: 'تقرير المدفوعات',
    description: 'ملخص المدفوعات والإيرادات',
    icon: TrendingUp,
  },
  {
    id: '3',
    title: 'تقرير الطلاب النشطين',
    description: 'إحصائيات وتحليلات عن الطلاب النشطين',
    icon: Users,
  },
];

const applicationStats = {
  labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
  datasets: [
    {
      label: 'الطلبات المقدمة',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const paymentStats = {
  labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
  datasets: [
    {
      label: 'المدفوعات',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const acceptanceRateData = [
  { track: 'علوم الحاسب', total: 200, accepted: 150, rate: '75%' },
  { track: 'هندسة البرمجيات', total: 180, accepted: 120, rate: '67%' },
  { track: 'نظم المعلومات', total: 150, accepted: 90, rate: '60%' },
  { track: 'أمن المعلومات', total: 120, accepted: 80, rate: '67%' },
  { track: 'الذكاء الاصطناعي', total: 100, accepted: 60, rate: '60%' },
];

const paymentStatsData = [
  { track: 'علوم الحاسب', completed: 100, pending: 20, cancelled: 10, total: 130 },
  { track: 'هندسة البرمجيات', completed: 80, pending: 15, cancelled: 5, total: 100 },
  { track: 'نظم المعلومات', completed: 60, pending: 10, cancelled: 5, total: 75 },
  { track: 'أمن المعلومات', completed: 40, pending: 5, cancelled: 5, total: 50 },
  { track: 'الذكاء الاصطناعي', completed: 20, pending: 5, cancelled: 5, total: 30 },
];

export const ReportsPage = () => {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [date, setDate] = useState<DateRange>({ 
    from: new Date(), 
    to: addDays(new Date(), 7)
  });
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">التقارير</h1>
          <p className="text-gray-500 mt-1">إحصائيات وتقارير المدفوعات والطلبات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقارير
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل التقرير
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>المسار</Label>
              <Select
                value={selectedTrack}
                onValueChange={setSelectedTrack}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المسار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المسارات</SelectItem>
                  <SelectItem value="cs">علوم الحاسب</SelectItem>
                  <SelectItem value="se">هندسة البرمجيات</SelectItem>
                  <SelectItem value="is">نظم المعلومات</SelectItem>
                  <SelectItem value="cyber">أمن المعلومات</SelectItem>
                  <SelectItem value="ai">الذكاء الاصطناعي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الفترة الزمنية</Label>
              <DatePickerWithRange 
                date={date} 
                setDate={setDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="acceptance">معدلات القبول</TabsTrigger>
          <TabsTrigger value="payments">إحصائيات المدفوعات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={applicationStats}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={paymentStats}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        {/* Acceptance Rates Tab */}
        <TabsContent value="acceptance">
          <Card>
            <CardHeader>
              <CardTitle>معدلات القبول حسب المسار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4">المسار</th>
                      <th className="p-4">إجمالي الطلبات</th>
                      <th className="p-4">الطلبات المقبولة</th>
                      <th className="p-4">معدل القبول</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptanceRateData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{row.track}</td>
                        <td className="p-4">{row.total}</td>
                        <td className="p-4">{row.accepted}</td>
                        <td className="p-4">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Stats Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المدفوعات حسب المسار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4">المسار</th>
                      <th className="p-4">المدفوعات المكتملة</th>
                      <th className="p-4">المدفوعات المعلقة</th>
                      <th className="p-4">المدفوعات الملغاة</th>
                      <th className="p-4">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentStatsData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{row.track}</td>
                        <td className="p-4">{row.completed}</td>
                        <td className="p-4">{row.pending}</td>
                        <td className="p-4">{row.cancelled}</td>
                        <td className="p-4">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
