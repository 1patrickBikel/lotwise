# Development Roadmap

## Phase 1 — Inventory and lot foundation

Status: working first version.

- Categories
- Stack calculator
- Pricing tiers
- Lot generation and IDs
- Printable lot card
- Dashboard
- CSV and JSON export
- Seed data and tests
- Dynamic category variables
- Object dimensions and modifier pricing
- Framing, art, mirror, and framing-material records
- Exact-object lot assignment and object media plans

## Phase 2 — Operational persistence

Priority: highest.

- SQLite database and migrations
- Inventory batch records
- Multiple measurement profiles
- JSON import and restore
- Manual lot-code editing with uniqueness validation
- Sold-lot warning and revision history
- Transactional object assignment and category-variable migrations
- Barcode or QR labels for individual objects and lots

Completion: data survives browser resets and every mutation is transactional.

## Phase 3 — Buyer CRM and qualification

- Buyer intake form
- Budget and category interests
- Qualification scoring
- Appointment tracking
- Bulk-rule acknowledgment
- Recommended lots

Completion: a user can move a lead from intake to an appointment with linked lots.

## Phase 4 — Sales, reservations, and commission

- Reservation buyer/date enforcement
- Sale sheets
- Payment and pickup status
- Standard and bulk commission models
- Owner, broker, and buyer approvals
- Paid-before-pickup control

Completion: a lot can move safely from available through picked up with an auditable sale.

## Phase 5 — Media and marketing

- Media asset upload and storage
- Photo metadata
- Marketplace/social copy templates
- Buyer inventory menus
- QR codes linked to lot records

Completion: each available lot has complete media and shareable buyer collateral.

## Phase 6 — Shared use and deployment

- Authentication and roles
- Multi-user concurrency
- Audit log
- Automated backups
- Private deployment
- CI test/build checks

Completion: warehouse, sales, and owner users can operate simultaneously with controlled permissions.
