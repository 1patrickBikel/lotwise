# Data Model

## Implemented objects

### Category

- `id`, `name`, `code`, `itemType`
- `measurementMethod`
- `storageLocation`, `buyerTypes`, `condition`
- calibration count and thickness
- total measured inches or direct unit count
- width, height, default lot size
- nested pricing tiers
- object-category base price, description template, and nested dynamic variables

### Category variable

- stable `id`, data `key`, display `name`, and `fieldType`
- required/default/allowed-value rules
- pricing modifier type and value configuration
- buyer, internal, lot-card, and description visibility flags

### Inventory item

- `id`, `categoryId`, title, location, and status
- width, height, depth, area, perimeter, and automatic size class
- category-specific variable values
- base, calculated, manual, and final prices
- review flags, notes, timestamps, and optional assigned `lotId`

### Pricing tier

- `name`
- `quantity`
- `price`
- Derived unit price

### Lot

- `id`, `lotCode`, `categoryId`
- `curation`, `quantity`, `price`
- `status`
- creation metadata
- optional buyer and reservation information
- pickup rule
- media completion count
- optional exact `itemIds`, calculated retail value, object summary, required media shots, and completed-shot names

## Planned relational entities

### MeasurementProfile

One or more dated calibrations per category, including paper weight, dimensions, and notes.

### InventoryBatch

A physical stack, rack, pallet, box, bin, or object group with location, condition, photos, and estimated or verified count.

### Buyer

Contact, company, buyer type, interests, budget, qualification, transportation readiness, and bulk-lot acknowledgment.

### Sale

Buyer, lot IDs, collected amount, payment status, pickup status, approvals, dates, and commission details.

### BrokerReferral

Broker, introduction date, protected period, commission model, due amount, and paid date.

### MediaAsset

Lot, type, filename, path, caption, status, creator, and capture date.

## Referential rules

- Lot codes must be unique.
- Category codes should be unique and uppercase.
- A lot belongs to one category and optionally one inventory batch.
- A sold lot may belong to only one completed sale.
- Reserved lots require buyer and reservation date.
- Media assets inherit their filename prefix from the lot code.
- Removing a category with active lots should be blocked.
- An object may be assigned to at most one active lot.
- Unverified original art must not produce a confirmed-original claim.
