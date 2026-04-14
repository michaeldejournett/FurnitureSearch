function selectItem(uuid) {
  if (selectedElement) {
    selectedElement.classList.remove('selected');
    document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
  }
  selectedElement = uuid ? document.getElementById(uuid) : null;
  if(selectedElement) {
    selectedElement.classList.add('selected');
    const isRug = selectedElement.innerText.toLowerCase().includes('rug');
    if(!isRug) {
      selectedElement.style.zIndex = Array.from(document.querySelectorAll('.furniture'))
        .map(f => parseInt(f.style.zIndex || '10'))
        .reduce((a, b) => Math.max(a, b), 10) + 1;
    }
    const baseId = selectedElement.dataset.baseid;
    const card = document.getElementById('card-' + baseId);
    if(card) { card.classList.add('selected'); card.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  }
}

function spawnItem(baseId, x, y, rotation, skipHistory) {
  const template = masterLibrary.find(i => i.id === baseId);
  if(!template) return null;
  if(!skipHistory) pushHistory();
  const uuid = 'furn-' + uniqueCounter++;
  let cx, cy;
  if(x !== undefined && y !== undefined) { cx = x; cy = y; }
  else {
    const pxW = template.inW * PPI, pxH = template.inH * PPI;
    cx = Math.max(0, (canvasW - pxW) / 2);
    cy = Math.max(0, (canvasH - pxH) / 2);
  }
  const itemState = { ...template, uuid, x: cx, y: cy, rot: rotation || 0 };
  itemsOnCanvas.push(itemState);
  renderCanvasItems();
  selectItem(uuid);
  saveState();
  return uuid;
}

function toggleItem(baseId) {
  const existing = itemsOnCanvas.filter(i => i.id === baseId);
  pushHistory();
  if(existing.length > 0) {
    itemsOnCanvas = itemsOnCanvas.filter(i => i.id !== baseId);
    selectedElement = null;
    renderCanvasItems();
    renderSidebar(currentFilterMode);
    saveState();
  } else {
    spawnItem(baseId, undefined, undefined, 0, true);
    renderSidebar(currentFilterMode);
  }
}

function addCopy(baseId) {
  spawnItem(baseId, undefined, undefined, 0);
  renderSidebar(currentFilterMode);
}

function deleteSelected() {
  if(!selectedElement) return;
  pushHistory();
  const uuid = selectedElement.id;
  itemsOnCanvas = itemsOnCanvas.filter(i => i.uuid !== uuid);
  selectedElement = null;
  renderCanvasItems();
  renderSidebar(currentFilterMode);
  saveState();
}

function rotateSelected() {
  if(!selectedElement) return;
  pushHistory();
  const item = itemsOnCanvas.find(i => i.uuid === selectedElement.id);
  if(item) {
    item.rot = (item.rot + 90) % 360;
    selectedElement.dataset.rotation = item.rot;
    selectedElement.style.transform = `rotate(${item.rot}deg)`;
    saveState();
  }
}

function applyCanvasDims() {
  const container = document.getElementById('canvas-container');
  container.style.width = canvasW + 'px';
  container.style.height = canvasH + 'px';
  container.style.backgroundImage = `url("${currentBgUrl}")`;
  container.style.backgroundSize = '100% 100%';
  document.getElementById('bg-status').innerText = `PPI ${PPI.toFixed(3)} • Canvas ${Math.round(canvasW)}×${Math.round(canvasH)}px`;
}

function renderCanvasItems() {
  const canvas = document.getElementById('canvas-container');
  canvas.innerHTML = '';

  let oldSelFound = false;

  itemsOnCanvas.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'furniture';
    el.id = item.uuid;
    el.dataset.baseid = item.id;

    const pxW = item.inW * PPI;
    const pxH = item.inH * PPI;
    el.style.width = pxW + 'px';
    el.style.height = pxH + 'px';
    el.style.left = item.x + 'px';
    el.style.top = item.y + 'px';
    el.style.zIndex = item.type.toLowerCase().includes('rug') ? "1" : "10";
    el.dataset.rotation = item.rot;
    el.style.transform = `rotate(${item.rot}deg)`;

    const label = document.createElement('div');
    label.className = 'label';
    label.innerText = item.type;

    if(item.isL) {
      const legPx = (item.leg || 30) * PPI;
      const topBlock = document.createElement('div');
      topBlock.className = 'solid-block';
      topBlock.style.backgroundColor = item.c;
      topBlock.style.width = '100%'; topBlock.style.height = legPx + 'px';
      topBlock.style.top = '0'; topBlock.style.left = '0';

      const sideBlock = document.createElement('div');
      sideBlock.className = 'solid-block';
      sideBlock.style.backgroundColor = item.c;
      sideBlock.style.width = legPx + 'px'; sideBlock.style.height = (pxH - legPx) + 'px';
      sideBlock.style.top = legPx + 'px'; sideBlock.style.left = '0';
      sideBlock.style.borderTop = 'none';

      el.appendChild(topBlock); el.appendChild(sideBlock);

      label.classList.add('l-label');
      label.style.top = (legPx / 2) + "px"; label.style.left = (legPx / 2) + "px";
    } else {
      const block = document.createElement('div');
      block.className = 'solid-block';
      block.style.backgroundColor = item.c;
      block.style.width = '100%'; block.style.height = '100%';
      el.appendChild(block);
    }

    el.appendChild(label);

    el.addEventListener('mousedown', (e) => {
      if(calibrating) return;
      dragElement = el;
      dragStartSnapshot = JSON.stringify(itemsOnCanvas);
      offsetX = e.clientX - el.getBoundingClientRect().left;
      offsetY = e.clientY - el.getBoundingClientRect().top;
      selectItem(item.uuid);
      e.stopPropagation();
    });

    canvas.appendChild(el);
    if(selectedElement && selectedElement.id === item.uuid) {
      oldSelFound = true; el.classList.add('selected');
    }
  });
  if(!oldSelFound) selectedElement = null;
  updateBudget();
}

function installDragHandlers() {
  document.addEventListener('mousemove', (e) => {
    if (!dragElement) return;
    const cCont = document.getElementById('canvas-container').getBoundingClientRect();
    let x = e.clientX - cCont.left - offsetX;
    let y = e.clientY - cCont.top - offsetY;
    dragElement.style.left = x + 'px'; dragElement.style.top = y + 'px';
    const item = itemsOnCanvas.find(i => i.uuid === dragElement.id);
    if(item) { item.x = x; item.y = y; }
  });
  document.addEventListener('mouseup', () => {
    if(dragElement) {
      if(dragStartSnapshot) {
        const before = dragStartSnapshot;
        const after = JSON.stringify(itemsOnCanvas);
        if(before !== after) { history.push(before); if(history.length > HISTORY_CAP) history.shift(); }
        dragStartSnapshot = null;
      }
      dragElement = null;
      saveState();
    }
  });
  document.getElementById('main').addEventListener('mousedown', () => { if(!calibrating) selectItem(null); });
}
