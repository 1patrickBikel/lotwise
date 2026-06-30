# Data Governance and Business Rules

## Estimate integrity

- All measurement-based quantities are estimates until manually verified.
- Buyer-facing descriptions use “approx.” for estimated counts.
- Calibration assumptions remain editable and attributable to a category.
- Future measurement profiles should be dated rather than silently overwritten.

## Sellable-lot requirements

A lot is not sellable until it has:

- Unique lot ID
- Category and assigned inventory
- Quantity or measure
- Price
- Status
- Pickup rule

## Anti-cherry-picking controls

- Bulk lots are assigned stacks, boxes, pallets, sections, or tagged groups.
- Buyers may choose a prebuilt lot but may not rebuild it.
- Buyers may not remove only selected pieces from a discounted lot.
- Substitutions require approval.
- Custom-picked lots are priced higher.
- Additional pickup selections must be priced and paid before removal.
- Pickup is supervised.

## Status controls

- Available: may be offered to qualified buyers.
- Reserved: requires buyer and reservation date.
- Sold: editing should produce a warning and audit record.
- Picked up: allowed only after payment or approved terms.

## Financial controls

- Commission applies to collected gross sales, not quoted or unpaid amounts.
- Owner minimum acceptable price should block unapproved discounts.
- Sales require payment status, pickup status, and approval fields.

## Data classification

- Inventory and pricing: internal business data
- Buyer contacts: private personal/business data
- Payment status and commissions: confidential financial operations data
- Public lot cards: buyer-facing content approved for distribution

## Retention recommendation

- Keep sold lots and sales records permanently for historical reporting.
- Preserve measurement profiles used to create sold lots.
- Retain buyer and broker records according to applicable privacy and tax requirements.
- Do not store payment card numbers in Lotwise.
