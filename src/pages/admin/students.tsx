import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const students = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    program: 'هندسة البرمجيات',
    year: 2,
    gpa: 3.8,
    status: 'active',
  },
  {
    id: '2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    program: 'علوم الحاسب',
    year: 3,
    gpa: 3.5,
    status: 'active',
  },
  {
    id: '3',
    name: 'محمد علي',
    email: 'mohammed@example.com',
    program: 'نظم المعلومات',
    year: 1,
    gpa: 3.2,
    status: 'inactive',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
};

const statusText = {
  active: 'نشط',
  inactive: 'غير نشط',
  suspended: 'موقوف',
};

export const StudentsPage = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الطلاب</h1>
        <div className="flex gap-2">
          <Button>
            <UserPlus className="w-4 h-4 ml-2" />
            إضافة طالب
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>البحث في الطلاب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث باسم الطالب أو البريد الإلكتروني..."
              className="pl-10 pr-10"
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>البرنامج</TableHead>
                <TableHead>السنة</TableHead>
                <TableHead>المعدل التراكمي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.gpa}</TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[student.status as keyof typeof statusColors]}
                    >
                      {statusText[student.status as keyof typeof statusText]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
