import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GraduationCap } from 'lucide-react'; // Import the GraduationCap icon

const Profile = () => {
  const { user } = useAuth();
  // User's profile photo URL or null if not available
  const profilePhoto = user?.photoURL || null;
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="relative h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.fullName || 'Profile'} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <GraduationCap className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold mt-2">الملف الشخصى</CardTitle>
            <CardDescription>إدارة بيانات حسابك الشخصية</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">الاسم</label>
            <Input value={user?.fullName || ''} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium">البريد الإلكتروني</label>
            <Input value={user?.email || ''} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium">الرقم القومي</label>
            <Input value={user?.nationalId || ''} disabled className="bg-gray-200 " />
          </div>
          <div>
            <label className="block mb-1 font-medium">رقم الهاتف </label>
            <Input value={user?.phone || ''} disabled className="bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
