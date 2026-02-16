import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllProfiles, useCreateOrUpdateCallerCompanionProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { formatError } from '../lib/errorFormatting';
import { Status__1 } from '../backend';
import { Loader2, IndianRupee } from 'lucide-react';
import { EditorialSection, EditorialHeadline, EditorialSubhead } from '../components/layout/EditorialSection';

export default function MyCompanionProfilePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: allProfiles, isLoading: profilesLoading } = useGetAllProfiles();
  const createOrUpdateMutation = useCreateOrUpdateCallerCompanionProfile();

  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [languages, setLanguages] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [feeConfirmed, setFeeConfirmed] = useState(false);

  useEffect(() => {
    if (identity && allProfiles) {
      const myProfile = allProfiles.find(
        (p) => p.principal.toString() === identity.getPrincipal().toString()
      );
      if (myProfile) {
        setExistingProfile(myProfile);
        setIsEditing(true);
        setDisplayName(myProfile.displayName);
        setDescription(myProfile.description);
        setPhotoUrl(myProfile.photoUrl);
        setCategory(myProfile.category);
        setCity(myProfile.city || '');
        setLanguages(myProfile.languages.join(', '));
        setMinPrice(myProfile.priceRange.min.toString());
        setMaxPrice(myProfile.priceRange.max.toString());
        setFeeConfirmed(true); // Already paid
      }
    }
  }, [identity, allProfiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please sign in to continue');
      return;
    }

    if (!displayName || !description || !category || !city || !minPrice || !maxPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditing && !feeConfirmed) {
      toast.error('Please confirm the one-time ₹10 fee to create your profile');
      return;
    }

    const profileId = existingProfile?.id || `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const profile = {
      id: profileId,
      principal: identity.getPrincipal(),
      displayName,
      description,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      status: (existingProfile?.status || Status__1.review) as Status__1,
      category,
      city,
      priceRange: {
        min: BigInt(minPrice),
        max: BigInt(maxPrice),
      },
      languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
      ratings: existingProfile?.ratings || {
        professionalism: BigInt(0),
        communication: BigInt(0),
        reliability: BigInt(0),
      },
    };

    try {
      await createOrUpdateMutation.mutateAsync({ profile, hasPaidFee: feeConfirmed });
      toast.success(isEditing ? 'Profile updated successfully!' : 'Profile created successfully!');
      navigate({ to: '/profile/$profileId', params: { profileId } });
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  if (profilesLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <EditorialSection>
        <EditorialHeadline>
          {isEditing ? 'Edit Your Profile' : 'Create Your Companion Profile'}
        </EditorialHeadline>
        <EditorialSubhead>
          {isEditing
            ? 'Update your profile information to keep it current'
            : 'Join our platform and start connecting with clients'}
        </EditorialSubhead>

        <Card className="mx-auto mt-8 max-w-2xl">
          <CardHeader>
            <CardTitle>{isEditing ? 'Update Profile' : 'New Profile'}</CardTitle>
            <CardDescription>
              {isEditing
                ? 'Make changes to your companion profile'
                : 'Fill in your details to create your profile'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditing && (
              <Alert className="mb-6 border-primary/50 bg-primary/10">
                <IndianRupee className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  <strong>One-time fee: ₹10 to create your profile</strong>
                  <br />
                  This fee helps maintain the quality of our platform.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your professional name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell clients about yourself, your services, and what makes you unique"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg (optional)"
                  type="url"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use a default image
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Dinner Companion, Event Escort, Travel Partner"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <Input
                  id="languages"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g., English, Hindi, French (comma-separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Min Price (₹) *</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="5000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price (₹) *</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="15000"
                    required
                  />
                </div>
              </div>

              {!isEditing && (
                <div className="flex items-start space-x-2 rounded-md border p-4">
                  <Checkbox
                    id="feeConfirmed"
                    checked={feeConfirmed}
                    onCheckedChange={(checked) => setFeeConfirmed(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="feeConfirmed"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm the one-time ₹10 profile creation fee
                    </label>
                    <p className="text-xs text-muted-foreground">
                      This fee is required to create your profile and helps maintain platform quality.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/browse' })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createOrUpdateMutation.isPending || (!isEditing && !feeConfirmed)}
                  className="flex-1"
                >
                  {createOrUpdateMutation.isPending
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Profile'
                      : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </EditorialSection>
    </div>
  );
}
