import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';

export interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  track: string;
  registrationDate: string;
  isActive: boolean;
}

interface EditStudentDialogProps {
  student: StudentData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: StudentData) => void;
}

export const EditStudentDialog: React.FC<EditStudentDialogProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<StudentData>(student);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'الاسم مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.phone) newErrors.phone = 'رقم الجوال مطلوب';
    if (!formData.nationalId) newErrors.nationalId = 'رقم الهوية مطلوب';
    if (!formData.guardianName) newErrors.guardianName = 'اسم ولي الأمر مطلوب';
    if (!formData.guardianPhone) newErrors.guardianPhone = 'رقم جوال ولي الأمر مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          <DialogDescription>
            قم بتعديل بيانات الطالب. جميع الحقول المميزة بعلامة * مطلوبة.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              dir="rtl"
            />
            {errors.name && <FormError message={errors.name} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              dir="rtl"
            />
            {errors.email && <FormError message={errors.email} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              dir="rtl"
            />
            {errors.phone && <FormError message={errors.phone} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId">رقم الهوية *</Label>
            <Input
              id="nationalId"
              value={formData.nationalId}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              dir="rtl"
            />
            {errors.nationalId && <FormError message={errors.nationalId} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianName">اسم ولي الأمر *</Label>
            <Input
              id="guardianName"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              dir="rtl"
            />
            {errors.guardianName && <FormError message={errors.guardianName} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone">رقم جوال ولي الأمر *</Label>
            <Input
              id="guardianPhone"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              dir="rtl"
            />
            {errors.guardianPhone && <FormError message={errors.guardianPhone} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              dir="rtl"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
