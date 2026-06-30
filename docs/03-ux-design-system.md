# UX and Design System

## Design direction

The interface combines two supplied visual references:

- A calm industrial dashboard with a deep-teal sidebar, cream canvas, rounded white panels, and yellow active states
- High-contrast cyan and teal inventory analytics with quickly scannable bars and summaries

## Warehouse usability principles

- Large controls usable on laptops and tablets
- Plain-language prompts instead of accounting or database jargon
- Visible formulas and immediate feedback
- Strong category codes and monospaced lot IDs
- Estimate labels wherever counts are not manually verified
- Clear status colors without relying on color alone
- Minimal nested navigation

## Core visual tokens

- Deep teal: navigation, primary actions, strong identity
- Teal: charts, inventory bars, active data
- Cream: main workspace and reduced glare
- Yellow: active navigation, value cards, attention
- Cyan: informational metrics and measurement summaries
- Mint: completed and positive status
- White: work panels and print surfaces

## Typography and icons

- Manrope for interface text and large warehouse-readable headings
- DM Mono for lot IDs, codes, and numeric identifiers
- Phosphor Icons for consistent, real interface icons

## Responsive behavior

- Desktop: fixed sidebar and multi-column dashboard
- Narrow desktop/tablet: two-column metrics and stacked work panels
- Mobile: hidden navigation drawer, one-column forms, contained tables, and full-width primary actions
- Print: surrounding navigation and controls are removed so the lot card becomes the printable artifact

## Interaction standards

- Every visible button must perform an action or clearly represent an upcoming module.
- Inputs use persistent labels and visible units.
- Destructive demo reset requires confirmation.
- Search returns both categories and lot IDs.
- Sold-lot warning and reservation details are planned for the sales phase.
