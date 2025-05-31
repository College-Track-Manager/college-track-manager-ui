import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/form-error';

interface PaymentVerificationPageProps {
  // Add props if needed
}

export const PaymentVerificationPage: React.FC<PaymentVerificationPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('الرجاء إدخال رقم الطالب أو رمز الدفع');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add your API call here
      // const result = await api.verifyPayment(searchTerm);
      
      // Handle success
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
            className="w-full"
            disabled={loading}
          >
            {loading ? 'جاري التحقق...' : 'تحقق من الدفع'}
          </Button>
        </div>
      </div>
    </div>
  );
};
