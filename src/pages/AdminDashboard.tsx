
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/ui/PageTransition";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import React from 'react'; // Added React for useState
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { registrationsApi } from '@/services/registrations'
import { StudentRegistration } from '@/services/registrations';

const AdminDashboard = () => {
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = React.useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = React.useState<string | null>(null);
  const [isConfirmPaymentDialogOpen, setIsConfirmPaymentDialogOpen] = React.useState(false);
  const [paymentToConfirmId, setPaymentToConfirmId] = React.useState<number | null>(null);
  const [pendingApplications, setPendingApplications] = useState<StudentRegistration[]>([]);
  const [reviewedApplications, setreviewedApplications] = useState<StudentRegistration[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch all data when component mounts
    const fetchData = async () => {
      try {
        const [pendingApps] = await Promise.all([
          registrationsApi.fetchPendingApplications(0)
        ]);
        
        setPendingApplications(pendingApps);
      
               
      } catch (err) {
        console.error("Error fetching data:", err);
        // Handle error appropriately, e.g., show a notification
      }
    };
    
    fetchData();
  }, []);
  
  // Mock data for pending applications
  // const pendingApplications = [
  //   { id: 6, name: "نورا عبدالله", track: "تطوير تطبيقات الجوال", date: "2023-09-12", status: "disapproved", email: "noura.abdullah@example.com", type: "مهني" },
  //   { id: 2, name: "سارة أحمد", track: "علوم البيانات", date: "2023-09-16", status: "pending" },
  //   { id: 8, name: "فاطمة علي", track: "الأمن السيبراني", date: "2023-09-14", status: "disapproved", email: "fatima.ali@example.com", type: "مهني" },
  // ];


useEffect(() => {
    // Fetch all data when component mounts
    const fetchData = async () => {
      try {
        const [reviewedApplications] = await Promise.all([
          registrationsApi.fetchProcessedApplications(3)
        ]);
        
        setreviewedApplications(reviewedApplications);
      
               
      } catch (err) {
        console.error("Error fetching data:", err);
        // Handle error appropriately, e.g., show a notification
      }
    };
    
    fetchData();
  }, []);

  // Mock data for reviewed applications
  // const reviewedApplications = [
  //   { id: 4, name: "مريم حسن", track: "الذكاء الاصطناعي وتعلم الآلة", date: "2023-09-10", status: "approved", email: "sara.fahad@example.com", type: "مهني" },
  //   { id: 5, name: "محمد إبراهيم", track: "تطوير الويب", date: "2023-09-11", status: "disapproved", email: "mohammed.ibrahim@example.com", type: "أكاديمي" },
  //   { id: 6, name: "نورا عبدالله", track: "تطوير تطبيقات الجوال", date: "2023-09-12", status: "modified" },
  //   { id: 7, name: "خالد عمر", track: "علوم الحاسوب", date: "2023-09-13", status: "approved", email: "khaled.omar@example.com", type: "أكاديمي" },
  // ];

  // Mock data for payments pending confirmation
  // Mock data for payments pending confirmation
  const pendingPayments = [
    { id: 4, name: "مريم حسن", track: "الذكاء الاصطناعي وتعلم الآلة", date: "2023-09-14", amount: "٢,٥٠٠ ريال", receiptImageUrl: "https://via.placeholder.com/400x600.png?text=Receipt+Maryam" },
    { id: 7, name: "خالد عمر", track: "علوم الحاسوب", date: "2023-09-18", amount: "٢,٢٠٠ ريال", receiptImageUrl: "https://via.placeholder.com/400x600.png?text=Receipt+Khaled" },
  ];

  const getStatusBadge = (status: number) => {
    debugger;
    switch (status) {
      case 1:
        return <Badge className="bg-green-500">مقبول</Badge>;
      case 2:
        return <Badge variant="destructive">مرفوض</Badge>;
      case -1:
        return <Badge variant="outline" className="border-amber-500 text-amber-500">طلب تعديل</Badge>;
      case 0:
        return <Badge variant="outline" className="border-blue-500 text-blue-500">قيد المراجعة</Badge>;
      case 2:
        return <Badge variant="outline" className="border-red-500 text-red-500">مرفوض</Badge>;
      case 1:
        return <Badge variant="outline" className="border-green-500 text-green-500">مقبول</Badge>;
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
            {/* <TabsTrigger value="payments">المدفوعات</TabsTrigger> */}

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
                            <p className="text-sm text-muted-foreground">تاريخ التقديم: {new Date(app.registrationDate).toLocaleDateString('ar-EG')}</p>
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
                          <Button size="sm" variant="default" onClick={() => navigate(`/admin/review-application/${app.id}`)}>مراجعة</Button>
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
                        <p className="text-sm text-muted-foreground mt-1 mb-3 text-right">تاريخ المراجعة: {new Date(app.registrationDate).toLocaleDateString('ar-EG')}</p>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/review-application/${app.id}`, { state: { isReadOnlyView: true, status: app.status, applicantName: app.name, trackName: app.track } })}>عرض التفاصيل</Button>
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
                        <Button size="sm" variant="default" className="flex-1" onClick={() => { setPaymentToConfirmId(payment.id); setIsConfirmPaymentDialogOpen(true); }}>تأكيد الدفع</Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelectedReceiptUrl(payment.receiptImageUrl); setIsReceiptDialogOpen(true); }}>عرض الإيصال</Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>

        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">عرض إيصال الدفع</DialogTitle>
              <DialogDescription className="text-right">
                تفاصيل إيصال الدفع. يمكنك تحميل نسخة من الإيصال.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedReceiptUrl ? (
                <img src={selectedReceiptUrl} alt="إيصال الدفع" className="max-w-full h-auto rounded-md" />
              ) : (
                <p>لا يمكن عرض الإيصال.</p>
              )}
            </div>
            <DialogFooter style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '1rem' }}>
              {selectedReceiptUrl && (
                <Button asChild variant="default">
                  <a href={selectedReceiptUrl} download={`receipt-${Date.now()}.png`}>تحميل الإيصال</a>
                </Button>
              )}
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إغلاق
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isConfirmPaymentDialogOpen} onOpenChange={setIsConfirmPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">تأكيد عملية الدفع</DialogTitle>
              <DialogDescription className="text-right">
                هل أنت متأكد من رغبتك في تأكيد هذا الدفع؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '1rem', paddingTop: '1rem' }}>
              <Button variant="default" onClick={() => {
                // TODO: Implement actual payment confirmation logic here (e.g., API call)
                console.log(`Payment confirmed for ID: ${paymentToConfirmId}`);
                setIsConfirmPaymentDialogOpen(false);
                setPaymentToConfirmId(null);
                // Optionally, refresh payments list or remove the confirmed payment from the list
              }}>
                نعم، تأكيد الدفع
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
