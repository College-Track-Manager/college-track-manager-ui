import React from 'react';
import { StatsCard } from '@/components/ui/stats-card';
import { NotificationCard, type Notification } from '@/components/ui/notification-card';
import { QuickActions } from '@/components/ui/quick-actions';
import { FileText, DollarSign, Clock, Users } from 'lucide-react';

// Mock data - replace with actual API calls
const stats = [
  {
    title: 'طلبات جديدة',
    value: 24,
    icon: FileText,
    trend: { value: 12, isPositive: true },
    description: 'في آخر 24 ساعة'
  },
  {
    title: 'طلبات معلقة',
    value: 15,
    icon: Clock,
    description: 'تحتاج إلى مراجعة'
  },
  {
    title: 'مدفوعات حديثة',
    value: '12,450 ريال',
    icon: DollarSign,
    trend: { value: 8, isPositive: true },
    description: 'هذا الأسبوع'
  },
  {
    title: 'إجمالي الطلاب',
    value: 156,
    icon: Users,
    trend: { value: 5, isPositive: true },
    description: 'هذا الشهر'
  }
];

const notifications: Notification[] = [
  {
    id: '1',
    title: 'طلبات تحتاج للمراجعة',
    message: 'يوجد 5 طلبات جديدة تحتاج إلى مراجعة عاجلة',
    timestamp: 'قبل 30 دقيقة',
    type: 'warning'
  },
  {
    id: '2',
    title: 'تم تأكيد الدفع',
    message: 'تم تأكيد دفع جديد لـ 3 طلاب',
    timestamp: 'قبل ساعة',
    type: 'success'
  },
  {
    id: '3',
    title: 'تحديث النظام',
    message: 'سيتم تحديث النظام الليلة الساعة 12 صباحاً',
    timestamp: 'قبل ساعتين',
    type: 'info'
  }
];

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-gray-500">مرحباً بك، المشرف</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              description={stat.description}
              trend={stat.trend}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* Notifications */}
        <NotificationCard notifications={notifications} />
      </div>
    </div>
  );
};
