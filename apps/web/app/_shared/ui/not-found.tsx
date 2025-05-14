import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 md:flex-row md:gap-12 lg:gap-24">
      <div className="bg-muted relative mb-8 flex h-48 w-48 items-center justify-center rounded-full md:h-64 md:w-64 lg:h-80 lg:w-80"></div>

      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-primary mb-4 text-8xl font-bold tracking-tighter md:text-9xl">
          404
        </h1>
        <h2 className="text-foreground mb-2 text-xl font-semibold uppercase tracking-wide md:text-2xl">
          Looks like you&apos;re lost
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for is not available!
        </p>
        <Link
          href="/feed"
          className="bg-background text-foreground hover:bg-muted group inline-flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors"
        >
          Go to feed
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
