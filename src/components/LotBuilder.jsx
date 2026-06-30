import { useMemo, useState } from "react";
import { Check, Images, Package, Plus } from "@phosphor-icons/react";
import { CURATION_CODES, DEFAULT_PICKUP_RULE } from "../data/seed";
import { formatQuantity, getCategoryCount, lotCode } from "../lib/calculations";
import { LotCard } from "./LotCard";

const objectPriceRatios = { Bulk: 0.35, Basic: 0.45, Sorted: 0.5, Better: 0.58, Curated: 0.65, Premium: 0.8, "Custom Pick": 1.1 };
const printMediaPlan = ["HERO", "GROUP", "DETAIL", "CONDITION", "SCALE", "LOTCARD", "LOCATION", "PICKUP"];

function objectMediaPlan(category) {
  const base = ["FRONT", "BACK", "CORNER", "FRAMEDETAIL", "DAMAGE", "SCALE", "GROUP", "LOTCARD", "LOCATION"];
  if (["FMR", "FLM"].includes(category.code)) base.push("MIRRORSURFACE", "HARDWARE");
  if (category.code === "OAF") base.push("SIGNATURE", "LABEL");
  return base;
}

function summarize(items, key, fallback = "mixed") {
  const values = [...new Set(items.map((item) => key === "sizeClass" ? item.sizeClass : item.values?.[key]).filter(Boolean))];
  return values.length ? values.join(" / ") : fallback;
}

