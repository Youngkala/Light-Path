import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {  Check } from "lucide-react";
import { toast } from "sonner";

export default function BibleReadingPlan() {
  
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [notes, setNotes] = useState("");

  const { data: chapters, refetch } = trpc.bibleChapters.list.useQuery();
  const updateMutation = trpc.bibleChapters.createOrUpdate.useMutation();

  const books = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel"];
  const chapters_count = 50;

  const handleMarkComplete = async () => {
    try {
      await updateMutation.mutateAsync({
        book: selectedBook,
        chapter: selectedChapter,
        isCompleted: true,
        notes
      });
      setNotes("");
      refetch();
      toast.success("Chapter marked as complete!");
    } catch (error) {
      toast.error("Failed to update chapter");
    }
  };

  const completedCount = chapters?.filter(c => c.isCompleted).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bible Reading Plan</h1>
            <p className="text-sm text-primary-foreground/80">Track your Scripture reading journey</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="spiritual-card mb-6">
          <p className="text-sm text-muted-foreground mb-2">Progress</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${(completedCount / (chapters?.length || 1)) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-accent">{completedCount} / {chapters?.length || 0}</span>
          </div>
        </div>

        <Card className="p-6 bg-card border-border mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Log Reading</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Book</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md"
              >
                {books.map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
                className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md"
              >
                {Array.from({ length: chapters_count }, (_, i) => i + 1).map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            placeholder="Add notes about what you learned..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md mb-4 min-h-24"
          />
          <Button
            onClick={handleMarkComplete}
            disabled={updateMutation.isPending}
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        </Card>

        <div className="space-y-2">
          {chapters && chapters.length > 0 ? (
            chapters.map(chapter => (
              <Card
                key={chapter.id}
                className={`p-3 border-border ${chapter.isCompleted ? "bg-accent/10 border-accent" : "bg-card"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{chapter.book} {chapter.chapter}</span>
                  {chapter.isCompleted && <Check className="w-5 h-5 text-accent" />}
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">Start logging your Bible reading</p>
          )}
        </div>
      </main>
    </div>
  );
}
