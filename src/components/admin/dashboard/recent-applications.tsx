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

const applications = [
  {
    id: '1',
    name: 'أحمد محمد',
    program: 'هندسة البرمجيات',
    status: 'pending',
    date: '2025-06-01',
  },
  {
    id: '2',
    name: 'سارة أحمد',
    program: 'علوم الحاسب',
    status: 'approved',
    date: '2025-05-31',
  },
  {
    id: '3',
    name: 'محمد علي',
    program: 'نظم المعلومات',
    status: 'rejected',
    date: '2025-05-30',
  },
  {
    id: '4',
    name: 'فاطمة خالد',
    program: 'هندسة البرمجيات',
    status: 'pending',
    date: '2025-05-29',
  },
  {
    id: '5',
    name: 'عمر حسن',
    program: 'علوم الحاسب',
    status: 'approved',
    date: '2025-05-28',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusText = {
  pending: 'قيد المراجعة',
  approved: 'مقبول',
  rejected: 'مرفوض',
};

export function RecentApplications() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البرنامج</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.name}</TableCell>
              <TableCell>{application.program}</TableCell>
              <TableCell>
                <Badge
                  className={statusColors[application.status as keyof typeof statusColors]}
                >
                  {statusText[application.status as keyof typeof statusText]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(application.date).toLocaleDateString('ar-SA')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
