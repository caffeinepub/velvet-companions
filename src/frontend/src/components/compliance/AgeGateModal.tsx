import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface AgeGateModalProps {
  onConfirm: () => void;
  onDecline: () => void;
}

export default function AgeGateModal({ onConfirm, onDecline }: AgeGateModalProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-accent p-3">
              <AlertTriangle className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Age Verification Required</DialogTitle>
          <DialogDescription className="text-center">
            This website contains adult content and is intended for individuals 18 years of age or older.
            By entering, you confirm that you are of legal age in your jurisdiction.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onConfirm} className="w-full">
            I am 18 or older - Enter
          </Button>
          <Button onClick={onDecline} variant="outline" className="w-full">
            I am under 18 - Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
