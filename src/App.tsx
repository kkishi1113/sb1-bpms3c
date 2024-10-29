import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import { LoginForm } from '@/components/Auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import { useState } from 'react';
import Demo from '@/components/Demo/page';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleMenuClick = (view: string) => {
    setCurrentView(view);
  };
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar onMenuClick={handleMenuClick} />
                    <SidebarTrigger />
                    <main className="flex-1 overflow-auto">
                      {currentView === 'home' && <Dashboard />}
                      {currentView === 'demo' && <Demo />}
                      {/* Add other views here as needed */}
                    </main>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
