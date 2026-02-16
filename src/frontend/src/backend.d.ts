import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MessageThreadInfo {
    requester: Principal;
    companionId: string;
    companionPrincipal: Principal;
}
export type Time = bigint;
export interface Rating {
    communication: bigint;
    reliability: bigint;
    professionalism: bigint;
}
export interface Message {
    id: string;
    status: Variant_pending_rejected_accepted;
    content: string;
    sender: Principal;
    messageType: Type;
    timestamp: Time;
    bookingRequestId?: string;
    receiver: Principal;
}
export interface Config {
    leadFee?: bigint;
    model: Model;
    featuredPlacementFee?: bigint;
    commissionRate?: bigint;
    listingFee?: bigint;
}
export interface Profile {
    id: string;
    status: Status__1;
    principal: Principal;
    displayName: string;
    city: string;
    languages: Array<string>;
    ratings: Rating;
    description: string;
    photoUrl: string;
    priceRange: {
        max: bigint;
        min: bigint;
    };
    category: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phoneNumber?: string;
}
export interface Request {
    id: string;
    status: Status;
    scheduledTime?: Time;
    companionId: string;
    notes: string;
    requestTime: Time;
    requesterId: Principal;
}
export enum Model {
    leadFee = "leadFee",
    none = "none",
    featuredPlacement = "featuredPlacement",
    commission = "commission",
    listingFee = "listingFee"
}
export enum Status {
    pending = "pending",
    completed = "completed",
    rejected = "rejected",
    accepted = "accepted"
}
export enum Status__1 {
    review = "review",
    active = "active",
    inactive = "inactive"
}
export enum Type {
    offer = "offer",
    message = "message",
    bookingRequest = "bookingRequest"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_rejected_accepted {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export interface backendInterface {
    adminUpdateProfileStatus(profileId: string, status: Status__1): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canUserAccessMessages(user1: Principal, user2: Principal): Promise<boolean>;
    createOrUpdateCallerCompanionProfile(profile: Profile, hasPaidFee: boolean): Promise<void>;
    createOrUpdateProfile(profile: Profile): Promise<void>;
    getActiveMonetizationConfig(): Promise<Config>;
    getActiveProfiles(): Promise<Array<Profile>>;
    getAllBookings(): Promise<Array<Request>>;
    getAllProfiles(): Promise<Array<Profile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessagesByParticipants(sender: Principal, receiver: Principal): Promise<Array<Message>>;
    getMessagesByUserId(userId: Principal): Promise<Array<Message>>;
    getPlatformEarnings(): Promise<bigint>;
    getUserBookings(userId: Principal): Promise<Array<Request>>;
    getUserMessageThreads(user: Principal): Promise<Array<MessageThreadInfo>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(message: Message): Promise<void>;
    submitBookingRequest(request: Request): Promise<void>;
    updateBookingRequestStatus(requestId: string, status: Status): Promise<void>;
    updateMonetizationConfig(config: Config): Promise<void>;
}
