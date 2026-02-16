import { Badge } from '@/components/ui/badge';
import { Status__1 } from '../../backend';

interface ProfileStatusBadgeProps {
  status: Status__1;
}

export default function ProfileStatusBadge({ status }: ProfileStatusBadgeProps) {
  const getVariant = () => {
    if (status === Status__1.active) return 'default';
    if (status === Status__1.review) return 'secondary';
    return 'outline';
  };

  const getLabel = () => {
    if (status === Status__1.active) return 'Active';
    if (status === Status__1.review) return 'Review';
    if (status === Status__1.inactive) return 'Inactive';
    return 'Unknown';
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}
