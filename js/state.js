const STORAGE_KEY = 'furniture-planner-v5';
const DEFAULT_BG = 'assets/Layout.png';
const DEFAULT_PPI = 1.68;
const DEFAULT_CANVAS_W = 843;
const DEFAULT_CANVAS_H = 705;
const HISTORY_CAP = 30;

let PPI = DEFAULT_PPI;
let currentBgUrl = DEFAULT_BG;
let canvasW = DEFAULT_CANVAS_W;
let canvasH = DEFAULT_CANVAS_H;

let masterLibrary = [];
let itemsOnCanvas = [];
let uniqueCounter = 0;
let currentFilterMode = 0;
let layouts = {};
let plans = [];

let history = [];

let dragElement = null;
let selectedElement = null;
let offsetX = 0, offsetY = 0;
let dragStartSnapshot = null;

let calibrating = false;
let calibPoints = [];

const typeIcon = { 'Sectional': '🛋️', 'Couch': '🛋️', 'Futon': '🛋️', 'TV Stand': '📺', 'Table': '☕', 'Dining': '🍽️', 'Desk': '💻', 'Bed': '🛏️', 'Wardrobe': '🚪', 'Rug': '🔲' };
const planColors = [
  ['#a9a9a9', '#d2b48c', '#deb887', '#ffdead', '#cd853f'],
  ['#6c7a89', '#8d6e63', '#8d6e63', '#5d4037', '#b0bec5'],
  ['#d7ccc8', '#3e2723', '#e0e0e0', '#795548', '#424242'],
  ['#f5f0e6', '#c9b89a', '#e8dcc4', '#b8a082', '#8b7355'],
  ['#e8eef2', '#b5c7d6', '#d4d9dc', '#9fa8b0', '#6a7580'],
  ['#4a3c2e', '#8b6f47', '#2f2a24', '#5c4a36', '#c9a97a']
];

function showToast(msg) {
  const t = document.getElementById('toast');
  if(t) t.innerText = msg;
}

function saveState() {
  try {
    const snapshot = JSON.parse(JSON.stringify(layouts));
    snapshot[String(currentFilterMode)] = JSON.parse(JSON.stringify(itemsOnCanvas));
    const payload = { itemsOnCanvas, layouts: snapshot, PPI, currentBgUrl, canvasW, canvasH, currentFilterMode, uniqueCounter };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch(e) {}
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    const s = JSON.parse(raw);
    if(!Array.isArray(s.itemsOnCanvas)) return false;
    const validIds = new Set(masterLibrary.map(i => i.id));
    itemsOnCanvas = s.itemsOnCanvas.filter(i => validIds.has(i.id));
    layouts = {};
    if(s.layouts && typeof s.layouts === 'object') {
      Object.keys(s.layouts).forEach(k => {
        layouts[k] = (s.layouts[k] || []).filter(i => validIds.has(i.id));
      });
    }
    PPI = s.PPI || DEFAULT_PPI;
    currentBgUrl = s.currentBgUrl || DEFAULT_BG;
    canvasW = s.canvasW || DEFAULT_CANVAS_W;
    canvasH = s.canvasH || DEFAULT_CANVAS_H;
    currentFilterMode = (typeof s.currentFilterMode === 'number') ? s.currentFilterMode : 0;
    uniqueCounter = s.uniqueCounter || itemsOnCanvas.length;
    return true;
  } catch(e) { return false; }
}
