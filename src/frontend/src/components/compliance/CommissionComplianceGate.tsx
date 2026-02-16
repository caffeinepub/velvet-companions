import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerBanStatus, useGetCallerCommissionsDue, useConfirmCommissionPayment } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { AlertCircle, Ban, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { formatError } from '@/lib/errorFormatting';
import { useQueryClient } from '@tanstack/react-query';

interface CommissionComplianceGateProps {
  children: React.ReactNode;
}

export default function CommissionComplianceGate({ children }: CommissionComplianceGateProps) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: isBanned, isLoading: banLoading, error: banError } = useGetCallerBanStatus();
  const { data: commissionsDue, isLoading: commissionsLoading, error: commissionsError } = useGetCallerCommissionsDue();
  const confirmPayment = useConfirmCommissionPayment();

  // Only check compliance for authenticated users
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading state while checking compliance
  if (banLoading || commissionsLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Checking account status...</p>
        </div>
      </div>
    );
  }

  // Handle errors gracefully
  if (banError || commissionsError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="mx-4 max-w-md rounded-lg border bg-card p-6 text-center shadow-lg">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Unable to Verify Account Status</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            We encountered an error while checking your account. Please try logging out and back in.
          </p>
          <Button
            onClick={async () => {
              await clear();
              queryClient.clear();
            }}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Show permanent ban screen
  if (isBanned) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="mx-4 max-w-md rounded-lg border bg-card p-6 text-center shadow-lg">
          <Ban className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold text-destructive">Account Permanently Banned</h2>
          <p className="mb-6 text-muted-foreground">
            Your account has been permanently banned due to non-payment of commission fees. This action cannot be reversed.
            You will not be able to use this platform with this account.
          </p>
          <Button
            onClick={async () => {
              await clear();
              queryClient.clear();
            }}
            variant="destructive"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Filter pending commissions
  const pendingCommissions = commissionsDue?.filter((c) => c.status === 'pending') || [];

  // Show commission payment prompt if there are pending commissions
  if (pendingCommissions.length > 0) {
    const handleConfirmPayment = async (bookingId: string, paid: boolean) => {
      try {
        await confirmPayment.mutateAsync({ bookingId, paid });
        toast.success(paid ? 'Payment confirmed successfully' : 'Non-payment recorded');
      } catch (error) {
        const errorMessage = formatError(error);
        toast.error(errorMessage);
        
        // If banned due to non-payment, the query will refetch and show ban screen
        if (errorMessage.includes('banned')) {
          queryClient.invalidateQueries({ queryKey: ['callerBanStatus'] });
        }
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="mx-4 max-w-2xl rounded-lg border bg-card p-6 shadow-lg">
          <div className="mb-6 text-center">
            <DollarSign className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h2 className="mb-2 text-2xl font-bold">Commission Payment Required</h2>
            <p className="text-muted-foreground">
              You have outstanding commission payments that must be confirmed before you can continue using the platform.
            </p>
          </div>

          <div className="mb-6 space-y-4">
            {pendingCommissions.map((commission) => (
              <div key={commission.bookingId} className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">Booking ID: {commission.bookingId}</p>
                    <p className="text-2xl font-bold text-primary">₹{commission.amount.toString()}</p>
                    <p className="text-sm text-muted-foreground">Commission due</p>
                  </div>
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Pending
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleConfirmPayment(commission.bookingId, true)}
                    disabled={confirmPayment.isPending}
                    className="flex-1"
                  >
                    {confirmPayment.isPending ? 'Processing...' : 'I have paid'}
                  </Button>
                  <Button
                    onClick={() => handleConfirmPayment(commission.bookingId, false)}
                    disabled={confirmPayment.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    {confirmPayment.isPending ? 'Processing...' : 'I did not pay'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-destructive/10 p-4 text-sm">
            <p className="font-semibold text-destructive">Important Notice:</p>
            <p className="text-muted-foreground">
              Selecting "I did not pay" will result in your account being permanently banned from the platform.
              Please ensure you have made the payment before confirming.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={async () => {
                await clear();
                queryClient.clear();
              }}
              variant="ghost"
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No compliance issues - render children normally
  return <>{children}</>;
}
