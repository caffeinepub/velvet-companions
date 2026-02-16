# Specification

## Summary
**Goal:** Make the app safe to launch by enforcing a blocking commission/ban compliance gate across authenticated user experiences and verifying end-to-end readiness of the compliance flow.

**Planned changes:**
- Implement `frontend/src/components/compliance/CommissionComplianceGate.tsx` as a real blocking gate that checks (via backend APIs) whether the signed-in user is banned and/or has pending commission-due items, and displays the appropriate English blocking UI.
- Mount the compliance gate from the main app routing/layout so it consistently protects authenticated routes (e.g., My Profile, Messages, booking flows) while leaving public browsing and legal pages accessible (subject to the existing Age Gate where applicable).
- Ensure backend APIs exist and are used (no mock state) to (a) determine whether the caller is banned and (b) fetch the caller’s commission-due items with pending vs paid status.
- Run a launch readiness pass focused on removing placeholders and preventing obvious runtime errors/broken routes in core journeys, including the admin booking completion → commission-due creation → requester blocked-until-resolved flow.

**User-visible outcome:** Signed-in users who are banned or who have unpaid commission-due items are blocked from using authenticated parts of the app until they resolve the compliance prompt (or log out), while public pages remain accessible and core routes work without runtime errors.
