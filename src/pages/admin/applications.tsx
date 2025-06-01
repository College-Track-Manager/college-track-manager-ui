import React, { useState } from 'react';
import { ApplicationsTable, type Application } from '@/components/applications/applications-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data - replace with API call
const mockApplications: Application[] = [
  {
    id: '1',
    applicationNumber: 'APP-2025-001',
    studentName: 'أحمد محمد',
    date: '2025-05-31',
    status: 'pending',
  },
  {
    id: '2',
    applicationNumber: 'APP-2025-002',
    studentName: 'سارة أحمد',
    date: '2025-05-30',
    status: 'approved',
  },
  {
    id: '3',
    applicationNumber: 'APP-2025-003',
    studentName: 'محمد علي',
    date: '2025-05-29',
    status: 'rejected',
  },
  {
    id: '4',
    applicationNumber: 'APP-2025-004',
    studentName: 'فاطمة خالد',
    date: '2025-05-28',
    status: 'needs_modification',
  },
];

export const ApplicationsManagement = () => {
  const [applications] = useState<Application[]>(mockApplications);

  const handleViewDetails = (applicationId: string) => {
    // Navigate to application details or open modal
    console.log('View details for application:', applicationId);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">إدارة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationsTable
            applications={applications}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
};
