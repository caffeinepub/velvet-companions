import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetAllProfiles, useCreateOrUpdateProfile } from '../../hooks/useQueries';
import { EditorialSection, EditorialHeadline } from '../../components/layout/EditorialSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { formatError } from '../../lib/errorFormatting';
import { Profile, Status__1 } from '../../backend';
import { Principal } from '@dfinity/principal';

export default function AdminProfileEditorPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const profileId = 'profileId' in params ? params.profileId : undefined;
  const { data: profiles = [] } = useGetAllProfiles();
  const createOrUpdate = useCreateOrUpdateProfile();

  const existingProfile = profileId ? profiles.find(p => p.id === profileId) : undefined;
  const isEditing = !!existingProfile;

  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [languages, setLanguages] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'review'>('review');

  useEffect(() => {
    if (existingProfile) {
      setDisplayName(existingProfile.displayName);
      setDescription(existingProfile.description);
      setPhotoUrl(existingProfile.photoUrl);
      setCategory(existingProfile.category);
      setLanguages(existingProfile.languages.join(', '));
      
      if (existingProfile.status === Status__1.active) setStatus('active');
      else if (existingProfile.status === Status__1.inactive) setStatus('inactive');
      else setStatus('review');
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim() || !description.trim() || !photoUrl.trim() || !category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const languageArray = languages.split(',').map(l => l.trim()).filter(Boolean);
    if (languageArray.length === 0) {
      toast.error('Please enter at least one language');
      return;
    }

    const statusObj: Status__1 = 
      status === 'active' ? Status__1.active :
      status === 'inactive' ? Status__1.inactive :
      Status__1.review;

    const profile: Profile = {
      id: existingProfile?.id || `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      principal: existingProfile?.principal || Principal.anonymous(),
      displayName: displayName.trim(),
      description: description.trim(),
      photoUrl: photoUrl.trim(),
      status: statusObj,
      category: category.trim(),
      priceRange: existingProfile?.priceRange || { min: BigInt(0), max: BigInt(0) },
      languages: languageArray,
      ratings: existingProfile?.ratings || {
        professionalism: BigInt(0),
        communication: BigInt(0),
        reliability: BigInt(0),
      },
    };

    try {
      await createOrUpdate.mutateAsync(profile);
      toast.success(isEditing ? 'Profile updated successfully' : 'Profile created successfully');
      navigate({ to: '/admin/profiles' });
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  return (
    <EditorialSection>
      <div className="mx-auto max-w-2xl">
        <EditorialHeadline className="mb-8">
          {isEditing ? 'Edit Profile' : 'Create Profile'}
        </EditorialHeadline>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Alexandra"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief bio and description..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL *</Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct URL to the profile photo
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Elite Companion, Travel Companion"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="languages">Languages *</Label>
            <Input
              id="languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g., English, French, Spanish"
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple languages with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active (Visible to public)</SelectItem>
                <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                <SelectItem value="review">Review (Pending approval)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/profiles' })}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOrUpdate.isPending}>
              {createOrUpdate.isPending ? 'Saving...' : isEditing ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </EditorialSection>
  );
}
