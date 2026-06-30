import test from "node:test";
import assert from "node:assert/strict";
import { calculateInventory, calculateObjectPrice, classifyObjectDimensions, getObjectFlags } from "./calculations.js";

test("matches the 240-inch / 10K lot example", () => {
  const result = calculateInventory({
    calibrationCount: 500,
    calibrationThickness: 2.5,
    totalMeasuredInches: 240,
    lotQuantity: 10000,
    lotPrice: 500,
    width: 6,
    height: 8,
  });
  assert.equal(result.piecesPerInch, 200);
  assert.equal(result.estimatedCount, 48000);
  assert.equal(result.lotStackInches, 50);
  assert.equal(result.fullLots, 4);
  assert.equal(result.remainderPieces, 8000);
  assert.equal(result.remainderInches, 40);
  assert.equal(result.bulkValue, 2400);
  assert.equal(result.pricePerInch, 10);
});

test("converts a 10K lot to 50 inches", () => {
  const result = calculateInventory({
    calibrationCount: 200,
    calibrationThickness: 1,
    totalMeasuredInches: 50,
    lotQuantity: 10000,
    lotPrice: 500,
  });
  assert.equal(result.lotStackInches, 50);
});

test("classifies a 24 by 36 object as Large", () => {
  const result = classifyObjectDimensions(24, 36);
  assert.equal(result.areaSqIn, 864);
  assert.equal(result.areaSqFt, 6);
  assert.equal(result.sizeClass, "Large");
  assert.equal(result.perimeterInches, 120);
});

test("prices a large highly ornate framed mirror at 126 dollars", () => {
  const result = calculateObjectPrice({
    basePrice: 40,
    width: 24,
    height: 36,
    ornateLevel: "Highly Ornate",
    condition: "Good",
    quality: "High",
    material: "Metal",
  });
  assert.equal(result.calculatedPrice, 126);
  assert.deepEqual(result.roundedSuggestions, [125, 150]);
});

test("flags a damaged empty frame for repair or salvage", () => {
  const result = calculateObjectPrice({
    basePrice: 20,
    width: 20,
    height: 30,
    ornateLevel: "Moderate Ornate",
    condition: "Poor",
    quality: "Average",
  });
  const flags = getObjectFlags({ condition: "Poor", glassIncluded: false, backingIncluded: false, categoryCode: "FR" });
  assert.ok(result.calculatedPrice < 20);
  assert.equal(flags.repairCandidate, true);
});

test("only confirmed original art receives an original claim", () => {
  const printed = getObjectFlags({ categoryCode: "FPA", originalArtConfirmed: false });
  const unverified = getObjectFlags({ categoryCode: "OAF", originalArtConfirmed: false });
  const confirmed = getObjectFlags({ categoryCode: "OAF", originalArtConfirmed: true });
  assert.equal(printed.safeOriginalClaim, false);
  assert.match(unverified.originalWording, /appears to be original/);
  assert.equal(confirmed.originalWording, "original artwork confirmed");
});
