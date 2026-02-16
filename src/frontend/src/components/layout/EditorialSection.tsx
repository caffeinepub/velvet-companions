import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface EditorialSectionProps {
  children: ReactNode;
  className?: string;
}

export function EditorialSection({ children, className = '' }: EditorialSectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}

interface EditorialHeadlineProps {
  children: ReactNode;
  className?: string;
}

export function EditorialHeadline({ children, className = '' }: EditorialHeadlineProps) {
  return (
    <h2 className={`mb-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl ${className}`}>
      {children}
    </h2>
  );
}

interface EditorialSubheadProps {
  children: ReactNode;
  className?: string;
}

export function EditorialSubhead({ children, className = '' }: EditorialSubheadProps) {
  return (
    <p className={`text-lg text-muted-foreground md:text-xl ${className}`}>
      {children}
    </p>
  );
}

interface EditorialDividerProps {
  className?: string;
}

export function EditorialDivider({ className = '' }: EditorialDividerProps) {
  return <Separator className={`my-8 ${className}`} />;
}
