# Specification

## Summary
**Goal:** Set the platform’s commission-per-booking monetization to 30% and ensure admin screens reflect the configured commission rate.

**Planned changes:**
- Update backend default monetization config so the active model is commission with `commissionRate = 30` (percent) on fresh deploys.
- When an admin marks a booking request as `#completed` and the active model is commission, increase platform earnings by `(avgPrice * 30) / 100`, where `avgPrice = (priceRange.min + priceRange.max) / 2` for the booked companion profile.
- Update admin UI to read and display the commission rate from the backend config:
  - Pre-fill the Commission Rate input on the Monetization Settings page with the backend value (30 on fresh deploy).
  - Show the commission label on the Earnings Dashboard as “30% per booking” (or the currently configured percent).

**User-visible outcome:** Admins see a 30% commission setting in Monetization Settings and Earnings Dashboard, and platform earnings increase by 30% of the booking amount when a booking is marked completed.
