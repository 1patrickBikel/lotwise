import { Images, MapPin, Printer, ShieldCheck } from "@phosphor-icons/react";
import { getTierUnitPrice } from "../lib/calculations";

export function LotCard({ lot, category, onPrint }) {
  if (!lot || !category) return null;
  const ppi = category.measurementMethod === "stack" && category.calibrationThickness ? category.calibrationCount / category.calibrationThickness : 0;
  const stack = ppi ? lot.quantity / ppi : 0;
  const objectMode = category.measurementMethod === "object";
  const mediaTotal = lot.mediaRequired?.length || 8;
  return <article className="lot-card-preview" id="printable-lot-card">
    <div className="lot-card-preview__head"><div><span>LOT CARD</span><strong>{lot.lotCode}</strong></div><span className={`status status--${lot.status.toLowerCase()}`}>{lot.status}</span></div>
    <div className="lot-card-preview__body"><p className="eyebrow">{lot.curation} · {category.itemType}</p><h2>{category.name}</h2><div className="lot-card-preview__price"><span>Price</span><strong>{lot.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</strong><small>{getTierUnitPrice({ quantity: lot.quantity, price: lot.price }).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 3 })} per item</small></div><dl><div><dt>Approx. quantity</dt><dd>{lot.quantity.toLocaleString()}</dd></div>{stack > 0 && <div><dt>Approx. stack height</dt><dd>{stack.toFixed(1)} inches</dd></div>}{objectMode && lot.objectSummary?.sizeClass && <div><dt>Size class</dt><dd>{lot.objectSummary.sizeClass}</dd></div>}{objectMode && lot.objectSummary?.ornateLevel && <div><dt>Ornate detail</dt><dd>{lot.objectSummary.ornateLevel}</dd></div>}<div><dt>Condition</dt><dd>{objectMode ? lot.objectSummary?.condition || category.condition : category.condition}</dd></div><div><dt>Best for</dt><dd>{category.buyerTypes.join(", ") || "Bulk buyers"}</dd></div></dl><div className="location-line"><MapPin weight="fill" /> {category.storageLocation}</div><div className="rule-box"><ShieldCheck size={24} weight="duotone" /><p><strong>Pickup rule</strong>{lot.pickupRule}</p></div></div>
    <div className="lot-card-preview__foot"><span><Images /> Media {lot.mediaComplete || 0}/{mediaTotal}</span><button className="secondary-button no-print" onClick={onPrint}><Printer /> Print lot card</button></div>
  </article>;
}