export function LotBuilder({ categories, lots, inventoryItems, addLots, updateLot, updateInventoryItem }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id);
  const category = categories.find((item) => item.id === categoryId) || categories[0];
  const objectMode = category?.measurementMethod === "object";
  const [tierIndex, setTierIndex] = useState(0);
  const tier = category?.tiers[tierIndex] || category?.tiers[0];
  const [lotCount, setLotCount] = useState(1);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(lots[0]?.id);
  const selectedLot = lots.find((lot) => lot.id === selectedLotId);
  const selectedCategory = categories.find((item) => item.id === selectedLot?.categoryId);
  const selectedLotItems = (inventoryItems || []).filter((item) => selectedLot?.itemIds?.includes(item.id));
  const availableObjectItems = (inventoryItems || []).filter((item) => item.categoryId === category.id && !item.lotId && ["Available", "Review"].includes(item.status));
  const selectedItems = availableObjectItems.filter((item) => selectedItemIds.includes(item.id));
  const alreadyAllocated = lots.filter((lot) => lot.categoryId === category.id && lot.status !== "Sold").reduce((sum, lot) => sum + lot.quantity, 0);
  const availableUnits = objectMode ? availableObjectItems.length : Math.max(0, getCategoryCount(category) - alreadyAllocated);
  const maximumLots = objectMode ? (selectedItems.length ? 1 : 0) : tier?.quantity ? Math.floor(availableUnits / tier.quantity) : 0;
  const selectedRetailValue = selectedItems.reduce((sum, item) => sum + Number(item.finalPrice || 0), 0);
  const objectRatio = objectPriceRatios[tier?.name] || 0.5;
  const suggestedObjectPrice = selectedRetailValue ? Math.max(25, Math.round((selectedRetailValue * objectRatio) / 25) * 25) : 0;

  function chooseCategory(id) {
    setCategoryId(id);
    setTierIndex(0);
    setSelectedItemIds([]);
    setLotCount(1);
  }

  function toggleItem(id) {
    setSelectedItemIds((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  }

  function generateLots() {
    if (objectMode) {
      if (!selectedItems.length) return;
      const sequence = lots.filter((lot) => lot.categoryId === category.id).length + 1;
      const mediaRequired = objectMediaPlan(category);
      const created = {
        id: `lot-${crypto.randomUUID()}`,
        lotCode: lotCode(category.code, selectedItems.length, tier.name, sequence, CURATION_CODES),
        categoryId: category.id,
        curation: tier.name,
        quantity: selectedItems.length,
        price: suggestedObjectPrice,
        retailValue: selectedRetailValue,
        itemIds: selectedItems.map((item) => item.id),
        objectSummary: {
          sizeClass: summarize(selectedItems, "sizeClass"),
          ornateLevel: summarize(selectedItems, "ornateLevel"),
          condition: summarize(selectedItems, "condition", summarize(selectedItems, "frameCondition")),
          material: summarize(selectedItems, "material"),
        },
        status: "Available",
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: "Warehouse team",
        pickupRule: `${DEFAULT_PICKUP_RULE} ${["FMR", "FLM"].includes(category.code) ? "Fragile mirror handling required; buyer supplies appropriate padding and transport." : "Buyer supplies appropriate vehicle, movers, and handling equipment."}`,
        mediaRequired,
        mediaComplete: 0,
        mediaCompletedShots: [],
      };
      addLots([created]);
      selectedItems.forEach((item) => updateInventoryItem(item.id, { lotId: created.id, status: "Allocated" }));
      setSelectedLotId(created.id);
      setSelectedItemIds([]);
      return;
    }

    const count = Math.min(lotCount, maximumLots);
    if (count < 1) return;
    const existingCategoryLots = lots.filter((lot) => lot.categoryId === category.id).length;
    const created = Array.from({ length: count }, (_, index) => {
      const sequence = existingCategoryLots + index + 1;
      return {
        id: `lot-${crypto.randomUUID()}`,
        lotCode: lotCode(category.code, tier.quantity, tier.name, sequence, CURATION_CODES),
        categoryId: category.id,
        curation: tier.name,
        quantity: tier.quantity,
        price: tier.price,
        status: "Available",
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: "Warehouse team",
        pickupRule: DEFAULT_PICKUP_RULE,
        mediaRequired: printMediaPlan,
        mediaComplete: 0,
        mediaCompletedShots: [],
      };
    });
    addLots(created);
    setSelectedLotId(created[0].id);
  }

  const mediaPlan = selectedCategory?.measurementMethod === "object" ? (selectedLot?.mediaRequired || objectMediaPlan(selectedCategory)) : printMediaPlan;
  const completedShots = selectedLot?.mediaCompletedShots || mediaPlan.slice(0, selectedLot?.mediaComplete || 0);

  function toggleShot(shot, checked) {
    const next = checked ? [...new Set([...completedShots, shot])] : completedShots.filter((item) => item !== shot);
    updateLot(selectedLot.id, { mediaCompletedShots: next, mediaComplete: next.length });
  }

  const buyerCopy = useMemo(() => {
    if (!selectedLot || !selectedCategory) return "";
    if (selectedCategory.measurementMethod === "object") {
      const summary = selectedLot.objectSummary || {
        sizeClass: summarize(selectedLotItems, "sizeClass"),
        ornateLevel: summarize(selectedLotItems, "ornateLevel"),
        condition: summarize(selectedLotItems, "condition", summarize(selectedLotItems, "frameCondition")),
      };
      const originalLanguage = selectedCategory.code === "OAF" ? " Artwork is described as original only where individually confirmed; otherwise it appears to be original and remains unverified." : "";
      return `${selectedLot.lotCode} is a ${selectedLot.curation.toLowerCase()} prebuilt lot of approx. ${selectedLot.quantity} ${selectedCategory.name.toLowerCase()}. Sizes are ${summary.sizeClass}; detail is ${summary.ornateLevel}; condition is ${summary.condition}. Best for ${selectedCategory.buyerTypes.join(", ")}. Sold as-is and as photographed. Buyer handles pickup and appropriate transport. No substitutions at bulk pricing.${originalLanguage}`;
    }
    return `${selectedCategory.name} ${selectedLot.curation} Lot\nLot ID: ${selectedLot.lotCode}\nApprox. quantity: ${selectedLot.quantity.toLocaleString()} items\nPrice: ${selectedLot.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}\nCondition: ${selectedCategory.condition}\nBest for: ${selectedCategory.buyerTypes.join(", ")}\nPickup: buyer handles pickup and transport\nRule: assigned lot only; no cherry-picking at bulk pricing.`;
  }, [selectedCategory, selectedLot, selectedLotItems]);

  return <div className="view-stack">
    <section className="page-heading"><div><p className="eyebrow">Lot builder</p><h1>Turn inventory into controlled lots</h1><p>Prints use measured quantities. Objects use selected, individually described inventory.</p></div></section>
    <section className="lot-builder-layout">
      <article className="panel builder-panel">
        <div className="step-title"><span>1</span><div><h2>Choose inventory</h2><p>Select a category with enough unallocated inventory.</p></div></div>
        <label className="field"><span>Category</span><select value={categoryId} onChange={(event) => chooseCategory(event.target.value)}>{categories.map((item) => <option value={item.id} key={item.id}>{item.code} · {item.name}</option>)}</select></label>
        <div className="availability-strip"><Package size={24} weight="duotone" /><span><strong>{availableUnits.toLocaleString()} {objectMode ? "described objects" : "units"} available</strong><small>{objectMode ? `${selectedItems.length} selected for this lot` : `${alreadyAllocated.toLocaleString()} units already assigned to active lots`}</small></span></div>

        {objectMode && <div className="object-lot-picker"><div className="divider" /><div className="step-title"><span>2</span><div><h2>Select the exact pieces</h2><p>Only checked items will be tagged and assigned to the lot.</p></div></div><div className="object-pick-list">{availableObjectItems.map((item) => <label className={selectedItemIds.includes(item.id) ? "is-selected" : ""} key={item.id}><input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} /><span><strong>{item.title}</strong><small>{item.sizeClass || "Unclassified"} · {Number(item.finalPrice || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} · {item.location}</small></span></label>)}</div>{availableObjectItems.length === 0 && <p className="empty-state">No individually described objects are available. Add them in Object inventory first.</p>}</div>}

        <div className="divider" />
        <div className="step-title"><span>{objectMode ? "3" : "2"}</span><div><h2>Choose the lot type</h2><p>{objectMode ? "The recommendation uses a percentage of the selected items’ calculated value." : "Pricing and curation stay category-specific."}</p></div></div>
        <div className="tier-options">{category.tiers.map((item, index) => <button key={`${item.name}-${item.quantity}`} className={tierIndex === index ? "is-selected" : ""} onClick={() => setTierIndex(index)}><span>{tierIndex === index && <Check weight="bold" />}{item.name}</span><strong>{objectMode ? `${Math.round((objectPriceRatios[item.name] || 0.5) * 100)}% of item value` : `${formatQuantity(item.quantity)} items`}</strong><small>{objectMode ? `${item.quantity} piece target` : `${item.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} per lot`}</small></button>)}</div>

        <div className="divider" />
        <div className="step-title"><span>{objectMode ? "4" : "3"}</span><div><h2>{objectMode ? "Review the recommendation" : "How many lots?"}</h2><p>{objectMode ? `${selectedItems.length} selected · ${selectedRetailValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} calculated item value · ${suggestedObjectPrice.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} suggested lot price.` : `This category can make up to ${maximumLots} full lots at the selected tier.`}</p></div></div>
        {!objectMode && <label className="field"><span>Number of lots to generate</span><input type="number" min="1" max={Math.max(1, maximumLots)} value={lotCount} onChange={(event) => setLotCount(Number(event.target.value))} /></label>}
        <button className="primary-button wide-button" disabled={maximumLots < 1} onClick={generateLots}><Plus weight="bold" /> {objectMode ? `Build lot from ${selectedItems.length} selected item${selectedItems.length === 1 ? "" : "s"}` : `Generate ${Math.min(lotCount, maximumLots)} lot${Math.min(lotCount, maximumLots) === 1 ? "" : "s"}`}</button>
      </article>

      <aside className="lot-preview-column">
        <label className="field"><span>Preview an existing lot</span><select value={selectedLotId} onChange={(event) => setSelectedLotId(event.target.value)}>{lots.slice().reverse().map((lot) => <option key={lot.id} value={lot.id}>{lot.lotCode}</option>)}</select></label>
        <LotCard lot={selectedLot} category={selectedCategory} onPrint={() => window.print()} />
        {selectedLot && <article className="panel media-plan"><div className="panel__head"><div><p className="eyebrow">Media plan</p><h2>Photo filenames</h2></div><span className="method-pill"><Images /> {completedShots.length}/{mediaPlan.length}</span></div><div className="shot-grid">{mediaPlan.map((shot) => <label key={shot}><input type="checkbox" checked={completedShots.includes(shot)} onChange={(event) => toggleShot(shot, event.target.checked)} /><span>{selectedLot.lotCode}_{shot}_01.jpg</span></label>)}</div></article>}
        {selectedLot && <article className="panel copy-panel"><p className="eyebrow">Buyer-facing description</p><pre>{buyerCopy}</pre><button className="secondary-button" onClick={() => navigator.clipboard.writeText(buyerCopy)}>Copy description</button></article>}
      </aside>
    </section>
  </div>;
}
