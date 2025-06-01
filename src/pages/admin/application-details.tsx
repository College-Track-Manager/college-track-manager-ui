import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DocumentViewer, type Document } from '@/components/applications/document-viewer';
import { ModificationHistory, type ModificationRecord } from '@/components/applications/modification-history';
import { ActionButtons } from '@/components/applications/action-buttons';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { PageTransition } from '@/components/page-transition';
import { ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationDetails {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_modification';
  program: string;
  semester: string;
  academicYear: string;
  studentInfo: {
    name: string;
    email: string;
    phone: string;
    nationalId: string;
    birthDate: string;
    address: string;
    education: {
      school: string;
      grade: string;
      graduationYear: string;
    };
  };
  documents: Document[];
  modificationHistory: ModificationRecord[];
}

// Mock data - replace with API call
const mockApplication: ApplicationDetails = {
  id: '1',
  status: 'pending',
  program: 'علوم الحاسب',
  semester: 'الفصل الأول',
  academicYear: '2024-2025',
  studentInfo: {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    nationalId: '1234567890',
    birthDate: '1995-01-01',
    address: 'الرياض، السعودية',
    education: {
      school: 'ثانوية الرياض',
      grade: '95%',
      graduationYear: '2024',
    },
  },
  documents: [
    {
      id: '1',
      name: 'الهوية الوطنية',
      type: 'PDF',
      size: '2.3 MB',
      url: '#',
    },
    {
      id: '2',
      name: 'شهادة الثانوية',
      type: 'PDF',
      size: '1.5 MB',
      url: '#',
    },
    {
      id: '3',
      name: 'كشف الدرجات',
      type: 'PDF',
      size: '1.1 MB',
      url: '#',
    },
  ] as Document[],
  modificationHistory: [
    {
      id: '1',
      date: '2025-05-30',
      type: 'request',
      description: 'الرجاء تحديث صورة الهوية الوطنية',
      by: 'المشرف: خالد',
    },
    {
      id: '2',
      date: '2025-05-31',
      type: 'update',
      description: 'تم تحديث صورة الهوية الوطنية',
      by: 'الطالب: أحمد',
    },
  ] as ModificationRecord[],
};

export const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);

  const handleApprove = async (paymentCode: string) => {
    setLoading(true);
    try {
      // API call here
      toast({
        title: 'تم قبول الطلب',
        description: `تم إرسال رمز الدفع: ${paymentCode}`,
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء قبول الطلب',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestModification = async (notes: string) => {
    setLoading(true);
    try {
      // API call here
      toast({
        title: 'تم طلب التعديل',
        description: 'تم إرسال طلب التعديل للطالب',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء طلب التعديل',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    setLoading(true);
    try {
      // API call here
      toast({
        title: 'تم رفض الطلب',
        description: 'تم إرسال سبب الرفض للطالب',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء رفض الطلب',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/applications')}
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للطلبات
            </Button>
            <h1 className="text-2xl font-bold">طلب رقم: {mockApplication.id}</h1>
          </div>
          <Badge
            className={{
              'bg-yellow-100 text-yellow-800': mockApplication.status === 'pending',
              'bg-green-100 text-green-800': mockApplication.status === 'approved',
              'bg-red-100 text-red-800': mockApplication.status === 'rejected',
              'bg-blue-100 text-blue-800': mockApplication.status === 'needs_modification',
            }[mockApplication.status] || ''}
          >
            {{
              pending: 'قيد المراجعة',
              approved: 'مقبول',
              rejected: 'مرفوض',
              needs_modification: 'يحتاج تعديل',
            }[mockApplication.status]}
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="details">التفاصيل</TabsTrigger>
            <TabsTrigger value="documents">المستندات</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="font-medium">الاسم:</span> {mockApplication.studentInfo.name}</p>
                    <p><span className="font-medium">البريد الإلكتروني:</span> {mockApplication.studentInfo.email}</p>
                    <p><span className="font-medium">رقم الجوال:</span> {mockApplication.studentInfo.phone}</p>
                    <p><span className="font-medium">رقم الهوية:</span> {mockApplication.studentInfo.nationalId}</p>
                    <p><span className="font-medium">تاريخ الميلاد:</span> {mockApplication.studentInfo.birthDate}</p>
                    <p><span className="font-medium">العنوان:</span> {mockApplication.studentInfo.address}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold mb-4">المعلومات الدراسية</h3>
                    <p><span className="font-medium">المدرسة:</span> {mockApplication.studentInfo.education.school}</p>
                    <p><span className="font-medium">المعدل:</span> {mockApplication.studentInfo.education.grade}</p>
                    <p><span className="font-medium">سنة التخرج:</span> {mockApplication.studentInfo.education.graduationYear}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">معلومات البرنامج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">البرنامج المطلوب:</span> {mockApplication.program}</p>
                  <p><span className="font-medium">الفصل الدراسي:</span> {mockApplication.semester}</p>
                  <p><span className="font-medium">السنة الدراسية:</span> {mockApplication.academicYear}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentViewer documents={mockApplication.documents} />
          </TabsContent>

          <TabsContent value="history">
            <ModificationHistory records={mockApplication.modificationHistory} />
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <ActionButtons
              loading={loading}
              onApprove={handleApprove}
              onRequestModification={handleRequestModification}
              onReject={handleReject}
            />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};
