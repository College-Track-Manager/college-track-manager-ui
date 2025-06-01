import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/page-transition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Eye } from 'lucide-react';

interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  program?: string;
  submittedAt?: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    applicationNumber: 'APP-2025-001',
    studentName: 'أحمد محمد',
    email: 'ahmed@example.com',
    date: '2025-05-31',
    status: 'pending',
    program: 'علوم الحاسب',
  },
  {
    id: '2',
    applicationNumber: 'APP-2025-002',
    studentName: 'سارة أحمد',
    email: 'sara@example.com',
    date: '2025-05-30',
    status: 'approved',
    program: 'هندسة البرمجيات',
  },
  {
    id: '3',
    applicationNumber: 'APP-2025-003',
    studentName: 'محمد علي',
    email: 'mohamed@example.com',
    date: '2025-05-29',
    status: 'rejected',
    program: 'نظم المعلومات',
  },
  {
    id: '4',
    applicationNumber: 'APP-2025-004',
    studentName: 'فاطمة حسن',
    email: 'fatima@example.com',
    date: '2025-05-28',
    status: 'needs_modification',
    program: 'علوم البيانات',
  },
];

const statusMap = {
  pending: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'مقبول', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
  needs_modification: { label: 'يحتاج تعديل', color: 'bg-blue-100 text-blue-800' },
};

export const ApplicationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredApplications, setFilteredApplications] = useState(mockApplications);

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: 'applicationNumber',
      header: 'رقم الطلب',
    },
    {
      accessorKey: 'studentName',
      header: 'اسم الطالب',
    },
    {
      accessorKey: 'email',
      header: 'البريد الإلكتروني',
    },
    {
      accessorKey: 'program',
      header: 'البرنامج',
    },
    {
      accessorKey: 'date',
      header: 'تاريخ التقديم',
    },
    {
      accessorKey: 'status',
      header: 'الحالة',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusMap;
        return (
          <Badge className={statusMap[status].color}>
            {statusMap[status].label}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/applications/${row.original.id}`)}
          >
            <Eye className="h-4 w-4 ml-2" />
            عرض التفاصيل
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    let filtered = mockApplications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter]);

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">إدارة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن طلب..."
                  className="pl-3 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="approved">مقبول</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                  <SelectItem value="needs_modification">يحتاج تعديل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTable
              columns={columns}
              data={filteredApplications}
              pageSize={10}
              searchKey="studentName"
            />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};
