function updateNavActive() {
  plans.forEach(p => {
    const b = document.getElementById('btn-' + p.id);
    if(b) b.className = (currentFilterMode === p.id) ? 'active' : '';
  });
  const cust = document.getElementById('btn-cust');
  if(cust) cust.className = (currentFilterMode === -1) ? 'active' : '';
}

function stashCurrentLayout() {
  layouts[String(currentFilterMode)] = JSON.parse(JSON.stringify(itemsOnCanvas));
}

function loadPreset(index) {
  if(masterLibrary.length === 0) return;
  stashCurrentLayout();
  pushHistory();
  currentFilterMode = index;
  const saved = layouts[String(index)];
  if(saved && saved.length > 0) {
    itemsOnCanvas = JSON.parse(JSON.stringify(saved));
  } else {
    itemsOnCanvas = [];
    masterLibrary.filter(i => i.plan === index).forEach(i => {
      const uuid = 'furn-' + uniqueCounter++;
      itemsOnCanvas.push({ ...i, uuid, x: i.defX, y: i.defY, rot: 0 });
    });
  }
  renderCanvasItems();
  renderSidebar(index);
  updateNavActive();
  saveState();
}

function openCustom() {
  stashCurrentLayout();
  currentFilterMode = -1;
  const saved = layouts["-1"];
  itemsOnCanvas = saved ? JSON.parse(JSON.stringify(saved)) : [];
  updateNavActive();
  renderCanvasItems();
  renderSidebar(-1);
  selectItem(null);
  saveState();
}
