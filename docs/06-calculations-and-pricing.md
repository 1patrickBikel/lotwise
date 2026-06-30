# Calculations and Pricing

## Stack calculations

```text
pieces_per_inch = calibration_count / calibration_thickness_inches
inches_per_piece = calibration_thickness_inches / calibration_count
estimated_count = total_measured_stack_inches × pieces_per_inch
lot_stack_inches = lot_quantity / pieces_per_inch
full_lots = floor(estimated_count / lot_quantity)
remainder_pieces = estimated_count mod lot_quantity
remainder_inches = remainder_pieces / pieces_per_inch
unit_price = lot_price / lot_quantity
bulk_value = estimated_count × unit_price
price_per_inch = pieces_per_inch × unit_price
```

## Physical volume

```text
cubic_inches = print_width × print_height × stack_thickness
cubic_feet = cubic_inches / 1728
```

## Verified baseline

Inputs: 500 pieces, 2.5 inches, 240 total inches, 10,000-piece lot, $500 lot price.

- 200 pieces per inch
- 48,000 estimated pieces
- 50 inches per 10,000-piece lot
- Four full lots
- 8,000-piece / 40-inch remainder
- $0.05 per piece
- $10 per inch
- $2,400 estimated bulk value

## Pricing principles

- Bulk is the lowest assigned-group price.
- Sorted reflects labor and easier buyer targeting.
- Better and Curated reflect selection quality and reduced filler.
- Premium is the strongest prebuilt inventory.
- Custom Pick protects remaining inventory and should usually cost 20%–40% more than comparable prebuilt goods.
- All assumptions remain editable by category.

## Object dimensions and pricing

```text
area_sq_in = width × height
area_sq_ft = area_sq_in / 144
perimeter_inches = 2 × (width + height)
calculated_price = base_price × size × ornate × condition × quality × material
final_price = manual_override when present, otherwise calculated_price
```

Default size bands are Small, Medium, Large, Oversized, and Statement / Extra Large. Category variables may add fixed, percentage, multiplier, minimum, maximum, or manual-review modifiers. Framing Material uses linear feet with the same transparent modifier boundary.

Object lot recommendations are percentages of the selected pieces' calculated value: Basic 45%, Sorted 50%, Better 58%, Curated 65%, Premium 80%, Bulk 35%, and Custom Pick 110%, rounded to the nearest $25.

Verified object baseline: a 24 × 36 inch metal mirror at a $40 base price, Large size, Highly Ornate detail, Good condition, and High quality calculates to $126.

## Commission models planned

Standard model:

- Minimum purchase: $500
- Minimum commission: $75
- 20% through $5,000 collected
- 25% on collected amounts above $5,000

Bulk liquidation alternative:

- $500–$999: $75 flat
- $1,000–$2,499: 12.5%
- $2,500–$9,999: 15%
- $10,000+: 17.5%

Commission is calculated only on collected sale amount.
