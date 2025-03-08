export function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-end">
        <div className="w-28 h-10 bg-muted rounded-md animate-pulse"></div>
        <div className="w-36 h-10 bg-muted rounded-md animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded-md w-1/2 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded-md w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

