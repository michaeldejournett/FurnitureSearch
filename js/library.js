function determineType(typeStr) {
  if(!typeStr) return 'Item';
  const s = typeStr.toLowerCase();
  if(s.includes('desk')) return 'Desk';
  if(s.includes('sectional')) return 'Sectional';
  if(s.includes('futon')) return 'Futon';
  if(s.includes('tv') || s.includes('console')) return 'TV Stand';
  if(s.includes('dining')) return 'Dining';
  if(s.includes('table')) return 'Table';
  if(s.includes('bed')) return 'Bed';
  if(s.includes('wardrobe')) return 'Wardrobe';
  if(s.includes('rug')) return 'Rug';
  return typeStr.split(" ")[0] || 'Item';
}

function processCSV(results) {
  masterLibrary = [];
  const rows = results.data;

  rows.forEach((row, idx) => {
    if(!row.Price || !row["Item Type"]) return;

    let w = parseFloat(row.Width) || 50;
    let d = parseFloat(row.Depth) || 50;
    let pID = parseInt(row.PlanID) || 0;
    let price = parseFloat(row.Price.toString().replace(/[^0-9.]/g, '')) || 0;
    let tStr = row["Item Type"] || "";
    let cleanType = determineType(tStr);

    let isL = false, leg = 30;
    if(cleanType === 'Sectional' && w > d) { isL = true; leg = 35; }
    if((cleanType === 'Desk' || tStr.toLowerCase().includes('l-shaped')) && w >= 55) { isL = true; leg = 24; }

    let c = planColors[pID % planColors.length][idx % 5] || '#cccccc';

    // Keep ImageURL paths pointing to the relocated assets/ folder transparently.
    let img = row.ImageURL || null;
    if(img && img.startsWith('images/')) img = 'assets/' + img;

    masterLibrary.push({
      id: 'db_' + idx,
      plan: pID,
      type: cleanType,
      text: row["Product Name"] || "Unknown Item",
      retailer: row.Retailer,
      numPrice: price,
      dims: `${w}"W x ${d}"D`,
      inW: w, inH: d,
      isL, leg,
      icon: typeIcon[cleanType] || '📦',
      c,
      defX: 200 + (Math.random() * 200),
      defY: 200 + (Math.random() * 200),
      url: row.Link || "#",
      img
    });
  });

  document.getElementById('db-loader').style.display = 'none';
  document.getElementById('nav-controls').style.display = 'flex';
  document.getElementById('action-bar').style.display = 'grid';

  if(!restoreState()) {
    loadPreset(0);
  } else {
    applyCanvasDims();
    renderCanvasItems();
    renderSidebar(currentFilterMode);
    updateNavActive();
  }
}

function updateBudget() {
  const tracker = document.getElementById('budget-tracker');
  const sum = itemsOnCanvas.reduce((a, o) => a + o.numPrice, 0);
  tracker.innerText = `Total: $${sum.toLocaleString()} / $4,500`;
  tracker.classList.toggle('over', sum > 4500);

  const countEl = document.getElementById('count-tracker');
  const uniqueAdded = new Set(itemsOnCanvas.map(i => i.id)).size;
  countEl.innerText = `Added ${uniqueAdded} / ${masterLibrary.length}`;
}
