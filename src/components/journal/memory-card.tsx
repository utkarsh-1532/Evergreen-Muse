import Image from "next/image";
import type { JournalEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";
import { format } from "date-fns";

type MemoryCardProps = {
  entry: JournalEntry;
};

export default function MemoryCard({ entry }: MemoryCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-lg">
      {entry.imageUrl && (
        <div className="relative">
          <Image
            src={entry.imageUrl}
            alt={entry.imageCaption || entry.title}
            width={600}
            height={400}
            className="w-full object-cover"
            data-ai-hint="forest stream"
          />
          {entry.imageCaption && (
            <p className="mt-2 px-6 text-sm italic text-muted-foreground">
              {entry.imageCaption}
            </p>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-serif text-2xl">{entry.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(entry.timestamp, "MMMM d, yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <p className="font-serif leading-relaxed text-foreground/90">
          {entry.text}
        </p>
      </CardContent>
      {entry.songTitle && (
        <CardFooter>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            <Music className="h-4 w-4" />
            <span>
              {entry.songTitle} - {entry.songArtist}
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
