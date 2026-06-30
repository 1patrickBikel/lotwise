import { useState } from "react";
import { Bell, List, MagnifyingGlass, Plus } from "@phosphor-icons/react";

export function Topbar({ onMenu, onQuickAdd, search, setSearch, results, onResult }) {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><List size={23} /></button>
      <div className="search-wrap">
        <MagnifyingGlass size={20} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Find categories, lot IDs, or locations"
          aria-label="Search inventory"
        />
        {search && (
          <div className="search-results">
            {results.length ? results.slice(0, 6).map((item) => (
              <button key={`${item.type}-${item.id}`} onClick={() => onResult(item)}>
                <span>{item.label}</span><small>{item.meta}</small>
              </button>
            )) : <p>No matching inventory</p>}
          </div>
        )}
      </div>
      <div className="notification-wrap">
        <button className="icon-button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((open) => !open)}><Bell size={20} /></button>
        {showNotifications && <div className="notification-popover"><strong>Warehouse alerts</strong><p>3 lots still need media.</p><p>1 reserved lot is waiting for pickup.</p></div>}
      </div>
      <button className="primary-button topbar__add" onClick={onQuickAdd}><Plus weight="bold" /> Build lot</button>
      <div className="avatar" aria-label="Warehouse team profile">WT</div>
    </header>
  );
}
