import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const projects = [
  { id: 1, name: "Learn Next.js 14", description: "Master the App Router and Server Components.", progress: 75 },
  { id: 2, name: "Firestore Data Modeling", description: "Design scalable data structures for Firebase.", progress: 40 },
  { id: 3, name: "Digital Gardening with Obsidian", description: "Build a personal knowledge base.", progress: 90 },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Learning Projects</h1>
        <p className="text-muted-foreground">Track your progress on new skills and knowledge.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={project.progress} className="w-full" />
              <p className="mt-2 text-right text-sm text-muted-foreground">{project.progress}% complete</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
