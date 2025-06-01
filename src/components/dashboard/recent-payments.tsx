import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';

interface Payment {
  id: number;
  name: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  email: string;
  track: string;
  paymentMethod: string;
  transactionId?: string;
}

const payments: Payment[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    amount: 5000,
    status: 'completed',
    date: '2025-05-30',
    email: 'ahmed@example.com',
    track: 'الطب',
    paymentMethod: 'بطاقة ائتمانية',
    transactionId: 'TXN123456',
  },
  {
    id: 2,
    name: 'سارة علي',
    amount: 4500,
    status: 'pending',
    date: '2025-05-29',
    email: 'sara@example.com',
    track: 'الهندسة',
    paymentMethod: 'تحويل بنكي',
  },
  {
    id: 3,
    name: 'محمد أحمد',
    amount: 5000,
    status: 'failed',
    date: '2025-05-28',
    email: 'mohammed@example.com',
    track: 'العلوم',
    paymentMethod: 'بطاقة ائتمانية',
    transactionId: 'TXN123457',
  },
];

const getStatusDetails = (status: Payment['status']) => {
  switch (status) {
    case 'completed':
      return {
        label: 'مكتمل',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      };
    case 'failed':
      return {
        label: 'مرفوض',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      };
    default:
      return {
        label: 'معلق',
        icon: AlertCircle,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
  }
};

export const RecentPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResendNotification = (payment: Payment) => {
    toast({
      title: 'تم إرسال الإشعار',
      description: `تم إرسال إشعار الدفع إلى ${payment.email}`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>آخر المدفوعات</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/payments')}
        >
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => {
            const status = getStatusDetails(payment.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border transition-all hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h3 className="font-semibold">{payment.name}</h3>
                    <Badge variant="outline" className={status.className}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {payment.amount.toLocaleString('ar-SA')} ريال
                  </p>
                  <p className="text-xs text-muted-foreground">{payment.track}</p>
                </div>
                <div className="text-left space-y-2">
                  <p className="text-xs text-muted-foreground">{payment.date}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => navigate(`/admin/payments/${payment.id}`)}
                    >
                      <Eye className="h-3 w-3 ml-1" />
                      عرض
                    </Button>
                    {payment.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleResendNotification(payment)}
                      >
                        <Send className="h-3 w-3 ml-1" />
                        إرسال
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
