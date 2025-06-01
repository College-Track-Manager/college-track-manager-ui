import React from 'react';
import { PageTransition } from '../../components/page-transition';
import { Overview } from '../../components/dashboard/overview';
import { RecentApplications } from '../../components/dashboard/recent-applications';
import { RecentPayments } from '../../components/dashboard/recent-payments';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/button';
import { Bell, Settings } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import { Toaster } from '../../components/ui/toaster';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: 'مرحباً بعودتك',
      description: 'تم تحديث لوحة التحكم بنجاح',
    });
  }, [toast]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex-1 space-y-8 p-8 pt-6">
        <Toaster />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
            <p className="text-muted-foreground">مرحباً {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overview and Recent Applications */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Overview />
          </div>
          <div className="col-span-3">
            <RecentApplications />
          </div>
        </div>

        {/* Recent Payments */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <RecentPayments />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
