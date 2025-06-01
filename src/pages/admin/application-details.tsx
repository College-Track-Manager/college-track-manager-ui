import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentViewer, type Document } from '@/components/applications/document-viewer';
import { ModificationHistory, type ModificationRecord } from '@/components/applications/modification-history';
import { ActionButtons } from '@/components/applications/action-buttons';
import { Separator } from '@/components/ui/separator';

// Mock data - replace with API call
const mockApplication = {
  id: '1',
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

  const handleApprove = (paymentCode: string) => {
    console.log('Approved with payment code:', paymentCode);
  };

  const handleRequestModification = (notes: string) => {
    console.log('Requested modification:', notes);
  };

  const handleReject = (reason: string) => {
    console.log('Rejected with reason:', reason);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">تفاصيل الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">المعلومات الشخصية</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">الاسم:</span> {mockApplication.studentInfo.name}</p>
                  <p><span className="font-medium">البريد الإلكتروني:</span> {mockApplication.studentInfo.email}</p>
                  <p><span className="font-medium">رقم الجوال:</span> {mockApplication.studentInfo.phone}</p>
                  <p><span className="font-medium">رقم الهوية:</span> {mockApplication.studentInfo.nationalId}</p>
                  <p><span className="font-medium">تاريخ الميلاد:</span> {mockApplication.studentInfo.birthDate}</p>
                  <p><span className="font-medium">العنوان:</span> {mockApplication.studentInfo.address}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">المعلومات الدراسية</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">المدرسة:</span> {mockApplication.studentInfo.education.school}</p>
                  <p><span className="font-medium">المعدل:</span> {mockApplication.studentInfo.education.grade}</p>
                  <p><span className="font-medium">سنة التخرج:</span> {mockApplication.studentInfo.education.graduationYear}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <ActionButtons
              onApprove={handleApprove}
              onRequestModification={handleRequestModification}
              onReject={handleReject}
            />
          </CardContent>
        </Card>

        {/* Documents */}
        <DocumentViewer documents={mockApplication.documents} />

        {/* Modification History */}
        {mockApplication.modificationHistory.length > 0 && (
          <ModificationHistory records={mockApplication.modificationHistory} />
        )}
      </div>
    </div>
  );
};
