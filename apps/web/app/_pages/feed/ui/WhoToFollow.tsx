export function WhoToFollow() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Who to follow</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground text-xs">DESIGN</p>
          <p className="font-medium">ThreadsDesktop</p>
          <p className="text-muted-foreground text-xs">123.9k threads</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs">MOVIES AND SERIES</p>
          <p className="font-medium">Spider-Man: Across the Spider-Verse</p>
          <p className="text-muted-foreground text-xs">93.4k threads</p>
        </div>

        <p className="text-sm text-blue-400">see more</p>
      </div>
    </>
  );
}
