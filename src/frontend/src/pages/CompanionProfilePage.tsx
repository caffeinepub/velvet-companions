import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetActiveProfiles } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { EditorialSection } from '../components/layout/EditorialSection';
import CompanionGallery from '../components/companions/CompanionGallery';
import BookingRequestDialog from '../components/bookings/BookingRequestDialog';
import RequireAuth from '../components/guards/RequireAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Languages, Star, Calendar } from 'lucide-react';

export default function CompanionProfilePage() {
  const { profileId } = useParams({ from: '/profile/$profileId' });
  const { data: profiles = [] } = useGetActiveProfiles();
  const { identity } = useInternetIdentity();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const profile = profiles.find(p => p.id === profileId);

  if (!profile) {
    return (
      <EditorialSection>
        <div className="py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">Profile Not Found</h2>
          <p className="text-muted-foreground">The companion profile you're looking for doesn't exist.</p>
        </div>
      </EditorialSection>
    );
  }

  const images = [profile.photoUrl];

  const handleBookingClick = () => {
    if (!identity) {
      // Will be handled by RequireAuth wrapper
      return;
    }
    setBookingDialogOpen(true);
  };

  return (
    <>
      <EditorialSection>
        <div className="mb-4 text-center">
          <p className="text-sm font-semibold text-destructive">18+ ONLY</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <CompanionGallery images={images} alt={profile.displayName} />
          </div>

          <div>
            <div className="mb-6">
              <h1 className="mb-2 font-serif text-4xl font-bold">{profile.displayName}</h1>
              <Badge className="mb-4">{profile.category}</Badge>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Languages className="h-4 w-4" />
                  <span>{profile.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Verified Profile</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="mb-3 font-serif text-2xl font-bold">About</h2>
              <p className="leading-relaxed text-muted-foreground">{profile.description}</p>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="mb-3 font-serif text-2xl font-bold">Companionship Services</h2>
              <p className="leading-relaxed text-muted-foreground">
                Professional companionship for social events, dinners, travel, and private engagements. 
                All services are legal adult companionship only.
              </p>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="mb-3 font-serif text-2xl font-bold">Availability</h2>
              <p className="leading-relaxed text-muted-foreground">
                Available for bookings by appointment. Submit a request with your preferred date and time, 
                and we'll confirm availability.
              </p>
            </div>

            <div className="mt-8">
              {identity ? (
                <Button size="lg" className="w-full gap-2" onClick={handleBookingClick}>
                  <Calendar className="h-5 w-5" />
                  Request Booking
                </Button>
              ) : (
                <RequireAuth>
                  <Button size="lg" className="w-full gap-2">
                    <Calendar className="h-5 w-5" />
                    Request Booking
                  </Button>
                </RequireAuth>
              )}
            </div>
          </div>
        </div>
      </EditorialSection>

      {identity && (
        <BookingRequestDialog
          companionId={profile.id}
          companionName={profile.displayName}
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
        />
      )}
    </>
  );
}
