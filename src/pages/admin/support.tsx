import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageCircle, Filter } from 'lucide-react';

// Mock data
const tickets = [
  {
    id: 'T001',
    studentName: 'أحمد محمد',
    subject: 'مشكلة في التسجيل',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-06-01T10:00:00',
    lastUpdate: '2025-06-01T10:30:00',
  },
  {
    id: 'T002',
    studentName: 'سارة أحمد',
    subject: 'استفسار عن المسارات',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2025-06-01T09:00:00',
    lastUpdate: '2025-06-01T09:45:00',
  },
];

const messages = [
  {
    id: 1,
    ticketId: 'T001',
    sender: 'student',
    message: 'لا أستطيع إكمال عملية التسجيل، تظهر لي رسالة خطأ',
    timestamp: '2025-06-01T10:00:00',
  },
  {
    id: 2,
    ticketId: 'T001',
    sender: 'admin',
    message: 'هل يمكنك إرسال لقطة شاشة للخطأ؟',
    timestamp: '2025-06-01T10:30:00',
  },
];

const statusColors = {
  pending: 'bg-yellow-500',
  'in-progress': 'bg-blue-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
};

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const SupportPage = () => {
  const [selectedTicket, setSelectedTicket] = React.useState<string | null>(null);
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Add message to the ticket
    setNewMessage('');
  };

  const getTicketMessages = (ticketId: string) => {
    return messages.filter(m => m.ticketId === ticketId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">دعم الطلاب</h1>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tickets">التذاكر الفنية</TabsTrigger>
          <TabsTrigger value="inquiries">الاستفسارات</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>التذاكر الفنية</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="ml-2 h-4 w-4" />
                  تصفية
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم التذكرة</TableHead>
                      <TableHead>الطالب</TableHead>
                      <TableHead>الموضوع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>آخر تحديث</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>{ticket.studentName}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge
                            className={statusColors[ticket.status as keyof typeof statusColors]}
                          >
                            {ticket.status === 'pending' ? 'معلق' : 
                             ticket.status === 'in-progress' ? 'قيد المعالجة' :
                             ticket.status === 'resolved' ? 'تم الحل' : 'مغلق'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={priorityColors[ticket.priority as keyof typeof priorityColors]}
                          >
                            {ticket.priority === 'high' ? 'عالية' :
                             ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.lastUpdate).toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedTicket(ticket.id)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>تذكرة #{ticket.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">تفاصيل التذكرة</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">الطالب:</span>{' '}
                                      {ticket.studentName}
                                    </div>
                                    <div>
                                      <span className="font-medium">الموضوع:</span>{' '}
                                      {ticket.subject}
                                    </div>
                                    <div>
                                      <span className="font-medium">تاريخ الإنشاء:</span>{' '}
                                      {new Date(ticket.createdAt).toLocaleString('ar-SA')}
                                    </div>
                                    <div>
                                      <span className="font-medium">آخر تحديث:</span>{' '}
                                      {new Date(ticket.lastUpdate).toLocaleString('ar-SA')}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold">المحادثة</h4>
                                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {getTicketMessages(ticket.id).map((message) => (
                                      <div
                                        key={message.id}
                                        className={`flex ${
                                          message.sender === 'admin'
                                            ? 'justify-start'
                                            : 'justify-end'
                                        }`}
                                      >
                                        <div
                                          className={`rounded-lg p-3 max-w-[80%] ${
                                            message.sender === 'admin'
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-muted'
                                          }`}
                                        >
                                          <p className="text-sm">{message.message}</p>
                                          <span className="text-xs opacity-70">
                                            {new Date(message.timestamp).toLocaleTimeString('ar-SA')}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Textarea
                                    placeholder="اكتب ردك هنا..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button onClick={handleSendMessage}>إرسال</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>الاستفسارات العامة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="search"
                  placeholder="البحث في الاستفسارات..."
                  className="max-w-sm"
                />
                
                {/* FAQ Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">التسجيل والقبول</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <Button variant="link" className="text-right">
                            كيف يمكنني التسجيل في البرنامج؟
                          </Button>
                        </li>
                        <li>
                          <Button variant="link" className="text-right">
                            ما هي متطلبات القبول؟
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">المسارات والبرامج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <Button variant="link" className="text-right">
                            ما هي المسارات المتاحة؟
                          </Button>
                        </li>
                        <li>
                          <Button variant="link" className="text-right">
                            كيف يمكنني تغيير مساري؟
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">المدفوعات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <Button variant="link" className="text-right">
                            ما هي طرق الدفع المتاحة؟
                          </Button>
                        </li>
                        <li>
                          <Button variant="link" className="text-right">
                            كيف يمكنني طلب استرداد المبلغ؟
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
