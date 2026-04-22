import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Bookmark, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function Devotionals() {
  const [selectedDevotional, setSelectedDevotional] = useState<number | null>(null);

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

  const selectedDev = devotionals?.find(d => d.id === selectedDevotional);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">Devotionals</h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">Daily spiritual inspiration and Scripture</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading devotionals...</p>
          </div>
        ) : selectedDev ? (
          // Reading View
          <div className="space-y-4">
            <Button
              onClick={() => setSelectedDevotional(null)}
              variant="outline"
              className="mb-4 h-10 font-semibold"
            >
              ← Back to List
            </Button>

            <Card className="p-4 sm:p-6 bg-card border-border space-y-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2 break-words">
                    {selectedDev.title}
                  </h2>
                  {selectedDev.author && (
                    <p className="text-xs sm:text-sm text-muted-foreground">by {selectedDev.author}</p>
                  )}
                  {selectedDev.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(selectedDev.publishedAt).toLocaleDateString([], {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    isBookmarked(selectedDev.id)
                      ? handleRemoveBookmark(selectedDev.id)
                      : handleBookmark(selectedDev.id)
                  }
                  className="p-2 hover:bg-accent/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <Bookmark
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isBookmarked(selectedDev.id)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {selectedDev.content}
                </p>
              </div>

              {selectedDev.verseReference && (
                <div className="border-l-4 border-accent pl-4 py-3 bg-accent/5 rounded">
                  <p className="text-xs sm:text-sm font-semibold text-accent mb-1">Scripture Reference</p>
                  <p className="text-sm sm:text-base text-foreground italic">{selectedDev.verseReference}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border/50">
                <Button
                  onClick={() => setSelectedDevotional(null)}
                  variant="outline"
                  className="w-full h-10 font-semibold"
                >
                  Back to List
                </Button>
              </div>
            </Card>
          </div>
        ) : devotionals && devotionals.length > 0 ? (
          // List View
          <div className="space-y-3">
            {devotionals.map((devotional) => (
              <Card
                key={devotional.id}
                className="p-4 sm:p-5 bg-card border-border hover:border-accent/50 transition-all cursor-pointer"
                onClick={() => setSelectedDevotional(devotional.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 break-words">
                      {devotional.title}
                    </h3>
                    {devotional.author && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">by {devotional.author}</p>
                    )}
                    {devotional.publishedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(devotional.publishedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isBookmarked(devotional.id)
                        ? handleRemoveBookmark(devotional.id)
                        : handleBookmark(devotional.id);
                    }}
                    className="p-2 hover:bg-accent/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        isBookmarked(devotional.id)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-sm sm:text-base text-foreground/80 line-clamp-2 break-words">
                  {devotional.content}
                </p>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDevotional(devotional.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full h-9 text-xs sm:text-sm font-semibold"
                  >
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Read Full
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No devotionals available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
