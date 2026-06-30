import { useMemo, useState } from "react";
import { Categories } from "./components/Categories";
import { CategoryVariables } from "./components/CategoryVariables";
import { Dashboard } from "./components/Dashboard";
import { ExportCenter } from "./components/ExportCenter";
import { LotBuilder } from "./components/LotBuilder";
import { MeasurementCalculator } from "./components/MeasurementCalculator";
import { ObjectInventory } from "./components/ObjectInventory";
import { PlaceholderView } from "./components/PlaceholderView";
import { PricingEditor } from "./components/PricingEditor";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { WarehouseChecklist } from "./components/WarehouseChecklist";
import { useInventoryStore } from "./hooks/useInventoryStore";

export function App() {
  const store = useInventoryStore();
  const [activeView, setActiveView] = useState("dashboard");
  const [initialCategoryId, setInitialCategoryId] = useState();
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");

  function navigate(view, categoryId) {
    setActiveView(view);
    if (categoryId) setInitialCategoryId(categoryId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return [
      ...store.categories.filter((item) => `${item.name} ${item.code} ${item.storageLocation}`.toLowerCase().includes(term)).map((item) => ({ type: "category", id: item.id, label: item.name, meta: `${item.code} · ${item.storageLocation}`, measurementMethod: item.measurementMethod })),
      ...store.inventoryItems.filter((item) => `${item.title} ${item.location} ${Object.values(item.values || {}).join(" ")}`.toLowerCase().includes(term)).map((item) => ({ type: "item", id: item.id, categoryId: item.categoryId, label: item.title, meta: `Object · ${item.location}` })),
      ...store.lots.filter((item) => item.lotCode.toLowerCase().includes(term)).map((item) => ({ type: "lot", id: item.id, label: item.lotCode, meta: `${item.status} · $${item.price.toLocaleString()}` })),
    ];
  }, [search, store.categories, store.inventoryItems, store.lots]);

  function chooseResult(item) {
    if (item.type === "category") navigate(item.measurementMethod === "object" ? "objects" : "calculator", item.id);
    else if (item.type === "item") navigate("objects", item.categoryId);
    else navigate("lots");
    setSearch("");
  }

  let content;
  if (activeView === "dashboard") content = <Dashboard categories={store.categories} lots={store.lots} onNavigate={navigate} />;
  else if (activeView === "categories") content = <Categories categories={store.categories} addCategory={store.addCategory} onMeasure={(category) => navigate(category.measurementMethod === "object" ? "objects" : "calculator", category.id)} />;
  else if (activeView === "variables") content = <CategoryVariables categories={store.categories} updateCategory={store.updateCategory} updateCategoryVariable={store.updateCategoryVariable} addCategoryVariable={store.addCategoryVariable} deleteCategoryVariable={store.deleteCategoryVariable} reorderCategoryVariable={store.reorderCategoryVariable} />;
  else if (activeView === "calculator") content = <MeasurementCalculator key={initialCategoryId || "default"} categories={store.categories} updateCategory={store.updateCategory} initialCategoryId={initialCategoryId} />;
  else if (activeView === "objects") content = <ObjectInventory key={initialCategoryId || "objects"} categories={store.categories} inventoryItems={store.inventoryItems} addInventoryItem={store.addInventoryItem} updateInventoryItem={store.updateInventoryItem} deleteInventoryItem={store.deleteInventoryItem} initialCategoryId={initialCategoryId} />;
  else if (activeView === "lots") content = <LotBuilder categories={store.categories} lots={store.lots} inventoryItems={store.inventoryItems} addLots={store.addLots} updateLot={store.updateLot} updateInventoryItem={store.updateInventoryItem} />;
  else if (activeView === "pricing") content = <PricingEditor categories={store.categories} updateCategory={store.updateCategory} />;
  else if (activeView === "exports") content = <ExportCenter categories={store.categories} lots={store.lots} inventoryItems={store.inventoryItems} resetData={store.resetData} />;
  else if (activeView === "checklist") content = <WarehouseChecklist />;
  else content = <PlaceholderView view={activeView} onNavigate={navigate} />;

  return <div className="app-shell">
    <Sidebar activeView={activeView} onNavigate={navigate} open={mobileNav} onClose={() => setMobileNav(false)} />
    {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <div className="workspace"><Topbar onMenu={() => setMobileNav(true)} onQuickAdd={() => navigate("lots")} search={search} setSearch={setSearch} results={results} onResult={chooseResult} /><main>{content}</main><footer><span>Lotwise: Janiak Warehouse Inventory</span><span>Estimates stay editable and clearly labeled</span></footer></div>
  </div>;
}
