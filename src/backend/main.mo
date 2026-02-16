import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module CompanionProfile {
    public type Status = {
      #active;
      #inactive;
      #review;
    };

    public type Rating = {
      professionalism : Nat;
      communication : Nat;
      reliability : Nat;
    };

    public type Profile = {
      id : Text;
      principal : Principal;
      displayName : Text;
      description : Text;
      photoUrl : Text;
      status : Status;
      category : Text;
      priceRange : {
        min : Nat;
        max : Nat;
      };
      languages : [Text];
      ratings : Rating;
    };

    public func compare(a : Profile, b : Profile) : Order.Order {
      Text.compare(a.displayName, b.displayName);
    };
  };

  module BookingRequest {
    public type Status = {
      #pending;
      #accepted;
      #rejected;
      #completed;
    };

    public type Request = {
      id : Text;
      companionId : Text;
      requesterId : Principal;
      status : Status;
      requestTime : Time.Time;
      scheduledTime : ?Time.Time;
      notes : Text;
    };

    public func compare(a : Request, b : Request) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phoneNumber : ?Text;
  };

  type Pricing = {
    min : Nat;
    max : Nat;
  };

  // Allowlist for admin users (creator is the first admin)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent maps for profiles and bookings
  let companionProfiles = Map.empty<Text, CompanionProfile.Profile>();
  let bookingRequests = Map.empty<Text, BookingRequest.Request>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // USER PROFILE FUNCTIONS

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // PUBLIC COMPANION PROFILE FUNCTIONS

  public shared ({ caller }) func createOrUpdateProfile(profile : CompanionProfile.Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create/edit companion profiles");
    };
    companionProfiles.add(profile.id, profile);
  };

  // Admin can change status
  public shared ({ caller }) func adminUpdateProfileStatus(profileId : Text, status : CompanionProfile.Status) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (companionProfiles.get(profileId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedProfile = {
          id = profile.id;
          principal = profile.principal;
          displayName = profile.displayName;
          description = profile.description;
          photoUrl = profile.photoUrl;
          status;
          category = profile.category;
          priceRange = profile.priceRange;
          languages = profile.languages;
          ratings = profile.ratings;
        };
        companionProfiles.add(profileId, updatedProfile);
      };
    };
  };

  // Booking request handling
  public shared ({ caller }) func submitBookingRequest(request : BookingRequest.Request) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit booking requests");
    };

    // Verify the requester matches the caller
    if (request.requesterId != caller) {
      Runtime.trap("Unauthorized: Cannot submit booking request for another user");
    };

    bookingRequests.add(request.id, request);
  };

  public shared ({ caller }) func updateBookingRequestStatus(requestId : Text, status : BookingRequest.Status) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can accept/reject");
    };

    switch (bookingRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?existing) {
        let updated = {
          id = existing.id;
          companionId = existing.companionId;
          requesterId = existing.requesterId;
          status;
          requestTime = existing.requestTime;
          scheduledTime = existing.scheduledTime;
          notes = existing.notes;
        };
        bookingRequests.add(requestId, updated);
      };
    };
  };

  // Query functions for React Query
  public query ({ caller }) func getActiveProfiles() : async [CompanionProfile.Profile] {
    // Public access - anyone can browse active profiles
    companionProfiles.values().toArray().sort().filter(
      func(profile) {
        switch (profile.status) {
          case (#active) { true };
          case (_) { false };
        };
      }
    );
  };

  public query ({ caller }) func getUserBookings(userId : Principal) : async [BookingRequest.Request] {
    // User can view their own bookings, admin can view any user's bookings
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };

    bookingRequests.values().toArray().sort().filter(
      func(req) {
        req.requesterId == userId
      }
    );
  };

  public query ({ caller }) func getAllProfiles() : async [CompanionProfile.Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    companionProfiles.values().toArray().sort();
  };

  public query ({ caller }) func getAllBookings() : async [BookingRequest.Request] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookingRequests.values().toArray().sort();
  };
};
