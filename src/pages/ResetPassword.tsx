import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { resetPasswordApi } from "@/services/login";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Store sensitive params in state, then clean URL
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const emailParam = params.get("email") || "";
    const tokenParam = params.get("token") || "";
    setEmail(emailParam);
    setToken(tokenParam);
    if (emailParam && tokenParam) {
      window.history.replaceState({}, "", "/reset-password");
    }
  }, [location.search]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.custom((t) => (
        <div
          className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in"
          style={{ minWidth: 320 }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#ef4444"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-lg font-medium">
            كلمة المرور ضعيفة. يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.
          </span>
        </div>
      ), { position: "top-center", duration: 5000 });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.custom((t) => (
        <div
          className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in"
          style={{ minWidth: 320 }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#ef4444"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-lg font-medium">
            كلمتا المرور غير متطابقتين.
          </span>
        </div>
      ), { position: "top-center", duration: 5000 });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await resetPasswordApi({ email, token, newPassword });
      if (response.ok) {
        navigate("/status", {
          state: {
            type: "success",
            title: "تم تغيير كلمة المرور",
            message: response.message || "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
            buttonText: "الذهاب لتسجيل الدخول",
            buttonTo: "/login",
          },
        });
      } else {
        toast.custom((t) => (
          <div
            className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in"
            style={{ minWidth: 320 }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#ef4444"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-lg font-medium">
              {response.message || "تعذر تغيير كلمة المرور. ربما انتهت صلاحية الرابط أو هناك خطأ آخر."}
            </span>
          </div>
        ), { position: "top-center", duration: 5000 });
        // Stay on the same page, allow user to retry
      }
    } catch (error) {
      toast.custom((t) => (
        <div
          className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in"
          style={{ minWidth: 320 }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#ef4444"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-lg font-medium">
            حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة لاحقاً.
          </span>
        </div>
      ), { position: "top-center", duration: 5000 });
      // Stay on the same page, allow user to retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription className="text-center">
            أدخل كلمة المرور الجديدة لحساب البريد الإلكتروني:
            <span className="block font-bold mt-1">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              required
              placeholder="كلمة المرور الجديدة"
              className="w-full"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              required
              placeholder="تأكيد كلمة المرور الجديدة"
              className="w-full"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" className="w-full bg-primary text-white mt-2" disabled={isSubmitting}>
              {isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
