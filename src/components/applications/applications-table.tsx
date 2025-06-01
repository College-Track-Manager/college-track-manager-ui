import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye } from 'lucide-react';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_modification';

export interface Application {
  id: string;
  studentName: string;
  applicationNumber: string;
  date: string;
  status: ApplicationStatus;
}

interface ApplicationsTableProps {
  applications: Application[];
  onViewDetails: (applicationId: string) => void;
}

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'needs_modification':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: ApplicationStatus) => {
  switch (status) {
    case 'pending':
      return 'معلق';
    case 'approved':
      return 'مقبول';
    case 'rejected':
      return 'مرفوض';
    case 'needs_modification':
      return 'يحتاج تعديل';
    default:
      return status;
  }
};

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onViewDetails,
}) => {
  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="بحث باسم الطالب أو رقم الطلب"
          className="flex-1"
          dir="rtl"
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
            <SelectItem value="approved">مقبول</SelectItem>
            <SelectItem value="rejected">مرفوض</SelectItem>
            <SelectItem value="needs_modification">يحتاج تعديل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">اسم الطالب</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.applicationNumber}
                </TableCell>
                <TableCell>{application.studentName}</TableCell>
                <TableCell>{application.date}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusText(application.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(application.id)}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    عرض التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
