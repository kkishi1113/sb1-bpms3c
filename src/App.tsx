import { ThemeProvider } from '@/components/theme-provider';
import Dashboard from '@/components/Dashboard/index';
import { Toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleMenuClick = (view: string) => {
    setCurrentView(view);
  };
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar onMenuClick={handleMenuClick} />
        <SidebarTrigger />
        <main className="flex-1 overflow-auto">
          {currentView === 'home' && <Dashboard />}
          {/* Add other views here as needed */}
        </main>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
