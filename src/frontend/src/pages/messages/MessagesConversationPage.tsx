import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetMessagesByParticipants, useSendMessage, useGetAllProfiles } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatError } from '../../lib/errorFormatting';
import { Type, Variant_pending_rejected_accepted } from '../../backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MessagesConversationPage() {
  const { counterpartPrincipal } = useParams({ from: '/messages/$counterpartPrincipal' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [messageContent, setMessageContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const counterpart = counterpartPrincipal ? Principal.fromText(counterpartPrincipal) : undefined;
  const sender = identity?.getPrincipal();

  const { data: messages, isLoading: messagesLoading, error: messagesError } = useGetMessagesByParticipants(
    sender,
    counterpart
  );
  const { data: allProfiles } = useGetAllProfiles();
  const sendMessageMutation = useSendMessage();

  const counterpartProfile = allProfiles?.find(
    (p) => p.principal.toString() === counterpartPrincipal
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim() || !sender || !counterpart) {
      return;
    }

    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      receiver: counterpart,
      content: messageContent.trim(),
      timestamp: BigInt(Date.now() * 1000000),
      messageType: Type.message,
      bookingRequestId: undefined,
      status: Variant_pending_rejected_accepted.pending,
    };

    try {
      await sendMessageMutation.mutateAsync(message);
      setMessageContent('');
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  if (messagesLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <h3 className="mb-2 text-lg font-semibold">Cannot Access Conversation</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              {formatError(messagesError)}
            </p>
            <Button onClick={() => navigate({ to: '/messages' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Card className="flex h-[calc(100vh-12rem)] flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: '/messages' })}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={counterpartProfile?.photoUrl} />
                <AvatarFallback>
                  {counterpartProfile?.displayName?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {counterpartProfile?.displayName || 'Unknown User'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {counterpartProfile?.category || 'Companion'}
                </p>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
              {messages?.map((message) => {
                const isOwnMessage = message.sender.toString() === sender?.toString();
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {new Date(Number(message.timestamp) / 1000000).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <CardContent className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!messageContent.trim() || sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
