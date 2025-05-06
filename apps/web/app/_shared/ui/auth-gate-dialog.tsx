import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@skill-based/ui/components/dialog";

import { ConnectButton } from "./connect-button";

interface AuthGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export function AuthGateDialog({
  open,
  onOpenChange,
  title,
  description,
}: AuthGateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit p-8">
        <DialogHeader>
          <DialogTitle className="mx-auto max-w-fit text-center text-4xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-md mt-2 grid gap-8">
            <span className="mx-auto block max-w-[30ch] text-center">
              {description}
            </span>
            <ConnectButton />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
