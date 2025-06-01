import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUsers } from '@/components/settings/admin-users';
import { NotificationTemplates } from '@/components/settings/notification-templates';
import { PaymentSettings } from '@/components/settings/payment-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  maxApplicationsPerTrack: number;
  applicationDeadline: string;
}

export const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'نظام إدارة المسارات الجامعية',
    siteDescription: 'منصة متكاملة لإدارة المسارات الجامعية وطلبات الالتحاق',
    supportEmail: 'support@example.com',
    supportPhone: '0501234567',
    maxApplicationsPerTrack: 100,
    applicationDeadline: '2025-08-31',
  });

  const handleSettingChange = (key: keyof SystemSettings, value: string | number) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveGeneralSettings = () => {
    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ الإعدادات العامة بنجاح',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">إعدادات النظام</h1>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="payment">الدفع</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">اسم الموقع</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">وصف الموقع</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">البريد الإلكتروني للدعم</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">رقم الدعم</Label>
                    <Input
                      id="supportPhone"
                      value={settings.supportPhone}
                      onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxApplications">الحد الأقصى للطلبات لكل مسار</Label>
                    <Input
                      id="maxApplications"
                      type="number"
                      value={settings.maxApplicationsPerTrack}
                      onChange={(e) => handleSettingChange('maxApplicationsPerTrack', parseInt(e.target.value))}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">الموعد النهائي للتقديم</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={settings.applicationDeadline}
                      onChange={(e) => handleSettingChange('applicationDeadline', e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveGeneralSettings} className="w-full">
                  حفظ الإعدادات العامة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationTemplates />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
