"use client";

import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, PenSquare, Target } from "lucide-react";
import Link from 'next/link';

export default function FeedPage() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Friend'}!
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your journey of growth?
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Track Your Habits</CardTitle>
                </div>
                <CardDescription className="pt-2">
                    Build positive routines and break old patterns. Consistency is key to mastery.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                 <Button asChild variant="outline">
                    <Link href="#">
                        Go to Habits <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <PenSquare className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Creative Journaling</CardTitle>
                </div>
                <CardDescription className="pt-2">
                    Unleash your thoughts, ideas, and reflections. A space for your mind to wander and create.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild variant="outline">
                    <Link href="#">
                        Start Writing <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Expand Your Knowledge</CardTitle>
                </div>
                <CardDescription className="pt-2">
                   Curate your learning path. Collect resources, take notes, and track your progress.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                 <Button asChild variant="outline">
                    <Link href="#">
                        Go to Learning <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
