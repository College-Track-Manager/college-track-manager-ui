import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>الملف الشخصى</CardTitle>
          <CardDescription>إدارة بيانات حسابك الشخصية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">الاسم</label>
            <Input value={user?.name || ''} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium">البريد الإلكتروني</label>
            <Input value={user?.email || ''} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium">الرقم القومي</label>
            <Input value={user?.nationalId || ''} disabled className="bg-gray-200 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
