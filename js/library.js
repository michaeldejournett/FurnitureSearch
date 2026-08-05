function determineType(typeStr) {
  if(!typeStr) return 'Item';
  const s = typeStr.toLowerCase();
  if(s.includes('desk')) return 'Desk';
  if(s.includes('sectional')) return 'Sectional';
  if(s.includes('futon')) return 'Futon';
  if(s.includes('tv') || s.includes('console')) return 'TV Stand';
  if(s.includes('dining')) return 'Dining';
  if(s.includes('table')) return 'Table';
  if(s.includes('mattress')) return 'Mattress';
  if(s.includes('foundation') || s.includes('platform')) return 'Bed Foundation';
  if(s.includes('frame') || s.includes('panel bed') || s.includes('bed frame')) return 'Bed Frame';
  if(s.includes('bed')) return 'Bed';
  if(s.includes('wardrobe')) return 'Wardrobe';
  if(s.includes('rug')) return 'Rug';
  return typeStr.split(" ")[0] || 'Item';
}

function renderNavControls() {
  const nav = document.getElementById('nav-controls');
  nav.innerHTML = '';
  plans.forEach(p => {
    const b = document.createElement('button');
    b.id = 'btn-' + p.id;
    b.textContent = p.label;
    b.onclick = () => loadPreset(p.id);
    nav.appendChild(b);
  });
  const cust = document.createElement('button');
  cust.id = 'btn-cust';
  cust.textContent = 'Custom build';
  cust.onclick = openCustom;
  nav.appendChild(cust);
}

function processCSV(results) {
  masterLibrary = [];
  plans = [];
  const rows = results.data;
  const planLabels = {};

  rows.forEach((row, idx) => {
    if(!row.Price || !row["Item Type"]) return;
    const pID = parseInt(row.PlanID) || 0;
    if(!(pID in planLabels)) {
      const style = (row.Style || '').trim();
      planLabels[pID] = style || ('Plan ' + (pID + 1));
    }

    let w = parseFloat(row.Width) || 50;
    let d = parseFloat(row.Depth) || 50;
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
      room: (row.Room || '').trim() || 'Other',
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

  plans = Object.keys(planLabels)
    .map(k => parseInt(k, 10))
    .sort((a, b) => a - b)
    .map(id => ({ id, label: planLabels[id] }));

  if(plans.length === 0) {
    const loader = document.getElementById('db-loader');
    loader.innerHTML = '<strong>⚠️ No valid rows found.</strong><br/>Make sure your CSV has PlanID, Item Type, and Price columns. <a href="#" onclick="downloadCSVTemplate(); return false;">Download a template</a>.';
    return;
  }

  renderNavControls();
  renderRoomChips();
  document.getElementById('db-loader').style.display = 'none';
  document.getElementById('nav-controls').style.display = 'flex';
  document.getElementById('action-bar').style.display = 'flex';

  const validIds = new Set(plans.map(p => p.id));
  if(!restoreState() || !validIds.has(currentFilterMode) && currentFilterMode !== -1) {
    applyCanvasDims();
    loadPreset(plans[0].id);
  } else {
    applyCanvasDims();
    renderCanvasItems();
    renderSidebar(currentFilterMode);
    updateNavActive();
  }
  autoFitForViewport();
}

function updateBudget() {
  const tracker = document.getElementById('budget-tracker');
  const sum = itemsOnCanvas.reduce((a, o) => a + o.numPrice, 0);
  tracker.innerText = `$${sum.toLocaleString()} of $${budget.toLocaleString()}`;
  tracker.classList.toggle('over', sum > budget);

  const fill = document.getElementById('budget-fill');
  const pct = budget > 0 ? Math.min(100, (sum / budget) * 100) : 100;
  fill.style.width = pct + '%';
  fill.className = sum > budget ? 'over' : (sum > budget * 0.85 ? 'warn' : '');

  const editBtn = document.getElementById('budget-edit');
  if(editBtn && !editBtn.querySelector('input')) {
    editBtn.childNodes[0].textContent = `$${budget.toLocaleString()} `;
  }

  const countEl = document.getElementById('count-tracker');
  countEl.innerText = `${itemsOnCanvas.length} item${itemsOnCanvas.length === 1 ? '' : 's'} placed`;
}
