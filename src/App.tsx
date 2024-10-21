import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "@/components/Dashboard"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Dashboard />
    </ThemeProvider>
  )
}

export default App