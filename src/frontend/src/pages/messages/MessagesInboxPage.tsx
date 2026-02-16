import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetUserMessageThreads, useGetAllProfiles } from '../../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageCircle, Inbox } from 'lucide-react';
import { EditorialSection, EditorialHeadline, EditorialSubhead } from '../../components/layout/EditorialSection';

export default function MessagesInboxPage() {
  const { identity } = useInternetIdentity();
  const { data: threads, isLoading: threadsLoading } = useGetUserMessageThreads(identity?.getPrincipal());
  const { data: allProfiles } = useGetAllProfiles();

  if (threadsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const uniqueThreads = threads?.reduce((acc, thread) => {
    const otherPrincipal = thread.companionPrincipal.toString() === identity?.getPrincipal().toString()
      ? thread.requester.toString()
      : thread.companionPrincipal.toString();
    
    if (!acc.find(t => t.otherPrincipal === otherPrincipal)) {
      acc.push({ ...thread, otherPrincipal });
    }
    return acc;
  }, [] as any[]) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <EditorialSection>
        <EditorialHeadline>Messages</EditorialHeadline>
        <EditorialSubhead>
          Connect with your matched companions and clients
        </EditorialSubhead>

        <div className="mx-auto mt-8 max-w-3xl">
          {uniqueThreads.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Inbox className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No conversations yet</h3>
                <p className="text-center text-sm text-muted-foreground">
                  You can message users once you have a booking relationship with them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {uniqueThreads.map((thread) => {
                const otherProfile = allProfiles?.find(
                  (p) => p.principal.toString() === thread.otherPrincipal
                );

                return (
                  <Link
                    key={thread.otherPrincipal}
                    to="/messages/$counterpartPrincipal"
                    params={{ counterpartPrincipal: thread.otherPrincipal }}
                  >
                    <Card className="transition-colors hover:bg-accent/50">
                      <CardContent className="flex items-center gap-4 p-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={otherProfile?.photoUrl} />
                          <AvatarFallback>
                            {otherProfile?.displayName?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {otherProfile?.displayName || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {otherProfile?.category || 'Companion'}
                          </p>
                        </div>
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </EditorialSection>
    </div>
  );
}
