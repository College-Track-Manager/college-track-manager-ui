import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TrackDistributionChart, ApplicationsChart, PaymentStatusChart } from '@/components/reports/charts';
import { ExportData } from '@/components/reports/export-data';

// Mock data for reports
const acceptanceRateData = [
  { track: 'علوم الحاسب', total: 200, accepted: 150, rate: '75%' },
  { track: 'هندسة البرمجيات', total: 180, accepted: 120, rate: '67%' },
  { track: 'نظم المعلومات', total: 150, accepted: 90, rate: '60%' },
  { track: 'أمن المعلومات', total: 120, accepted: 80, rate: '67%' },
  { track: 'الذكاء الاصطناعي', total: 100, accepted: 60, rate: '60%' },
];

const paymentStatsData = [
  { track: 'علوم الحاسب', completed: 140, pending: 8, cancelled: 2, total: 150 },
  { track: 'هندسة البرمجيات', completed: 110, pending: 7, cancelled: 3, total: 120 },
  { track: 'نظم المعلومات', completed: 85, pending: 3, cancelled: 2, total: 90 },
  { track: 'أمن المعلومات', completed: 75, pending: 4, cancelled: 1, total: 80 },
  { track: 'الذكاء الاصطناعي', completed: 55, pending: 3, cancelled: 2, total: 60 },
];

export const Reports = () => {
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">التقارير والإحصائيات</h1>

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
              <DatePickerWithRange date={date} setDate={setDate} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrackDistributionChart />
            <ApplicationsChart />
            <PaymentStatusChart />
          </div>
        </TabsContent>

        {/* Acceptance Rates Tab */}
        <TabsContent value="acceptance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>معدلات القبول حسب المسار</CardTitle>
              <ExportData
                data={acceptanceRateData}
                filename="acceptance-rates"
                title="تقرير معدلات القبول"
              />
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>إحصائيات المدفوعات حسب المسار</CardTitle>
              <ExportData
                data={paymentStatsData}
                filename="payment-stats"
                title="تقرير إحصائيات المدفوعات"
              />
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
