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
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showMatchError, setShowMatchError] = useState(false);

  // Real-time validation effects
  useEffect(() => {
    if (newPassword.length > 0 && newPassword.length < 6) {
      setShowPasswordError(true);
    } else {
      setShowPasswordError(false);
    }
  }, [newPassword]);

  useEffect(() => {
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      setShowMatchError(true);
    } else {
      setShowMatchError(false);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!newPassword || newPassword.length < 6) {
      setShowPasswordError(true);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setShowMatchError(true);
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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-1 min-h-0 items-center justify-center">
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
              <div className="space-y-1">
                <Input
                  type="password"
                  required
                  placeholder="كلمة المرور الجديدة"
                  className={`w-full ${showPasswordError ? 'border-red-500' : ''}`}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                {showPasswordError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="12" fill="#ef4444"/>
                      <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    يجب أن تتكون كلمة المرور من 6 أحرف على الأقل
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Input
                  type="password"
                  required
                  placeholder="تأكيد كلمة المرور الجديدة"
                  className={`w-full ${showMatchError ? 'border-red-500' : ''}`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {showMatchError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="12" fill="#ef4444"/>
                      <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    كلمتا المرور غير متطابقتين
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full bg-primary text-white mt-2" disabled={isSubmitting}>
                {isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
