
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Bell, Moon, Sun, LogOut, Info, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-primary-foreground/80">Manage your preferences</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24">
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">{user?.name}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-accent" />
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Currently: {theme === "dark" ? "Enabled" : "Disabled"}</p>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="flex items-center gap-2"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-foreground">Daily devotional reminders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-foreground">Prayer streak notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-foreground">Habit reminders</span>
              </label>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              About
            </h3>
            <Button
              onClick={() => setLocation("/about-developer")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mb-3"
            >
              <Info className="w-4 h-4" />
              About Developer
            </Button>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
            <Button
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
