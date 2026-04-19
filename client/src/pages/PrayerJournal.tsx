import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Heart, ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export default function PrayerJournal() {
  const [, setLocation] = useLocation();
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
      await updateMutation.mutateAsync({ id, isAnswered: true, answeredAt: new Date() });
      refetch();
      toast.success("Prayer marked as answered");
    } catch (error) {
      toast.error("Failed to update prayer");
    }
  };

  const categories = ["general", "family", "health", "work", "gratitude", "intercession"];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => setLocation("/dashboard")} className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Prayer Journal</h1>
            <p className="text-sm text-primary-foreground/80">Record your prayers and track answered prayers</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground mb-6 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Prayer
          </Button>
        ) : (
          <Card className="p-6 mb-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Write a Prayer</h3>
            <Textarea
              placeholder="Share your prayer, concerns, or gratitude..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-4 min-h-32"
            />
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
              >
                Save Prayer
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading prayers...</p>
          </div>
        ) : prayers && prayers.length > 0 ? (
          <div className="space-y-4">
            {prayers.map((prayer) => (
              <Card
                key={prayer.id}
                className="p-4 bg-card border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {prayer.category}
                      </span>
                      {prayer.isAnswered && (
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" /> Answered
                        </span>
                      )}
                    </div>
                    <p className="text-foreground">{prayer.content}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(prayer.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    {!prayer.isAnswered && (
                      <button
                        onClick={() => handleMarkAnswered(prayer.id)}
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark Answered
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="text-destructive hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No prayers yet. Start by writing your first prayer.</p>
          </div>
        )}
      </main>
    </div>
  );
}
