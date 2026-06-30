import { Archive, CurrencyDollar, Images, Package, Tag } from "@phosphor-icons/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryCount, getCategoryValue } from "../lib/calculations";
import { MetricCard } from "./MetricCard";

const statusColors = { Available: "#0f7181", Reserved: "#f3c95e", Sold: "#92d6bf" };

export function Dashboard({ categories, lots, onNavigate }) {
  const totalUnits = categories.reduce((sum, category) => sum + getCategoryCount(category), 0);
  const estimatedValue = categories.reduce((sum, category) => sum + getCategoryValue(category), 0);
  const available = lots.filter((lot) => lot.status === "Available").length;
  const mediaNeeded = lots.filter((lot) => (lot.mediaComplete || 0) < 8).length;
  const statusData = ["Available", "Reserved", "Sold"].map((name) => ({
    name,
    value: lots.filter((lot) => lot.status === name).length,
  }));
  const maxCount = Math.max(...categories.map(getCategoryCount), 1);

  return (
    <div className="view-stack">
      <section className="page-heading">
        <div><p className="eyebrow">Warehouse command center</p><h1>Know what you have. Build what you can sell.</h1><p>All quantities are estimates unless manually verified.</p></div>
        <button className="secondary-button" onClick={() => onNavigate("calculator")}>Measure a stack</button>
      </section>

      <section className="metric-grid" aria-label="Inventory summary">
        <MetricCard icon={Archive} label="Estimated inventory" value={totalUnits.toLocaleString()} helper="units across all categories" />
        <MetricCard icon={Package} label="Sellable lots" value={available} helper={`${lots.length} total lots built`} tone="blue" />
        <MetricCard icon={CurrencyDollar} label="Estimated bulk value" value={estimatedValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} helper="using each category’s first tier" tone="yellow" />
        <MetricCard icon={Images} label="Media needed" value={mediaNeeded} helper="lots missing photos" tone="mint" />
      </section>

      <section className="dashboard-grid">
        <article className="panel category-overview">
          <div className="panel__head"><div><p className="eyebrow">Inventory overview</p><h2>Category readiness</h2></div><button className="text-button" onClick={() => onNavigate("categories")}>Manage categories</button></div>
          <div className="category-bars">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              const lotSize = category.defaultLotSize || 1;
              const readyLots = Math.floor(count / lotSize);
              return (
                <button key={category.id} className="category-row" onClick={() => onNavigate("calculator", category.id)}>
                  <span className="category-code">{category.code}</span>
                  <span className="category-row__main"><strong>{category.name}</strong><span className="bar"><i style={{ width: `${Math.max(8, count / maxCount * 100)}%` }} /></span></span>
                  <span className="category-row__count"><strong>{count.toLocaleString()}</strong><small>{readyLots} lots ready</small></span>
                </button>
              );
            })}
          </div>
        </article>

        <article className="panel status-panel">
          <div className="panel__head"><div><p className="eyebrow">Lot pipeline</p><h2>Status mix</h2></div></div>
          <div className="status-chart">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={72} paddingAngle={4}>
                  {statusData.map((entry) => <Cell key={entry.name} fill={statusColors[entry.name]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="status-chart__center"><strong>{lots.length}</strong><small>built lots</small></div>
          </div>
          <div className="legend">
            {statusData.map((item) => <div key={item.name}><i style={{ background: statusColors[item.name] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}
          </div>
        </article>

        <article className="panel recent-lots">
          <div className="panel__head"><div><p className="eyebrow">Action queue</p><h2>Recent lots</h2></div><button className="text-button" onClick={() => onNavigate("lots")}>View all</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Lot ID</th><th>Category</th><th>Qty</th><th>Price</th><th>Status</th><th>Media</th></tr></thead>
              <tbody>{lots.slice(-5).reverse().map((lot) => {
                const category = categories.find((item) => item.id === lot.categoryId);
                return <tr key={lot.id}><td className="mono">{lot.lotCode}</td><td>{category?.name}</td><td>{lot.quantity.toLocaleString()}</td><td>{lot.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</td><td><span className={`status status--${lot.status.toLowerCase()}`}>{lot.status}</span></td><td>{lot.mediaComplete || 0}/8</td></tr>;
              })}</tbody>
            </table>
          </div>
        </article>

        <article className="panel next-step">
          <span className="next-step__icon"><Tag size={28} weight="duotone" /></span>
          <div><p className="eyebrow">Recommended next step</p><h2>Turn the 8,000-print remainder into a partial lot</h2><p>Metallic Foil Prints has 40 inches remaining after four full 10K lots.</p></div>
          <button className="primary-button" onClick={() => onNavigate("lots")}>Build partial lot</button>
        </article>
      </section>
    </div>
  );
}
