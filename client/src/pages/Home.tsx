import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Heart, BookOpen, Zap, Users } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-accent-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Navigation */}
      <nav className="bg-primary/10 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">LightPath</h1>
          </div>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Your Daily Companion for Spiritual Growth
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Grow closer to God through prayer, devotion, habit tracking, and AI-powered spiritual guidance grounded in Scripture.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">Powerful Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="spiritual-card">
            <Heart className="w-10 h-10 text-accent mb-4" />
            <h4 className="font-semibold text-foreground mb-2">Prayer Journal</h4>
            <p className="text-sm text-muted-foreground">Record, organize, and track your prayers with categories and answered status.</p>
          </div>
          <div className="spiritual-card">
            <BookOpen className="w-10 h-10 text-accent mb-4" />
            <h4 className="font-semibold text-foreground mb-2">Daily Devotionals</h4>
            <p className="text-sm text-muted-foreground">Scripture-based guidance and spiritual wisdom to inspire your day.</p>
          </div>
          <div className="spiritual-card">
            <Zap className="w-10 h-10 text-accent mb-4" />
            <h4 className="font-semibold text-foreground mb-2">Spiritual Mentor</h4>
            <p className="text-sm text-muted-foreground">AI-powered faith guidance grounded in Scripture and Christian wisdom.</p>
          </div>
          <div className="spiritual-card">
            <Users className="w-10 h-10 text-accent mb-4" />
            <h4 className="font-semibold text-foreground mb-2">Habit Tracking</h4>
            <p className="text-sm text-muted-foreground">Build spiritual disciplines with streak counters and progress tracking.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-2">LightPath - Your Daily Companion for Spiritual Growth</p>
          <p className="text-sm text-muted-foreground">Built with faith and technology by Deep Dreams Technology</p>
        </div>
      </footer>
    </div>
  );
}
