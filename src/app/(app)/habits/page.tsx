import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const habits = [
  { id: 1, name: "Read for 15 minutes", completed: true },
  { id: 2, name: "Morning meditation", completed: false },
  { id: 3, name: "Go for a walk", completed: true },
  { id: 4, name: "Journal one entry", completed: false },
];

export default function HabitsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Habit Tracker</h1>
        <p className="text-muted-foreground">Cultivate your daily routines and watch your progress.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center space-x-3 rounded-md border p-4">
                <Checkbox id={`habit-${habit.id}`} checked={habit.completed} />
                <label
                  htmlFor={`habit-${habit.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {habit.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
