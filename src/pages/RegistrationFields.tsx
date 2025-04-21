import { Control } from 'react-hook-form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';

interface RegistrationFieldsProps {
  control: Control<any>;
}

export function RegistrationFields({ control }: RegistrationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First & Last Name */}
      <div>
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">الاسم الأول</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="الاسم الأول" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">الاسم الأخير</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="الاسم الأخير" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Email & Phone */}
      <div>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">رقم الهاتف</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  placeholder="رقم الهاتف" 
                  {...field} 
                  maxLength={11} 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onInput={e => {
                    const value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 11);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Address & National ID (swapped) */}
      <div className="md:col-span-1">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">العنوان</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="عنوانك" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">الرقم القومي</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  placeholder="الرقم القومي" 
                  {...field} 
                  maxLength={14} 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onInput={e => {
                    const value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 14);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Password & Confirm Password */}
      <div>
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">كلمة المرور</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" type="password" placeholder="كلمة المرور" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-right mb-1 px-0">تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <Input className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" type="password" placeholder="تأكيد كلمة المرور" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
