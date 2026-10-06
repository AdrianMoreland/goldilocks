import { useState } from "react";
import { Button } from "@goldilocks/ui/button";
import { Checkbox } from "@goldilocks/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@goldilocks/ui/dialog";
import { Label } from "@goldilocks/ui/label";
import { Separator } from "@goldilocks/ui/separator";

import { PAYMENT_OPTIONS, PRICE_NOTICE } from "../config/order-notices";

export interface PaymentOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** Shown when the customer presses Place order request: how and when they pay. The request is sent only after they confirm. */
export function PaymentOptionsDialog({ open, onOpenChange, onConfirm }: PaymentOptionsDialogProps) {
  const [understood, setUnderstood] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setUnderstood(false);
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">How you pay</DialogTitle>
          <DialogDescription>{PAYMENT_OPTIONS.afterQuote}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm">
          <p>{PAYMENT_OPTIONS.bankTransfer}</p>
          <p>{PAYMENT_OPTIONS.inPerson}</p>
          <p className="font-medium">{PAYMENT_OPTIONS.cashFee}</p>
          <Separator />
          <p className="text-muted-foreground">{PRICE_NOTICE}</p>
          <div className="flex items-center gap-2">
            <Checkbox id="payment-understood" checked={understood} onCheckedChange={(on) => setUnderstood(on === true)} />
            <Label htmlFor="payment-understood">I understand</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!understood} onClick={onConfirm}>
            Send order request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
