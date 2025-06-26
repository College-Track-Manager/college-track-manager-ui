import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // For triggering download
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { registrationsApi } from '@/services/registrations'
import { useEffect, useState } from 'react';
import { ApplicationData } from '@/data/ApplicationData';
import { useNavigate } from 'react-router-dom';

// Mock data structure for an application - replace with actual data fetching


const ApplicationReviewPage = () => {
  const location = useLocation();
  const { isReadOnlyView, status: applicationFinalStatus, applicantName: routeApplicantName, trackName: routeTrackName } = (location.state as { isReadOnlyView?: boolean; status?: string; applicantName?: string; trackName?: string; }) || {};
  const { applicationId } = useParams<{ applicationId: string }>();
  const [mockApplication, setPendingApplications] = useState<ApplicationData>();

    // Use route params for initial display if available, then fetch full data
  const initialName = routeApplicantName || 'جاري التحميل...';
  const initialTrack = routeTrackName || 'جاري التحميل...';
  const navigate = useNavigate();
  
    // useEffect(() => {
    //   // Fetch all data when component mountsss
    //   const fetchData = async () => {
    //     try {
    //       const [mockApplication] = await Promise.all([
    //         registrationsApi.GetRegistrationById(applicationId)
    //       ]);
          
    //       setPendingApplications(mockApplication);
        
                 
    //     } catch (err) {
    //       console.error("Error fetching data:", err);
    //       // Handle error appropriately, e.g., show a notification
    //     }
    //   };
      
    //   fetchData();
    // }, []);

  // TODO: Fetch application data based on applicationId
  // For now, using mock data that incorporates initial route params
  // const mockApplication: ApplicationData = {
  //   id: applicationId || '1',
  //   name: initialName,
  //   email: 'ahmed.alghamdi@example.com', // This will be overwritten by actual fetch
  //   trackType: 'academic', // This will be overwritten
  //   track: initialTrack,
  //   educationLevel: 'ماجستير',
  //   studyType: 'online',
  //   education: 'بكالوريوس هندسة برمجيات - جامعة الملك سعود (2020)',
  //   statement: 'أسعى لتطوير مهاراتي في مجال الذكاء الاصطناعي وتطبيقاته في تحليل البيانات الضخمة. لدي شغف كبير بالبحث العلمي وأطمح للمساهمة في تطوير حلول تقنية مبتكرة تخدم المجتمع. أتمنى أن تتاح لي الفرصة للانضمام إلى هذا البرنامج المتميز.',
  //   resumeUrl: '#',
  //   transcriptUrl: '#',
  //   idCardUrl: '#',
  //   submissionDate: '2023-09-15',
  // };
  const [applicationData, setApplicationData] = React.useState<ApplicationData | null>(mockApplication);
  const [isLoading, setIsLoading] = React.useState(false); // Set to true when fetching data
    const [error, setError] = React.useState<string | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = React.useState('');
  const [rejectionReason, setRejectionReason] = useState("");
  // Reading the value:
const currentValue = rejectionReason; // Always up-to-date

  // Placeholder for actual data fetching logic
  useEffect(() => {
    const fetchApplication = async () => {
      setIsLoading(true);
      try {
        const data = await registrationsApi.GetRegistrationById(applicationId);
        setApplicationData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load application data.');
        setApplicationData(null);
      }
      setIsLoading(false);
    };
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  if (isLoading) {
    return <div className="text-center p-8">جاري تحميل بيانات الطلب...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!applicationData) {
    return <div className="text-center p-8">لم يتم العثور على بيانات الطلب.</div>;
  }

  const handleApprove = () => {
    // TODO: Implement approval logic
    console.log('Application approved:', applicationId);
    //const data =  registrationsApi.ApproveRegistration(applicationId,1,"");
    setAlertDialogMessage('تمت الموافقة على الطلب');
    setIsAlertDialogOpen(true);
  };

  const handleDisapprove = () => {
    // TODO: Implement disapproval logic
    console.log('Application disapproved:', applicationId);
    setAlertDialogMessage('تم رفض الطلب');
    setIsAlertDialogOpen(true);
  };

  const ApproveRegistration = async () =>{

      const data =  registrationsApi.ApproveRegistration(applicationId,1,"");
      setIsAlertDialogOpen(false);
       navigate(`/admin/dashboard`);
  }

    const RejectRegistration = async () =>{     
      const data =  registrationsApi.ApproveRegistration(applicationId,2,rejectionReason);
      setIsAlertDialogOpen(false);
       // Redirect after success
     
      navigate(`/admin/dashboard`);
  }

  const handleDownloadAllDocuments = async () => {
    if (!applicationData) return;

    const zip = new JSZip();
    const documentsToDownload = [];
    applicationData.resumeUrl = `${import.meta.env.VITE_API_BASE_URL}/api/SecureFiles/download/6c67c83b-34f8-4d4c-807d-f455496b52ab_f6b101b6-1ef0-4839-9fc9-67d3e0a2303e_1.jpg`;

    if (applicationData.resumeUrl && applicationData.resumeUrl !== '#') {
      documentsToDownload.push({ name: 'resume.pdf', url: applicationData.resumeUrl });
    } else if (applicationData.resumeUrl === '#') {
        // Placeholder for actual file fetching
        zip.file('resume_placeholder.txt', 'This is a placeholder for the resume.\nActual file content would be fetched from: ' + applicationData.resumeUrl);
    }
    
    applicationData.transcriptUrl = `${import.meta.env.VITE_API_BASE_URL}/api/SecureFiles/download/a9104f48-4d5a-450c-ab73-d0a3a6fb7c45_0e0b32bf-5856-4acc-9235-0a358dc39a90_1.jpg`;
    if (applicationData.transcriptUrl && applicationData.transcriptUrl !== '#') {
      documentsToDownload.push({ name: 'transcript.pdf', url: applicationData.transcriptUrl });
    } else if (applicationData.transcriptUrl === '#') {
        zip.file('transcript_placeholder.txt', 'This is a placeholder for the transcript.\nActual file content would be fetched from: ' + applicationData.transcriptUrl);
    }

    applicationData.idCardUrl = `${import.meta.env.VITE_API_BASE_URL}/api/SecureFiles/download/6c67c83b-34f8-4d4c-807d-f455496b52ab_f6b101b6-1ef0-4839-9fc9-67d3e0a2303e_1.jpg`;
    if (applicationData.idCardUrl && applicationData.idCardUrl !== '#') {
      documentsToDownload.push({ name: 'id_card.pdf', url: applicationData.idCardUrl });
    } else if (applicationData.idCardUrl === '#') {
        zip.file('id_card_placeholder.txt', 'This is a placeholder for the ID card.\nActual file content would be fetched from: ' + applicationData.idCardUrl);
    }

    // Simulate fetching for URLs that are not '#'
    // In a real scenario, you would fetch the content of each URL
    // For example: const response = await fetch(doc.url); const blob = await response.blob(); zip.file(doc.name, blob);
    // For now, if URLs are real, we just log them. If they are '#', placeholders are already added.
    documentsToDownload.forEach(doc => {
        console.log(`Would fetch and add ${doc.name} from ${doc.url} to zip.`);
        // If you had actual file fetching logic, it would go here for non-'#' URLs
        // For this example, we'll add a placeholder if it's a real URL but not fetched
        if (!zip.file(doc.name)) { // Check if placeholder for '#' was already added
            zip.file(doc.name, `Content for ${doc.name} would be fetched from ${doc.url}`);
        }
    });

    if (Object.keys(zip.files).length === 0) {
        alert('لا توجد مستندات متاحة للتحميل.');
        return;
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `application_documents_${applicationData.id}.zip`);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('حدث خطأ أثناء إنشاء ملف المستندات المضغوط.');
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 text-right" dir="rtl">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">مراجعة طلب تسجيل برنامج</CardTitle>
            <CardDescription>
              {isReadOnlyView ? 'عرض تفاصيل الطلب المقدم.' : 'مراجعة تفاصيل طلب الطالب واتخاذ قرار.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">معلومات الطالب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="applicantName" className="mb-2 block">اسم الطالب</Label>
                  <Input id="applicantName" defaultValue={applicationData.name} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="applicantEmail" className="mb-2 block">البريد الإلكتروني</Label>
                  <Input id="applicantEmail" defaultValue={applicationData.email} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="submissionDate" className="mb-2 block">تاريخ التقديم</Label>
                  <Input id="submissionDate" defaultValue={applicationData.submissionDate} readOnly className="bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Program Details Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">تفاصيل البرنامج المطلوب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="trackType" className="mb-2 block">نوع المسار</Label>
                  <Input id="trackType" defaultValue={applicationData.trackType === 'academic' ? 'أكاديمي' : 'مهني'} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="trackName" className="mb-2 block">المسار</Label>
                  <Input id="trackName" defaultValue={applicationData.track} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="educationLevel" className="mb-2 block">المرحلة الدراسية</Label>
                  <Input id="educationLevel" defaultValue={applicationData.educationLevel} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="studyType" className="mb-2 block">نوع الدراسة</Label>
                  <Input id="studyType" defaultValue={applicationData.studyType === 'online' ? 'عن بعد' : 'حضوري'} readOnly className="bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Education and Statement Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">الخلفية التعليمية والرسالة الشخصية</h3>
              <div>
                <Label htmlFor="educationBackground" className="mb-2 block">الخلفية التعليمية</Label>
                <Textarea id="educationBackground" defaultValue={applicationData.education} readOnly rows={4} className="bg-gray-50" />
              </div>
              {applicationData.statement && (
                <div>
                  <Label htmlFor="personalStatement" className="mb-2 block">الرسالة الشخصية</Label>
                  <Textarea id="personalStatement" defaultValue={applicationData.statement} readOnly rows={6} className="bg-gray-50" />
                </div>
              )}
            </div>


            <div className="space-y-3 pt-4">
              <h4 className="font-semibold mb-2">المستندات المرفقة:</h4>
              {(applicationData.resumeUrl || applicationData.transcriptUrl || applicationData.idCardUrl) ? (
                <Button onClick={handleDownloadAllDocuments} variant="outline" className="w-full md:w-auto">
                  تنزيل جميع المستندات (ملف مضغوط)
                </Button>
              ) : (
                  <p className="text-muted-foreground">لم يتم رفع مستندات.</p>
              )}
            </div>

            {isReadOnlyView ? (              
              <div className="pt-6 border-t mt-6">
                <h4 className="font-semibold mb-2">حالة الطلب النهائية:</h4>
                {Number(applicationFinalStatus) === 1 && (
                  <p className="text-lg font-semibold text-green-600 p-3 bg-green-50 rounded-md border border-green-200">الطالب مقبول (Approved)</p>
                )}
                {Number(applicationFinalStatus) === 2 && (
                  <p className="text-lg font-semibold text-red-600 p-3 bg-red-50 rounded-md border border-red-200">الطالب مرفوض (Disapproved)</p>
                )}               
                 {!(Number(applicationFinalStatus) === 1 || Number(applicationFinalStatus) === 2 || Number(applicationFinalStatus) === 1 || Number(applicationFinalStatus) === 2) && (
                  <p className="text-lg font-semibold text-gray-600 p-3 bg-gray-50 rounded-md border border-gray-200">حالة الطلب: {applicationFinalStatus || 'غير محددة'}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t mt-6">
                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                  موافقة على الطلب
                </Button>
                <Button onClick={handleDisapprove} variant="destructive" className="flex-1">
                  رفض الطلب
                </Button>
              </div>
            )}

          

          </CardContent>
        </Card>
              <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen} >
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-right">حالة الطلب</AlertDialogTitle>
      <AlertDialogDescription className="text-right">
        {alertDialogMessage === "تم رفض الطلب" ? (
          <>
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">سبب الرفض</h3>
              <div>
                <Label htmlFor="rejectionReason" className="mb-2 block">سبب الرفض *</Label>
                <Textarea
                  id="rejectionReason"
                  name="rejectionReason"
                  defaultValue={applicationData.adminComments}
                  rows={4}
                  className="bg-gray-50"
                  required
                  onChange={(e) => setRejectionReason(applicationData.adminComments = e.target.value)}
                />
                <p className="text-sm text-red-500 mt-1">هذا الحقل مطلوب</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
              <p>{alertDialogMessage}</p>
            </div>
          </>
        )}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <AlertDialogAction 
        disabled={alertDialogMessage === "تم رفض الطلب" && !applicationData.adminComments}
        className={
          alertDialogMessage === "تم رفض الطلب" && !applicationData.adminComments
            ? "opacity-50 cursor-not-allowed"
            : ""
        }
        onClick={() => (alertDialogMessage === "تم رفض الطلب" ? RejectRegistration() : ApproveRegistration())}
      >
        موافق
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      </div>
    </PageTransition>
  );
};

export default ApplicationReviewPage;
