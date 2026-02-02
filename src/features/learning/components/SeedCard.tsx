'use client';
import { LearningSeed } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, TreePine, TreeDeciduous } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SeedCardProps {
  seed: LearningSeed;
}

const GrowthIcon = ({ box }: { box: number }) => {
  if (box <= 1) {
    return <Sprout className="h-6 w-6 text-yellow-600" />;
  }
  if (box <= 3) {
    return <TreePine className="h-6 w-6 text-green-600" />;
  }
  return <TreeDeciduous className="h-6 w-6 text-emerald-500" />;
};

export function SeedCard({ seed }: SeedCardProps) {
  return (
    <Card className="glass-panel flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-base font-semibold">{seed.front}</CardTitle>
            <GrowthIcon box={seed.box} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
             {seed.category && <Badge variant="secondary">{seed.category}</Badge>}
             <span>
                {seed.nextReview
                  ? `Review ${formatDistanceToNow(seed.nextReview.toDate(), { addSuffix: true })}`
                  : 'No review scheduled'
                }
            </span>
          </div>
      </CardContent>
    </Card>
  );
}
