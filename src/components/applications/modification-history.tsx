import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export interface ModificationRecord {
  id: string;
  date: string;
  type: 'request' | 'update';
  description: string;
  by: string;
}

interface ModificationHistoryProps {
  records: ModificationRecord[];
}

export const ModificationHistory: React.FC<ModificationHistoryProps> = ({ records }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">سجل التعديلات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {records.map((record, index) => (
            <div key={record.id} className="flex gap-4">
              {/* Timeline line */}
              {index !== records.length - 1 && (
                <div className="absolute h-full w-0.5 bg-gray-200 right-6 top-8 -z-10" />
              )}
              
              {/* Timeline item */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <History className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {record.type === 'request' ? 'طلب تعديل' : 'تم التحديث'}
                    </p>
                    <p className="text-sm text-gray-500">{record.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{record.by}</span>
                      <span>•</span>
                      <span>{record.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
