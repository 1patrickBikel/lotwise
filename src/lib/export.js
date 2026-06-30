function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportJson(categories, lots, inventoryItems = []) {
  download(
    `warehouse-inventory-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ schemaVersion: 2, exportedAt: new Date().toISOString(), categories, lots, inventoryItems }, null, 2),
    "application/json",
  );
}

export function exportCsv(categories, lots) {
  const header = ["lot_id", "category", "curation", "quantity", "price", "unit_price", "status", "location"];
  const rows = lots.map((lot) => {
    const category = categories.find((item) => item.id === lot.categoryId);
    return [
      lot.lotCode,
      category?.name || "",
      lot.curation,
      lot.quantity,
      lot.price,
      lot.quantity ? (lot.price / lot.quantity).toFixed(4) : 0,
      lot.status,
      category?.storageLocation || "",
    ];
  });
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  download(`warehouse-lots-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv");
}
