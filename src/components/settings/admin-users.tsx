import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/ui/form-error';
import { UserPlus, Edit, Trash } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'أحمد المشرف',
    email: 'admin@example.com',
    role: 'super_admin',
    permissions: ['all'],
    isActive: true,
  },
  {
    id: '2',
    name: 'محمد المشرف',
    email: 'mod@example.com',
    role: 'moderator',
    permissions: ['view_applications', 'review_applications'],
    isActive: true,
  },
];

const availablePermissions = [
  { id: 'manage_users', label: 'إدارة المستخدمين' },
  { id: 'manage_settings', label: 'إدارة الإعدادات' },
  { id: 'view_applications', label: 'عرض الطلبات' },
  { id: 'review_applications', label: 'مراجعة الطلبات' },
  { id: 'manage_payments', label: 'إدارة المدفوعات' },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    permissions: [] as string[],
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = 'الاسم مطلوب';
    if (!formData.email) errors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.role) errors.role = 'الدور مطلوب';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...editingUser, ...formData }
          : user
      ));
    } else {
      setUsers([...users, {
        id: Math.random().toString(),
        ...formData,
        isActive: true,
      }]);
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      permissions: [],
    });
    setFormErrors({});
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة المستخدمين</CardTitle>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-right">الاسم</th>
                <th className="p-3 text-right">البريد الإلكتروني</th>
                <th className="p-3 text-right">الدور</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.role === 'super_admin' ? 'مشرف عام' :
                     user.role === 'admin' ? 'مشرف' : 'مراجع'}
                  </td>
                  <td className="p-3">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={(checked) => {
                        setUsers(users.map(u =>
                          u.id === user.id ? { ...u, isActive: checked } : u
                        ));
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={showAddDialog || !!editingUser} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
            </DialogTitle>
            <DialogDescription>
              قم بتعبئة البيانات التالية. جميع الحقول مطلوبة.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                dir="rtl"
              />
              {formErrors.name && <FormError message={formErrors.name} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                dir="rtl"
              />
              {formErrors.email && <FormError message={formErrors.email} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">الدور</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مشرف</SelectItem>
                  <SelectItem value="moderator">مراجع</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && <FormError message={formErrors.role} />}
            </div>

            <div className="space-y-2">
              <Label>الصلاحيات</Label>
              <div className="grid grid-cols-2 gap-4">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Switch
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked
                          ? [...formData.permissions, permission.id]
                          : formData.permissions.filter(p => p !== permission.id);
                        setFormData({ ...formData, permissions: newPermissions });
                      }}
                    />
                    <Label htmlFor={permission.id} className="mr-2">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'حفظ التغييرات' : 'إضافة المستخدم'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
