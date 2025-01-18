"use client";

interface DataLoaderProps {
  isLoading: boolean;
  error: any;
  children: React.ReactNode;
  loadingText?: string;
  skeleton?: React.ReactNode;
}

export function DataLoader({
  isLoading,
  error,
  children,
  skeleton,
}: DataLoaderProps) {
  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      skeleton || (
        <div className="flex h-[200px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      )
    );
  }

  return children;
}
