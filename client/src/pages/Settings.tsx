import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { Bell, Moon, Sun, LogOut, Info, ChevronRight, Heart, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      // Auth state change will trigger app rerender to show AuthStack
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">Manage your preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Account Section */}
        <Card className="p-4 sm:p-6 bg-card border-border overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Account</h3>
          <div className="space-y-4">
            <div className="pb-4 border-b border-border/50">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Email</p>
              <p className="text-sm sm:text-base text-foreground font-medium break-all">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Name</p>
              <p className="text-sm sm:text-base text-foreground font-medium">{user?.name}</p>
            </div>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card className="p-4 sm:p-6 bg-card border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-accent" />
            ) : (
              <Sun className="w-5 h-5 text-accent" />
            )}
            Appearance
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-foreground font-medium">Dark Mode</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Currently: {theme === "dark" ? "Enabled" : "Disabled"}
              </p>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="h-10 px-3 sm:px-4 flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-4 sm:p-6 bg-card border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-border cursor-pointer"
              />
              <span className="text-sm sm:text-base text-foreground">Daily devotional reminders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-border cursor-pointer"
              />
              <span className="text-sm sm:text-base text-foreground">Prayer streak notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-border cursor-pointer"
              />
              <span className="text-sm sm:text-base text-foreground">Habit reminders</span>
            </label>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-4 sm:p-6 bg-card border-border space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" />
            About
          </h3>
          <Button
            onClick={() => setLocation("/about-developer")}
            className="w-full h-11 sm:h-12 flex items-center justify-between gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm sm:text-base"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              About Developer
            </span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            onClick={() => setLocation("/dedication")}
            className="w-full h-11 sm:h-12 flex items-center justify-between gap-2 bg-primary/20 hover:bg-primary/30 text-accent border border-accent/50 font-semibold text-sm sm:text-base transition-all"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              Dedication
            </span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            onClick={() => setLocation("/feedback")}
            className="w-full h-11 sm:h-12 flex items-center justify-between gap-2 bg-primary/20 hover:bg-primary/30 text-accent border border-accent/50 font-semibold text-sm sm:text-base transition-all"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              Feedback & Reviews
            </span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </Card>

        {/* Logout Section */}
        <Card className="p-4 sm:p-6 bg-card border-border">
          <Button
            onClick={handleLogout}
            className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base transition-all"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Logout
          </Button>
        </Card>

        {/* App Info */}
        <div className="text-center py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground">
          <p>LightPath v1.0</p>
          <p className="mt-1">Built with faith and technology</p>
        </div>
      </main>
    </div>
  );
}
