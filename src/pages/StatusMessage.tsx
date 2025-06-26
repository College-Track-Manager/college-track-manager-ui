import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type StatusType = "success" | "error" | "info" | "warning";

const icons = {
  success: <CheckCircle className="w-12 h-12 text-[#1992c8] mx-auto mb-4" />,
  error: <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />,
  info: <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />,
  warning: <Info className="w-12 h-12 text-yellow-500 mx-auto mb-4" />,
};

export default function StatusMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Prefer location.state, fallback to query params if needed
  const { title, message, type = "info", buttonText = "العودة إلى الصفحة الرئيسية", buttonTo = "/" } =
    (location.state as any) || {};

  return (
<div className="max-w-2xl mx-auto mt-[160px] mb-[60px]">
<Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            {icons[type as StatusType] || icons.info}
            <CardTitle className="text-2xl font-bold text-center">{title || "تنبيه"}</CardTitle>
            <CardDescription className="text-center mt-2">{message}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button className="w-full mt-4" onClick={() => navigate(buttonTo)}>
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
