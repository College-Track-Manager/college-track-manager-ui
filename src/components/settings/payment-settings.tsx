import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormError } from '@/components/ui/form-error';
import { toast } from '@/components/ui/use-toast';

interface PaymentGateway {
  id: string;
  name: string;
  isActive: boolean;
  apiKey: string;
  secretKey: string;
  mode: 'test' | 'live';
}

const mockGateways: PaymentGateway[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    isActive: true,
    apiKey: 'pk_test_...',
    secretKey: 'sk_test_...',
    mode: 'test',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    isActive: false,
    apiKey: '',
    secretKey: '',
    mode: 'test',
  },
];

export const PaymentSettings = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  const [selectedGateway, setSelectedGateway] = useState<string>(gateways[0].id);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentGateway = gateways.find(g => g.id === selectedGateway) || gateways[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentGateway.isActive) {
      if (!currentGateway.apiKey) {
        newErrors.apiKey = 'مفتاح API مطلوب';
      }
      if (!currentGateway.secretKey) {
        newErrors.secretKey = 'المفتاح السري مطلوب';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setGateways(gateways.map(gateway =>
      gateway.id === selectedGateway ? currentGateway : gateway
    ));

    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ إعدادات الدفع بنجاح',
    });
  };

  const updateGateway = (updates: Partial<PaymentGateway>) => {
    const updatedGateway = { ...currentGateway, ...updates };
    setGateways(gateways.map(g =>
      g.id === selectedGateway ? updatedGateway : g
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الدفع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>بوابة الدفع</Label>
            <Select
              value={selectedGateway}
              onValueChange={setSelectedGateway}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gateways.map(gateway => (
                  <SelectItem key={gateway.id} value={gateway.id}>
                    {gateway.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>تفعيل بوابة الدفع</Label>
            <Switch
              checked={currentGateway.isActive}
              onCheckedChange={(checked) => updateGateway({ isActive: checked })}
            />
          </div>

          {currentGateway.isActive && (
            <>
              <div className="space-y-2">
                <Label>بيئة العمل</Label>
                <Select
                  value={currentGateway.mode}
                  onValueChange={(value: 'test' | 'live') => 
                    updateGateway({ mode: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">تجريبي</SelectItem>
                    <SelectItem value="live">إنتاج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">مفتاح API</Label>
                <Input
                  id="apiKey"
                  value={currentGateway.apiKey}
                  onChange={(e) => updateGateway({ apiKey: e.target.value })}
                  type="password"
                  dir="ltr"
                />
                {errors.apiKey && <FormError message={errors.apiKey} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">المفتاح السري</Label>
                <Input
                  id="secretKey"
                  value={currentGateway.secretKey}
                  onChange={(e) => updateGateway({ secretKey: e.target.value })}
                  type="password"
                  dir="ltr"
                />
                {errors.secretKey && <FormError message={errors.secretKey} />}
              </div>

              <div className="space-y-2">
                <Label>الإعدادات الإضافية</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="successUrl">رابط نجاح الدفع</Label>
                    <Input
                      id="successUrl"
                      placeholder="https://..."
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancelUrl">رابط إلغاء الدفع</Label>
                    <Input
                      id="cancelUrl"
                      placeholder="https://..."
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Button onClick={handleSave} className="w-full">
            حفظ الإعدادات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
