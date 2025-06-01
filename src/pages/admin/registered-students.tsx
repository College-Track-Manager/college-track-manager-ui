import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EditStudentDialog, type StudentData } from '@/components/students/edit-student-dialog';
import { Search, Edit, Power } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data - replace with API call
const mockStudents: StudentData[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    nationalId: '1234567890',
    address: 'الرياض، السعودية',
    guardianName: 'محمد علي',
    guardianPhone: '0509876543',
    track: 'المسار العلمي',
    registrationDate: '2025-05-31',
    isActive: true,
  },
  {
    id: '2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '0501234568',
    nationalId: '1234567891',
    address: 'جدة، السعودية',
    guardianName: 'أحمد علي',
    guardianPhone: '0509876544',
    track: 'المسار الأدبي',
    registrationDate: '2025-05-30',
    isActive: true,
  },
];

export const RegisteredStudents = () => {
  const [students, setStudents] = useState<StudentData[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const filteredStudents = students.filter((student) =>
    student.name.includes(searchQuery) ||
    student.email.includes(searchQuery) ||
    student.phone.includes(searchQuery) ||
    student.nationalId.includes(searchQuery)
  );

  const handleEditStudent = (student: StudentData) => {
    setEditingStudent(student);
  };

  const handleSaveStudent = (updatedStudent: StudentData) => {
    setStudents(students.map((s) => 
      s.id === updatedStudent.id ? updatedStudent : s
    ));
    toast({
      title: 'تم تحديث البيانات',
      description: 'تم تحديث بيانات الطالب بنجاح',
    });
  };

  const handleToggleStatus = (student: StudentData) => {
    setSelectedStudent(student);
    setShowDeactivateDialog(true);
  };

  const confirmDeactivate = () => {
    if (selectedStudent) {
      setStudents(students.map((s) =>
        s.id === selectedStudent.id
          ? { ...s, isActive: !s.isActive }
          : s
      ));
      toast({
        title: selectedStudent.isActive ? 'تم تعطيل الحساب' : 'تم تفعيل الحساب',
        description: selectedStudent.isActive
          ? 'تم تعطيل حساب الطالب بنجاح'
          : 'تم تفعيل حساب الطالب بنجاح',
      });
    }
    setShowDeactivateDialog(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">الطلاب المسجلين</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="بحث بالاسم، البريد، الجوال، أو رقم الهوية"
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                dir="rtl"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">المسار</TableHead>
                  <TableHead className="text-right">رقم الجوال</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.track}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.registrationDate}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4 ml-2" />
                          تعديل
                        </Button>
                        <Button
                          variant={student.isActive ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleToggleStatus(student)}
                        >
                          <Power className="h-4 w-4 ml-2" />
                          {student.isActive ? 'تعطيل' : 'تفعيل'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <EditStudentDialog
          student={editingStudent}
          isOpen={true}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveStudent}
        />
      )}

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedStudent?.isActive ? 'تأكيد تعطيل الحساب' : 'تأكيد تفعيل الحساب'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedStudent?.isActive
                ? 'هل أنت متأكد من رغبتك في تعطيل حساب الطالب؟'
                : 'هل أنت متأكد من رغبتك في تفعيل حساب الطالب؟'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeactivate}>
              {selectedStudent?.isActive ? 'تعطيل' : 'تفعيل'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
