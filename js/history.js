function pushHistory() {
  history.push(JSON.stringify(itemsOnCanvas));
  if(history.length > HISTORY_CAP) history.shift();
}

function undo() {
  if(history.length === 0) return;
  const prev = history.pop();
  try { itemsOnCanvas = JSON.parse(prev); } catch(e) { return; }
  selectedElement = null;
  renderCanvasItems();
  renderSidebar(currentFilterMode);
  saveState();
}

function resetLayout() {
  if(!confirm('Clear all items from the floor?')) return;
  pushHistory();
  itemsOnCanvas = [];
  selectedElement = null;
  renderCanvasItems();
  renderSidebar(currentFilterMode);
  saveState();
}
