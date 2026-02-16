import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EditorialSection, EditorialHeadline, EditorialSubhead } from '../components/layout/EditorialSection';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x1080.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Velvet Companions
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Premium adult companionship services for discerning individuals
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/browse' })} className="gap-2">
                Browse Companions
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm font-semibold text-destructive">18+ ONLY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <EditorialSection className="bg-muted/30">
        <div className="mx-auto max-w-5xl text-center">
          <EditorialHeadline className="mb-12">Why Choose Velvet Companions</EditorialHeadline>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold">Verified Profiles</h3>
              <p className="text-muted-foreground">
                All companions are carefully vetted and verified for your peace of mind.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold">Flexible Scheduling</h3>
              <p className="text-muted-foreground">
                Book appointments that fit your schedule with our easy request system.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold">Premium Experience</h3>
              <p className="text-muted-foreground">
                Enjoy sophisticated companionship tailored to your preferences.
              </p>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* CTA Section */}
      <EditorialSection>
        <div className="mx-auto max-w-3xl text-center">
          <EditorialHeadline className="mb-6">Ready to Begin?</EditorialHeadline>
          <EditorialSubhead className="mb-8">
            Explore our curated selection of companions and find your perfect match.
          </EditorialSubhead>
          <Button size="lg" onClick={() => navigate({ to: '/browse' })} className="gap-2">
            View All Companions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </EditorialSection>
    </div>
  );
}
