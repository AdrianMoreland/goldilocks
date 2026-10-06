import { Button } from "@goldilocks/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@goldilocks/ui/dialog";

import { formatDublinDateTime } from "../lib/format";

export interface MarketClosedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The next opening of the chosen branch's gold office, as an instant. Shown in Irish time. */
  nextOpening: Date;
  onConfirm: () => void;
}

/** Shown when a request is about to be sent while the market is closed (weekend or outside opening hours). */
export function MarketClosedDialog({ open, onOpenChange, nextOpening, onConfirm }: MarketClosedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-warning-text/30 bg-warning text-warning-text">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">The market is closed</DialogTitle>
          <DialogDescription className="text-warning-text">
            You can send your request now, but it will not be processed, priced or locked until{" "}
            <strong className="font-semibold tabular-nums">{formatDublinDateTime(nextOpening)}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" className="border-warning-text bg-transparent text-warning-text hover:bg-warning-text/10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="bg-warning-text text-warning hover:bg-warning-text/90" onClick={onConfirm}>
            Send request anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
