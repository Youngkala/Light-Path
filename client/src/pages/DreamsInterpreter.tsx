import { useState, useEffect } from "react";
import { Heart, Loader2, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Dream {
  id: number;
  dreamContent: string;
  interpretation: string | null;
  mood?: string;
  isSaved: boolean;
  createdAt: Date;
}

export default function DreamsInterpreter() {
  const [dreamContent, setDreamContent] = useState("");
  const [mood, setMood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // tRPC hooks
  const submitDreamMutation = trpc.dreams.submit.useMutation();
  const getDreamHistoryQuery = trpc.dreams.getHistory.useQuery();
  const saveDreamMutation = trpc.dreams.save.useMutation();
  const deleteDreamMutation = trpc.dreams.delete.useMutation();

  const dreams = (getDreamHistoryQuery.data || []) as Dream[];

  // Handle dream submission
  const handleSubmitDream = async () => {
    if (!dreamContent.trim()) {
      toast.error("Please describe your dream");
      return;
    }

    if (dreamContent.length < 10) {
      toast.error("Dream description must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitDreamMutation.mutateAsync({
        dreamContent,
        mood: mood || undefined,
      });

      toast.success("Dream submitted! Generating interpretation...");
      setDreamContent("");
      setMood("");
      setSelectedDream({
        id: result.dreamId,
        dreamContent,
        interpretation: result.interpretation,
        mood: mood || undefined,
        isSaved: false,
        createdAt: new Date(),
      });

      // Refetch history
      await getDreamHistoryQuery.refetch();
    } catch (error) {
      console.error("Failed to submit dream:", error);
      toast.error("Failed to submit dream. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle saving dream
  const handleSaveDream = async (dreamId: number, currentSaved: boolean) => {
    try {
      await saveDreamMutation.mutateAsync({
        dreamId,
        isSaved: !currentSaved,
      });
      toast.success(currentSaved ? "Dream removed from favorites" : "Dream saved!");
      await getDreamHistoryQuery.refetch();
    } catch (error) {
      console.error("Failed to save dream:", error);
      toast.error("Failed to save dream");
    }
  };

  // Handle deleting dream
  const handleDeleteDream = async (dreamId: number) => {
    if (!window.confirm("Are you sure you want to delete this dream?")) return;

    try {
      await deleteDreamMutation.mutateAsync({ dreamId });
      toast.success("Dream deleted");
      setSelectedDream(null);
      await getDreamHistoryQuery.refetch();
    } catch (error) {
      console.error("Failed to delete dream:", error);
      toast.error("Failed to delete dream");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Dreams Interpreter
          </h1>
          <p className="text-slate-400">
            Share your dreams and receive spiritual interpretation
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dream Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Share Your Dream
              </h2>

              {/* Dream Content Textarea */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Dream Description
                </label>
                <Textarea
                  value={dreamContent}
                  onChange={(e) => setDreamContent(e.target.value)}
                  placeholder="Describe your dream in detail... (at least 10 characters)"
                  className="w-full bg-slate-700 text-white placeholder-slate-500 border-slate-600 focus:border-amber-600 focus:ring-amber-600 min-h-[150px]"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {dreamContent.length} characters
                </p>
              </div>

              {/* Mood Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mood (Optional)
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-md px-3 py-2 focus:border-amber-600 focus:ring-amber-600"
                >
                  <option value="">Select a mood...</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="anxious">Anxious</option>
                  <option value="joyful">Joyful</option>
                  <option value="confusing">Confusing</option>
                  <option value="vivid">Vivid</option>
                  <option value="dark">Dark</option>
                  <option value="mysterious">Mysterious</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitDream}
                disabled={isSubmitting || !dreamContent.trim()}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Interpretation...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Get Spiritual Interpretation
                  </>
                )}
              </Button>
            </div>

            {/* Selected Dream Interpretation */}
            {selectedDream && (
              <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-amber-600/30">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Interpretation
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleSaveDream(selectedDream.id, selectedDream.isSaved)
                      }
                      className={`${
                        selectedDream.isSaved
                          ? "bg-amber-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      } border-0`}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDream(selectedDream.id)}
                      className="bg-red-600 hover:bg-red-700 text-white border-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedDream.mood && (
                  <p className="text-sm text-slate-400 mb-3">
                    <span className="font-medium">Mood:</span> {selectedDream.mood}
                  </p>
                )}

                {selectedDream.interpretation ? (
                  <div className="bg-slate-700/50 rounded p-4 border border-slate-600">
                    <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {selectedDream.interpretation}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-700/50 rounded p-4 border border-slate-600 text-center">
                    <Loader2 className="w-6 h-6 text-amber-600 animate-spin mx-auto mb-2" />
                    <p className="text-slate-400">Generating interpretation...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dream History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Dream History
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                  className="bg-slate-700 text-slate-300 border-0 text-xs"
                >
                  {showHistory ? "Hide" : "Show"}
                </Button>
              </div>

              {showHistory && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {dreams.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No dreams yet. Share your first dream!
                    </p>
                  ) : (
                    dreams.map((dream) => (
                      <button
                        key={dream.id}
                        onClick={() => setSelectedDream(dream)}
                        className={`w-full text-left p-3 rounded border transition-colors ${
                          selectedDream?.id === dream.id
                            ? "bg-amber-600/20 border-amber-600"
                            : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        <p className="text-sm text-white font-medium truncate">
                          {dream.dreamContent.substring(0, 40)}...
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(dream.createdAt).toLocaleDateString()}
                        </p>
                        {dream.isSaved && (
                          <Heart className="w-3 h-3 text-amber-600 mt-1" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
