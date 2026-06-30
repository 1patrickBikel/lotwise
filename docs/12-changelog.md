# Changelog

## 2026-06-27 — Framing extension completed

Completed the paused framing/object workflow: versioned local-state migration, dynamic category variables, six object categories, object entry and pricing preview, item search and filters, exact-piece lot assignment, percentage-based object lot recommendations, object-aware lot cards, safe buyer copy, category-specific media filenames, object search routing, and JSON backups. Six tests and the production build pass. Browser QA confirmed the $126 mirror baseline, $50 Basic-lot recommendation, unchanged 48,000-print baseline, 390px containment, and zero console warnings/errors.

## 2026-06-27 — Warehouse demo and field checklist

Added a double-click demo launcher on dedicated port 4173, same-Wi-Fi phone access instructions, and a persistent printable warehouse checklist with 90 checks across safety, location, categories, measurement, dimensions, attributes, condition, pricing, media, sales, pickup, and closeout. Verified HTTP 200 from the launcher, local-storage persistence, 390px containment, production build, tests, and browser console.

## 2026-06-27 — Framing extension checkpoint

Added the object-dimension and modifier-pricing calculation foundation, dynamic variable seed definitions, six framing/object categories, representative object seed items, and four required regression scenarios. All six tests and the production build pass. UI and state integration are intentionally paused and documented in `13-framing-extension-checkpoint.md`.

## 2026-06-27 — First working version

### Added

- Responsive Lotwise application shell
- Deep-teal warehouse navigation and high-contrast analytics
- Four seeded inventory categories
- Local browser persistence
- Category creation workflow
- Stack calibration and measurement calculator
- Physical-volume, lot, remainder, and value calculations
- Category-specific price tier editor
- Controlled lot generation and naming
- Printable buyer lot card
- Anti-cherry-picking pickup rule
- Eight-photo media plan and filenames
- Search and notification controls
- CSV lot register and JSON backup
- Automated calculation tests
- Visual QA evidence and report
- Full development documentation library

### Verified

- Two automated calculation tests pass
- Production build passes
- Desktop and mobile layouts verified
- Mobile horizontal overflow corrected
- No browser console warnings or errors in final preview

### Known next work

- SQLite persistence
- Buyer CRM
- Sales and reservation enforcement
- Broker commission tracking
- Media upload storage
- Authentication and shared deployment
