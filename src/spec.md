# Specification

## Summary
**Goal:** Let signed-in non-admin users create and manage their own companion profiles with a one-time ₹10 creation fee, and enable free in-app messaging only between matched users.

**Planned changes:**
- Add non-admin self-service companion profile create/edit flow tied to the signed-in Principal (no /admin routes), preventing users from modifying others’ profiles.
- Enforce a one-time ₹10 fee confirmation on first-time companion profile creation, record ₹10 platform earnings once per Principal, and keep subsequent edits free.
- Add a non-admin UI page/route to create a companion profile that displays “One-time fee: ₹10 to create your profile”, validates required fields, shows errors via existing patterns, and routes after success with relevant cache invalidation.
- Implement persistent in-app messaging with APIs and basic UI (inbox + conversation) restricted to matched users only, with clear errors for non-matched access.
- Define and enforce a deterministic “match” rule using existing stored domain data, and add backend query APIs so the frontend can list only authorized conversations/matched counterparts.

**User-visible outcome:** Signed-in users can pay/confirm a one-time ₹10 fee to create their own companion profile (and later edit it without further charges), and can view/send free messages only with users they are matched with via the app’s match rules.
