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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mx-auto max-w-[15ch] text-center text-4xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground grid justify-center gap-8 text-sm">
            <span className="block max-w-[45ch] text-center">
              {description}
            </span>
            <ConnectButton />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
