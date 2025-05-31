import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface RegistrationConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export const RegistrationConfirmationDialog: React.FC<RegistrationConfirmationDialogProps> = ({
  isOpen,
  onClose,
  studentName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تأكيد التسجيل</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">
              تم تأكيد التسجيل بنجاح!
            </h3>
            {studentName && (
              <p className="text-gray-600">
                مرحباً {studentName}، تم تأكيد تسجيلك في البرنامج.
              </p>
            )}
            <p className="text-sm text-gray-500">
              سيتم إرسال تفاصيل البرنامج إلى بريدك الإلكتروني.
            </p>
          </div>
          <Button onClick={onClose} className="mt-4">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
