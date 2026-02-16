import Map "mo:core/Map";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

module {
  public type OldCompanionProfile = {
    id : Text;
    principal : Principal.Principal;
    displayName : Text;
    description : Text;
    photoUrl : Text;
    status : { #active; #inactive; #review };
    category : Text;
    priceRange : { min : Nat; max : Nat };
    languages : [Text];
    ratings : {
      professionalism : Nat;
      communication : Nat;
      reliability : Nat;
    };
  };

  public type OldBookingRequest = {
    id : Text;
    companionId : Text;
    requesterId : Principal.Principal;
    status : { #pending; #accepted; #rejected; #completed };
    requestTime : Int;
    scheduledTime : ?Int;
    notes : Text;
  };

  public type OldMonetizationConfig = {
    model : { #commission; #listingFee; #featuredPlacement; #leadFee; #none };
    commissionRate : ?Int;
    listingFee : ?Int;
    featuredPlacementFee : ?Int;
    leadFee : ?Int;
  };

  public type OldActor = {
    companionProfiles : Map.Map<Text, OldCompanionProfile>;
    bookingRequests : Map.Map<Text, OldBookingRequest>;
    platformEarnings : Int;
    activeMonetizationConfig : OldMonetizationConfig;
    userProfiles : Map.Map<Principal.Principal, { name : Text; email : ?Text; phoneNumber : ?Text }>;
  };

  public type NewActor = {
    companionProfiles : Map.Map<Text, OldCompanionProfile>;
    bookingRequests : Map.Map<Text, OldBookingRequest>;
    platformEarnings : Int;
    activeMonetizationConfig : OldMonetizationConfig;
    userProfiles : Map.Map<Principal.Principal, { name : Text; email : ?Text; phoneNumber : ?Text }>;
    companionFeePaid : Map.Map<Principal.Principal, Bool>;
  };

  public func run(old : OldActor) : NewActor {
    let companionFeePaid = Map.empty<Principal.Principal, Bool>();
    { old with companionFeePaid };
  };
};
