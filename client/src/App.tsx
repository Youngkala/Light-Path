import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrayerJournal from "./pages/PrayerJournal";
import HabitTracker from "./pages/HabitTracker";
import Devotionals from "./pages/Devotionals";
import BibleReadingPlan from "./pages/BibleReadingPlan";
import SpiritualMentor from "./pages/SpiritualMentor";
import Settings from "./pages/Settings";
import About from "./pages/About";
import AboutDeveloper from "./pages/AboutDeveloper";
import Dedication from "./pages/Dedication";
import Feedback from "./pages/Feedback";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNavigation from "./components/BottomNavigation";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-24">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/prayers" component={() => <ProtectedRoute><PrayerJournal /></ProtectedRoute>} />
          <Route path="/habits" component={() => <ProtectedRoute><HabitTracker /></ProtectedRoute>} />
          <Route path="/devotionals" component={() => <ProtectedRoute><Devotionals /></ProtectedRoute>} />
          <Route path="/bible" component={() => <ProtectedRoute><BibleReadingPlan /></ProtectedRoute>} />
          <Route path="/mentor" component={() => <ProtectedRoute><SpiritualMentor /></ProtectedRoute>} />
          <Route path="/settings" component={() => <ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/about" component={() => <ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/about-developer" component={() => <ProtectedRoute><AboutDeveloper /></ProtectedRoute>} />
          <Route path="/dedication" component={() => <ProtectedRoute><Dedication /></ProtectedRoute>} />
          <Route path="/feedback" component={() => <ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
