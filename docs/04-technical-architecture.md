# Technical Architecture

## Current stack

- React 19
- Vite 6
- JavaScript modules and JSX
- Recharts for dashboard visualization
- Phosphor Icons for interface symbols
- CSS design system with responsive and print rules
- Browser `localStorage` for MVP persistence

## Application structure

```text
src/
  components/        screen and interface components
  data/seed.js       example categories, variables, object items, tiers, and lots
  hooks/             local persistence and update actions
  lib/               calculations and export utilities
  App.jsx            application shell and screen routing
  styles.css         design tokens, layouts, responsive, and print styles
docs/                product and development documentation
qa/                  captured visual verification evidence
```

## State flow

`useInventoryStore` loads saved state or falls back to seed data. Schema migration upgrades earlier local data with the framing category contract while preserving user-created categories and records. Category, variable, item, and lot mutations update React state, then an effect serializes the full state to local storage. Dashboard values are derived from current data rather than copied into secondary state.

## Calculation boundary

All inventory math lives in `src/lib/calculations.js`. UI components pass explicit numeric inputs and render returned values. Automated tests execute the same functions used by the interface.

## Export boundary

CSV export creates a flat lot register for spreadsheet use. JSON export preserves nested categories, dynamic variables, object inventory items, measurement profiles, price tiers, pickup rules, and lots for complete backup and future migration.

## Future SQLite architecture

Recommended next persistence architecture:

- SQLite database stored locally
- ORM such as Prisma or Drizzle
- Server/API layer for transactional mutations
- Explicit migrations and seed scripts
- Repository abstraction so UI calculations do not depend directly on storage
- Backup/export jobs retaining the existing JSON format

## Security posture

The MVP has no authentication, cloud API, or remote database. It should be treated as a single-device operational tool. Authentication, audit logs, role permissions, encrypted backups, and validated server mutations are required before shared or internet-accessible deployment.
