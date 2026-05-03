import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import DoctorProfile from "@/pages/DoctorProfile";
import JobListings from "@/pages/JobListings";
import MyApplications from "@/pages/MyApplications";
import Messages from "@/pages/Messages";
import PostJob from "@/pages/PostJob";
import ManageJobs from "@/pages/ManageJobs";
import Applicants from "@/pages/Applicants";
import DoctorDirectory from "@/pages/DoctorDirectory";
import SearchDoctors from "@/pages/SearchDoctors";
import DoctorView from "@/pages/DoctorView";
import ContactDoctor from "@/pages/ContactDoctor";
import AdminUsers from "@/pages/AdminUsers";
import AdminInsights from "@/pages/AdminInsights";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobListings /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/manage-jobs" element={<ProtectedRoute><ManageJobs /></ProtectedRoute>} />
        <Route path="/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
        <Route path="/doctor-directory" element={<ProtectedRoute><DoctorDirectory /></ProtectedRoute>} />
        <Route path="/search-doctors" element={<SearchDoctors />} />
        <Route path="/doctor/:id" element={<DoctorView />} />
        <Route path="/contact/:id" element={<ContactDoctor />} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/insights" element={<ProtectedRoute><AdminInsights /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
