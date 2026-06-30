import { useEffect, useState } from "react";
import { seedCategories, seedInventoryItems, seedLots } from "../data/seed";

const STORAGE_KEY = "warehouse-lot-builder-v1";
const SCHEMA_VERSION = 2;

function migrateState(saved) {
  if (!saved) return { schemaVersion: SCHEMA_VERSION, categories: seedCategories, lots: seedLots, inventoryItems: seedInventoryItems };
  const savedCategories = Array.isArray(saved.categories) ? saved.categories : [];
  const mergedCategories = savedCategories.map((category) => {
    const seeded = seedCategories.find((item) => item.id === category.id);
    if (!seeded) return category;
    const upgraded = { ...seeded, ...category, variables: category.variables?.length ? category.variables : seeded.variables };
    if (seeded.measurementMethod === "object") {
      upgraded.measurementMethod = "object";
      upgraded.basePrice ??= seeded.basePrice;
      upgraded.descriptionTemplate ??= seeded.descriptionTemplate;
    }
    return upgraded;
  });
  seedCategories.forEach((seeded) => {
    if (!mergedCategories.some((category) => category.id === seeded.id)) mergedCategories.push(seeded);
  });
  const savedItems = Array.isArray(saved.inventoryItems) ? saved.inventoryItems : [];
  const mergedItems = savedItems.map((item) => {
    const seeded = seedInventoryItems.find((candidate) => candidate.id === item.id);
    return seeded ? { ...seeded, ...item, sizeClass: item.sizeClass || seeded.sizeClass } : item;
  });
  seedInventoryItems.forEach((seeded) => {
    if (!mergedItems.some((item) => item.id === seeded.id)) mergedItems.push(seeded);
  });
  return {
    schemaVersion: SCHEMA_VERSION,
    categories: mergedCategories,
    lots: Array.isArray(saved.lots) ? saved.lots : seedLots,
    inventoryItems: mergedItems,
  };
}

export function useInventoryStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return migrateState(saved ? JSON.parse(saved) : null);
    } catch {
      return migrateState(null);
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function updateCategory(id, patch) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === id ? { ...category, ...patch } : category,
      ),
    }));
  }

  function addCategory(category) {
    setState((current) => ({ ...current, categories: [...current.categories, category] }));
  }

  function addLots(newLots) {
    setState((current) => ({ ...current, lots: [...current.lots, ...newLots] }));
  }

  function updateLot(id, patch) {
    setState((current) => ({
      ...current,
      lots: current.lots.map((lot) => (lot.id === id ? { ...lot, ...patch } : lot)),
    }));
  }

  function addInventoryItem(item) {
    setState((current) => ({ ...current, inventoryItems: [...current.inventoryItems, item] }));
  }

  function updateInventoryItem(id, patch) {
    setState((current) => ({
      ...current,
      inventoryItems: current.inventoryItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function deleteInventoryItem(id) {
    setState((current) => ({ ...current, inventoryItems: current.inventoryItems.filter((item) => item.id !== id) }));
  }

  function updateCategoryVariable(categoryId, variableId, patch) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id === categoryId ? {
        ...category,
        variables: (category.variables || []).map((variable) => variable.id === variableId ? { ...variable, ...patch } : variable),
      } : category),
    }));
  }

  function addCategoryVariable(categoryId, variable) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id === categoryId ? { ...category, variables: [...(category.variables || []), variable] } : category),
    }));
  }

  function deleteCategoryVariable(categoryId, variableId) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id === categoryId ? { ...category, variables: (category.variables || []).filter((variable) => variable.id !== variableId) } : category),
    }));
  }

  function reorderCategoryVariable(categoryId, variableId, direction) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        const variables = [...(category.variables || [])];
        const index = variables.findIndex((variable) => variable.id === variableId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= variables.length) return category;
        [variables[index], variables[target]] = [variables[target], variables[index]];
        return { ...category, variables };
      }),
    }));
  }

  function resetData() {
    setState({ schemaVersion: SCHEMA_VERSION, categories: seedCategories, lots: seedLots, inventoryItems: seedInventoryItems });
  }

  return { ...state, updateCategory, addCategory, addLots, updateLot, addInventoryItem, updateInventoryItem, deleteInventoryItem, updateCategoryVariable, addCategoryVariable, deleteCategoryVariable, reorderCategoryVariable, resetData };
}
