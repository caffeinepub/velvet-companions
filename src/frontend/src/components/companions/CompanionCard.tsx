import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Profile } from '../../backend';
import { MapPin } from 'lucide-react';

interface CompanionCardProps {
  profile: Profile;
}

export default function CompanionCard({ profile }: CompanionCardProps) {
  return (
    <Link to="/profile/$profileId" params={{ profileId: profile.id }}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={profile.photoUrl}
            alt={profile.displayName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 font-serif text-xl font-bold">{profile.displayName}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{profile.description}</p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {profile.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{profile.languages[0] || 'International'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
