import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Heart, Church } from "lucide-react";
import { useLocation } from "wouter";

export default function Dedication() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const spiritualLeaders = [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            onClick={() => setLocation("/settings")}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">Dedication</h1>
            <p className="text-xs sm:text-sm text-primary-foreground/80">A Message of Purpose and Honor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Dedication Message */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-accent/30 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-accent animate-pulse" />
          </div>
          <p className="text-base sm:text-lg font-serif text-foreground leading-relaxed italic">
            "This application, <span className="font-bold text-accent">LightPath</span>, is dedicated to the glory of God and to the mission of spreading His word through technology."
          </p>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
          <div className="text-accent">✝️</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        </div>

        {/* Church Section */}
        <Card className="p-5 sm:p-6 bg-card border-border hover:border-accent/50 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Church className="w-6 h-6 sm:w-7 sm:h-7 text-accent flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">Church</h2>
          </div>
          <p className="text-sm sm:text-base text-foreground/90 font-semibold pl-9">
            All Nations for Christ Church International
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground pl-9 mt-2">
            United in faith, service, and spiritual growth
          </p>
        </Card>

        {/* Spiritual Leadership Section */}
        <Card className="p-5 sm:p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-accent">👥</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">Spiritual Leadership</h2>
          </div>

          {/* Apostle R.K Boamah Adjei */}
          <div className="mb-6 pb-6 border-b border-border/50">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="flex-shrink-0">
                <img
                  src="/manus-storage/343281_22b26530.jpg"
                  alt="Apostle R.K Boamah Adjei"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-accent/30 shadow-md"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-accent">Apostle R.K Boamah Adjei</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Founder & Spiritual Leader</p>
                <p className="text-xs sm:text-sm text-foreground/80 mt-2 italic">Leading with faith and vision</p>
              </div>
            </div>
          </div>

          {/* Pastor Elijah Adamu */}
          <div className="mb-6 pb-6 border-b border-border/50">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg p-1">
                <img
                  src="/manus-storage/114883_425ea225.jpg"
                  alt="Pastor Elijah Adamu"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-md object-contain border-2 border-accent/30 shadow-md bg-background"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-accent">Pastor Elijah Adamu</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Senior Pastor & Spiritual Guide</p>
                <p className="text-xs sm:text-sm text-foreground/80 mt-2 italic">Guiding believers in faith and truth</p>
              </div>
            </div>
          </div>

          {/* Pastor Francis Luguniah */}
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="flex-shrink-0">
                <img
                  src="/manus-storage/343339_56f2a83a.jpg"
                  alt="Pastor Francis Luguniah"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-accent/30 shadow-md"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-accent">Pastor Francis Luguniah</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Pastor & Spiritual Counselor</p>
                <p className="text-xs sm:text-sm text-foreground/80 mt-2 italic">Serving with compassion and wisdom</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Scripture Section */}
        <Card className="p-6 sm:p-7 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/40">
          <div className="text-center space-y-3">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">Scripture</p>
            <p className="text-sm sm:text-base font-serif text-foreground italic leading-relaxed">
              "Commit your works to the Lord, and your plans will be established."
            </p>
            <p className="text-xs sm:text-sm font-semibold text-accent">Proverbs 16:3</p>
          </div>
        </Card>

        {/* Closing Message */}
        <Card className="p-6 sm:p-7 bg-card border-border text-center">
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
            May this platform inspire lives, strengthen faith, and draw many closer to God.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="text-lg">✨</span>
            <span className="text-lg">🙏</span>
            <span className="text-lg">✨</span>
          </div>
        </Card>

        {/* Back Button */}
        <div className="pt-4">
          <Button
            onClick={() => setLocation("/settings")}
            variant="outline"
            className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs sm:text-sm text-muted-foreground">
          <p>LightPath - Dedicated to God's Glory</p>
          <p className="mt-1">© 2026 Deep Dreams Technology</p>
        </div>
      </main>
    </div>
  );
}
