import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Profile, Request, UserProfile, Status, Status__1 } from '../backend';
import { Principal } from '@dfinity/principal';

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
    },
  });
}
