export function calculateInventory({
  calibrationCount,
  calibrationThickness,
  totalMeasuredInches,
  lotQuantity,
  lotPrice,
  width = 0,
  height = 0,
}) {
  const piecesPerInch = calibrationThickness > 0 ? calibrationCount / calibrationThickness : 0;
  const inchesPerPiece = calibrationCount > 0 ? calibrationThickness / calibrationCount : 0;
  const estimatedCount = Math.round(totalMeasuredInches * piecesPerInch);
  const lotStackInches = piecesPerInch > 0 ? lotQuantity / piecesPerInch : 0;
  const fullLots = lotQuantity > 0 ? Math.floor(estimatedCount / lotQuantity) : 0;
  const remainderPieces = lotQuantity > 0 ? estimatedCount % lotQuantity : 0;
  const remainderInches = piecesPerInch > 0 ? remainderPieces / piecesPerInch : 0;
  const unitPrice = lotQuantity > 0 ? lotPrice / lotQuantity : 0;
  const bulkValue = estimatedCount * unitPrice;
  const pricePerInch = piecesPerInch * unitPrice;
  const cubicInches = width * height * totalMeasuredInches;

  return {
    piecesPerInch,
    inchesPerPiece,
    estimatedCount,
    lotStackInches,
    fullLots,
    remainderPieces,
    remainderInches,
    unitPrice,
    bulkValue,
    pricePerInch,
    cubicInches,
    cubicFeet: cubicInches / 1728,
  };
}

export function getCategoryCount(category) {
  if (category.measurementMethod !== "stack") return Number(category.unitCount) || 0;
  return calculateInventory({
    calibrationCount: category.calibrationCount,
    calibrationThickness: category.calibrationThickness,
    totalMeasuredInches: category.totalMeasuredInches,
    lotQuantity: category.defaultLotSize,
    lotPrice: category.tiers[0]?.price || 0,
    width: category.width,
    height: category.height,
  }).estimatedCount;
}

export function getTierUnitPrice(tier) {
  return tier.quantity > 0 ? tier.price / tier.quantity : 0;
}

export function getCategoryValue(category, tier = category.tiers[0]) {
  return getCategoryCount(category) * getTierUnitPrice(tier);
}

export function formatQuantity(quantity) {
  if (quantity >= 1000 && quantity % 1000 === 0) return `${quantity / 1000}K`;
  return String(quantity);
}

export function lotCode(categoryCode, quantity, curation, sequence, codes) {
  const measure = formatQuantity(quantity);
  const level = codes[curation] || curation.toUpperCase().replace(/\s/g, "").slice(0, 6);
  return `${categoryCode}-${measure}-${level}-${String(sequence).padStart(3, "0")}`;
}

export function calculateCommission(collected, model = "standard") {
  const amount = Number(collected) || 0;
  if (amount < 500) return 0;
  if (model === "bulk") {
    if (amount < 1000) return 75;
    if (amount < 2500) return amount * 0.125;
    if (amount < 10000) return amount * 0.15;
    return amount * 0.175;
  }
  return Math.max(75, amount <= 5000 ? amount * 0.2 : 1000 + (amount - 5000) * 0.25);
}

export const DEFAULT_SIZE_CLASSES = [
  { name: "Small", maxArea: 299, multiplier: 0.75 },
  { name: "Medium", maxArea: 800, multiplier: 1 },
  { name: "Large", maxArea: 1800, multiplier: 1.4 },
  { name: "Oversized", maxArea: 3600, multiplier: 1.8 },
  { name: "Statement / Extra Large", maxArea: Infinity, multiplier: 2.5 },
];

export const ORNATE_MULTIPLIERS = {
  Plain: 1,
  "Simple Decorative": 1.1,
  "Moderate Ornate": 1.25,
  "Highly Ornate": 1.5,
  "Gilded / Statement": 1.8,
  "Museum / Architectural": 2.25,
};

export const CONDITION_MULTIPLIERS = {
  Excellent: 1.25,
  Good: 1,
  Fair: 0.75,
  Poor: 0.45,
  Salvage: 0.25,
};

