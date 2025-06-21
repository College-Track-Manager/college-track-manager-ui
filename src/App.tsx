import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Public pages
import Index from "./pages/Index";
import Tracks from "./pages/Tracks";
import TrackDetail from "./pages/TrackDetail";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StatusMessage from "./pages/StatusMessage";
import ProgramRegistrationSuccess from "./pages/ProgramRegistrationSuccess";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Protected pages
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ApplicationReviewPage from "./pages/ApplicationReviewPage";
import Profile from "./pages/Profile";
import ProgramRegistration from "./pages/ProgramRegistration";

// Component to handle role-based redirection after login
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'Student') {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  // Default redirect if role is not determined
  return <Navigate to="/" replace />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/tracks" element={<Tracks />} />
                  <Route path="/tracks/:trackId" element={<TrackDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/status" element={<StatusMessage />} />
                  <Route path="/program-registration-success" element={<ProgramRegistrationSuccess />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<RoleBasedRedirect />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/review-application/:applicationId" 
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <ApplicationReviewPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Student Routes */}
                  <Route 
                    path="/student/dashboard" 
                    element={
                      <ProtectedRoute requiredRole="Student">
                        <StudentDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Common Protected Routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/program-registration" 
                    element={
                      <ProtectedRoute requiredRole="Student">
                        <ProgramRegistration />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 - Must be the last route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
