import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentFilters } from '@/components/payments/payment-filters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Send, ArrowUpDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Payment {
  id: string;
  paymentCode: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'pending';
}

// Mock data - replace with API call
const mockPayments: Payment[] = [
  {
    id: '1',
    paymentCode: 'PAY-2025-001',
    studentName: 'أحمد محمد',
    amount: 5000,
    date: '2025-05-31',
    status: 'success',
  },
  {
    id: '2',
    paymentCode: 'PAY-2025-002',
    studentName: 'سارة أحمد',
    amount: 5000,
    date: '2025-05-30',
    status: 'pending',
  },
  {
    id: '3',
    paymentCode: 'PAY-2025-003',
    studentName: 'محمد علي',
    amount: 5000,
    date: '2025-05-29',
    status: 'failed',
  },
];

export const PaymentsManagement = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return 'ناجح';
      case 'failed':
        return 'فاشل';
      case 'pending':
        return 'معلق';
      default:
        return status;
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      setPayments(mockPayments);
    } else {
      setPayments(mockPayments.filter((p) => p.status === status));
    }
  };

  const handleDateChange = (dates: { from: Date; to: Date }) => {
    setPayments(
      mockPayments.filter((p) => {
        const paymentDate = new Date(p.date);
        return paymentDate >= dates.from && paymentDate <= dates.to;
      })
    );
  };

  const handleReset = () => {
    setPayments(mockPayments);
  };

  const handleResendNotification = (paymentId: string) => {
    // API call to resend notification
    toast({
      title: 'تم إعادة إرسال إشعار الدفع',
      description: 'تم إرسال إشعار الدفع بنجاح',
    });
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setPayments([...payments].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إدارة المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <PaymentFilters
              onStatusChange={handleStatusChange}
              onDateChange={handleDateChange}
              onReset={handleReset}
            />
          </div>

          {/* Payments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">كود الدفع</TableHead>
                  <TableHead className="text-right">اسم الطالب</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={handleSort}>
                    <div className="flex items-center justify-end">
                      التاريخ
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.paymentCode}</TableCell>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell>{payment.amount} ريال</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResendNotification(payment.id)}
                      >
                        <Send className="h-4 w-4 ml-2" />
                        إعادة إرسال الإشعار
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
  );
};
