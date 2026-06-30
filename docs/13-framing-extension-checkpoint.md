# Framing Extension Checkpoint

Status: completed and verified on 2026-06-27.

Source brief: private upstream framing requirements document

## Completed in this checkpoint

- Read and mapped the full framing/object-inventory modification brief.
- Added object dimension calculations:
  - area in square inches and square feet
  - perimeter
  - automatic size class
  - editable-size-class-compatible calculation boundary
- Added default multiplier systems for:
  - size class
  - ornate level
  - condition
  - commercial quality / appeal
  - material
  - arbitrary custom pricing modifiers
- Added object price calculation with manual override support, rounded-price suggestions, and manual-review flags.
- Added safe buyer-copy flags for printed art versus verified original art.
- Added dynamic category-variable definitions to seed data.
- Expanded seed categories for:
  - Empty Frames (`FR`)
  - Framed Printed Art (`FPA`)
  - Original Art in Frames (`OAF`)
  - Framed Mirrors (`FMR`)
  - Frameless Mirrors (`FLM`)
  - Framing Material (`FM`)
- Added four representative object inventory seed items.
- Added the four required object-inventory test scenarios.

## Verification at pause

- All six calculation tests pass.
- Production build passes.
- Existing print-stack calculation tests still pass unchanged.
- No UI routes were replaced or removed.

## Completed after resuming

- Versioned local-state migration and persistence for inventory items and category variables
- Category Variables screen with add, edit, reorder, delete, pricing, visibility, lot-card, and description controls
- Dynamic object inventory entry form and live modifier breakdown
- Object register with search, size, and condition filters
- Exact object selection inside the lot builder
- Suggested object-lot pricing percentages and selected-value calculations
- Object-aware lot cards, safe buyer copy, pickup instructions, and category-specific media plans
- Search routing for categories and object records
- README, data-model, feature, calculation, QA, roadmap, and changelog updates
- Desktop and 390px browser QA with no console warnings or errors

## Verification after completion

- Six automated calculation tests pass.
- A 24 × 36 inch, highly ornate, high-quality metal mirror calculates to $126.
- Selecting the $126 mirror at the Basic object-lot tier recommends a $50 lot price.
- The original Metallic Foil Print baseline still returns 48,000 pieces, four full lots, and $2,400.
- Production build passes. The existing Recharts chunk-size advisory remains non-blocking.
- QA evidence is stored under `qa/framing-*.png`.

## Next recommended work

Move the now-complete local framing workflow to transactional persistence, then add barcode/QR identification and media uploads without changing its category-variable contract.
