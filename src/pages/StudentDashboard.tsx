
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/ui/PageTransition";
import { Badge } from "@/components/ui/badge";
import { BookIcon, GraduationCapIcon } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudentProfile, StudentProfile } from '@/services/students';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchStudentProfile()
      .then(data => {
        setProfile(data);
        setError(null);
      })
      .catch(() => {
        setError('فشل تحميل بيانات الطالب.');
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const getTrackTypeString = (type: number) => {
    switch (type) {
      case 1: return 'أكاديمي';
      case 2: return 'مهني';
      default: return 'غير محدد';
    }
  };

  const getTrackDegreeString = (degree: number) => {
    switch (degree) {
      case 1: return 'دبلوم';
      case 2: return 'ماجستير';
      case 3: return 'دكتوراه';
    }
  };

  const getStudyTypeString = (type: number) => {
    switch (type) {
      case 1: return 'اونلاين';
      case 2: return 'حضورى';
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center h-96">
          <span>جاري التحميل...</span>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="text-red-500 text-center p-4">{error}</div>
      </PageTransition>
    );
  }
  
  // Show empty state if there are no registrations
  if (!profile || !profile.track?.id) {
    return (
      <PageTransition>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-2xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <GraduationCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تسجيلات</h3>
            <p className="text-gray-500 mb-6">لم تقم بالتسجيل في أي برنامج دراسي بعد.</p>
            <Link
              to="/tracks"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              تصفح البرامج المتاحة
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
          <Card className="md:col-span-1 h-full flex flex-col">
            <CardHeader className="flex-1 flex flex-col justify-center items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={profile.fullName} />
                <AvatarFallback>{profile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{profile.track?.title}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="md:col-span-1 h-full">
            <CardHeader>
              <CardTitle className="text-lg">معلومات المسار الأكاديمي</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><strong>التخصص:</strong> {profile.education}</div>
              <div><strong>نوع المسار:</strong> {getTrackTypeString(profile.trackType)}</div>
              <div><strong>درجة المسار:</strong> {getTrackDegreeString(profile.trackDegree)}</div>
              <div><strong>نوع الدراسة:</strong> {getStudyTypeString(profile.studyType)}</div>
              <div><strong>تاريخ التسجيل:</strong> {new Date(profile.registrationDate).toLocaleDateString('ar-EG')}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">دوراتي</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.courses && profile.courses.length > 0 ? (
                profile.courses.map((course) => (
                  <Card key={course.courseCode}>
                    <CardHeader className="text-right">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-right">
                      <div className="w-full flex flex-col items-end gap-2 text-right">
                        <div className="text-sm">
                          <span>رمز المقرر: {course.courseCode}</span>
                          <BookIcon className="h-4 w-4 text-muted-foreground inline-block mr-2" />
                        </div>
                        <div className="text-sm">
                          <span>عدد الساعات: {course.credits}</span>
                          <GraduationCapIcon className="h-4 w-4 text-muted-foreground inline-block mr-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div>لا توجد دورات مسجلة.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
