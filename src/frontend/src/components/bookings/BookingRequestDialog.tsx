import { useState } from 'react';
import { useSubmitBookingRequest } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatError } from '../../lib/errorFormatting';
import { Request, Status } from '../../backend';
import { Calendar } from 'lucide-react';

interface BookingRequestDialogProps {
  companionId: string;
  companionName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingRequestDialog({ 
  companionId, 
  companionName, 
  open, 
  onOpenChange 
}: BookingRequestDialogProps) {
  const { identity } = useInternetIdentity();
  const submitBooking = useSubmitBookingRequest();
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please sign in to submit a booking request');
      return;
    }

    if (!date || !time || !duration || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const request: Request = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companionId,
      requesterId: identity.getPrincipal(),
      status: Status.pending,
      requestTime: BigInt(Date.now() * 1000000),
      scheduledTime: BigInt(new Date(`${date}T${time}`).getTime() * 1000000),
      notes: `Duration: ${duration} hours\nLocation: ${location}\n\nAdditional notes:\n${notes}`,
    };

    try {
      await submitBooking.mutateAsync(request);
      toast.success('Booking request submitted successfully');
      onOpenChange(false);
      
      // Reset form
      setDate('');
      setTime('');
      setDuration('');
      setLocation('');
      setNotes('');
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Booking with {companionName}</DialogTitle>
          <DialogDescription>
            Fill in the details below to submit your booking request. Our team will review and respond shortly.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="24"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/City *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or information..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitBooking.isPending}>
              {submitBooking.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
