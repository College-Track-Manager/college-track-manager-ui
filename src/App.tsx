import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Index from "./pages/Index";
import Tracks from "./pages/Tracks";
import TrackDetail from "./pages/TrackDetail";
import Login from "./pages/Login";
import StudentRegistration from "./pages/StudentRegistration";
import Registration from "./pages/Registration";
import { AdminLoginPage } from "./pages/admin/login";
import { AdminDashboard } from "./pages/admin/dashboard";
import { ApplicationsManagement } from "./pages/admin/applications";
import { ApplicationDetails } from "./pages/admin/application-details";
import { PaymentsManagement } from "./pages/admin/payments";
import { RegisteredStudents } from "./pages/admin/registered-students";
import { Settings } from "./pages/admin/settings";
import { Reports } from "./pages/admin/reports";
import { Support } from "./pages/admin/support";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProgramRegistration from "./pages/ProgramRegistration";
import ProgramRegistrationSuccess from "./pages/ProgramRegistrationSuccess";

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
                  <Route path="/" element={<Index />} />
                  <Route path="/tracks" element={<Tracks />} />
                  <Route path="/tracks/:trackId" element={<TrackDetail />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/applications"
                    element={
                      <ProtectedRoute>
                        <ApplicationsManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/applications/:id"
                    element={
                      <ProtectedRoute>
                        <ApplicationDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/payments"
                    element={
                      <ProtectedRoute>
                        <PaymentsManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/students"
                    element={
                      <ProtectedRoute>
                        <RegisteredStudents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/support"
                    element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/program-registration" element={<ProtectedRoute><ProgramRegistration /></ProtectedRoute>} />
                  <Route path="/program-registration-success" element={<ProgramRegistrationSuccess />} />
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
