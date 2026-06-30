import { useMemo, useState } from "react";
import { CheckCircle, CurrencyDollar, FunnelSimple, Plus, Ruler, Trash, Warning, X } from "@phosphor-icons/react";
import { calculateObjectPrice, getObjectFlags } from "../lib/calculations";

const coreModifierKeys = new Set(["width", "height", "depth", "ornateLevel", "condition", "frameCondition", "printCondition", "mirrorCondition", "artworkCondition", "quality", "material"]);

function makeForm(category) {
  return {
    title: "",
    location: category?.storageLocation || "",
    basePrice: category?.basePrice || 0,
    manualPrice: "",
    notes: "",
    ...Object.fromEntries((category?.variables || []).map((variable) => [variable.key, variable.defaultValue ?? (variable.fieldType === "boolean" ? false : "")])),
  };
}

function DynamicField({ variable, value, onChange }) {
  const id = `object-${variable.id}`;
  if (variable.fieldType === "boolean") return <label className="object-boolean" htmlFor={id}><input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span><strong>{variable.name}</strong><small>{variable.helpText || "Yes / no"}</small></span></label>;
  if (variable.fieldType === "notes") return <label className="field object-field object-field--wide" htmlFor={id}><span>{variable.name}{variable.required ? " *" : ""}</span><textarea id={id} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={variable.helpText || "Notes…"} /></label>;
  if (["dropdown", "condition", "quality", "multi-select"].includes(variable.fieldType)) return <label className="field object-field" htmlFor={id}><span>{variable.name}{variable.required ? " *" : ""}</span><select id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={variable.required}><option value="" disabled>Select…</option>{(variable.allowedValues || []).map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
  const numeric = ["number", "currency", "percentage", "dimension"].includes(variable.fieldType);
  return <label className="field object-field" htmlFor={id}><span>{variable.name}{variable.required ? " *" : ""}</span><div className={variable.fieldType === "dimension" ? "input-with-suffix" : undefined}><input id={id} type={numeric ? "number" : variable.fieldType === "date" ? "date" : "text"} min={numeric ? 0 : undefined} step={numeric ? "any" : undefined} value={value ?? ""} onChange={(event) => onChange(numeric ? Number(event.target.value) : event.target.value)} required={variable.required} />{variable.fieldType === "dimension" && <small>inches</small>}</div></label>;
}

export function ObjectInventory({ categories, inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, initialCategoryId }) {
  const objectCategories = categories.filter((category) => category.measurementMethod === "object");
  const initial = objectCategories.find((category) => category.id === initialCategoryId) || objectCategories[0];
  const [categoryId, setCategoryId] = useState(initial?.id);
  const category = categories.find((item) => item.id === categoryId) || initial;
  const [form, setForm] = useState(() => makeForm(initial));
  const [editingId, setEditingId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("All sizes");
  const [conditionFilter, setConditionFilter] = useState("All conditions");

  function chooseCategory(id) {
    const next = categories.find((item) => item.id === id);
    setCategoryId(id);
    setForm(makeForm(next));
    setEditingId(null);
    setSaved(false);
  }

  const customModifiers = useMemo(() => (category.variables || []).flatMap((variable) => {
    if (!variable.affectsPricing || coreModifierKeys.has(variable.key)) return [];
    const selected = form[variable.key];
    if (variable.pricingModifierType === "manual_review") return selected ? [{ type: "none", amount: 0, manualReviewFlag: true, label: variable.name }] : [];
    const configured = variable.pricingModifierConfig?.[String(selected)] ?? variable.pricingModifierConfig?.[selected];
    if (configured === undefined) return [];
    return [{ type: variable.pricingModifierType, amount: configured, label: `${variable.name}: ${String(selected)}` }];
  }), [category, form]);

  const primaryCondition = form.condition || form.frameCondition || form.printCondition || form.mirrorCondition || form.artworkCondition || "Good";
  const isLinearMaterial = category.code === "FM";
  const effectiveBase = isLinearMaterial ? Number(form.basePrice || 0) * Number(form.linearFeet || 0) : form.basePrice;
  const pricing = useMemo(() => calculateObjectPrice({
    basePrice: effectiveBase,
    width: form.width,
    height: form.height,
    ornateLevel: form.ornateLevel,
    condition: primaryCondition,
    quality: form.quality,
    material: form.material || "Mixed",
    customModifiers,
    manualPrice: form.manualPrice,
    sizeClasses: isLinearMaterial ? [{ name: "Linear material", maxArea: Infinity, multiplier: 1 }] : undefined,
  }), [customModifiers, effectiveBase, form.height, form.manualPrice, form.material, form.ornateLevel, form.quality, form.width, isLinearMaterial, primaryCondition]);

  const flags = getObjectFlags({ condition: primaryCondition, glassIncluded: form.glassIncluded, backingIncluded: form.backingIncluded, originalArtConfirmed: form.originalArtConfirmed, categoryCode: category.code });
  const handlingWarning = ["Oversized", "Statement / Extra Large"].includes(pricing.sizeClass) || ["FMR", "FLM"].includes(category.code);

  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries((category.variables || []).map((variable) => [variable.key, form[variable.key]]));
    const record = {
      categoryId: category.id,
      title: form.title.trim(),
      location: form.location,
      width: Number(form.width) || 0,
      height: Number(form.height) || 0,
      depth: Number(form.depth) || 0,
      areaSqIn: pricing.areaSqIn,
      areaSqFt: pricing.areaSqFt,
      perimeterInches: pricing.perimeterInches,
      sizeClass: pricing.sizeClass,
      basePrice: Number(form.basePrice) || 0,
      calculatedPrice: pricing.calculatedPrice,
      manualPrice: pricing.manualPrice,
      finalPrice: pricing.finalPrice,
      status: editingId ? inventoryItems.find((item) => item.id === editingId)?.status || "Available" : "Available",
      notes: form.notes,
      values,
      manualReview: pricing.manualReview || flags.repairCandidate || (category.code === "OAF" && !form.originalArtConfirmed),
      updatedAt: new Date().toISOString(),
    };
    if (editingId) updateInventoryItem(editingId, record);
    else addInventoryItem({ ...record, id: `item-${crypto.randomUUID()}`, createdAt: new Date().toISOString() });
    setSaved(true);
    setEditingId(null);
    setForm(makeForm(category));
  }

  function editItem(item) {
    setEditingId(item.id);
    setForm({ ...makeForm(category), ...item.values, width: item.width, height: item.height, depth: item.depth, title: item.title, location: item.location, basePrice: item.basePrice, manualPrice: item.manualPrice ?? "", notes: item.notes || "" });
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const visibleItems = inventoryItems.filter((item) => item.categoryId === category.id).filter((item) => !search || `${item.title} ${item.location} ${Object.values(item.values || {}).join(" ")}`.toLowerCase().includes(search.toLowerCase())).filter((item) => sizeFilter === "All sizes" || item.sizeClass === sizeFilter).filter((item) => conditionFilter === "All conditions" || (item.values?.condition || item.values?.frameCondition || item.values?.printCondition) === conditionFilter);

  const buyerCopy = `${form.title || category.name} — approx. ${form.width || 0} × ${form.height || 0} in, ${pricing.sizeClass.toLowerCase()}, ${primaryCondition.toLowerCase()} condition, as-is.${flags.repairCandidate ? " Repair/salvage use recommended." : ""}${handlingWarning ? " Buyer must plan fragile/oversized pickup and transport." : ""}${category.code === "OAF" ? ` ${flags.originalWording}.` : ""}`;

  return <div className="view-stack">
    <section className="page-heading"><div><p className="eyebrow">Object inventory entry</p><h1>Measure the piece, then price what matters</h1><p>The form changes with the category. Size, condition, quality, material, and custom variables stay visible in the price.</p></div>{saved && <span className="success-pill"><CheckCircle weight="fill" /> Item saved locally</span>}</section>

    <section className="object-entry-layout">
      <form className="panel object-entry-form" onSubmit={submit}>
        <div className="panel__head"><div><p className="eyebrow">{editingId ? "Editing item" : "New object"}</p><h2>{editingId ? "Update this inventory record" : "What is this piece?"}</h2></div>{editingId && <button type="button" className="icon-button" onClick={() => { setEditingId(null); setForm(makeForm(category)); }} aria-label="Cancel editing"><X /></button>}</div>
        <label className="field"><span>Object category</span><select value={category.id} onChange={(event) => chooseCategory(event.target.value)}>{objectCategories.map((item) => <option value={item.id} key={item.id}>{item.code} · {item.name}</option>)}</select></label>
        <div className="form-grid"><label className="field"><span>Item title *</span><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Large ornate gilt mirror" /></label><label className="field"><span>Physical location *</span><input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label></div>
        <div className="object-fields">{(category.variables || []).map((variable) => <DynamicField key={variable.id} variable={variable} value={form[variable.key]} onChange={(value) => { setForm((current) => ({ ...current, [variable.key]: value })); setSaved(false); }} />)}</div>
        <div className="divider" />
        <div className="form-grid"><label className="field"><span>{isLinearMaterial ? "Base price per linear foot" : "Base category price"}</span><div className="money-input"><span>$</span><input type="number" min="0" step="any" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: Number(event.target.value) })} /></div></label><label className="field"><span>Manual final price, optional</span><div className="money-input"><span>$</span><input type="number" min="0" step="any" value={form.manualPrice} onChange={(event) => setForm({ ...form, manualPrice: event.target.value })} placeholder="Use calculated price" /></div></label></div>
        <label className="field"><span>Internal notes</span><textarea className="large-textarea" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Repair, provenance, handling, or follow-up…" /></label>
        <button className="primary-button wide-button" type="submit"><Plus weight="bold" /> {editingId ? "Save item changes" : "Add object to inventory"}</button>
      </form>

      <aside className="result-stack object-pricing">
        <article className="result-hero"><span>Estimated final price</span><strong>{pricing.finalPrice.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })}</strong><small>{pricing.manualPrice !== null ? "manual price override" : `calculated from ${category.name} variables`}</small></article>
        <article className="panel price-breakdown"><p className="eyebrow">Object pricing preview</p><h2>How the estimate was built</h2><dl><div><dt>Base price</dt><dd>{pricing.basePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}</dd></div><div><dt>Size · {pricing.sizeClass}</dt><dd>× {pricing.multipliers.size}</dd></div><div><dt>Ornate · {form.ornateLevel || "None"}</dt><dd>× {pricing.multipliers.ornate}</dd></div><div><dt>Condition · {primaryCondition}</dt><dd>× {pricing.multipliers.condition}</dd></div><div><dt>Quality · {form.quality || "Average"}</dt><dd>× {pricing.multipliers.quality}</dd></div><div><dt>Material · {form.material || "Mixed"}</dt><dd>× {pricing.multipliers.material}</dd></div>{customModifiers.map((modifier) => <div key={modifier.label}><dt>{modifier.label}</dt><dd>{modifier.type === "multiply" ? `× ${modifier.amount}` : modifier.manualReviewFlag ? "Review" : modifier.amount}</dd></div>)}</dl><div className="price-breakdown__total"><span>Calculated</span><strong>{pricing.calculatedPrice.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })}</strong></div><p>Suggested rounded price: {pricing.roundedSuggestions.map((price) => `$${price}`).join(" or ")}</p></article>
        <article className="panel dimension-summary"><Ruler size={26} weight="duotone" /><div><strong>{pricing.sizeClass}</strong><small>{pricing.areaSqIn.toLocaleString()} sq in · {pricing.areaSqFt.toFixed(2)} sq ft · {pricing.perimeterInches.toLocaleString()} in perimeter</small></div></article>
        {(flags.repairCandidate || handlingWarning || pricing.manualReview) && <article className="object-warning"><Warning size={24} weight="fill" /><div><strong>Review before selling</strong><p>{flags.repairCandidate ? "Repair/salvage candidate. " : ""}{handlingWarning ? "Add fragile or oversized pickup instructions. " : ""}{pricing.manualReview ? "A selected variable requires manual review." : ""}</p></div></article>}
        <article className="panel copy-panel"><p className="eyebrow">Safe buyer-facing copy</p><p>{buyerCopy}</p></article>
      </aside>
    </section>

    <section className="panel object-register"><div className="panel__head"><div><p className="eyebrow">Object register</p><h2>{category.name}</h2></div><span className="method-pill">{visibleItems.length} shown</span></div><div className="object-filters"><label className="field"><span>Find item or attribute</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ornate, religious, mirror bay…" /></label><label className="field"><span>Size</span><select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}><option>All sizes</option>{["Small", "Medium", "Large", "Oversized", "Statement / Extra Large", "Linear material"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field"><span>Condition</span><select value={conditionFilter} onChange={(event) => setConditionFilter(event.target.value)}><option>All conditions</option>{["Excellent", "Good", "Fair", "Poor", "Salvage"].map((value) => <option key={value}>{value}</option>)}</select></label><span className="filter-icon"><FunnelSimple size={22} /></span></div><div className="table-wrap"><table><thead><tr><th>Item</th><th>Size</th><th>Condition</th><th>Final price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleItems.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><small className="table-subtext">{item.location}</small></td><td>{item.sizeClass || "—"}</td><td>{item.values?.condition || item.values?.frameCondition || item.values?.printCondition || "—"}</td><td>{Number(item.finalPrice || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })}</td><td><span className={`status status--${String(item.status).toLowerCase()}`}>{item.status}</span></td><td><div className="table-actions"><button className="text-button" onClick={() => editItem(item)}>Edit</button><button className="icon-button" onClick={() => { if (window.confirm(`Delete ${item.title}?`)) deleteInventoryItem(item.id); }} aria-label={`Delete ${item.title}`}><Trash /></button></div></td></tr>)}</tbody></table>{visibleItems.length === 0 && <div className="empty-state">No object items match these filters.</div>}</div></section>
  </div>;
}
