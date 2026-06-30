import { useState } from "react";
import { CheckCircle, Plus } from "@phosphor-icons/react";
import { getTierUnitPrice } from "../lib/calculations";

export function PricingEditor({ categories, updateCategory }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id);
  const category = categories.find((item) => item.id === categoryId) || categories[0];
  const [saved, setSaved] = useState(false);

  function updateTier(index, key, value) {
    const tiers = category.tiers.map((tier, tierIndex) => tierIndex === index ? { ...tier, [key]: value } : tier);
    updateCategory(category.id, { tiers });
    setSaved(false);
  }

  function addTier() {
    updateCategory(category.id, { tiers: [...category.tiers, { name: "New tier", quantity: category.defaultLotSize, price: 0 }] });
  }

  return <div className="view-stack">
    <section className="page-heading"><div><p className="eyebrow">Pricing engine</p><h1>Price the work, not just the quantity</h1><p>Sorted, curated, premium, and custom-picked lots can carry different value.</p></div>{saved && <span className="success-pill"><CheckCircle weight="fill" /> Pricing saved locally</span>}</section>
    <section className="panel pricing-panel"><div className="panel__head"><div><label className="field compact-field"><span>Category</span><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>{categories.map((item) => <option value={item.id} key={item.id}>{item.code} · {item.name}</option>)}</select></label></div><button className="secondary-button" onClick={addTier}><Plus weight="bold" /> Add price tier</button></div><div className="table-wrap"><table className="editable-table"><thead><tr><th>Curation level</th><th>Lot quantity</th><th>Lot price</th><th>Unit price</th><th>Price note</th></tr></thead><tbody>{category.tiers.map((tier, index) => <tr key={`${index}-${tier.name}`}><td><input value={tier.name} onChange={(e) => updateTier(index, "name", e.target.value)} /></td><td><input type="number" min="1" value={tier.quantity} onChange={(e) => updateTier(index, "quantity", Number(e.target.value))} /></td><td><div className="money-input"><span>$</span><input type="number" min="0" value={tier.price} onChange={(e) => updateTier(index, "price", Number(e.target.value))} /></div></td><td className="mono">{getTierUnitPrice(tier).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 3 })}</td><td>{tier.name === "Custom Pick" ? "Higher by default; protects remaining inventory" : `${tier.name} prebuilt lot`}</td></tr>)}</tbody></table></div><div className="pricing-foot"><p><strong>Business rule:</strong> Custom-pick pricing should stay 20%–40% above comparable prebuilt inventory.</p><button className="primary-button" onClick={() => setSaved(true)}>Save pricing</button></div></section>
  </div>;
}
