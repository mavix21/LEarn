import * as React from "react";

import { cn } from "@myapp/ui/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground relative flex flex-col gap-6 rounded-xl border py-6 shadow-sm has-data-[slot=card-image]:overflow-clip has-data-[slot=card-image]:pt-0",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardImage({
  className,
  children,
  withOverlay = false,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  withOverlay?: boolean;
}) {
  const overlayStyles = {
    position: "absolute",
    inset: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
    background: `linear-gradient(
      180deg,
      hsla(0, 0%, 35.29%, 0) 0%,
      hsla(0, 0%, 34.53%, 0.034375) 16.36%,
      hsla(0, 0%, 32.42%, 0.125) 33.34%,
      hsla(0, 0%, 29.18%, 0.253125) 50.1%,
      hsla(0, 0%, 24.96%, 0.4) 65.75%,
      hsla(0, 0%, 19.85%, 0.546875) 79.43%,
      hsla(0, 0%, 13.95%, 0.675) 90.28%,
      hsla(0, 0%, 7.32%, 0.765625) 97.43%,
      hsla(0, 0%, 0%, 0.8) 100%
    )`,
  } as const;
  return (
    <>
      <div
        data-slot="card-image"
        className={cn("relative h-64 w-full", className)}
        {...props}
      >
        {children}
        {withOverlay && <div style={overlayStyles} />}
      </div>
    </>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-2xl leading-none font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardImage,
};
