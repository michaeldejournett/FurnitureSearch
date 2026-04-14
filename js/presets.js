function updateNavActive() {
  const btns = document.querySelectorAll('#nav-controls button');
  btns.forEach((b, i) => {
    if(i < 3) b.className = (currentFilterMode === i) ? 'active' : '';
    else b.className = (currentFilterMode === -1) ? 'btn-custom active' : 'btn-custom';
  });
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
