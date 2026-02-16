import { ReactNode } from 'react';
import { useAuthz } from '../../hooks/useAuthz';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Lock } from 'lucide-react';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { isAdmin, isLoading } = useAuthz();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-accent p-4">
              <Lock className="h-8 w-8 text-accent-foreground" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold">Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please sign in to access the admin area.
          </p>
          <Button onClick={login} disabled={loginStatus === 'logging-in'}>
            {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
