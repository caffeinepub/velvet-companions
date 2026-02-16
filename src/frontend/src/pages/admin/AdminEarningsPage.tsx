import { useGetPlatformEarnings, useGetMonetizationConfig, useGetAllBookings } from '../../hooks/useQueries';
import { EditorialSection, EditorialHeadline, EditorialSubhead } from '../../components/layout/EditorialSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp } from 'lucide-react';
import { Model, Status } from '../../backend';

export default function AdminEarningsPage() {
  const { data: earnings, isLoading: earningsLoading } = useGetPlatformEarnings();
  const { data: config, isLoading: configLoading } = useGetMonetizationConfig();
  const { data: bookings = [], isLoading: bookingsLoading } = useGetAllBookings();

  const isLoading = earningsLoading || configLoading || bookingsLoading;

  const formatCurrency = (amount: bigint | number) => {
    const num = typeof amount === 'bigint' ? Number(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatDate = (time: bigint) => {
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getModelLabel = (model: Model) => {
    switch (model) {
      case Model.commission:
        return 'Commission';
      case Model.listingFee:
        return 'Listing Fee';
      case Model.featuredPlacement:
        return 'Featured Placement';
      case Model.leadFee:
        return 'Lead Fee';
      case Model.none:
        return 'None';
      default:
        return 'Unknown';
    }
  };

  const getModelBadgeVariant = (model: Model) => {
    switch (model) {
      case Model.commission:
        return 'default';
      case Model.listingFee:
        return 'secondary';
      case Model.featuredPlacement:
        return 'outline';
      case Model.leadFee:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Get recent completed bookings for fee tracking
  const completedBookings = bookings
    .filter(b => b.status === Status.completed)
    .sort((a, b) => Number(b.requestTime - a.requestTime))
    .slice(0, 20);

  if (isLoading) {
    return (
      <EditorialSection>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EditorialSection>
    );
  }

  return (
    <EditorialSection>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <EditorialHeadline>Earnings Dashboard</EditorialHeadline>
          <EditorialSubhead>
            Track your platform's revenue and fee records
          </EditorialSubhead>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Earnings
              </CardTitle>
              <CardDescription>Cumulative platform revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{formatCurrency(earnings || 0n)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Active Model
              </CardTitle>
              <CardDescription>Current monetization strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge variant={getModelBadgeVariant(config?.model || Model.none)} className="text-base">
                  {getModelLabel(config?.model || Model.none)}
                </Badge>
                {config?.model === Model.commission && config.commissionRate !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {config.commissionRate.toString()}% per booking
                  </span>
                )}
                {config?.model === Model.listingFee && config.listingFee !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(config.listingFee)} per listing
                  </span>
                )}
                {config?.model === Model.leadFee && config.leadFee !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(config.leadFee)} per lead
                  </span>
                )}
                {config?.model === Model.featuredPlacement && config.featuredPlacementFee !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(config.featuredPlacementFee)} per feature
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Fee Records</CardTitle>
            <CardDescription>
              {config?.model === Model.commission
                ? 'Completed bookings that generated commission revenue'
                : 'Recent activity that generated platform fees'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedBookings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p>No fee records yet</p>
                <p className="mt-2 text-sm">
                  {config?.model === Model.none
                    ? 'Enable a monetization model to start tracking earnings'
                    : 'Fee records will appear here as activity occurs'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Companion</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">
                          {formatDate(booking.requestTime)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getModelBadgeVariant(config?.model || Model.none)}>
                            {getModelLabel(config?.model || Model.none)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {booking.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {booking.companionId.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge>Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 rounded-lg border border-border/40 bg-muted/50 p-4 text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> These are internal tracking records only. No actual payment processing is integrated.
            Earnings represent the amounts that would be collected based on your active monetization model.
          </p>
        </div>
      </div>
    </EditorialSection>
  );
}
