function updateDetailPanel() {
  const panel = document.getElementById('detail-panel');
  if(!panel) return;
  if(!selectedElement) { panel.hidden = true; return; }
  const item = itemsOnCanvas.find(i => i.uuid === selectedElement.id);
  if(!item) { panel.hidden = true; return; }

  document.getElementById('detail-type').innerText = item.type;
  document.getElementById('detail-name').innerText = item.text;
  const retailerStr = item.retailer ? ` · ${item.retailer}` : '';
  document.getElementById('detail-meta').innerText =
    `$${item.numPrice.toLocaleString()} · ${item.dims}${retailerStr}`;

  const link = document.getElementById('detail-link');
  const hasUrl = item.url && item.url !== '#';
  link.href = hasUrl ? item.url : '#';
  link.style.display = hasUrl ? '' : 'none';

  panel.hidden = false;
}

function duplicateSelected() {
  if(!selectedElement) return;
  const item = itemsOnCanvas.find(i => i.uuid === selectedElement.id);
  if(!item) return;
  spawnItem(item.id, item.x + 18, item.y + 18, item.rot);
  renderSidebar(currentFilterMode);
  actionToast('Copy placed');
}

let actionToastTimer = null;
function actionToast(msg) {
  const el = document.getElementById('action-toast');
  if(!el) return;
  el.innerText = msg;
  el.hidden = false;
  el.classList.add('visible');
  clearTimeout(actionToastTimer);
  actionToastTimer = setTimeout(() => {
    el.classList.remove('visible');
    actionToastTimer = setTimeout(() => { el.hidden = true; }, 250);
  }, 1600);
}

function openHelp() {
  document.getElementById('help-modal').hidden = false;
}

function closeHelp() {
  document.getElementById('help-modal').hidden = true;
}

function helpIsOpen() {
  return !document.getElementById('help-modal').hidden;
}

function toggleCatalog(force) {
  const open = typeof force === 'boolean'
    ? document.body.classList.toggle('catalog-open', force)
    : document.body.classList.toggle('catalog-open');
  document.getElementById('catalog-toggle').setAttribute('aria-expanded', String(open));
}

function isMobileLayout() {
  return window.matchMedia('(max-width: 860px)').matches;
}

/* ── Zoom ── */
const ZOOM_MIN = 0.35, ZOOM_MAX = 2;

function setZoom(scale) {
  viewScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale));
  applyCanvasDims();
}

function zoomIn() { setZoom(viewScale + 0.15); }
function zoomOut() { setZoom(viewScale - 0.15); }

function fitZoom() {
  const scroll = document.getElementById('canvas-scroll');
  const style = getComputedStyle(scroll);
  const availW = scroll.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const availH = scroll.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  if(availW <= 0 || availH <= 0 || !canvasW || !canvasH) return;
  setZoom(Math.min(availW / canvasW, availH / canvasH, 1));
}

function autoFitForViewport() {
  const scroll = document.getElementById('canvas-scroll');
  if(scroll.clientWidth && canvasW * viewScale > scroll.clientWidth) fitZoom();
}

function startBudgetEdit() {
  const btn = document.getElementById('budget-edit');
  if(btn.querySelector('input')) return;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.step = '50';
  input.value = budget;
  input.setAttribute('aria-label', 'Budget in dollars');
  btn.innerHTML = '$';
  btn.appendChild(input);
  input.focus();
  input.select();

  const commit = () => {
    const val = parseInt(input.value, 10);
    if(val && val > 0) {
      budget = val;
      saveState();
      actionToast(`Budget set to $${budget.toLocaleString()}`);
    }
    restoreBudgetButton();
  };
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if(e.key === 'Enter') commit();
    if(e.key === 'Escape') restoreBudgetButton();
  });
  input.addEventListener('blur', commit);
}

function restoreBudgetButton() {
  const btn = document.getElementById('budget-edit');
  btn.innerHTML = `$${budget.toLocaleString()} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`;
  updateBudget();
}

function installUIHandlers() {
  document.getElementById('budget-edit').addEventListener('click', startBudgetEdit);

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderSidebar(currentFilterMode);
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderSidebar(currentFilterMode);
  });

  const csvReload = document.getElementById('csv-reload');
  if(csvReload) {
    csvReload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if(!file) return;
      Papa.parse(file, { header: true, skipEmptyLines: true, complete: processCSV });
      actionToast('Catalog replaced');
    });
  }

  document.getElementById('help-modal').addEventListener('click', (e) => {
    if(e.target === e.currentTarget) closeHelp();
  });
}
