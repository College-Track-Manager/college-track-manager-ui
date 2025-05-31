import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentCode?: string;
  error?: string;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  isOpen,
  onClose,
  paymentCode,
  error
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تأكيد الدفع</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {paymentCode ? (
            <>
              <p className="text-center text-lg">
                رمز الدفع الخاص بك هو:
              </p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-center text-xl font-bold">{paymentCode}</p>
              </div>
              <p className="text-sm text-gray-500 text-center">
                يرجى الاحتفاظ بهذا الرمز للرجوع إليه لاحقاً
              </p>
            </>
          ) : (
            <FormError message={error || 'حدث خطأ أثناء إنشاء رمز الدفع'} />
          )}
          
          <div className="flex justify-center">
            <Button onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
