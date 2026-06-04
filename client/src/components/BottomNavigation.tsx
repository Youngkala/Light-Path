import { useLocation } from "wouter";
import { Home, Heart, Zap, BookOpen, MessageCircle, Settings, Menu, Book } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/prayers", label: "Prayer", icon: Heart },
    { path: "/habits", label: "Habits", icon: Zap },
    { path: "/devotionals", label: "Devotionals", icon: BookOpen },
    { path: "/holy-bible", label: "Bible", icon: Book },
    { path: "/mentor", label: "Mentor", icon: MessageCircle },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="max-w-4xl mx-auto px-2 py-2 flex justify-around items-center">
        {navItems.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
              isActive(path)
                ? "text-accent bg-accent/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title={label}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
