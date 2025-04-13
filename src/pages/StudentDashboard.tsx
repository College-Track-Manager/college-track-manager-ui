
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/ui/PageTransition";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookIcon, GraduationCapIcon, FileTextIcon, ClockIcon } from "lucide-react";

const StudentDashboard = () => {
  // Mock student data
  const student = {
    name: "أحمد محمد",
    email: "ahmed.mohammed@example.com",
    track: "علوم الحاسوب",
    enrollmentDate: "١٥ سبتمبر ٢٠٢٣",
    progress: 35,
    avatar: "/placeholder.svg",
  };

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "مقدمة في البرمجة",
      instructor: "د. سارة وليامز",
      schedule: "الاثنين، الأربعاء ١٠:٠٠ - ١١:٣٠ صباحًا",
      completion: 80,
      nextClass: "غدًا، ١٠:٠٠ صباحًا",
      materials: 12,
    },
    {
      id: 2,
      title: "هياكل البيانات والخوارزميات",
      instructor: "أ. مايكل تشين",
      schedule: "الثلاثاء، الخميس ١:٠٠ - ٢:٣٠ مساءً",
      completion: 45,
      nextClass: "الخميس، ١:٠٠ مساءً",
      materials: 8,
    },
    {
      id: 3,
      title: "أنظمة قواعد البيانات",
      instructor: "د. إيميلي رودريجيز",
      schedule: "الجمعة ٩:٠٠ - ١٢:٠٠ مساءً",
      completion: 20,
      nextClass: "الجمعة، ٩:٠٠ صباحًا",
      materials: 5,
    },
  ];

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: "تم إصدار جدول الاختبارات النصفية",
      date: "٥ أكتوبر ٢٠٢٣",
      content: "تم إصدار جدول الاختبارات النصفية. يرجى التحقق من صفحات الدورات الخاصة بك للتواريخ والموضوعات المحددة.",
    },
    {
      id: 2,
      title: "محاضرة خاصة: اتجاهات الصناعة",
      date: "١٢ أكتوبر ٢٠٢٣",
      content: "ستعقد محاضرة خاصة حول اتجاهات الصناعة الحالية الأسبوع المقبل. ينصح بحضور جميع الطلاب.",
    },
  ];

  // Mock upcoming deadlines
  const deadlines = [
    { id: 1, course: "مقدمة في البرمجة", task: "تسليم المشروع", dueDate: "١٠ أكتوبر ٢٠٢٣" },
    { id: 2, course: "هياكل البيانات والخوارزميات", task: "الواجب #٣", dueDate: "١٥ أكتوبر ٢٠٢٣" },
    { id: 3, course: "أنظمة قواعد البيانات", task: "الاختبار القصير #٢", dueDate: "٨ أكتوبر ٢٠٢٣" },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription>{student.email}</CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{student.track}</Badge>
                  <Badge variant="outline" className="bg-primary/10">التسجيل: {student.enrollmentDate}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تقدم البرنامج</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>الإكمال الكلي</span>
                    <span>{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>
                <div className="text-center pt-3">
                  <p className="text-sm text-muted-foreground">استمر! أنت تحرز تقدمًا جيدًا.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">دوراتي</TabsTrigger>
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
            <TabsTrigger value="deadlines">المواعيد النهائية القادمة</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{course.schedule}</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>تقدم الدورة</span>
                        <span>{course.completion}%</span>
                      </div>
                      <Progress value={course.completion} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">الدرس القادم</span>
                        <span className="text-sm flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" /> {course.nextClass}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">المواد</span>
                        <span className="text-sm flex items-center gap-1">
                          <FileTextIcon className="h-3 w-3" /> {course.materials} ملفات
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-2">
                    <Button variant="outline" className="w-full">الذهاب إلى الدورة</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>إعلانات البرنامج</CardTitle>
                <CardDescription>إشعارات وتحديثات مهمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <span className="text-sm text-muted-foreground">{announcement.date}</span>
                      </div>
                      <p className="text-sm">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines">
            <Card>
              <CardHeader>
                <CardTitle>المواعيد النهائية القادمة</CardTitle>
                <CardDescription>الواجبات والمشاريع المستحقة قريبًا</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deadlines.map((deadline) => (
                    <div key={deadline.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{deadline.task}</h4>
                        <p className="text-sm text-muted-foreground">{deadline.course}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">الموعد النهائي: {deadline.dueDate}</p>
                        <Button size="sm" variant="ghost" className="mt-1 h-7 text-xs">عرض التفاصيل</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
