import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const payments = [
  {
    id: '1',
    studentName: 'أحمد محمد',
    amount: 5000,
    status: 'completed',
    date: '2025-06-01',
  },
  {
    id: '2',
    studentName: 'سارة أحمد',
    amount: 3500,
    status: 'pending',
    date: '2025-05-31',
  },
  {
    id: '3',
    studentName: 'محمد علي',
    amount: 4500,
    status: 'failed',
    date: '2025-05-30',
  },
  {
    id: '4',
    studentName: 'فاطمة خالد',
    amount: 6000,
    status: 'completed',
    date: '2025-05-29',
  },
  {
    id: '5',
    studentName: 'عمر حسن',
    amount: 4000,
    status: 'pending',
    date: '2025-05-28',
  },
];

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const statusText = {
  completed: 'مكتمل',
  pending: 'قيد المعالجة',
  failed: 'فشل',
};

export function RecentPayments() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم الطالب</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.studentName}</TableCell>
              <TableCell>${payment.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  className={statusColors[payment.status as keyof typeof statusColors]}
                >
                  {statusText[payment.status as keyof typeof statusText]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(payment.date).toLocaleDateString('ar-SA')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
