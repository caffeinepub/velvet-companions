import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { identity, login, loginStatus } = useInternetIdentity();

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
            Please sign in to access this feature.
          </p>
          <Button onClick={login} disabled={loginStatus === 'logging-in'}>
            {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
