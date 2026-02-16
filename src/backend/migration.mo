import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
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

  type OldActor = {
    companionProfiles : Map.Map<Text, CompanionProfile.Profile>;
    bookingRequests : Map.Map<Text, BookingRequest.Request>;
    userProfiles : Map.Map<Principal, UserProfile>;
    messages : Map.Map<Text, Message.Message>;
    companionFeePaid : Map.Map<Principal, Bool>;
    platformEarnings : Int;
    activeMonetizationConfig : Monetization.Config;
  };

  type NewActor = {
    companionProfiles : Map.Map<Text, CompanionProfile.Profile>;
    bookingRequests : Map.Map<Text, BookingRequest.Request>;
    userProfiles : Map.Map<Principal, UserProfile>;
    messages : Map.Map<Text, Message.Message>;
    companionFeePaid : Map.Map<Principal, Bool>;
    platformEarnings : Int;
    activeMonetizationConfig : Monetization.Config;
  };

  public func run(old : OldActor) : NewActor {
    // Explicitly set commission model
    let newMonetizationConfig : Monetization.Config = {
      model = #commission;
      commissionRate = ?30;
      listingFee = null;
      featuredPlacementFee = null;
      leadFee = null;
    };
    { old with activeMonetizationConfig = newMonetizationConfig };
  };
};
