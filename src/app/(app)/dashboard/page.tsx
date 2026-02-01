import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your growth summary.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are tracking 3 habits.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have 2 active projects.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You've written 5 entries.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
