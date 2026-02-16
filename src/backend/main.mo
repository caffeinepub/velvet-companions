import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Bool "mo:core/Bool";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

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
      city : Text;
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

  module Message {
    public type Type = {
      #message;
      #bookingRequest;
      #offer;
    };

    public type Message = {
      id : Text;
      sender : Principal;
      receiver : Principal;
      content : Text;
      timestamp : Time.Time;
      messageType : Type;
      bookingRequestId : ?Text;
      status : {
        #pending;
        #accepted;
        #rejected;
      };
    };

    public func compare(a : Message, b : Message) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  module Pricing {
    public type Range = {
      min : Int;
      max : Int;
    };
  };

  module Monetization {
    public type Model = {
      #commission;
      #listingFee;
      #featuredPlacement;
      #leadFee;
      #none;
    };

    public type Config = {
      model : Model;
      commissionRate : ?Int;
      listingFee : ?Int;
      featuredPlacementFee : ?Int;
      leadFee : ?Int;
    };
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phoneNumber : ?Text;
  };

  public type MessageThreadInfo = {
    companionId : Text;
    companionPrincipal : Principal;
    requester : Principal;
  };

  public type CommissionDue = {
    bookingId : Text;
    requesterId : Principal;
    amount : Int;
    status : {
      #pending;
      #paid;
    };
  };

  var accessControlState = AccessControl.initState();
  var companionProfiles = Map.empty<Text, CompanionProfile.Profile>();
  var bookingRequests = Map.empty<Text, BookingRequest.Request>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var messages = Map.empty<Text, Message.Message>();
  var companionFeePaid = Map.empty<Principal, Bool>();
  var platformEarnings : Int = 0;
  var commissionsDue = Map.empty<Principal, List.List<CommissionDue>>();
  var bannedAccounts = Map.empty<Principal, Bool>();

  // Default to commission model, can be updated by admin
  var activeMonetizationConfig : Monetization.Config = {
    model = #commission;
    commissionRate = ?30;
    listingFee = null;
    featuredPlacementFee = null;
    leadFee = null;
  };

  // Authorization
  include MixinAuthorization(accessControlState);

  // Helper function to check if two users have a match (booking relationship)
  func hasMatchRelationship(user1 : Principal, user2 : Principal) : Bool {
    let user1CompanionIds = companionProfiles.values().toArray().filter(
      func(profile) { profile.principal == user1 }
    ).map(func(profile) { profile.id });

    let user2CompanionIds = companionProfiles.values().toArray().filter(
      func(profile) { profile.principal == user2 }
    ).map(func(profile) { profile.id });

    // Check if there's a booking where user1 is requester and user2 is companion
    let hasBooking1 = bookingRequests.values().toArray().any(
      func(booking) {
        booking.requesterId == user1 and user2CompanionIds.any(
          func(compId) { compId == booking.companionId }
        )
      }
    );

    // Check if there's a booking where user2 is requester and user1 is companion
    let hasBooking2 = bookingRequests.values().toArray().any(
      func(booking) {
        booking.requesterId == user2 and user1CompanionIds.any(
          func(compId) { compId == booking.companionId }
        )
      }
    );

    hasBooking1 or hasBooking2;
  };

  // Helper function to verify platform fee payment
  func verifyAndRecordFee(caller : Principal, feeAmount : Int, feeType : Text) {
    let alreadyPaid = companionFeePaid.get(caller);
    switch (alreadyPaid) {
      case (?true) {};
      case (null) {
        platformEarnings += feeAmount;
        companionFeePaid.add(caller, true);
      };
      case (_) {
        platformEarnings += feeAmount;
        companionFeePaid.add(caller, true);
      };
    };
  };

  // Ban check wrapper for public functions
  func checkNotBanned(caller : Principal) {
    switch (bannedAccounts.get(caller)) {
      case (?true) { Runtime.trap("Account is permanently banned") };
      case (_) {};
    };
  };

  // Compliance API - NO AUTHENTICATION REQUIRED (frontend compliance gate needs access)
  public query ({ caller }) func isCallerBanned() : async Bool {
    bannedAccounts.get(caller) == ?true;
  };

  public query ({ caller }) func getCallerCommissionDues() : async ?[CommissionDue] {
    switch (commissionsDue.get(caller)) {
      case (?commissionList) { ?commissionList.toArray() };
      case (null) { null };
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    checkNotBanned(caller);
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Monetization config functions
  public shared ({ caller }) func updateMonetizationConfig(config : Monetization.Config) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update monetization config");
    };

    let isValid : Bool = switch (config.model) {
      case (#commission) { config.commissionRate != null and config.commissionRate != ?0 };
      case (#listingFee) { config.listingFee != null and config.listingFee != ?0 };
      case (#featuredPlacement) { config.featuredPlacementFee != null and config.featuredPlacementFee != ?0 };
      case (#leadFee) { config.leadFee != null and config.leadFee != ?0 };
      case (#none) { true };
    };

    if (not isValid) {
      Runtime.trap("Invalid configuration: Fee must be set for selected model");
    };

    activeMonetizationConfig := config;
  };

  public query ({ caller }) func getActiveMonetizationConfig() : async Monetization.Config {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view monetization config");
    };
    activeMonetizationConfig;
  };

  public query ({ caller }) func getPlatformEarnings() : async Int {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view platform earnings");
    };
    platformEarnings;
  };

  // Profile management (admin)
  public shared ({ caller }) func createOrUpdateProfile(profile : CompanionProfile.Profile) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create/edit companion profiles");
    };

    if (activeMonetizationConfig.model == #listingFee) {
      switch (activeMonetizationConfig.listingFee) {
        case (?fee) { platformEarnings += fee };
        case (null) { Runtime.trap("Listing fee is not configured") };
      };
    };

    companionProfiles.add(profile.id, profile);
  };

  func createOrUpdateCompanionProfile(caller : Principal, profile : CompanionProfile.Profile, hasPaidFee : Bool) {
    // Verify that the profile principal matches the caller
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: Profile principal must match caller");
    };

    switch (companionProfiles.get(profile.id)) {
      case (null) {
        // New profile creation - require fee payment
        if (not hasPaidFee) { Runtime.trap("Fee not paid") };
        if (activeMonetizationConfig.model == #listingFee) {
          switch (activeMonetizationConfig.listingFee) {
            case (?fee) { verifyAndRecordFee(caller, fee, "companion_listing") };
            case (null) {
              Runtime.trap("Listing fee is not configured");
            };
          };
        };
      };
      case (?existing) {
        // Updating existing profile - verify ownership
        if (existing.principal != caller) {
          Runtime.trap("Unauthorized: Cannot update another user's profile");
        };
        // No fee required for updates
      };
    };
    companionProfiles.add(profile.id, profile);
  };

  public shared ({ caller }) func createOrUpdateCallerCompanionProfile(profile : CompanionProfile.Profile, hasPaidFee : Bool) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create their own companion profile");
    };
    createOrUpdateCompanionProfile(caller, profile, hasPaidFee);
  };

  public shared ({ caller }) func adminUpdateProfileStatus(profileId : Text, status : CompanionProfile.Status) : async () {
    checkNotBanned(caller);
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
          status = status;
          category = profile.category;
          priceRange = profile.priceRange;
          languages = profile.languages;
          city = profile.city;
          ratings = profile.ratings;
        };
        companionProfiles.add(profileId, updatedProfile);
      };
    };
  };

  // Commission handling
  func createCommissionDue(booking : BookingRequest.Request) {
    switch (companionProfiles.get(booking.companionId)) {
      case (?companion) {
        switch (activeMonetizationConfig.commissionRate) {
          case (?rate) {
            let amount = (companion.priceRange.min + companion.priceRange.max) / 2;
            let commission : CommissionDue = {
              bookingId = booking.id;
              requesterId = booking.requesterId;
              amount = (amount * rate) / 100;
              status = #pending;
            };

            let existingList = switch (commissionsDue.get(booking.requesterId)) {
              case (?list) { list };
              case (null) { List.empty<CommissionDue>() };
            };

            existingList.add(commission);

            commissionsDue.add(booking.requesterId, existingList);
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func confirmCommissionPayment(bookingId : Text, paid : Bool) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm commission payments");
    };

    let updatedCommissionsList = switch (commissionsDue.get(caller)) {
      case (?commissionList) {
        commissionList.map<CommissionDue, CommissionDue>(
          func(commission) {
            if (commission.bookingId == bookingId and commission.status == #pending) {
              if (paid) {
                return { commission with status = #paid };
              } else {
                bannedAccounts.add(caller, true);
                Runtime.trap("Non-payment of commission; account permanently banned");
              };
            };
            commission;
          }
        );
      };
      case (null) { Runtime.trap("No commission found for this booking") };
    };

    commissionsDue.add(caller, updatedCommissionsList);
  };

  public shared ({ caller }) func adminRevertBan(user : Principal) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can revert bans");
    };
    bannedAccounts.remove(user);
  };

  // Booking requests
  public shared ({ caller }) func submitBookingRequest(request : BookingRequest.Request) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit booking requests");
    };

    if (request.requesterId != caller) {
      Runtime.trap("Unauthorized: Cannot submit booking request for another user");
    };

    if (activeMonetizationConfig.model == #leadFee) {
      switch (activeMonetizationConfig.leadFee) {
        case (?fee) { platformEarnings += fee };
        case (null) { Runtime.trap("Lead fee is not configured") };
      };
    };

    bookingRequests.add(request.id, request);
  };

  public shared ({ caller }) func updateBookingRequestStatus(requestId : Text, status : BookingRequest.Status) : async () {
    checkNotBanned(caller);
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
          status = status;
          requestTime = existing.requestTime;
          scheduledTime = existing.scheduledTime;
          notes = existing.notes;
        };
        bookingRequests.add(requestId, updated);
        if (status == #completed and activeMonetizationConfig.model == #commission) {
          createCommissionDue(updated);
        };
      };
    };
  };

  // Messaging system
  public shared ({ caller }) func sendMessage(message : Message.Message) : async () {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };

    // Verify caller is the sender
    if (message.sender != caller) {
      Runtime.trap("Unauthorized: Cannot send messages as another user");
    };

    // Verify sender and receiver have a match relationship (unless admin)
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not hasMatchRelationship(message.sender, message.receiver)) {
        Runtime.trap("Unauthorized: Can only message users you have a booking relationship with");
      };
    };

    switch (message.messageType) {
      case (#message) {};
      case (#bookingRequest) {};
      case (#offer) {};
    };

    let senderRole = AccessControl.getUserRole(accessControlState, message.sender);
    let receiverRole = AccessControl.getUserRole(accessControlState, message.receiver);

    switch (senderRole, receiverRole) {
      case (#user, #user) {};
      case (sender, receiver) {
        switch (sender, receiver) {
          case (#admin, #user) {};
          case (#user, #admin) {};
          case (_) { Runtime.trap("Unauthorized sender-receiver combination") };
        };
      };
    };

    switch (messages.get(message.id)) {
      case (null) {};
      case (?existingMessage) {
        if (existingMessage.sender != caller) {
          Runtime.trap("Unauthorized: Cannot modify another user's message");
        };
      };
    };

    messages.add(message.id, message);
  };

  public query ({ caller }) func getMessagesByUserId(userId : Principal) : async [Message.Message] {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access messages");
    };

    // Users can only view their own messages, admins can view any
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own messages");
    };

    messages.values().toArray().filter(
      func(message) {
        message.sender == userId or message.receiver == userId;
      }
    );
  };

  public query ({ caller }) func getMessagesByParticipants(sender : Principal, receiver : Principal) : async [Message.Message] {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access messages");
    };

    // Verify caller is one of the participants or is admin
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (caller != sender and caller != receiver) {
        Runtime.trap("Unauthorized: Can only view conversations you are part of");
      };

      // Verify the two users have a match relationship
      if (not hasMatchRelationship(sender, receiver)) {
        Runtime.trap("Unauthorized: Can only view messages with matched users");
      };
    };

    messages.values().toArray().filter(
      func(message) {
        (message.sender == sender and message.receiver == receiver) or (message.sender == receiver and message.receiver == sender)
      }
    );
  };

  // Public browsing - NO AUTHENTICATION REQUIRED (guests can browse)
  public query ({ caller }) func getActiveProfiles() : async [CompanionProfile.Profile] {
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
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };

    bookingRequests.values().toArray().sort().filter(
      func(req) { req.requesterId == userId }
    );
  };

  public query ({ caller }) func canUserAccessMessages(user1 : Principal, user2 : Principal) : async Bool {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check message access");
    };

    // Verify caller is one of the participants or is admin
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (caller != user1 and caller != user2) {
        Runtime.trap("Unauthorized: Can only check access for your own conversations");
      };
    };

    if (user1 == user2) { return false };

    hasMatchRelationship(user1, user2);
  };

  public query ({ caller }) func getUserMessageThreads(user : Principal) : async [MessageThreadInfo] {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access message threads");
    };

    // Users can only view their own threads, admins can view any
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own message threads");
    };

    let userBookings = bookingRequests.values().toArray();
    let userCompanions = companionProfiles.values().toArray().filter(
      func(profile) { profile.principal == user }
    );

    let threads = userBookings.foldLeft(
      [],
      func(acc : [MessageThreadInfo], booking) : [MessageThreadInfo] {
        let isRequester = booking.requesterId == user;
        let isCompanion = userCompanions.any(
          func(profile) { profile.id == booking.companionId }
        );

        if (isRequester or isCompanion) {
          let companionProfile = companionProfiles.values().toArray().find(
            func(profile) { profile.id == booking.companionId }
          );
          switch (companionProfile) {
            case (?foundCompanion) {
              return acc.concat([
                {
                  companionId = booking.companionId;
                  companionPrincipal = foundCompanion.principal;
                  requester = booking.requesterId;
                }
              ]);
            };
            case (null) { return acc };
          };
        } else {
          return acc;
        };
      }
    );
    threads;
  };

  public query ({ caller }) func getAllProfiles() : async [CompanionProfile.Profile] {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    companionProfiles.values().toArray().sort();
  };

  public query ({ caller }) func getAllBookings() : async [BookingRequest.Request] {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookingRequests.values().toArray().sort();
  };

  public query ({ caller }) func isBanned(user : Principal) : async Bool {
    checkNotBanned(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check ban status");
    };
    bannedAccounts.get(user) == ?true;
  };
};
