import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Zap, Settings, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: dailyVerse } = trpc.dailyVerse.get.useQuery();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">LightPath</h1>
            <p className="text-sm text-primary-foreground/80">Welcome, {user?.name || "Friend"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/settings")}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="spiritual-card mb-6 border-l-4 border-accent">
          <p className="text-sm text-muted-foreground mb-2">Today's Verse</p>
          <p className="text-lg font-serif text-foreground mb-2">{dailyVerse?.verseText || "The Lord is my shepherd..."}</p>
          <p className="text-sm text-accent font-semibold">{dailyVerse?.verseReference || "Psalm 23:1"}</p>
        </div>
      </main>
    </div>
  );
}
