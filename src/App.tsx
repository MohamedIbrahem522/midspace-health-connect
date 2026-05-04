import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter , Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoadingPage } from "@/components/LoadingSpinner";
import AppLayout from "@/components/AppLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import DoctorProfile from "@/pages/DoctorProfile";
import DoctorPublicProfile from "@/pages/DoctorPublicProfile";
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
import PatientDashboard from "@/pages/PatientDashboard";
import PatientProfile from "@/pages/PatientProfile";
import PatientAppointments from "@/pages/PatientAppointments";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DoctorProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <DoctorPublicProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JobListings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyApplications />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Messages />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/post-job"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PostJob />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-jobs"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ManageJobs />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/applicants"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Applicants />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-directory"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DoctorDirectory />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PatientDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute>
            <PatientProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PatientAppointments />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search-doctors"
        element={<SearchDoctors />}
      />

      <Route path="/doctor/:id" element={<DoctorView />} />
      <Route path="/contact/:id" element={<ContactDoctor />} />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdminUsers />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/insights"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdminInsights />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <HashRouter >
            <AppRoutes />
          </HashRouter >
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
