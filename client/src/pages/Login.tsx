import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Heart, BookOpen, Zap } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-accent-foreground" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">LightPath</h1>
        <p className="text-lg text-muted-foreground mb-2">Your Daily Companion for Spiritual Growth</p>
        <p className="text-sm text-muted-foreground">Grow closer to God through prayer, devotion, and faith</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
        <div className="spiritual-card text-center">
          <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Prayer Journal</h3>
          <p className="text-sm text-muted-foreground">Record and track your prayers</p>
        </div>
        <div className="spiritual-card text-center">
          <BookOpen className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Daily Devotionals</h3>
          <p className="text-sm text-muted-foreground">Scripture-based guidance</p>
        </div>
        <div className="spiritual-card text-center">
          <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Spiritual Mentor</h3>
          <p className="text-sm text-muted-foreground">AI-powered faith guidance</p>
        </div>
      </div>

      <Button
        size="lg"
        className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold"
        onClick={() => window.location.href = getLoginUrl()}
      >
        Begin Your Journey
      </Button>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        Sign in with your account to access all features
      </p>
    </div>
  );
}
