import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ActionButtonsProps {
  loading?: boolean;
  onApprove: (paymentCode: string) => void;
  onRequestModification: (notes: string) => void;
  onReject: (reason: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading = false,
  onApprove,
  onRequestModification,
  onReject,
}) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    const paymentCode = generatePaymentCode();
    onApprove(paymentCode);
    setShowApproveDialog(false);
  };

  const handleRequestModification = () => {
    onRequestModification(notes);
    setNotes('');
    setShowModificationDialog(false);
  };

  const handleReject = () => {
    onReject(rejectReason);
    setRejectReason('');
    setShowRejectDialog(false);
  };

  const generatePaymentCode = () => {
    // This should be handled by the backend
    return 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => setShowApproveDialog(true)}
          className="bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          <CheckCircle className="ml-2 h-4 w-4" />
          قبول الطلب
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowModificationDialog(true)}
          disabled={loading}
        >
          <AlertCircle className="ml-2 h-4 w-4" />
          طلب تعديل
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowRejectDialog(true)}
          disabled={loading}
        >
          <XCircle className="ml-2 h-4 w-4" />
          رفض الطلب
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد قبول الطلب</DialogTitle>
            <DialogDescription>
              سيتم قبول الطلب وإنشاء كود دفع للطالب. هل أنت متأكد؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              تأكيد القبول
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modification Dialog */}
      <Dialog open={showModificationDialog} onOpenChange={setShowModificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>طلب تعديل</DialogTitle>
            <DialogDescription>
              الرجاء إدخال الملاحظات المطلوب تعديلها
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اكتب الملاحظات هنا..."
            className="min-h-[100px]"
            dir="rtl"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModificationDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleRequestModification}>
              إرسال طلب التعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض الطلب</DialogTitle>
            <DialogDescription>
              الرجاء تحديد سبب الرفض
            </DialogDescription>
          </DialogHeader>
          <Select value={rejectReason} onValueChange={setRejectReason}>
            <SelectTrigger>
              <SelectValue placeholder="اختر سبب الرفض" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incomplete_documents">مستندات غير مكتملة</SelectItem>
              <SelectItem value="invalid_documents">مستندات غير صحيحة</SelectItem>
              <SelectItem value="requirements_not_met">لم يتم استيفاء الشروط</SelectItem>
              <SelectItem value="other">سبب آخر</SelectItem>
            </SelectContent>
          </Select>
          {rejectReason === 'other' && (
            <Textarea
              placeholder="اذكر السبب..."
              className="mt-2"
              dir="rtl"
              onChange={(e) => setRejectReason(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
