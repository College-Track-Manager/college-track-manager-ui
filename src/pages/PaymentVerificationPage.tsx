import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';
import { RegistrationConfirmationDialog } from '@/components/ui/registration-confirmation-dialog';

interface PaymentVerificationPageProps {
  // Add props if needed
}

interface PaymentStatus {
  verified: boolean;
  studentName?: string;
  canConfirmRegistration?: boolean;
}

export const PaymentVerificationPage: React.FC<PaymentVerificationPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('الرجاء إدخال رقم الطالب أو رمز الدفع');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      // const result = await api.verifyPayment(searchTerm);
      
      // Mock response for demonstration
      setPaymentStatus({
        verified: true,
        studentName: 'أحمد محمد',
        canConfirmRegistration: true
      });
    } catch (err) {
      setError('حدث خطأ أثناء التحقق من الدفع. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">التحقق من الدفع</h1>
        
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="أدخل رقم الطالب أو رمز الدفع"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              dir="rtl"
            />
            <FormError message={error} />
          </div>

          <Button
            onClick={handleSearch}
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? 'جاري التحقق...' : 'تحقق من الدفع'}
          </Button>

          {paymentStatus?.verified && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <div className="text-center text-green-600 font-semibold">
                تم التحقق من الدفع بنجاح
              </div>
              {paymentStatus.canConfirmRegistration && (
                <Button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full"
                  variant="secondary"
                >
                  تأكيد التسجيل
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <RegistrationConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        studentName={paymentStatus?.studentName}
      />
    </div>
  );
};
