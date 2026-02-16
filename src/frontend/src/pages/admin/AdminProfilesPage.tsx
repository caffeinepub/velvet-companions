import { useNavigate } from '@tanstack/react-router';
import { useGetAllProfiles, useUpdateProfileStatus } from '../../hooks/useQueries';
import { EditorialSection, EditorialHeadline } from '../../components/layout/EditorialSection';
import ProfileStatusBadge from '../../components/admin/ProfileStatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { formatError } from '../../lib/errorFormatting';
import { Status__1 } from '../../backend';

export default function AdminProfilesPage() {
  const navigate = useNavigate();
  const { data: profiles = [], isLoading } = useGetAllProfiles();
  const updateStatus = useUpdateProfileStatus();

  const handleStatusChange = async (profileId: string, status: Status__1) => {
    try {
      await updateStatus.mutateAsync({ profileId, status });
      toast.success('Profile status updated');
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  return (
    <EditorialSection>
      <div className="mb-8 flex items-center justify-between">
        <EditorialHeadline>Manage Profiles</EditorialHeadline>
        <Button onClick={() => navigate({ to: '/admin/profiles/create' })} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Profile
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-muted-foreground">No profiles yet.</p>
          <Button onClick={() => navigate({ to: '/admin/profiles/create' })}>
            Create First Profile
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map(profile => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.displayName}</TableCell>
                  <TableCell>{profile.category}</TableCell>
                  <TableCell>
                    <ProfileStatusBadge status={profile.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate({ to: '/admin/profiles/edit/$profileId', params: { profileId: profile.id } })}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {profile.status === Status__1.active ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(profile.id, Status__1.inactive)}
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Set Inactive
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(profile.id, Status__1.active)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Set Active
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </EditorialSection>
  );
}
