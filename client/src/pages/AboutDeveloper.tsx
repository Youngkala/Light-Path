import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Users, Heart, Code2, Sparkles } from "lucide-react";

export default function AboutDeveloper() {
  const [, setLocation] = useLocation();

  const openWhatsApp = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => setLocation("/settings")} className="hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">About Developer</h1>
            <p className="text-sm text-primary-foreground/80">Meet the creator behind LightPath</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24">
        {/* Profile Section */}
        <Card className="p-8 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50 text-center mb-6">
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Code2 className="w-12 h-12 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kala Maxwell</h2>
            <p className="text-lg text-accent font-semibold mb-3">Founder & Lead Developer</p>
            <p className="text-foreground leading-relaxed">
              Passionate about creating technology that inspires spiritual growth and solves real-world problems.
            </p>
          </div>
        </Card>

        {/* Deep Dreams Technology */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Sparkles className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">Deep Dreams Technology</h3>
              <p className="text-foreground mb-3">
                A technology company dedicated to building innovative digital solutions that serve spiritual and personal growth communities.
              </p>
              <p className="text-muted-foreground italic">
                "Building technology to solve real-world problems and inspire lives."
              </p>
            </div>
          </div>
        </Card>

        {/* Mission & Vision */}
        <Card className="p-6 bg-card border-border mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            Our Mission
          </h3>
          <p className="text-foreground leading-relaxed mb-4">
            We believe technology should serve humanity's highest aspirations. LightPath is built on the conviction that digital tools can deepen faith, foster spiritual growth, and create meaningful connections with God and community.
          </p>
          <p className="text-foreground leading-relaxed">
            Every feature in LightPath is designed with care and intention to support your spiritual journey, whether you're just beginning or seeking to deepen your faith.
          </p>
        </Card>

        {/* Connect Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Connect With Me
          </h3>

          <div className="space-y-3">
            {/* WhatsApp Chat Button */}
            <button
              onClick={() => openWhatsApp("https://wa.me/233246757669")}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-auto py-4 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Message on WhatsApp</p>
                  <p className="text-xs opacity-90">Reach out for support, feedback, or collaboration</p>
                </div>
              </div>
              <span className="text-lg ml-2">→</span>
            </button>

            {/* WhatsApp Channel Button */}
            <button
              onClick={() => openWhatsApp("https://whatsapp.com/channel/0029VajTPvE9RZAZ7hQTSS0b")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-4 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <Users className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Join My Channel</p>
                  <p className="text-xs opacity-90">Get updates on projects and LightPath development</p>
                </div>
              </div>
              <span className="text-lg ml-2">→</span>
            </button>
          </div>
        </div>

        {/* About LightPath */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">About LightPath</h3>
          <p className="text-foreground leading-relaxed mb-4">
            LightPath is a faith-inspired spiritual wellness application designed to be your daily companion on your spiritual journey. It combines technology with Scripture-grounded guidance to help you:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span className="text-foreground">Maintain consistent spiritual practices through prayer, Bible reading, and devotionals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span className="text-foreground">Track your spiritual growth with habit tracking and streak counters</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span className="text-foreground">Receive AI-powered spiritual guidance grounded in Scripture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span className="text-foreground">Build a personal record of answered prayers and spiritual insights</span>
            </li>
          </ul>
          <p className="text-muted-foreground italic text-sm">
            Built with faith and technology by Deep Dreams Technology and Kala Maxwell
          </p>
        </Card>
      </main>
    </div>
  );
}
