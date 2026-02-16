import { useState, useMemo } from 'react';
import { useGetActiveProfiles } from '../hooks/useQueries';
import { EditorialSection, EditorialHeadline } from '../components/layout/EditorialSection';
import CompanionCard from '../components/companions/CompanionCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function BrowseCompanionsPage() {
  const { data: profiles = [], isLoading } = useGetActiveProfiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(profiles.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = 
        profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || profile.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [profiles, searchQuery, categoryFilter]);

  return (
    <EditorialSection>
      <div className="mb-12 text-center">
        <EditorialHeadline className="mb-4">Browse Companions</EditorialHeadline>
        <p className="text-lg text-muted-foreground">
          Discover our curated selection of premium companions
        </p>
        <p className="mt-2 text-sm font-semibold text-destructive">18+ ONLY</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No companions found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProfiles.map(profile => (
            <CompanionCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </EditorialSection>
  );
}
