import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, FileSearch, UserCheck, CreditCard, Settings } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'مراجعة الطلبات',
    description: 'مراجعة وإدارة طلبات التسجيل الجديدة',
    icon: FileSearch,
    path: '/admin/applications',
  },
  {
    title: 'التحقق من الدفع',
    description: 'التحقق من حالة الدفع وتأكيد التسجيل',
    icon: CreditCard,
    path: '/admin/payment-verification',
  },
  {
    title: 'إدارة المستخدمين',
    description: 'إدارة حسابات المستخدمين والصلاحيات',
    icon: UserCheck,
    path: '/admin/users',
  },
  {
    title: 'إعدادات النظام',
    description: 'تعديل إعدادات النظام والتكوين',
    icon: Settings,
    path: '/admin/settings',
  },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>إجراءات سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.path}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center text-center space-y-2"
                onClick={() => navigate(action.path)}
              >
                <Icon className="h-6 w-6 mb-2" />
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
