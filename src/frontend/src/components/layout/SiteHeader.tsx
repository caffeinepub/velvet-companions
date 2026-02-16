import { Link, useNavigate } from '@tanstack/react-router';
import { useAuthz } from '../../hooks/useAuthz';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthz();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/assets/generated/logo-wordmark.dim_512x192.png" 
              alt="Velvet Companions" 
              className="h-8 w-auto"
            />
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link 
              to="/browse" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Browse
            </Link>
            {isAdmin && (
              <>
                <Link 
                  to="/admin/profiles" 
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                >
                  <Shield className="h-3 w-3" />
                  Profiles
                </Link>
                <Link 
                  to="/admin/bookings" 
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                >
                  <Shield className="h-3 w-3" />
                  Bookings
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">18+ ONLY</span>
          <div className="hidden md:block">
            <LoginButton />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link 
              to="/browse" 
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            {isAdmin && (
              <>
                <Link 
                  to="/admin/profiles" 
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-3 w-3" />
                  Manage Profiles
                </Link>
                <Link 
                  to="/admin/bookings" 
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-3 w-3" />
                  Manage Bookings
                </Link>
              </>
            )}
            <div className="pt-2">
              <LoginButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