export const QUALITY_MULTIPLIERS = {
  Low: 0.6,
  Average: 1,
  Good: 1.25,
  High: 1.5,
  Premium: 2,
};

export const MATERIAL_MULTIPLIERS = {
  Wood: 1.1,
  Metal: 1,
  Gilded: 1.25,
  Composite: 0.9,
  Plastic: 0.7,
  Mixed: 1,
};

export function classifyObjectDimensions(width, height, thresholds = DEFAULT_SIZE_CLASSES) {
  const safeWidth = Math.max(0, Number(width) || 0);
  const safeHeight = Math.max(0, Number(height) || 0);
  const areaSqIn = safeWidth * safeHeight;
  const selected = thresholds.find((item) => areaSqIn <= item.maxArea) || thresholds.at(-1);
  return {
    width: safeWidth,
    height: safeHeight,
    areaSqIn,
    areaSqFt: areaSqIn / 144,
    perimeterInches: 2 * (safeWidth + safeHeight),
    sizeClass: selected?.name || "Unclassified",
    sizeMultiplier: selected?.multiplier || 1,
  };
}

export function applyPricingModifier(price, modifier = {}) {
  const amount = Number(modifier.amount) || 0;
  if (modifier.type === "add_fixed") return price + amount;
  if (modifier.type === "subtract_fixed") return Math.max(0, price - amount);
  if (modifier.type === "multiply") return price * (amount || 1);
  if (modifier.type === "add_percentage") return price * (1 + amount / 100);
  if (modifier.type === "subtract_percentage") return price * (1 - amount / 100);
  if (modifier.type === "minimum") return Math.max(price, amount);
  if (modifier.type === "maximum") return Math.min(price, amount);
  return price;
}

export function calculateObjectPrice({
  basePrice,
  width,
  height,
  ornateLevel = "Plain",
  condition = "Good",
  quality = "Average",
  material = "Mixed",
  customModifiers = [],
  manualPrice,
  sizeClasses = DEFAULT_SIZE_CLASSES,
}) {
  const dimensions = classifyObjectDimensions(width, height, sizeClasses);
  const multipliers = {
    size: dimensions.sizeMultiplier,
    ornate: ORNATE_MULTIPLIERS[ornateLevel] || 1,
    condition: CONDITION_MULTIPLIERS[condition] || 1,
    quality: QUALITY_MULTIPLIERS[quality] || 1,
    material: MATERIAL_MULTIPLIERS[material] || 1,
  };
  const base = Math.max(0, Number(basePrice) || 0);
  const subtotal = base * multipliers.size * multipliers.ornate * multipliers.condition * multipliers.quality * multipliers.material;
  const calculatedPrice = customModifiers.reduce((price, modifier) => applyPricingModifier(price, modifier), subtotal);
  const hasManualPrice = manualPrice !== "" && manualPrice !== null && manualPrice !== undefined && Number.isFinite(Number(manualPrice));
  const finalPrice = hasManualPrice ? Math.max(0, Number(manualPrice)) : calculatedPrice;
  const roundedLow = Math.max(0, Math.floor(calculatedPrice / 25) * 25);
  const roundedHigh = Math.max(25, Math.ceil(calculatedPrice / 25) * 25);

  return {
    ...dimensions,
    basePrice: base,
    multipliers,
    calculatedPrice,
    manualPrice: hasManualPrice ? Number(manualPrice) : null,
    finalPrice,
    roundedSuggestions: [...new Set([roundedLow, roundedHigh])],
    manualReview: customModifiers.some((modifier) => modifier.manualReviewFlag),
  };
}

export function getObjectFlags({ condition, glassIncluded, backingIncluded, originalArtConfirmed, categoryCode }) {
  const repairCandidate = condition === "Poor" || condition === "Salvage" || glassIncluded === false || backingIncluded === false;
  return {
    repairCandidate,
    safeOriginalClaim: categoryCode === "OAF" && originalArtConfirmed === true,
    originalWording: categoryCode === "OAF" ? (originalArtConfirmed ? "original artwork confirmed" : "appears to be original; not verified") : "printed/decorative art",
    handlingWarning: false,
  };
}
