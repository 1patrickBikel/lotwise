import { useState } from "react";
import { Plus, Stack, X } from "@phosphor-icons/react";
import { getCategoryCount } from "../lib/calculations";

export function Categories({ categories, addCategory, onMeasure }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", itemType: "", storageLocation: "", measurementMethod: "count", unitCount: 0, defaultLotSize: 50 });

  function submit(event) {
    event.preventDefault();
    addCategory({
      ...form,
      id: `cat-${crypto.randomUUID()}`,
      code: form.code.toUpperCase(),
      buyerTypes: [],
      calibrationCount: form.measurementMethod === "stack" ? 500 : 0,
      calibrationThickness: form.measurementMethod === "stack" ? 2.5 : 0,
      totalMeasuredInches: 0,
      width: 0,
      height: 0,
      condition: "Mixed, as-is",
      basePrice: form.measurementMethod === "object" ? 25 : undefined,
      variables: form.measurementMethod === "object" ? [] : undefined,
      tiers: [{ name: "Bulk", quantity: form.defaultLotSize, price: 0 }],
    });
    setShowForm(false);
    setForm({ name: "", code: "", itemType: "", storageLocation: "", measurementMethod: "count", unitCount: 0, defaultLotSize: 50 });
  }

  return <div className="view-stack">
    <section className="page-heading"><div><p className="eyebrow">Category setup</p><h1>Inventory categories</h1><p>Keep measurements, lot sizes, buyer types, and pricing separate by category.</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus weight="bold" /> Add category</button></section>
    <section className="category-card-grid">
      {categories.map((category) => {
        const count = getCategoryCount(category);
        return <article className="category-card" key={category.id}>
          <div className="category-card__top"><span className="category-code category-code--large">{category.code}</span><span className="method-pill"><Stack /> {category.measurementMethod === "stack" ? "Measured by stack" : category.measurementMethod === "object" ? "Described by object" : "Counted by unit"}</span></div>
          <h2>{category.name}</h2><p>{category.storageLocation}</p>
          <div className="category-card__stats"><span><small>Estimated units</small><strong>{count.toLocaleString()}</strong></span><span><small>Default lot</small><strong>{category.defaultLotSize.toLocaleString()}</strong></span><span><small>Full lots</small><strong>{Math.floor(count / category.defaultLotSize)}</strong></span></div>
          <div className="category-card__foot"><span>{category.tiers.length} pricing tiers</span>{category.measurementMethod !== "count" && <button className="text-button" onClick={() => onMeasure(category)}>{category.measurementMethod === "object" ? "Open object register" : "Update measurement"}</button>}</div>
        </article>;
      })}
    </section>
    {showForm && <div className="modal-backdrop" role="presentation"><form className="modal" onSubmit={submit}><div className="panel__head"><div><p className="eyebrow">New category</p><h2>What kind of inventory is this?</h2></div><button type="button" className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X /></button></div><label className="field"><span>Category name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mirrored Frames" /></label><div className="form-grid"><label className="field"><span>Category code</span><input required maxLength={6} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="MFRA" /></label><label className="field"><span>Item type</span><input required value={form.itemType} onChange={(e) => setForm({ ...form, itemType: e.target.value })} placeholder="Frames" /></label></div><label className="field"><span>Storage location</span><input required value={form.storageLocation} onChange={(e) => setForm({ ...form, storageLocation: e.target.value })} placeholder="Warehouse 2 · Rack E" /></label><div className="form-grid"><label className="field"><span>How is it measured?</span><select value={form.measurementMethod} onChange={(e) => setForm({ ...form, measurementMethod: e.target.value })}><option value="count">Unit count</option><option value="stack">Stack thickness</option><option value="object">Individual object record</option></select></label><label className="field"><span>Default lot size</span><input type="number" min="1" value={form.defaultLotSize} onChange={(e) => setForm({ ...form, defaultLotSize: Number(e.target.value) })} /></label></div><button className="primary-button wide-button" type="submit">Create category</button></form></div>}
  </div>;
}
