# Product Requirements

## Required user workflow

1. Create or choose an inventory category.
2. Define how that category is measured.
3. Enter calibration and total inventory measurements.
4. Review estimated count, physical volume, full lots, remainder, and value.
5. Define category-specific pricing tiers.
6. Generate controlled lots with IDs, prices, status, and pickup rules.
7. Prepare photos and buyer-facing descriptions.
8. Reserve, sell, and supervise pickup.
9. Export internal and buyer-facing records.

## Functional requirements

### Category setup

- Category name and short code
- Item type and measurement method
- Storage location
- Default lot size
- Buyer types and condition
- Measurement profile and pricing tiers

### Measurement

- Stack thickness and test-stack calibration for prints
- Direct unit counts for object inventory
- Editable width, height, and total thickness
- Transparent formulas and estimate labels
- Object width, height, area, perimeter, size class, condition, quality, material, and category-defined variables
- Manual object-price override and review warnings

### Lot builder

- Category and pricing-tier selection
- Available-versus-allocated quantity check
- Automatic lot IDs with manual-edit support planned
- Default anti-cherry-picking pickup rule
- Status and media readiness
- Exact-object selection, assignment, and object-specific media requirements

### Pricing

- Bulk, Basic, Sorted, Better, Curated, Premium, and Custom Pick
- Quantity and price editable per category
- Unit-price calculation
- Custom Pick priced above comparable prebuilt inventory by default

### Outputs

- Dashboard summary
- Printable lot cards
- Buyer-facing copy
- Media filenames
- CSV lot register
- JSON full backup

## MVP acceptance criteria

- The 2.5-inch / 500-print calibration produces 200 pieces per inch.
- A 240-inch inventory produces 48,000 estimated pieces.
- A 10,000-piece lot measures 50 inches.
- The result is four full lots plus an 8,000-piece, 40-inch remainder.
- At $500 per 10,000, estimated bulk value is $2,400 and value per inch is $10.
- A lot cannot be generated without a category, pricing tier, quantity, price, ID, status, and pickup rule.
- Data survives a page reload on the same browser profile.
- CSV and JSON downloads contain current user-created lots.
- A 24 × 36 Large, Highly Ornate, High-quality metal mirror with a $40 base price calculates to $126.
- Unverified original art never receives a confirmed-original claim.
- Assigned object items cannot appear as available for a second active lot.
