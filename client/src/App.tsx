import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { muiTheme } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import NewMainLayout from '@/components/layouts/NewMainLayout';
import AuthLayout from '@/components/layouts/AuthLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import NewDashboardPage from '@/pages/NewDashboardPage';
import BusinessesPage from '@/pages/BusinessesPage';
import DepartmentsPage from '@/pages/DepartmentsPage';
import ProjectsPage from '@/pages/ProjectsPage';
import EmailsPage from '@/pages/EmailsPage';
import CalendarPage from '@/pages/CalendarPage';
import DocumentsPage from '@/pages/DocumentsPage';
import PhonePage from '@/pages/PhonePage';
import TasksPage from '@/pages/TasksPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import IntegrationViewerPage from '@/pages/IntegrationViewerPage';
import MeshtasticMapPage from '@/pages/MeshtasticMapPage';
import AdminPage from '@/pages/admin/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <NewMainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<NewDashboardPage />} />
              <Route path="/businesses" element={<BusinessesPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/team" element={<TasksPage />} /> {/* TODO: Create TeamPage */}
              
              {/* Business-specific routes */}
              <Route path="/business/:businessId/emails" element={<EmailsPage />} />
              <Route path="/business/:businessId/calendar" element={<CalendarPage />} />
              <Route path="/business/:businessId/documents" element={<DocumentsPage />} />
              <Route path="/business/:businessId/phone" element={<PhonePage />} />
              <Route path="/business/:businessId/integrations" element={<IntegrationsPage />} />
              <Route path="/business/:businessId/integrations/view/:integrationId" element={<IntegrationViewerPage />} />
              <Route path="/business/:businessId/integrations/meshtastic/:integrationId" element={<MeshtasticMapPage />} />
              
              {/* Backwards compatibility - redirect old routes */}
              <Route path="/emails" element={<EmailsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/phone" element={<PhonePage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/integrations/view/:integrationId" element={<IntegrationViewerPage />} />
              <Route path="/integrations/meshtastic/:integrationId" element={<MeshtasticMapPage />} />
              
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
