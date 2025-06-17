import React from 'react';
import { useParams } from 'react-router-dom';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // For triggering download

// Mock data structure for an application - replace with actual data fetching
interface ApplicationData {
  id: string;
  name: string;
  email: string;
  trackType: 'academic' | 'professional';
  track: string;
  educationLevel: string;
  studyType: 'online' | 'offline';
  education: string;
  statement?: string;
  resumeUrl?: string; // URL to download resume
  transcriptUrl?: string; // URL to download transcript
  idCardUrl?: string; // URL to download ID card
  submissionDate: string;
}

const ApplicationReviewPage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();

  // TODO: Fetch application data based on applicationId
  // For now, using mock data
  const mockApplication: ApplicationData = {
    id: applicationId || '1',
    name: 'أحمد محمد الغامدي',
    email: 'ahmed.alghamdi@example.com',
    trackType: 'academic',
    track: 'علوم الحاسوب المتقدمة',
    educationLevel: 'ماجستير',
    studyType: 'online',
    education: 'بكالوريوس هندسة برمجيات - جامعة الملك سعود (2020)',
    statement: 'أسعى لتطوير مهاراتي في مجال الذكاء الاصطناعي وتطبيقاته في تحليل البيانات الضخمة. لدي شغف كبير بالبحث العلمي وأطمح للمساهمة في تطوير حلول تقنية مبتكرة تخدم المجتمع. أتمنى أن تتاح لي الفرصة للانضمام إلى هذا البرنامج المتميز.',
    resumeUrl: '#',
    transcriptUrl: '#',
    idCardUrl: '#',
    submissionDate: '2023-09-15',
  };

  const [applicationData, setApplicationData] = React.useState<ApplicationData | null>(mockApplication);
  const [isLoading, setIsLoading] = React.useState(false); // Set to true when fetching data
  const [error, setError] = React.useState<string | null>(null);

  // Placeholder for actual data fetching logic
  // useEffect(() => {
  //   const fetchApplication = async () => {
  //     setIsLoading(true);
  //     try {
  //       // const data = await fetchActualApplicationData(applicationId);
  //       // setApplicationData(data);
  //       setError(null);
  //     } catch (err) {
  //       setError('Failed to load application data.');
  //       setApplicationData(null);
  //     }
  //     setIsLoading(false);
  //   };
  //   if (applicationId) {
  //     fetchApplication();
  //   }
  // }, [applicationId]);

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
    alert('تمت الموافقة على الطلب');
  };

  const handleDisapprove = () => {
    // TODO: Implement disapproval logic
    console.log('Application disapproved:', applicationId);
    alert('تم رفض الطلب');
  };

  const handleDownloadAllDocuments = async () => {
    if (!applicationData) return;

    const zip = new JSZip();
    const documentsToDownload = [];

    if (applicationData.resumeUrl && applicationData.resumeUrl !== '#') {
      documentsToDownload.push({ name: 'resume.pdf', url: applicationData.resumeUrl });
    } else if (applicationData.resumeUrl === '#') {
        // Placeholder for actual file fetching
        zip.file('resume_placeholder.txt', 'This is a placeholder for the resume.\nActual file content would be fetched from: ' + applicationData.resumeUrl);
    }

    if (applicationData.transcriptUrl && applicationData.transcriptUrl !== '#') {
      documentsToDownload.push({ name: 'transcript.pdf', url: applicationData.transcriptUrl });
    } else if (applicationData.transcriptUrl === '#') {
        zip.file('transcript_placeholder.txt', 'This is a placeholder for the transcript.\nActual file content would be fetched from: ' + applicationData.transcriptUrl);
    }

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
          <CardHeader>
            <CardTitle className="text-2xl">مراجعة طلب تسجيل برنامج</CardTitle>
            <CardDescription>مراجعة تفاصيل طلب الطالب واتخاذ قرار.</CardDescription>
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

            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t mt-6">
              <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                موافقة على الطلب
              </Button>
              <Button onClick={handleDisapprove} variant="destructive" className="flex-1">
                رفض الطلب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ApplicationReviewPage;
