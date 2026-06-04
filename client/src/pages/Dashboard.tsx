import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, BookOpen, Zap, Settings, LogOut, Flame, Moon, Book } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: dailyVerse } = trpc.dailyVerse.get.useQuery();
  const { data: habits } = trpc.habits.list.useQuery();
  const { data: prayers } = trpc.prayers.list.useQuery();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Calculate current streak
  const currentStreak = habits?.reduce((max: number, h: any) => Math.max(max, h.currentStreak || 0), 0) || 0;

  // Count answered prayers
  const answeredPrayers = prayers?.filter((p: any) => p.isAnswered).length || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">LightPath</h1>
            <p className="text-xs sm:text-sm text-primary-foreground/80 truncate">Welcome, {user?.name || "Friend"}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-9 w-9 p-0 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Daily Verse */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-l-4 border-accent">
          <p className="text-xs sm:text-sm text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Today's Verse</p>
          <p className="text-base sm:text-lg font-serif text-foreground mb-3 leading-relaxed">
            "{dailyVerse?.verseText || "The Lord is my shepherd, I shall not want."}"
          </p>
          <p className="text-sm sm:text-base text-accent font-semibold">
            {dailyVerse?.verseReference || "Psalm 23:1"}
          </p>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-card border-border text-center hover:border-accent/50 transition-all">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{currentStreak}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Day Streak</p>
          </Card>

          <Card className="p-4 sm:p-5 bg-card border-border text-center hover:border-accent/50 transition-all">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{answeredPrayers}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Answered Prayers</p>
          </Card>
        </div>

        {/* Greeting */}
        <Card className="p-4 sm:p-6 bg-card border-border">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Good {getGreeting()}, {user?.name?.split(" ")[0] || "Friend"}!</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {getMotivationalMessage()}
          </p>
        </Card>

        {/* Quick Access Cards */}
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Access</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button
              onClick={() => setLocation("/prayer")}
              className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-border hover:border-accent/50 text-foreground hover:bg-accent/5 transition-all"
              variant="outline"
            >
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
              <span className="text-xs sm:text-sm font-semibold text-center">Prayer Journal</span>
            </Button>

            <Button
              onClick={() => setLocation("/habits")}
              className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-border hover:border-accent/50 text-foreground hover:bg-accent/5 transition-all"
              variant="outline"
            >
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" />
              <span className="text-xs sm:text-sm font-semibold text-center">Habits</span>
            </Button>

            <Button
              onClick={() => setLocation("/devotionals")}
              className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-border hover:border-accent/50 text-foreground hover:bg-accent/5 transition-all"
              variant="outline"
            >
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
              <span className="text-xs sm:text-sm font-semibold text-center">Devotionals</span>
            </Button>

            <Button
              onClick={() => setLocation("/mentor")}
              className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-border hover:border-accent/50 text-foreground hover:bg-accent/5 transition-all"
              variant="outline"
            >
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
              <span className="text-xs sm:text-sm font-semibold text-center">Mentor</span>
            </Button>

            <Button
              onClick={() => setLocation("/dreams")}
              className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-border hover:border-accent/50 text-foreground hover:bg-accent/5 transition-all"
              variant="outline"
            >
              <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500" />
              <span className="text-xs sm:text-sm font-semibold text-center">Dreams</span>
            </Button>

            <Button
              onClick={() => setLocation("/holy-bible")}
              className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-border hover:border-accent/50 text-foreground hover:bg-accent/5 transition-all"
              variant="outline"
            >
              <Book className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
              <span className="text-xs sm:text-sm font-semibold text-center">Holy Bible</span>
            </Button>
          </div>
        </div>

        {/* Encouragement */}
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/50">
          <p className="text-sm sm:text-base text-foreground italic">
            "Trust in the Lord with all your heart, and lean not on your own understanding." — Proverbs 3:5
          </p>
        </Card>
      </main>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

function getMotivationalMessage(): string {
  const messages = [
    "Your spiritual journey is unique and beautiful. Take one step at a time.",
    "Every prayer matters. God hears and cares about your heart.",
    "Today is a new opportunity to grow closer to God.",
    "Remember, you are never alone on this journey.",
    "Small acts of faith lead to great spiritual growth.",
    "Your dedication to spiritual growth is inspiring.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
