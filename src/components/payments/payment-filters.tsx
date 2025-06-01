import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface PaymentFiltersProps {
  onStatusChange: (status: string) => void;
  onDateChange: (dates: { from: Date; to: Date }) => void;
  onReset: () => void;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  onStatusChange,
  onDateChange,
  onReset,
}) => {
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    setFromDate(from);
    setToDate(to);
    if (from && to) {
      onDateChange({ from, to });
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <Select onValueChange={onStatusChange} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="حالة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="success">ناجح</SelectItem>
              <SelectItem value="failed">فاشل</SelectItem>
              <SelectItem value="pending">معلق</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-right">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {fromDate ? (
                    format(fromDate, 'PPP', { locale: ar })
                  ) : (
                    'من تاريخ'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-right">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {toDate ? (
                    format(toDate, 'PPP', { locale: ar })
                  ) : (
                    'إلى تاريخ'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    setToDate(date);
                    if (fromDate && date) {
                      onDateChange({ from: fromDate, to: date });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reset Button */}
          <Button variant="outline" onClick={onReset}>
            إعادة تعيين
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
