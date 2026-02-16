import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetAllBookings, useUpdateBookingStatus } from '../../hooks/useQueries';
import { EditorialSection, EditorialHeadline } from '../../components/layout/EditorialSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatError } from '../../lib/errorFormatting';
import { Status } from '../../backend';

export default function AdminBookingDetailPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams({ from: '/admin/bookings/$bookingId' });
  const { data: bookings = [] } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();

  const booking = bookings.find(b => b.id === bookingId);

  const handleStatusUpdate = async (status: Status) => {
    try {
      await updateStatus.mutateAsync({ requestId: bookingId, status });
      toast.success('Booking status updated');
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  if (!booking) {
    return (
      <EditorialSection>
        <div className="py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">Booking Not Found</h2>
          <Button onClick={() => navigate({ to: '/admin/bookings' })}>
            Back to Bookings
          </Button>
        </div>
      </EditorialSection>
    );
  }

  const getStatusBadge = (status: Status) => {
    if (status === Status.pending) return <Badge variant="secondary">Pending</Badge>;
    if (status === Status.accepted) return <Badge variant="default">Accepted</Badge>;
    if (status === Status.rejected) return <Badge variant="destructive">Rejected</Badge>;
    if (status === Status.completed) return <Badge>Completed</Badge>;
    return <Badge>Unknown</Badge>;
  };

  const formatDate = (time?: bigint) => {
    if (!time) return 'N/A';
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isPending = booking.status === Status.pending;

  return (
    <EditorialSection>
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate({ to: '/admin/bookings' })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bookings
      </Button>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-start justify-between">
          <EditorialHeadline>Booking Details</EditorialHeadline>
          {getStatusBadge(booking.status)}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Booking ID</h3>
            <p className="font-mono text-sm">{booking.id}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Companion ID</h3>
            <p className="font-mono text-sm">{booking.companionId}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Requester</h3>
            <p className="font-mono text-sm">{booking.requesterId.toString()}</p>
          </div>

          <Separator />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Request Date</h3>
              <p>{formatDate(booking.requestTime)}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Scheduled Date</h3>
              <p>{formatDate(booking.scheduledTime)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Notes</h3>
            <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {booking.notes || 'No additional notes provided.'}
            </div>
          </div>

          {isPending && (
            <>
              <Separator />
              <div className="flex gap-4">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleStatusUpdate(Status.accepted)}
                  disabled={updateStatus.isPending}
                >
                  <Check className="h-4 w-4" />
                  Accept Booking
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => handleStatusUpdate(Status.rejected)}
                  disabled={updateStatus.isPending}
                >
                  <X className="h-4 w-4" />
                  Reject Booking
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </EditorialSection>
  );
}
