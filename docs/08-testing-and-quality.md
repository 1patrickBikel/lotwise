# Testing and Quality

## Automated calculation tests

`src/lib/calculations.test.js` verifies:

- The complete 240-inch example
- Pieces per inch
- Estimated count
- Lot thickness
- Full lots and remainder
- Bulk value
- Price per inch
- 10,000 pieces converting to 50 inches
- Object size classification from width and height
- Framed-mirror modifier pricing
- Damaged-frame repair/salvage flags
- Safe original-art wording

Run with:

```bash
pnpm test
```

## Production build

Run with:

```bash
pnpm build
```

The current build passes. Recharts contributes a bundle-size warning; route or chart code splitting is a later performance improvement, not a functional failure.

## Browser verification completed

- Dashboard content and analytics
- Live recalculation after changing stack height
- Lot generation and lot-card preview
- Local persistence and seed reset
- Responsive navigation drawer
- 390px content containment
- Console warning and error check
- One-click demo launcher response on dedicated port 4173
- Warehouse checklist completion and notes persistence
- Warehouse checklist 390px phone containment
- Dynamic category-variable controls
- Live 24 × 36 mirror estimate of $126
- Exact object selection and $50 Basic-lot recommendation
- Framing object register, filters, and status display
- Framing desktop and 390px responsive containment

## Visual QA

`design-qa.md` compares the application with both supplied references. Evidence is stored under `qa/`. The final result is `passed` with no actionable P0, P1, or P2 findings.

## Accessibility baseline

- Semantic buttons, navigation, headings, tables, fields, and labels
- Keyboard focus styles
- Text accompanying color-coded statuses
- Mobile navigation controls with accessible names
- Inputs retain visible unit context

## Release checklist

1. Run calculation tests.
2. Run production build.
3. Open the dashboard and inspect console errors.
4. Complete measurement and lot-generation smoke tests.
5. Check a desktop and mobile viewport.
6. Print one lot card.
7. Export and inspect CSV and JSON.
8. Update changelog and relevant documentation.
