import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Bookmark, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function Devotionals() {
  const [, setLocation] = useLocation();
  const { data: devotionals, isLoading, refetch } = trpc.devotionals.list.useQuery();
  const { data: bookmarks } = trpc.devotionals.getBookmarks.useQuery();
  const bookmarkMutation = trpc.devotionals.bookmark.useMutation();
  const removeBookmarkMutation = trpc.devotionals.removeBookmark.useMutation();

  const handleBookmark = async (devotionalId: number) => {
    try {
      await bookmarkMutation.mutateAsync({ devotionalId });
      refetch();
      toast.success("Devotional bookmarked");
    } catch (error) {
      toast.error("Failed to bookmark");
    }
  };

  const handleRemoveBookmark = async (devotionalId: number) => {
    try {
      await removeBookmarkMutation.mutateAsync({ devotionalId });
      refetch();
      toast.success("Bookmark removed");
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  const isBookmarked = (devotionalId: number) => {
    return bookmarks?.some(b => b.devotionalId === devotionalId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => setLocation("/dashboard")} className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Devotionals</h1>
            <p className="text-sm text-primary-foreground/80">Daily spiritual inspiration and Scripture</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading devotionals...</p>
          </div>
        ) : devotionals && devotionals.length > 0 ? (
          <div className="space-y-4">
            {devotionals.map((devotional) => (
              <Card
                key={devotional.id}
                className="p-6 bg-card border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{devotional.title}</h3>
                    {devotional.author && (
                      <p className="text-sm text-muted-foreground mb-2">by {devotional.author}</p>
                    )}
                  </div>
                  <button
                    onClick={() => isBookmarked(devotional.id) ? handleRemoveBookmark(devotional.id) : handleBookmark(devotional.id)}
                    className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${isBookmarked(devotional.id) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                    />
                  </button>
                </div>
                <p className="text-foreground mb-4 leading-relaxed">{devotional.content}</p>
                {devotional.verseReference && (
                  <div className="border-l-4 border-accent pl-4 py-2 bg-accent/5 rounded">
                    <p className="text-sm font-semibold text-accent mb-1">{devotional.verseReference}</p>
                    <p className="text-sm text-foreground italic">{devotional.verseText}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No devotionals available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
