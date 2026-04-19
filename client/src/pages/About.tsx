import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Code2, Sparkles } from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => setLocation("/dashboard")} className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">About LightPath</h1>
            <p className="text-sm text-primary-foreground/80">Learn about our mission and team</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="space-y-6">
          <Card className="p-8 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50 text-center">
            <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-3">LightPath</h2>
            <p className="text-lg text-muted-foreground mb-4">Your Daily Companion for Spiritual Growth</p>
            <p className="text-foreground">
              LightPath is designed to help you deepen your faith through daily prayer, Scripture reading, devotionals, and spiritual guidance grounded in Christian wisdom.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Our Mission
            </h3>
            <p className="text-foreground leading-relaxed mb-4">
              We believe that spiritual growth is a journey, not a destination. LightPath provides tools and guidance to help you cultivate meaningful spiritual practices, connect with Scripture, and experience God's presence in your daily life.
            </p>
            <p className="text-foreground leading-relaxed">
              Whether you're just beginning your faith journey or seeking to deepen your relationship with God, LightPath is here to support you every step of the way.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-accent" />
              Built By
            </h3>
            <div className="space-y-6">
              <div className="border-l-4 border-accent pl-4">
                <h4 className="text-xl font-semibold text-accent mb-2">Deep Dreams Technology</h4>
                <p className="text-foreground mb-2">
                  Deep Dreams Technology is committed to creating innovative digital solutions that serve the spiritual and personal growth communities.
                </p>
                <p className="text-muted-foreground">
                  We specialize in building faith-centered applications that combine technology with purpose, creating meaningful digital experiences that inspire and uplift.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h4 className="text-xl font-semibold text-accent mb-2">Kala Maxwell</h4>
                <p className="text-foreground mb-2">
                  Kala Maxwell is the visionary founder and lead developer behind LightPath, bringing a passion for faith, technology, and user-centered design.
                </p>
                <p className="text-muted-foreground">
                  With a commitment to creating tools that genuinely serve spiritual growth, Kala has designed LightPath to be intuitive, beautiful, and deeply purposeful.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Prayer Journal with categories and answered prayer tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Daily Devotionals with Scripture references and bookmarking</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Spiritual Habit Tracker with streak counters</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Bible Reading Plan with chapter tracking and notes</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">AI Spiritual Mentor for Scripture-grounded guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Daily Verse display for spiritual inspiration</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-accent/10 border-accent/50">
            <p className="text-center text-foreground">
              <span className="font-semibold">LightPath</span> — Illuminating your path to spiritual growth
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Built with faith and technology by Deep Dreams Technology and Kala Maxwell
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
