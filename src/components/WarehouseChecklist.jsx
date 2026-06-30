import { useEffect, useMemo, useState } from "react";
import { ArrowCounterClockwise, CheckCircle, ClipboardText, Printer } from "@phosphor-icons/react";

const STORAGE_KEY = "lotwise-warehouse-checklist-v1";

const sections = [
  {
    id: "safety",
    title: "1 · Safety and warehouse setup",
    helper: "Make the walk-through safe before measuring or moving anything.",
    items: [
      "Confirm access, keys, lighting, power, and phone signal",
      "Identify blocked aisles, unstable stacks, sharp edges, and trip hazards",
      "Mark fragile mirror and glass zones",
      "Confirm gloves, eye protection, masks, ladders, and measuring tools",
      "Define supervised buyer and pickup boundaries",
      "Record rooms or zones that must not be entered",
    ],
  },
  {
    id: "locations",
    title: "2 · Location map and physical control",
    helper: "Every group needs a location precise enough for another person to find it.",
    items: [
      "Assign warehouse, room, aisle, bay, rack, shelf, pallet, bin, stack, or wall code",
      "Photograph the location sign and surrounding area",
      "Record access constraints, doorway size, stairs, loading dock, or elevator",
      "Separate sellable, reserved, sold, repair, and salvage zones",
      "Tag inventory groups before counting or photographing",
      "Record equipment needed for removal: cart, dolly, pallet jack, movers, or lift",
    ],
  },
  {
    id: "categories",
    title: "3 · Inventory category identification",
    helper: "Choose the closest category and create a new one when the variables differ materially.",
    items: [
      "Prints: metallic foil, movie/promo, religious, novelty, decorative, or mixed",
      "Framed printed art",
      "Original art in frames — mark confirmed versus unverified",
      "Empty frames and ornate frames",
      "Framed mirrors and frameless mirrors",
      "Framing moulding and material measured by linear feet",
      "Decorative panels, props, objects, and staging goods",
      "Damaged, repair, salvage, or mixed liquidation inventory",
    ],
  },
  {
    id: "quantity",
    title: "4 · Quantity and measurement method",
    helper: "Record whether the result is verified or estimated, and preserve the assumption used.",
    items: [
      "Choose verified unit count, approximate count, stack thickness, box, pallet, rack, bin, or linear feet",
      "For prints, count a test stack and measure its thickness",
      "For prints, record total stack height and number of stacks",
      "For objects, count by category, location, condition, and size class",
      "For moulding, record total linear feet and usable matching runs",
      "Record boxes, pallets, racks, or physical zones included",
      "Calculate full lots and identify the partial-lot remainder",
      "Label all unverified quantities as approx.",
    ],
  },
  {
    id: "dimensions",
    title: "5 · Dimensions, scale, and handling",
    helper: "Measure the item itself and the route required to remove it.",
    items: [
      "Width, height, and depth in inches",
      "Area in square inches and square feet",
      "Perimeter or linear feet where relevant",
      "Automatic size class: Small, Medium, Large, Oversized, or Statement",
      "Weight class or two-person-lift requirement",
      "Glass, mirror, sharp edge, or fragile handling warning",
      "Doorway, vehicle, and pickup clearance for oversized pieces",
    ],
  },
  {
    id: "attributes",
    title: "6 · Product variables and descriptive attributes",
    helper: "Capture the details that change price, buyer fit, media, or handling.",
    items: [
      "Material: wood, metal, gilded, composite, plastic, glass, or mixed",
      "Finish: natural, stained, painted, gilded, metallic, patina, or mixed",
      "Ornate level from Plain through Museum / Architectural",
      "Subject, theme, style, room type, and likely buyer type",
      "Original-art confirmation, artist, signature, medium, and provenance notes",
      "Glass included, backing included, and hanging hardware present",
      "Mirror shape, edge, silvering condition, chips, cracks, and safety backing",
      "Matching set, matching quantity, and usable matching lengths",
      "Add any custom variable that affects filtering, pricing, description, or pickup",
    ],
  },
  {
    id: "condition",
    title: "7 · Condition, quality, and repair",
    helper: "Condition measures physical state; quality measures commercial appeal.",
    items: [
      "Overall condition: Excellent, Good, Fair, Poor, or Salvage",
      "Frame condition recorded separately",
      "Artwork or print condition recorded separately",
      "Mirror, glass, and silvering condition recorded separately",
      "Backing and hanging-hardware condition recorded separately",
      "Photograph cracks, chips, stains, warping, missing pieces, and repairs",
      "Mark repair required, reframe candidate, frame-value-heavy, or salvage-only",
      "Quality / appeal: Low, Average, Good, High, or Premium",
      "Add a manual-review flag for uncertain originality, safety, or value",
    ],
  },
  {
    id: "pricing",
    title: "8 · Pricing and lot readiness",
    helper: "Separate calculated assumptions from the final approved selling price.",
    items: [
      "Set category base price or base lot price",
      "Review size, ornate, condition, quality, material, and custom modifiers",
      "Record calculated price and any manual adjusted price",
      "Define Bulk, Basic, Sorted, Curated, Premium, and Custom Pick tiers",
      "Confirm owner minimum acceptable price",
      "Choose lot basis: count, stack, pallet, rack, location, style, set, or curation",
      "Assign unique lot ID, price, status, location, and pickup rule",
      "Tag the exact physical inventory included in the lot",
      "Apply no-cherry-picking language to discounted prebuilt lots",
    ],
  },
  {
    id: "media",
    title: "9 · Photography and buyer-facing media",
    helper: "Photograph enough evidence that a buyer understands the exact lot and its condition.",
    items: [
      "Hero or full front view",
      "Back view and hanging hardware",
      "Corner, frame, edge, or construction detail",
      "Damage and condition detail",
      "Scale photo with ruler or recognizable reference",
      "Full stack, group, pallet, or assigned-lot photo",
      "Lot card and storage-location photo",
      "Mirror reflection/surface photo when relevant",
      "Signature, maker label, or provenance detail when relevant",
      "Rename files with the lot ID and view type",
      "Check buyer copy for approx., mixed condition, as-is, and unsupported claims",
    ],
  },
  {
    id: "sales",
    title: "10 · Buyer, sale, and pickup controls",
    helper: "Protect the inventory and the transaction from appointment through removal.",
    items: [
      "Record buyer, company, contact, source, and buyer type",
      "Confirm category interest, budget, curation level, and purchase readiness",
      "Confirm vehicle, movers, loading equipment, and pickup plan",
      "Record broker, introduction date, protected period, and commission model",
      "Reserved lots show buyer and reservation date",
      "Sale sheet lists exact lot IDs, price, payment status, and approvals",
      "Confirm collected payment or approved terms before pickup completion",
      "Supervise pickup and prevent substitutions or unauthorized browsing",
      "Price and collect payment for additional items before removal",
      "Mark sold and picked up only after the physical lot leaves correctly",
    ],
  },
  {
    id: "closeout",
    title: "11 · End-of-session closeout",
    helper: "Leave the warehouse and the data in a state another person can understand tomorrow.",
    items: [
      "Export a JSON backup and CSV lot register",
      "Confirm new photos are named and stored with the correct lot",
      "List unresolved counts, measurements, pricing reviews, and safety issues",
      "Return loose items to their tagged physical group",
      "Update Available, Reserved, Sold, and Picked Up statuses",
      "Secure restricted, fragile, high-value, and sold inventory",
      "Record who completed the session and the next required action",
    ],
  },
];

