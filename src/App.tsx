import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Dashboard />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
