import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface DocumentViewerProps {
  documents: Document[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">المستندات المرفقة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <FileText className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 ml-2" />
                  عرض
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
