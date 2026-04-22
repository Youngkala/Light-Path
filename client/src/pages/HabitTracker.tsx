import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, CheckCircle2, Circle, X } from "lucide-react";
import { toast } from "sonner";

export default function HabitTracker() {
  const [isCreating, setIsCreating] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitIcon, setHabitIcon] = useState("heart");

  const { data: habits, isLoading, refetch } = trpc.habits.list.useQuery();
  const createMutation = trpc.habits.create.useMutation();
  const deleteMutation = trpc.habits.delete.useMutation();
  const logMutation = trpc.habits.logCompletion.useMutation();

  const handleCreate = async () => {
    if (!habitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    try {
      await createMutation.mutateAsync({ name: habitName, description: habitDescription, icon: habitIcon });
      setHabitName("");
      setHabitDescription("");
      setHabitIcon("heart");
      setIsCreating(false);
      refetch();
      toast.success("Habit created");
    } catch (error) {
      toast.error("Failed to create habit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
      toast.success("Habit deleted");
    } catch (error) {
      toast.error("Failed to delete habit");
    }
  };

  const handleLogCompletion = async (id: number) => {
    try {
      await logMutation.mutateAsync({ habitId: id });
      refetch();
      toast.success("Great job! Habit logged");
    } catch (error) {
      toast.error("Failed to log habit");
    }
  };

  const defaultHabits = [
    { name: "Prayer", icon: "🙏" },
    { name: "Bible Reading", icon: "📖" },
    { name: "Meditation", icon: "🧘" },
    { name: "Fasting", icon: "🕯️" },
    { name: "Worship", icon: "🎵" },
    { name: "Service", icon: "🤝" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">Habit Tracker</h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">Build spiritual disciplines and track your progress</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Create Habit Section */}
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground mb-6 w-full h-12 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Habit
          </Button>
        ) : (
          <Card className="p-4 sm:p-6 mb-6 bg-card border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Create New Habit</h2>
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
                <label className="text-sm font-medium text-foreground mb-2 block">Habit Name</label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g., Morning Prayer"
                  className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Description (optional)</label>
                <input
                  type="text"
                  value={habitDescription}
                  onChange={(e) => setHabitDescription(e.target.value)}
                  placeholder="Add details about this habit..."
                  className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {defaultHabits.map(habit => (
                    <button
                      key={habit.icon}
                      onClick={() => setHabitIcon(habit.icon)}
                      className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                        habitIcon === habit.icon
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {habit.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !habitName.trim()}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-10 font-semibold"
                >
                  {createMutation.isPending ? "Creating..." : "Create Habit"}
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

        {/* Habits List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading habits...</p>
            </div>
          ) : habits && habits.length > 0 ? (
            habits.map((habit: any) => {
              const todayLogged = habit.completions?.some((c: any) => {
                const completionDate = new Date(c.completedAt).toDateString();
                return completionDate === new Date().toDateString();
              });

              return (
                <Card
                  key={habit.id}
                  className="p-4 sm:p-5 bg-card border-border hover:border-accent/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{habit.name}</h3>
                          {habit.description && (
                            <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-accent">
                          {habit.currentStreak || 0} day streak
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => handleLogCompletion(habit.id)}
                      disabled={todayLogged || logMutation.isPending}
                      className={`flex-1 sm:flex-none h-10 text-sm font-semibold transition-all ${
                        todayLogged
                          ? "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
                          : "bg-accent hover:bg-accent/90 text-accent-foreground"
                      }`}
                    >
                      {todayLogged ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Done Today
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 mr-1" />
                          Log Today
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDelete(habit.id)}
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                      className="flex-1 sm:flex-none h-10 text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-muted-foreground mb-4">No habits yet. Create your first spiritual habit today!</p>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Habit
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
