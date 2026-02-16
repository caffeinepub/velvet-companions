import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Rating {
    communication: bigint;
    reliability: bigint;
    professionalism: bigint;
}
export type Time = bigint;
export interface Profile {
    id: string;
    status: Status__1;
    principal: Principal;
    displayName: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminUpdateProfileStatus(profileId: string, status: Status__1): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(profile: Profile): Promise<void>;
    getActiveProfiles(): Promise<Array<Profile>>;
    getAllBookings(): Promise<Array<Request>>;
    getAllProfiles(): Promise<Array<Profile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserBookings(userId: Principal): Promise<Array<Request>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBookingRequest(request: Request): Promise<void>;
    updateBookingRequestStatus(requestId: string, status: Status): Promise<void>;
}
