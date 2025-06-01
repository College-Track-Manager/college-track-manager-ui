import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'طلب جديد',
    message: 'تم استلام طلب التحاق جديد من الطالب أحمد محمد',
    type: 'info',
    time: '2025-06-01T11:30:00',
    isRead: false,
  },
  {
    id: '2',
    title: 'دفع معلق',
    message: 'يوجد دفعة معلقة تحتاج إلى مراجعة',
    type: 'warning',
    time: '2025-06-01T10:15:00',
    isRead: false,
  },
];

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentLanguage, setCurrentLanguage] = React.useState<'ar' | 'en'>('ar');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLanguageChange = (language: 'ar' | 'en') => {
    setCurrentLanguage(language);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="text-xl font-bold mr-4">
          نظام المسارات الجامعية
        </Link>

        {isAuthenticated && user?.role === 'admin' && (
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              لوحة التحكم
            </Link>
            <Link to="/admin/applications" className="text-gray-600 hover:text-gray-900">
              الطلبات
            </Link>
            <Link to="/admin/payments" className="text-gray-600 hover:text-gray-900">
              المدفوعات
            </Link>
            <Link to="/admin/students" className="text-gray-600 hover:text-gray-900">
              الطلاب
            </Link>
            <Link to="/admin/reports" className="text-gray-600 hover:text-gray-900">
              التقارير
            </Link>
            <Link to="/admin/support" className="text-gray-600 hover:text-gray-900">
              الدعم
            </Link>
            <Link to="/admin/settings" className="text-gray-600 hover:text-gray-900">
              الإعدادات
            </Link>
          </nav>
        )}

        <div className="flex-1 flex items-center justify-end gap-4">
          <form onSubmit={handleSearch} className="relative w-64">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="بحث..."
              className="w-full pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir="rtl"
            />
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('ar')}
                className={currentLanguage === 'ar' ? 'bg-accent' : ''}
              >
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className={currentLanguage === 'en' ? 'bg-accent' : ''}
              >
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>الإشعارات</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    لا توجد إشعارات
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        !notification.isRead && 'bg-accent'
                      )}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(notification.time).toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{notification.message}</p>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {isAuthenticated ? (
            <Button
              onClick={() => logout()}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              تسجيل الخروج
            </Button>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};


