import { useState, useEffect } from 'react';
import { useGetMonetizationConfig, useUpdateMonetizationConfig } from '../../hooks/useQueries';
import { EditorialSection, EditorialHeadline, EditorialSubhead } from '../../components/layout/EditorialSection';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatError } from '../../lib/errorFormatting';
import { Model } from '../../backend';
import { Loader2, DollarSign } from 'lucide-react';

export default function AdminMonetizationSettingsPage() {
  const { data: config, isLoading } = useGetMonetizationConfig();
  const updateConfig = useUpdateMonetizationConfig();

  const [selectedModel, setSelectedModel] = useState<Model>(Model.none);
  const [commissionRate, setCommissionRate] = useState('');
  const [listingFee, setListingFee] = useState('');
  const [featuredPlacementFee, setFeaturedPlacementFee] = useState('');
  const [leadFee, setLeadFee] = useState('');

  useEffect(() => {
    if (config) {
      setSelectedModel(config.model);
      setCommissionRate(config.commissionRate ? config.commissionRate.toString() : '');
      setListingFee(config.listingFee ? config.listingFee.toString() : '');
      setFeaturedPlacementFee(config.featuredPlacementFee ? config.featuredPlacementFee.toString() : '');
      setLeadFee(config.leadFee ? config.leadFee.toString() : '');
    }
  }, [config]);

  const handleSave = async () => {
    try {
      const newConfig = {
        model: selectedModel,
        commissionRate: commissionRate ? BigInt(commissionRate) : undefined,
        listingFee: listingFee ? BigInt(listingFee) : undefined,
        featuredPlacementFee: featuredPlacementFee ? BigInt(featuredPlacementFee) : undefined,
        leadFee: leadFee ? BigInt(leadFee) : undefined,
      };

      await updateConfig.mutateAsync(newConfig);
      toast.success('Monetization settings saved successfully');
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  if (isLoading) {
    return (
      <EditorialSection>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EditorialSection>
    );
  }

  return (
    <EditorialSection>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <EditorialHeadline>Monetization Settings</EditorialHeadline>
          <EditorialSubhead>
            Configure how your platform generates revenue. Select one active monetization model and set its parameters.
          </EditorialSubhead>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Model
            </CardTitle>
            <CardDescription>
              Choose the monetization strategy that best fits your business model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model">Active Monetization Model</Label>
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as Model)}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Model.none}>None - No monetization</SelectItem>
                  <SelectItem value={Model.commission}>Commission per Booking</SelectItem>
                  <SelectItem value={Model.listingFee}>Listing Fee</SelectItem>
                  <SelectItem value={Model.featuredPlacement}>Featured Placement Fee</SelectItem>
                  <SelectItem value={Model.leadFee}>Lead Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedModel === Model.commission && (
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="e.g., 15"
                />
                <p className="text-sm text-muted-foreground">
                  Percentage of each completed booking that goes to the platform
                </p>
              </div>
            )}

            {selectedModel === Model.listingFee && (
              <div className="space-y-2">
                <Label htmlFor="listingFee">Listing Fee (USD)</Label>
                <Input
                  id="listingFee"
                  type="number"
                  min="0"
                  value={listingFee}
                  onChange={(e) => setListingFee(e.target.value)}
                  placeholder="e.g., 50"
                />
                <p className="text-sm text-muted-foreground">
                  One-time fee charged when a companion profile is created or published
                </p>
              </div>
            )}

            {selectedModel === Model.featuredPlacement && (
              <div className="space-y-2">
                <Label htmlFor="featuredPlacementFee">Featured Placement Fee (USD)</Label>
                <Input
                  id="featuredPlacementFee"
                  type="number"
                  min="0"
                  value={featuredPlacementFee}
                  onChange={(e) => setFeaturedPlacementFee(e.target.value)}
                  placeholder="e.g., 100"
                />
                <p className="text-sm text-muted-foreground">
                  Fee for premium placement on the homepage or in search results
                </p>
              </div>
            )}

            {selectedModel === Model.leadFee && (
              <div className="space-y-2">
                <Label htmlFor="leadFee">Lead Fee (USD)</Label>
                <Input
                  id="leadFee"
                  type="number"
                  min="0"
                  value={leadFee}
                  onChange={(e) => setLeadFee(e.target.value)}
                  placeholder="e.g., 25"
                />
                <p className="text-sm text-muted-foreground">
                  Fee charged when a booking request is submitted
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={updateConfig.isPending}
                className="gap-2"
              >
                {updateConfig.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 rounded-lg border border-border/40 bg-muted/50 p-6">
          <h3 className="mb-3 font-semibold">About Monetization Models</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Commission per Booking:</strong> Earn a percentage of each completed booking. The commission is calculated based on the companion's average price range.
            </p>
            <p>
              <strong>Listing Fee:</strong> Charge companions a one-time fee when they create or publish their profile on your platform.
            </p>
            <p>
              <strong>Featured Placement:</strong> Offer premium visibility for companions willing to pay for enhanced exposure.
            </p>
            <p>
              <strong>Lead Fee:</strong> Charge a fee each time a potential client submits a booking request.
            </p>
            <p className="pt-2 text-xs">
              Note: These are internal tracking records only. No actual payment processing is integrated.
            </p>
          </div>
        </div>
      </div>
    </EditorialSection>
  );
}
