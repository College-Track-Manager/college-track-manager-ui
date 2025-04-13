
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/ui/PageTransition";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminDashboard = () => {
  // Mock data for pending applications
  const pendingApplications = [
    { id: 1, name: "أحمد محمد", track: "علوم الحاسوب", date: "2023-09-15", status: "pending" },
    { id: 2, name: "سارة أحمد", track: "علوم البيانات", date: "2023-09-16", status: "pending" },
    { id: 3, name: "علي خالد", track: "الأمن السيبراني", date: "2023-09-17", status: "pending" },
  ];

  // Mock data for reviewed applications
  const reviewedApplications = [
    { id: 4, name: "مريم حسن", track: "الذكاء الاصطناعي وتعلم الآلة", date: "2023-09-10", status: "accepted" },
    { id: 5, name: "محمد إبراهيم", track: "تطوير الويب", date: "2023-09-11", status: "rejected" },
    { id: 6, name: "نورا عبدالله", track: "تطوير تطبيقات الجوال", date: "2023-09-12", status: "modified" },
    { id: 7, name: "خالد عمر", track: "علوم الحاسوب", date: "2023-09-13", status: "accepted" },
  ];

  // Mock data for payments pending confirmation
  const pendingPayments = [
    { id: 4, name: "مريم حسن", track: "الذكاء الاصطناعي وتعلم الآلة", date: "2023-09-14", amount: "٢,٥٠٠ ريال" },
    { id: 7, name: "خالد عمر", track: "علوم الحاسوب", date: "2023-09-18", amount: "٢,٢٠٠ ريال" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500">مقبول</Badge>;
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      case "modified":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">طلب تعديل</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">قيد المراجعة</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 text-right">
        <h1 className="text-3xl font-bold mb-2">لوحة تحكم المسؤول</h1>
        <p className="text-muted-foreground mb-8">إدارة طلبات الطلاب ومتابعة تسجيلات البرامج</p>

        <Tabs defaultValue="applications" dir="rtl">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">الطلبات</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
            <TabsTrigger value="courses">إدارة الدورات</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الطلبات المعلقة</CardTitle>
                  <CardDescription>مراجعة طلبات الطلاب الجديدة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pl-4">
                    {pendingApplications.map((app) => (
                      <div key={app.id} className="mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">تاريخ التقديم: {app.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <h4 className="font-medium">{app.name}</h4>
                              <p className="text-sm text-muted-foreground">{app.track}</p>
                            </div>
                            <Avatar>
                              <AvatarFallback>{app.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 justify-end">
                          <Button size="sm" variant="outline">التفاصيل</Button>
                          <Button size="sm" variant="default">مراجعة</Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الطلبات التي تمت مراجعتها</CardTitle>
                  <CardDescription>الطلبات التي قمت بمعالجتها بالفعل</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pl-4">
                    {reviewedApplications.map((app) => (
                      <div key={app.id} className="mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-right">
                            {getStatusBadge(app.status)}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <h4 className="font-medium">{app.name}</h4>
                              <p className="text-sm text-muted-foreground">{app.track}</p>
                            </div>
                            <Avatar>
                              <AvatarFallback>{app.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 mb-3 text-right">تاريخ المراجعة: {app.date}</p>
                        <Button size="sm" variant="outline" className="w-full">عرض التفاصيل</Button>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>تأكيدات الدفع المعلقة</CardTitle>
                <CardDescription>مراجعة وتأكيد مدفوعات الطلاب</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="mb-4 p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-left">
                          <p className="font-medium">{payment.amount}</p>
                          <Badge variant="outline" className="mt-1">تم رفع الإيصال</Badge>
                        </div>
                        <div className="text-right">
                          <h4 className="font-medium">{payment.name}</h4>
                          <p className="text-sm text-muted-foreground">{payment.track}</p>
                          <p className="text-sm text-muted-foreground">تاريخ التقديم: {payment.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">عرض الإيصال</Button>
                        <Button size="sm" className="flex-1">تأكيد الدفع</Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الدورات</CardTitle>
                <CardDescription>إدارة الدورات وتسجيلات الطلاب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <p className="text-muted-foreground">ميزات إدارة الدورات قادمة قريبًا</p>
                  <Button className="mt-4">إنشاء دورة جديدة</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
