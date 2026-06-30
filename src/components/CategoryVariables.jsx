import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, SlidersHorizontal, Trash, X } from "@phosphor-icons/react";

const fieldTypes = ["text", "number", "currency", "percentage", "dropdown", "multi-select", "boolean", "dimension", "condition", "quality", "date", "notes"];
const modifierTypes = ["none", "add_fixed", "subtract_fixed", "multiply", "add_percentage", "subtract_percentage", "minimum", "maximum", "manual_review"];

function modifiersToText(config = {}) {
  return Object.entries(config).map(([key, value]) => `${key}:${value}`).join(", ");
}

function textToModifiers(text) {
  return Object.fromEntries(text.split(",").map((part) => part.trim()).filter(Boolean).map((part) => {
    const [key, rawValue] = part.split(":");
    return [key.trim(), Number(rawValue) || 0];
  }));
}

export function CategoryVariables({ categories, updateCategory, updateCategoryVariable, addCategoryVariable, deleteCategoryVariable, reorderCategoryVariable }) {
  const objectCategories = categories.filter((category) => category.measurementMethod === "object");
  const [categoryId, setCategoryId] = useState(objectCategories[0]?.id);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ name: "", key: "", fieldType: "text", allowedValues: "", affectsPricing: false, pricingModifierType: "none" });
  const category = categories.find((item) => item.id === categoryId) || objectCategories[0];

  function submit(event) {
    event.preventDefault();
    const safeKey = (draft.key || draft.name).trim().replace(/[^a-zA-Z0-9]+(.)/g, (_, next) => next.toUpperCase()).replace(/^[A-Z]/, (letter) => letter.toLowerCase());
    addCategoryVariable(category.id, {
      id: `${category.code.toLowerCase()}-${safeKey}-${crypto.randomUUID().slice(0, 8)}`,
      name: draft.name.trim(),
      key: safeKey,
      fieldType: draft.fieldType,
      required: false,
      defaultValue: draft.fieldType === "boolean" ? false : "",
      allowedValues: draft.allowedValues.split(",").map((value) => value.trim()).filter(Boolean),
      affectsPricing: draft.affectsPricing,
      pricingModifierType: draft.affectsPricing ? draft.pricingModifierType : "none",
      pricingModifierConfig: {},
      buyerVisible: true,
      internalVisible: true,
      appearsOnLotCard: false,
      appearsInDescription: false,
      helpText: "",
    });
    setDraft({ name: "", key: "", fieldType: "text", allowedValues: "", affectsPricing: false, pricingModifierType: "none" });
    setShowAdd(false);
  }

  if (!category) return <div className="panel empty-state">Create an object-based category before adding variables.</div>;

  return <div className="view-stack">
    <section className="page-heading"><div><p className="eyebrow">Dynamic category system</p><h1>Category variables</h1><p>Decide what gets measured, what changes price, and what buyers are allowed to see.</p></div><button className="primary-button" onClick={() => setShowAdd(true)}><Plus weight="bold" /> Add variable</button></section>

    <section className="panel variable-toolbar"><label className="field"><span>Object category</span><select value={category.id} onChange={(event) => setCategoryId(event.target.value)}>{objectCategories.map((item) => <option value={item.id} key={item.id}>{item.code} · {item.name}</option>)}</select></label><div className="variable-toolbar__summary"><SlidersHorizontal size={25} weight="duotone" /><span><strong>{category.variables?.length || 0} active variables</strong><small>{(category.variables || []).filter((variable) => variable.affectsPricing).length} affect pricing</small></span></div></section>

    {showAdd && <form className="panel variable-add" onSubmit={submit}><div className="panel__head"><div><p className="eyebrow">New variable</p><h2>Add a field to {category.name}</h2></div><button type="button" className="icon-button" onClick={() => setShowAdd(false)} aria-label="Close add variable"><X /></button></div><div className="form-grid"><label className="field"><span>Variable name</span><input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Room type" /></label><label className="field"><span>Data key</span><input value={draft.key} onChange={(event) => setDraft({ ...draft, key: event.target.value })} placeholder="roomType" /></label><label className="field"><span>Field type</span><select value={draft.fieldType} onChange={(event) => setDraft({ ...draft, fieldType: event.target.value })}>{fieldTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field"><span>Allowed values, comma separated</span><input value={draft.allowedValues} onChange={(event) => setDraft({ ...draft, allowedValues: event.target.value })} placeholder="Living room, Dining room, Lobby" /></label></div><div className="variable-add__checks"><label><input type="checkbox" checked={draft.affectsPricing} onChange={(event) => setDraft({ ...draft, affectsPricing: event.target.checked })} /> Affects pricing</label>{draft.affectsPricing && <label className="field compact-field"><span>Modifier type</span><select value={draft.pricingModifierType} onChange={(event) => setDraft({ ...draft, pricingModifierType: event.target.value })}>{modifierTypes.map((type) => <option key={type}>{type}</option>)}</select></label>}</div><button className="primary-button" type="submit">Create variable</button></form>}

    <section className="variable-list">
      {(category.variables || []).map((variable, index) => <article className="panel variable-card" key={variable.id}>
        <div className="variable-card__order"><button className="icon-button" disabled={index === 0} onClick={() => reorderCategoryVariable(category.id, variable.id, -1)} aria-label={`Move ${variable.name} up`}><ArrowUp /></button><button className="icon-button" disabled={index === category.variables.length - 1} onClick={() => reorderCategoryVariable(category.id, variable.id, 1)} aria-label={`Move ${variable.name} down`}><ArrowDown /></button></div>
        <div className="variable-card__fields"><label className="field"><span>Name</span><input value={variable.name} onChange={(event) => updateCategoryVariable(category.id, variable.id, { name: event.target.value })} /></label><label className="field"><span>Field type</span><select value={variable.fieldType} onChange={(event) => updateCategoryVariable(category.id, variable.id, { fieldType: event.target.value })}>{fieldTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field"><span>Allowed values</span><input value={(variable.allowedValues || []).join(", ")} onChange={(event) => updateCategoryVariable(category.id, variable.id, { allowedValues: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} placeholder="No fixed values" /></label><label className="field"><span>Modifier type</span><select value={variable.pricingModifierType || "none"} disabled={!variable.affectsPricing} onChange={(event) => updateCategoryVariable(category.id, variable.id, { pricingModifierType: event.target.value })}>{modifierTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field"><span>Value modifiers</span><input key={`${variable.id}-${JSON.stringify(variable.pricingModifierConfig)}`} defaultValue={modifiersToText(variable.pricingModifierConfig)} onBlur={(event) => updateCategoryVariable(category.id, variable.id, { pricingModifierConfig: textToModifiers(event.target.value) })} placeholder="Yes:1.2, No:1" /></label></div>
        <div className="variable-card__toggles"><label><input type="checkbox" checked={variable.required} onChange={(event) => updateCategoryVariable(category.id, variable.id, { required: event.target.checked })} /> Required</label><label><input type="checkbox" checked={variable.affectsPricing} onChange={(event) => updateCategoryVariable(category.id, variable.id, { affectsPricing: event.target.checked, pricingModifierType: event.target.checked ? variable.pricingModifierType || "multiply" : "none" })} /> Pricing</label><label><input type="checkbox" checked={variable.buyerVisible} onChange={(event) => updateCategoryVariable(category.id, variable.id, { buyerVisible: event.target.checked })} /> Buyer visible</label><label><input type="checkbox" checked={variable.appearsOnLotCard} onChange={(event) => updateCategoryVariable(category.id, variable.id, { appearsOnLotCard: event.target.checked })} /> Lot card</label><label><input type="checkbox" checked={variable.appearsInDescription} onChange={(event) => updateCategoryVariable(category.id, variable.id, { appearsInDescription: event.target.checked })} /> Description</label></div>
        <button className="icon-button variable-card__delete" onClick={() => { if (window.confirm(`Delete ${variable.name}? Existing item values will remain in backups but no longer appear in forms.`)) deleteCategoryVariable(category.id, variable.id); }} aria-label={`Delete ${variable.name}`}><Trash /></button>
      </article>)}
    </section>

    <section className="panel template-editor"><p className="eyebrow">Buyer-facing template</p><h2>{category.name} description pattern</h2><p>Use bracketed variable names such as [LotID], [quantity], [size_class], [condition], and [buyer_type].</p><textarea value={category.descriptionTemplate || ""} onChange={(event) => updateCategory(category.id, { descriptionTemplate: event.target.value })} /></section>
  </div>;
}
