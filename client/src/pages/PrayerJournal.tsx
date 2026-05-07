import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Heart, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function PrayerJournal() {
  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  
  const { data: prayers, isLoading, refetch } = trpc.prayers.list.useQuery();
  const createMutation = trpc.prayers.create.useMutation();
  const deleteMutation = trpc.prayers.delete.useMutation();
  const updateMutation = trpc.prayers.update.useMutation();

  const handleCreate = async () => {
    if (!content.trim()) {
      toast.error("Please write a prayer");
      return;
    }
    try {
      await createMutation.mutateAsync({ content, category });
      setContent("");
      setCategory("general");
      setIsCreating(false);
      refetch();
      toast.success("Prayer saved");
    } catch (error) {
      toast.error("Failed to save prayer");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
      toast.success("Prayer deleted");
    } catch (error) {
      toast.error("Failed to delete prayer");
    }
  };

  const handleMarkAnswered = async (id: number) => {
    try {
      await updateMutation.mutateAsync({ id, isAnswered: true });
      refetch();
      toast.success("Prayer marked as answered");
    } catch (error) {
      toast.error("Failed to update prayer");
    }
  };

  const categories = ["general", "family", "health", "work", "gratitude", "intercession"];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">Prayer Journal</h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">Record your prayers and track answered prayers</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Create Prayer Section */}
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground mb-6 w-full h-12 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Prayer
          </Button>
        ) : (
          <Card className="p-4 sm:p-6 mb-6 bg-card border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Write Your Prayer</h2>
              <Button
                onClick={() => setIsCreating(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Prayer</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your prayer, concerns, or gratitude..."
                  className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-24 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !content.trim()}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-10 font-semibold"
                >
                  {createMutation.isPending ? "Saving..." : "Save Prayer"}
                </Button>
                <Button
                  onClick={() => setIsCreating(false)}
                  variant="outline"
                  className="flex-1 h-10 font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Prayers List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading prayers...</p>
            </div>
          ) : prayers && prayers.length > 0 ? (
            prayers.map((prayer: any) => (
              <Card
                key={prayer.id}
                className={`p-4 sm:p-5 border-l-4 transition-all ${
                  prayer.isAnswered
                    ? "bg-green-50 dark:bg-green-950/20 border-l-green-500"
                    : "bg-card border-l-accent"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary capitalize">
                        {prayer.category}
                      </span>
                      {prayer.isAnswered && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Answered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(prayer.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-foreground mb-4 leading-relaxed whitespace-pre-wrap break-words">
                  {prayer.content}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {!prayer.isAnswered && (
                    <Button
                      onClick={() => handleMarkAnswered(prayer.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none h-9 text-xs sm:text-sm"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Mark Answered
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(prayer.id)}
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    className="flex-1 sm:flex-none h-9 text-xs sm:text-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No prayers yet. Start your prayer journey today.</p>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Prayer
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
