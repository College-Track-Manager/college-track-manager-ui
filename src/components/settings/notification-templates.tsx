import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms';
}

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'قبول الطلب',
    subject: 'تم قبول طلبك',
    content: 'عزيزي {name}،\n\nنود إخبارك بأنه تم قبول طلبك. رقم الدفع الخاص بك هو: {payment_code}\n\nمع تحياتنا',
    type: 'email',
  },
  {
    id: '2',
    name: 'رفض الطلب',
    subject: 'تم رفض طلبك',
    content: 'عزيزي {name}،\n\nنأسف لإخبارك بأنه تم رفض طلبك للأسباب التالية:\n{rejection_reason}\n\nمع تحياتنا',
    type: 'email',
  },
  {
    id: '3',
    name: 'تأكيد الدفع',
    subject: 'تم تأكيد الدفع',
    content: 'تم تأكيد دفع المبلغ {amount} ريال. رقم المرجع: {reference}',
    type: 'sms',
  },
];

const availableVariables = {
  email: [
    { id: 'name', label: 'اسم الطالب', placeholder: '{name}' },
    { id: 'payment_code', label: 'رقم الدفع', placeholder: '{payment_code}' },
    { id: 'rejection_reason', label: 'سبب الرفض', placeholder: '{rejection_reason}' },
    { id: 'amount', label: 'المبلغ', placeholder: '{amount}' },
    { id: 'reference', label: 'رقم المرجع', placeholder: '{reference}' },
  ],
  sms: [
    { id: 'name', label: 'اسم الطالب', placeholder: '{name}' },
    { id: 'amount', label: 'المبلغ', placeholder: '{amount}' },
    { id: 'reference', label: 'رقم المرجع', placeholder: '{reference}' },
  ],
};

export const NotificationTemplates = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [editedTemplate, setEditedTemplate] = useState<NotificationTemplate>(templates[0]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEditedTemplate(template);
    }
  };

  const handleSave = () => {
    setTemplates(templates.map(template =>
      template.id === selectedTemplate ? editedTemplate : template
    ));
    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ التغييرات بنجاح',
    });
  };

  const currentVariables = availableVariables[editedTemplate.type];

  return (
    <Card>
      <CardHeader>
        <CardTitle>قوالب الإشعارات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>اختر القالب</Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>نوع الإشعار</Label>
            <Select
              value={editedTemplate.type}
              onValueChange={(value: 'email' | 'sms') => 
                setEditedTemplate({ ...editedTemplate, type: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">بريد إلكتروني</SelectItem>
                <SelectItem value="sms">رسالة نصية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editedTemplate.type === 'email' && (
            <div className="space-y-2">
              <Label>عنوان الرسالة</Label>
              <Textarea
                value={editedTemplate.subject}
                onChange={(e) => setEditedTemplate({
                  ...editedTemplate,
                  subject: e.target.value,
                })}
                dir="rtl"
                className="h-20"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>محتوى الرسالة</Label>
            <Textarea
              value={editedTemplate.content}
              onChange={(e) => setEditedTemplate({
                ...editedTemplate,
                content: e.target.value,
              })}
              dir="rtl"
              className="h-40"
            />
          </div>

          <div className="space-y-2">
            <Label>المتغيرات المتاحة</Label>
            <div className="grid grid-cols-2 gap-2">
              {currentVariables.map(variable => (
                <div
                  key={variable.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{variable.label}</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {variable.placeholder}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            حفظ التغييرات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
