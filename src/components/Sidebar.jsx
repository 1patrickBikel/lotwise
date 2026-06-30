import {
  Archive,
  Calculator,
  ChartDonut,
  ClipboardText,
  CurrencyDollar,
  DownloadSimple,
  FrameCorners,
  Images,
  Package,
  SlidersHorizontal,
  SquaresFour,
  Tag,
  UsersThree,
  Warehouse,
  X,
} from "@phosphor-icons/react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: SquaresFour },
  { id: "categories", label: "Categories", icon: Archive },
  { id: "variables", label: "Category variables", icon: SlidersHorizontal },
  { id: "checklist", label: "Warehouse checklist", icon: ClipboardText },
  { id: "calculator", label: "Measure & estimate", icon: Calculator },
  { id: "objects", label: "Object inventory", icon: FrameCorners },
  { id: "lots", label: "Build lots", icon: Package },
  { id: "pricing", label: "Pricing tiers", icon: CurrencyDollar },
  { id: "media", label: "Media planner", icon: Images },
  { id: "buyers", label: "Buyer CRM", icon: UsersThree },
  { id: "sales", label: "Sales tracker", icon: Tag },
  { id: "exports", label: "Export center", icon: DownloadSimple },
];

export function Sidebar({ activeView, onNavigate, open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
      <div className="brand">
        <span className="brand__mark"><Warehouse weight="duotone" size={28} /></span>
        <span><strong>Lotwise</strong><small>Janiak Warehouse Inventory</small></span>
        <button className="icon-button sidebar__close" onClick={onClose} aria-label="Close navigation"><X /></button>
      </div>
      <nav aria-label="Main navigation">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeView === id ? "is-active" : ""}`}
            onClick={() => { onNavigate(id); onClose(); }}
          >
            <Icon size={20} weight={activeView === id ? "fill" : "regular"} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__foot">
        <ChartDonut size={24} weight="duotone" />
        <div><strong>Local-first</strong><small>Changes save on this device</small></div>
      </div>
    </aside>
  );
}
