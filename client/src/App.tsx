import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthStack from "./components/AuthStack";
import AppStack from "./components/AppStack";
import { Loader2, Heart } from "lucide-react";

/**
 * Root App Component
 * Conditionally renders AuthStack (login/signup) or AppStack (main app)
 * based on authentication state
 */
function AppContent() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading/splash screen while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">LightPath</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading your spiritual journey...
          </p>
        </div>
      </div>
    );
  }

  // Render appropriate stack based on auth state
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
