import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, FileCheck, FileX, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  name: string;
  track: string;
  status: 'pending' | 'approved' | 'rejected' | 'review';
  date: string;
  email: string;
  phone: string;
  documents: string[];
}

const applications: Application[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    track: 'الطب',
    status: 'pending',
    date: '2025-05-30',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    documents: ['الهوية', 'الشهادة الجامعية'],
  },
  {
    id: 2,
    name: 'سارة علي',
    track: 'الهندسة',
    status: 'approved',
    date: '2025-05-29',
    email: 'sara@example.com',
    phone: '+966 55 987 6543',
    documents: ['الهوية', 'الشهادة الجامعية', 'السيرة الذاتية'],
  },
  {
    id: 3,
    name: 'محمد أحمد',
    track: 'العلوم',
    status: 'rejected',
    date: '2025-05-28',
    email: 'mohammed@example.com',
    phone: '+966 54 321 7890',
    documents: ['الهوية'],
  },
];

const getStatusDetails = (status: Application['status']) => {
  switch (status) {
    case 'approved':
      return {
        label: 'مقبول',
        icon: FileCheck,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      };
    case 'rejected':
      return {
        label: 'مرفوض',
        icon: FileX,
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      };
    case 'review':
      return {
        label: 'يحتاج مراجعة',
        icon: Eye,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      };
    default:
      return {
        label: 'قيد المراجعة',
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
  }
};

export const RecentApplications = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>آخر الطلبات</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/applications')}
        >
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => {
            const status = getStatusDetails(app.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border transition-all hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h3 className="font-semibold">{app.name}</h3>
                    <Badge variant="outline" className={status.className}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.track}</p>
                  <p className="text-xs text-muted-foreground">{app.email}</p>
                </div>
                <div className="text-left space-y-2">
                  <p className="text-xs text-muted-foreground">{app.date}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate(`/admin/applications/${app.id}`)}
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
