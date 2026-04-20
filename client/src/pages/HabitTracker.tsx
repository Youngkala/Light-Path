import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {  Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
            <p className="text-sm text-primary-foreground/80">Build spiritual disciplines and track your progress</p>
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
            Add Habit
          </Button>
        ) : (
          <Card className="p-6 mb-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New Habit</h3>
            <input
              type="text"
              placeholder="Habit name (e.g., Daily Prayer)"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md mb-4"
            />
            <textarea
              placeholder="Description (optional)"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md mb-4 min-h-20"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
              >
                Create Habit
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
            <p className="text-muted-foreground">Loading habits...</p>
          </div>
        ) : habits && habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                className="p-4 bg-card border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLogCompletion(habit.id)}
                      className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-6 h-6 text-destructive" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">No habits yet. Create one to get started!</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {defaultHabits.map((habit) => (
                <button
                  key={habit.name}
                  onClick={() => {
                    setHabitName(habit.name);
                    setIsCreating(true);
                  }}
                  className="spiritual-card text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-2">{habit.icon}</div>
                  <p className="text-sm font-medium text-foreground">{habit.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
