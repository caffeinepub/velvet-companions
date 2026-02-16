import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Profile, Request, UserProfile, Status, Status__1, Config, Message, MessageThreadInfo, Type, Variant_pending_rejected_accepted } from '../backend';
import { Principal } from '@dfinity/principal';

// Query keys for earnings-related queries
export const EARNINGS_QUERY_KEYS = {
  platformEarnings: ['platformEarnings'] as const,
  monetizationConfig: ['monetizationConfig'] as const,
};

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Companion Profile Queries
export function useGetActiveProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<Profile[]>({
    queryKey: ['activeProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<Profile[]>({
    queryKey: ['allProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['activeProfiles'] });
      queryClient.invalidateQueries({ queryKey: EARNINGS_QUERY_KEYS.platformEarnings });
    },
  });
}

export function useCreateOrUpdateCallerCompanionProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profile, hasPaidFee }: { profile: Profile; hasPaidFee: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateCallerCompanionProfile(profile, hasPaidFee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['activeProfiles'] });
      queryClient.invalidateQueries({ queryKey: EARNINGS_QUERY_KEYS.platformEarnings });
    },
  });
}

export function useUpdateProfileStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, status }: { profileId: string; status: Status__1 }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminUpdateProfileStatus(profileId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['activeProfiles'] });
    },
  });
}

// Booking Queries
export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserBookings(userId?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ['userBookings', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserBookings(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSubmitBookingRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Request) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitBookingRequest(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: EARNINGS_QUERY_KEYS.platformEarnings });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: Status }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingRequestStatus(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: EARNINGS_QUERY_KEYS.platformEarnings });
    },
  });
}

// Monetization Queries
export function useGetMonetizationConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<Config>({
    queryKey: EARNINGS_QUERY_KEYS.monetizationConfig,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActiveMonetizationConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateMonetizationConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Config) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMonetizationConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EARNINGS_QUERY_KEYS.monetizationConfig });
    },
  });
}

export function useGetPlatformEarnings() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: EARNINGS_QUERY_KEYS.platformEarnings,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPlatformEarnings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Messaging Queries
export function useGetUserMessageThreads(userId?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<MessageThreadInfo[]>({
    queryKey: ['messageThreads', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserMessageThreads(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetMessagesByParticipants(sender?: Principal, receiver?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', sender?.toString(), receiver?.toString()],
    queryFn: async () => {
      if (!actor || !sender || !receiver) return [];
      return actor.getMessagesByParticipants(sender, receiver);
    },
    enabled: !!actor && !isFetching && !!sender && !!receiver,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Message) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(message);
    },
    onSuccess: (_, variables) => {
      // Invalidate the conversation query to show the new message
      queryClient.invalidateQueries({ 
        queryKey: ['messages', variables.sender.toString(), variables.receiver.toString()] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['messages', variables.receiver.toString(), variables.sender.toString()] 
      });
    },
  });
}

export function useCanUserAccessMessages(user1?: Principal, user2?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['canAccessMessages', user1?.toString(), user2?.toString()],
    queryFn: async () => {
      if (!actor || !user1 || !user2) return false;
      return actor.canUserAccessMessages(user1, user2);
    },
    enabled: !!actor && !isFetching && !!user1 && !!user2,
  });
}
