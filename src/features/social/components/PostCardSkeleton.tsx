import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-48 w-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 border-t pt-4 mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  )
}
