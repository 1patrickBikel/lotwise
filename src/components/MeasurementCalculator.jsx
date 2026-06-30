import { useMemo, useState } from "react";
import { CheckCircle, Info, Ruler, Stack } from "@phosphor-icons/react";
import { calculateInventory } from "../lib/calculations";

function NumberInput({ label, value, onChange, suffix, step = "any", min = 0 }) {
  return <label className="field"><span>{label}</span><div className="input-with-suffix"><input type="number" value={value} min={min} step={step} onChange={(event) => onChange(Number(event.target.value))} /><small>{suffix}</small></div></label>;
}

export function MeasurementCalculator({ categories, updateCategory, initialCategoryId }) {
  const stackCategories = categories.filter((category) => category.measurementMethod === "stack");
  const [categoryId, setCategoryId] = useState(initialCategoryId || stackCategories[0]?.id);
  const category = categories.find((item) => item.id === categoryId) || stackCategories[0];
  const [values, setValues] = useState(() => ({
    calibrationCount: category?.calibrationCount || 500,
    calibrationThickness: category?.calibrationThickness || 2.5,
    totalMeasuredInches: category?.totalMeasuredInches || 240,
    lotQuantity: category?.defaultLotSize || 10000,
    lotPrice: category?.tiers[0]?.price || 500,
    width: category?.width || 6,
    height: category?.height || 8,
  }));

  function chooseCategory(id) {
    const next = categories.find((item) => item.id === id);
    setCategoryId(id);
    setValues({
      calibrationCount: next.calibrationCount || 500,
      calibrationThickness: next.calibrationThickness || 2.5,
      totalMeasuredInches: next.totalMeasuredInches || 0,
      lotQuantity: next.defaultLotSize || 10000,
      lotPrice: next.tiers[0]?.price || 0,
      width: next.width || 0,
      height: next.height || 0,
    });
  }
  const result = useMemo(() => calculateInventory(values), [values]);
  const set = (key) => (value) => setValues((current) => ({ ...current, [key]: value }));

  function saveMeasurement() {
    updateCategory(categoryId, {
      calibrationCount: values.calibrationCount,
      calibrationThickness: values.calibrationThickness,
      totalMeasuredInches: values.totalMeasuredInches,
      defaultLotSize: values.lotQuantity,
      width: values.width,
      height: values.height,
    });
  }

  return (
    <div className="view-stack">
      <section className="page-heading"><div><p className="eyebrow">Measurement calculator</p><h1>How thick is the stack?</h1><p>Calibrate from a small test stack, then estimate the whole inventory.</p></div><span className="estimate-pill"><Info weight="fill" /> Estimates update instantly</span></section>
      <section className="calculator-layout">
        <article className="panel form-panel">
          <div className="step-title"><span>1</span><div><h2>Choose the print category</h2><p>Each category keeps its own editable assumptions.</p></div></div>
          <label className="field"><span>Category</span><select value={categoryId} onChange={(event) => chooseCategory(event.target.value)}>{stackCategories.map((item) => <option value={item.id} key={item.id}>{item.code} · {item.name}</option>)}</select></label>
          <div className="divider" />
          <div className="step-title"><span>2</span><div><h2>Calibrate a test stack</h2><p>Count a manageable sample and measure its thickness.</p></div></div>
          <div className="form-grid"><NumberInput label="Pieces in the test stack" value={values.calibrationCount} onChange={set("calibrationCount")} suffix="pieces" /><NumberInput label="Thickness of the test stack" value={values.calibrationThickness} onChange={set("calibrationThickness")} suffix="inches" step="0.1" /></div>
          <div className="formula-strip"><Stack weight="duotone" /><span><strong>{result.piecesPerInch.toLocaleString(undefined, { maximumFractionDigits: 1 })} pieces per inch</strong><small>{result.inchesPerPiece.toFixed(4)} inches per piece</small></span></div>
          <div className="divider" />
          <div className="step-title"><span>3</span><div><h2>Measure everything</h2><p>Add the combined height of every stack in this batch.</p></div></div>
          <NumberInput label="Total measured stack height" value={values.totalMeasuredInches} onChange={set("totalMeasuredInches")} suffix="inches" step="0.5" />
          <div className="form-grid"><NumberInput label="Print width" value={values.width} onChange={set("width")} suffix="in" step="0.25" /><NumberInput label="Print height" value={values.height} onChange={set("height")} suffix="in" step="0.25" /></div>
          <div className="divider" />
          <div className="step-title"><span>4</span><div><h2>Define one lot</h2><p>What should the buyer receive, and at what bulk price?</p></div></div>
          <div className="form-grid"><NumberInput label="Pieces in one lot" value={values.lotQuantity} onChange={set("lotQuantity")} suffix="pieces" /><NumberInput label="Bulk price for one lot" value={values.lotPrice} onChange={set("lotPrice")} suffix="USD" /></div>
          <button className="primary-button wide-button" onClick={saveMeasurement}><CheckCircle weight="fill" /> Save these assumptions</button>
        </article>

        <aside className="result-stack">
          <article className="result-hero"><span>Estimated inventory</span><strong>{result.estimatedCount.toLocaleString()}</strong><small>approx. pieces</small></article>
          <article className="panel formula-results">
            <h2>What this inventory makes</h2>
            <dl>
              <div><dt>Full lots</dt><dd>{result.fullLots}</dd></div>
              <div><dt>Each lot is</dt><dd>{result.lotStackInches.toFixed(1)} in</dd></div>
              <div><dt>Remainder</dt><dd>{result.remainderPieces.toLocaleString()} pcs</dd></div>
              <div><dt>Remainder height</dt><dd>{result.remainderInches.toFixed(1)} in</dd></div>
            </dl>
          </article>
          <article className="panel value-card">
            <span>Estimated bulk value</span><strong>{result.bulkValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</strong>
            <div><span><small>Per piece</small><b>{result.unitPrice.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 3 })}</b></span><span><small>Per inch</small><b>{result.pricePerInch.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })}</b></span></div>
          </article>
          <article className="panel volume-card"><Ruler size={26} weight="duotone" /><div><strong>{result.cubicFeet.toFixed(2)} cubic feet</strong><small>{result.cubicInches.toLocaleString()} cubic inches of physical volume</small></div></article>
          <p className="estimation-note">Approximate counts should stay labeled “approx.” until manually verified.</p>
        </aside>
      </section>
    </div>
  );
}
