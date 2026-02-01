import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenSquare, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function JournalPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <PenSquare className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Coming Soon!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Creative Journal is currently under construction. Get ready to capture your thoughts, ideas, and inspirations.
          </p>
          <Button asChild>
            <Link href="/feed">
              <ArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
