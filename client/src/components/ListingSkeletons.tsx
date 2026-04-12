import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const InternshipCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card p-5 shadow-card",
      className,
    )}
  >
    <div className="flex gap-4">
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4 max-w-xs" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="mt-4 h-9 w-full max-w-sm" />
  </div>
);

export const CourseCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "overflow-hidden rounded-xl border border-border bg-card shadow-card",
      className,
    )}
  >
    <Skeleton className="aspect-[16/9] w-full rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-between border-t pt-4">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  </div>
);

export const ApplicantCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-5 shadow-card">
    <div className="flex gap-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    </div>
    <Skeleton className="mt-4 h-10 w-full max-w-xs" />
  </div>
);
