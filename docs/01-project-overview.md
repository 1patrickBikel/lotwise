# Project Overview

## Product name

Lotwise: Janiak Warehouse Inventory — Warehouse Lot Builder, Inventory Estimator, Pricing, and Sales Media System.

## Purpose

Lotwise converts messy, partially counted warehouse inventory into clear, priced, controlled buyer lots. It supports both stack-measured goods such as prints and object-counted goods such as frames, mirrors, framed art, decorative objects, and salvage.

## Primary users

- Warehouse owner or inventory manager
- Warehouse measurement and photography staff
- Sales coordinator
- Broker or referral partner
- Pickup supervisor

## Core outcomes

- Record inventory categories and editable measurement assumptions.
- Estimate item counts from stack thickness.
- Define category-specific lot sizes and pricing tiers.
- Generate governed lot IDs and buyer-facing lot cards.
- Prevent cherry-picking at discounted prices.
- Track media readiness and prepare practical sales copy.
- Export structured backups and lot registers.

## Current implementation status

The first working version is a responsive React application. It includes:

- Seeded Metallic Foil Prints, Disney / Movie Promo Prints, Mixed Print Lots, and Empty Frames
- Category creation
- Live stack measurement calculator
- Physical volume calculation
- Category-specific pricing tier editor
- Lot generator with pickup rules
- Printable lot cards
- Photo filename checklist
- Dashboard analytics
- CSV and JSON exports
- Local browser persistence
- Automated calculation tests

Buyer CRM, full sales tracking, broker commissions, appointments, and database-backed multi-device use are represented in the navigation and data plan but remain future implementation phases.

## Technology decision

The MVP uses browser local storage to keep setup friction near zero. SQLite remains the intended next persistence layer when the product needs stronger durability, relational reporting, or multiple operational users.
