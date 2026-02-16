# Specification

## Summary
**Goal:** Build a luxury editorial-style (non-explicit) adult companionship directory with Internet Identity auth, admin-managed profiles, and a booking request workflow with 18+ compliance UX.

**Planned changes:**
- Add Internet Identity sign-in/sign-out and roles (guest, signed-in user, admin) with admin allowlist enforcement in the backend and reflected in the UI.
- Create public pages: landing page, companion browse/search listing, and companion profile detail pages (English-only, non-explicit copy).
- Implement admin companion profile management: create/edit/delete, publish/unpublish, and moderation controls; validate required fields and enforce 18+ on stored profiles.
- Implement booking request flow: users submit requests from a profile (date/time, duration, location/city, note); admins review, filter, and accept/reject with persisted status lifecycle (no real-time chat).
- Add legal/compliance UX: first-visit 18+ age gate (remembered locally), Terms/Disclaimer page, navigation/footer links, and “18+ only” indicators on profile pages.
- Apply a consistent black/cream/gold luxury editorial theme across components (typography, layout, cards, forms, navigation) using Tailwind/Shadcn composition.
- Persist core data in the Motoko backend with query/update APIs suitable for React Query: profiles, booking requests, and admin allowlist; enforce principal-based authorization in backend methods.
- Add generated static brand assets (logo + hero background) under `frontend/public/assets/generated` and render them in the UI.

**User-visible outcome:** Visitors can pass an 18+ age gate, browse a magazine-styled companion directory, view profile details, and submit booking requests (as allowed by sign-in rules), while admins can sign in, manage/publish profiles, and review/accept/reject booking requests.
