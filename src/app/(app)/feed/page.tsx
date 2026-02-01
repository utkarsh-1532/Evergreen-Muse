import MemoryCard from "@/components/journal/memory-card";
import { Button } from "@/components/ui/button";
import type { JournalEntry } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const mockEntries: JournalEntry[] = [
  {
    id: "1",
    title: "A walk in the woods",
    text: "Today, I took a long walk through the forest. The air was crisp, and the scent of pine was all around. It's in these quiet moments, surrounded by nature's giants, that I feel most at peace. The sunlight filtering through the canopy created a beautiful, shifting mosaic on the forest floor. It reminded me that even in stillness, there is constant change and beauty to be found.",
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageCaption: "A path less traveled.",
    songTitle: "Holocene",
    songArtist: "Bon Iver",
    timestamp: new Date("2024-05-20T10:00:00Z"),
  },
  {
    id: "2",
    title: "Thoughts on creativity",
    text: "Creativity isn't a bolt of lightning. It's a slow, patient cultivation. Like tending a garden, you have to show up every day, water the seeds of ideas, pull the weeds of self-doubt, and trust in the process of growth. Some days are fallow, and that's okay. The rain will come again.",
    timestamp: new Date("2024-05-18T15:30:00Z"),
  },
  {
    id: "3",
    title: "Mountain sunrise",
    text: "Woke up at 4 AM to catch the sunrise from the peak. The world was painted in hues of orange and purple. It was breathtaking. A powerful reminder of new beginnings and the beauty that awaits when you're willing to make the climb.",
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageCaption: "Morning's first light.",
    songTitle: "First Day Of My Life",
    songArtist: "Bright Eyes",
    timestamp: new Date("2024-05-15T05:45:00Z"),
  },
];

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Creative Feed</h1>
          <p className="text-muted-foreground">Your collection of thoughts, moments, and inspirations.</p>
        </div>
        <Link href="/entry/new" passHref legacyBehavior>
           <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        {mockEntries.map((entry) => (
          <MemoryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