export function WarehouseChecklist() {
  const [state, setState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { checks: {}, sectionNotes: {}, sessionDate: new Date().toISOString().slice(0, 10), completedBy: "" };
    } catch {
      return { checks: {}, sectionNotes: {}, sessionDate: new Date().toISOString().slice(0, 10), completedBy: "" };
    }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);

  const total = sections.reduce((sum, section) => sum + section.items.length, 0);
  const completed = useMemo(() => Object.values(state.checks).filter(Boolean).length, [state.checks]);
  const percent = Math.round((completed / total) * 100);

  function toggle(id) {
    setState((current) => ({ ...current, checks: { ...current.checks, [id]: !current.checks[id] } }));
  }

  function reset() {
    if (window.confirm("Clear every checklist mark and note for a new warehouse session?")) {
      setState({ checks: {}, sectionNotes: {}, sessionDate: new Date().toISOString().slice(0, 10), completedBy: "" });
    }
  }

  return <div className="view-stack checklist-page">
    <div className="checklist-print-heading"><h1>Lotwise: Janiak Warehouse Inventory</h1><p>Warehouse Variable Checklist</p></div>
    <section className="page-heading"><div><p className="eyebrow">Warehouse field system</p><h1>Warehouse variable checklist</h1><p>Walk the building once, capture the variables that matter, and leave every group ready for the next decision.</p></div><div className="heading-actions no-print"><button className="secondary-button" onClick={() => window.print()}><Printer /> Print</button><button className="danger-button" onClick={reset}><ArrowCounterClockwise /> New session</button></div></section>

    <section className="panel checklist-summary">
      <span className="checklist-summary__icon"><ClipboardText size={28} weight="duotone" /></span>
      <div className="checklist-summary__progress"><div><strong>{percent}% complete</strong><span>{completed} of {total} checks</span></div><div className="checklist-progress" aria-label={`${percent}% complete`}><i style={{ width: `${percent}%` }} /></div></div>
      <label><span>Session date</span><input type="date" value={state.sessionDate} onChange={(event) => setState({ ...state, sessionDate: event.target.value })} /></label>
      <label><span>Completed by</span><input value={state.completedBy} onChange={(event) => setState({ ...state, completedBy: event.target.value })} placeholder="Name or team" /></label>
    </section>

    <section className="checklist-sections">
      {sections.map((section, sectionIndex) => {
        const sectionCompleted = section.items.filter((_, itemIndex) => state.checks[`${section.id}-${itemIndex}`]).length;
        return <details className="panel checklist-section" key={section.id} open={sectionIndex < 2}>
          <summary><span><strong>{section.title}</strong><small>{section.helper}</small></span><b>{sectionCompleted}/{section.items.length}</b></summary>
          <div className="checklist-section__body">
            <div className="checklist-items">{section.items.map((item, itemIndex) => {
              const id = `${section.id}-${itemIndex}`;
              return <label className={`checklist-item ${state.checks[id] ? "is-checked" : ""}`} key={id}><input type="checkbox" checked={Boolean(state.checks[id])} onChange={() => toggle(id)} /><span className="checklist-item__check"><CheckCircle weight={state.checks[id] ? "fill" : "regular"} /></span><span>{item}</span></label>;
            })}</div>
            <label className="field checklist-notes"><span>Section notes / unresolved variables</span><textarea value={state.sectionNotes[section.id] || ""} onChange={(event) => setState((current) => ({ ...current, sectionNotes: { ...current.sectionNotes, [section.id]: event.target.value } }))} placeholder="Locations, counts, follow-up, responsible person…" /></label>
          </div>
        </details>;
      })}
    </section>
  </div>;
}
