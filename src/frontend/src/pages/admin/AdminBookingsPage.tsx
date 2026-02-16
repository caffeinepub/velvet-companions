import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllBookings } from '../../hooks/useQueries';
import { EditorialSection, EditorialHeadline } from '../../components/layout/EditorialSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Status } from '../../backend';

export default function AdminBookingsPage() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useGetAllBookings();
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(b => {
      if (activeTab === 'pending') return b.status === Status.pending;
      if (activeTab === 'accepted') return b.status === Status.accepted;
      if (activeTab === 'rejected') return b.status === Status.rejected;
      if (activeTab === 'completed') return b.status === Status.completed;
      return false;
    });
  }, [bookings, activeTab]);

  const getStatusBadge = (status: Status) => {
    if (status === Status.pending) return <Badge variant="secondary">Pending</Badge>;
    if (status === Status.accepted) return <Badge variant="default">Accepted</Badge>;
    if (status === Status.rejected) return <Badge variant="destructive">Rejected</Badge>;
    if (status === Status.completed) return <Badge variant="outline">Completed</Badge>;
    return <Badge>Unknown</Badge>;
  };

  const formatDate = (time?: bigint) => {
    if (!time) return 'N/A';
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <EditorialSection>
      <EditorialHeadline className="mb-8">Manage Bookings</EditorialHeadline>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No bookings found.</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Companion</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">{booking.id.slice(0, 12)}...</TableCell>
                      <TableCell>{booking.companionId.slice(0, 12)}...</TableCell>
                      <TableCell>{formatDate(booking.requestTime)}</TableCell>
                      <TableCell>{formatDate(booking.scheduledTime)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate({ to: '/admin/bookings/$bookingId', params: { bookingId: booking.id } })}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </EditorialSection>
  );
}
