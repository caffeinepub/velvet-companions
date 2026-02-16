import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname || 'velvet-companions')
    : 'velvet-companions';

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <img 
              src="/assets/generated/logo-wordmark.dim_512x192.png" 
              alt="Velvet Companions" 
              className="mb-4 h-6 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              Premium adult companionship services.
            </p>
            <p className="mt-2 text-xs font-semibold text-destructive">
              18+ ONLY
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Terms & Disclaimer
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Browse</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/browse" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                View Companions
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 fill-current text-primary" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Velvet Companions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
