import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PageTransition } from '@/components/page-transition';
import { Search, Filter, Download, Send, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  studentName: string;
  email: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  lastNotified?: string;
}

const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    studentName: 'أحمد محمد',
    email: 'ahmed@example.com',
    amount: 5000,
    paymentMethod: 'بطاقة ائتمان',
    status: 'completed',
    date: '2025-06-01',
    lastNotified: '2025-06-01',
  },
  {
    id: 'PAY-002',
    studentName: 'سارة أحمد',
    email: 'sara@example.com',
    amount: 3500,
    paymentMethod: 'تحويل بنكي',
    status: 'pending',
    date: '2025-05-31',
    lastNotified: '2025-05-31',
  },
  {
    id: 'PAY-003',
    studentName: 'محمد علي',
    email: 'mohammed@example.com',
    amount: 4500,
    paymentMethod: 'بطاقة ائتمان',
    status: 'failed',
    date: '2025-05-30',
    lastNotified: '2025-05-30',
  },
];

const statusMap = {
  completed: { color: 'bg-green-100 text-green-800', text: 'مكتمل' },
  pending: { color: 'bg-yellow-100 text-yellow-800', text: 'قيد المعالجة' },
  failed: { color: 'bg-red-100 text-red-800', text: 'فشل' },
  refunded: { color: 'bg-blue-100 text-blue-800', text: 'مسترجع' },
};

export const PaymentsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPayments(query, statusFilter, dateRange);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterPayments(searchQuery, status, dateRange);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    filterPayments(searchQuery, statusFilter, range);
  };

  const filterPayments = (query: string, status: string, dates: { from: Date | undefined; to: Date | undefined }) => {
    let filtered = [...mockPayments];

    if (query) {
      filtered = filtered.filter((payment) =>
        payment.studentName.toLowerCase().includes(query.toLowerCase()) ||
        payment.id.toLowerCase().includes(query.toLowerCase()) ||
        payment.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((payment) => payment.status === status);
    }

    if (dates.from && dates.to) {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= dates.from! && paymentDate <= dates.to!;
      });
    }

    setPayments(filtered);
  };

  const handleResendNotification = async (payment: Payment) => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم إرسال الإشعار',
        description: `تم إرسال إشعار الدفع إلى ${payment.email}`,
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الإشعار',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const formattedAmount = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(totalAmount);

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">المدفوعات</h1>
            <p className="text-gray-500 mt-1">إجمالي المدفوعات: {formattedAmount}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              const csv = payments.map(p => [
                p.id,
                p.studentName,
                p.email,
                p.amount,
                p.paymentMethod,
                statusMap[p.status].text,
                p.date
              ].join(','));
              const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}>
              <Download className="w-4 h-4 ml-2" />
              تصدير CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن مدفوعات..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-3 pr-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="حالة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="pending">قيد المعالجة</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                  <SelectItem value="refunded">مسترجع</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[240px] justify-start text-right">
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      'اختر التاريخ'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>البحث في المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث باسم الطالب أو رقم المعاملة..."
              className="pl-10 pr-10"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الدفع</TableHead>
              <TableHead>الطالب</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>طريقة الدفع</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.studentName}</TableCell>
                <TableCell>{payment.email}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(payment.amount)}
                </TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Badge className={statusMap[payment.status].color}>
                    {statusMap[payment.status].text}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString('ar-SA')}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loading}
                    onClick={() => handleResendNotification(payment)}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 ml-2" />
                    )}
                    إرسال إشعار
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</div>
</PageTransition>

  );
};
