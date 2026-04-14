function installBackgroundHandlers() {
  document.getElementById('bg-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      const img = new Image();
      img.onload = () => {
        const natW = img.naturalWidth, natH = img.naturalHeight;
        const MAX_PX = 900;
        const fit = MAX_PX / Math.max(natW, natH);
        const newW = natW * fit, newH = natH * fit;

        const ratioW = newW / canvasW, ratioH = newH / canvasH;
        itemsOnCanvas.forEach(it => { it.x *= ratioW; it.y *= ratioH; });

        currentBgUrl = dataUrl;
        canvasW = newW;
        canvasH = newH;
        PPI = DEFAULT_PPI;
        applyCanvasDims();
        renderCanvasItems();
        saveState();
        showToast('Image loaded. Click 📏 Calibrate and mark two points on a known wall to set scale.');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });

  const container = document.getElementById('canvas-container');
  container.addEventListener('click', (e) => {
    if(!calibrating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    calibPoints.push({ x, y });
    const svg = ensureCalibSvg();
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 5);
    svg.appendChild(dot);
    if(calibPoints.length === 2) finishCalibration();
  });

  container.addEventListener('mousemove', (e) => {
    if(!calibrating || calibPoints.length !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const svg = ensureCalibSvg();
    let line = svg.querySelector('line.rubber');
    if(!line) {
      line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('rubber');
      svg.appendChild(line);
    }
    line.setAttribute('x1', calibPoints[0].x); line.setAttribute('y1', calibPoints[0].y);
    line.setAttribute('x2', x); line.setAttribute('y2', y);
  });
}

function clearBackground() {
  if(!confirm('Restore default background (Layout.png) and scale?')) return;
  const ratio = DEFAULT_PPI / PPI;
  itemsOnCanvas.forEach(it => { it.x *= ratio; it.y *= ratio; });
  currentBgUrl = DEFAULT_BG;
  canvasW = DEFAULT_CANVAS_W;
  canvasH = DEFAULT_CANVAS_H;
  PPI = DEFAULT_PPI;
  document.getElementById('bg-file').value = '';
  applyCanvasDims();
  renderCanvasItems();
  saveState();
  showToast('Background restored to default.');
}

function toggleCalibration() {
  calibrating = !calibrating;
  const btn = document.getElementById('btn-calibrate');
  const container = document.getElementById('canvas-container');
  calibPoints = [];
  clearCalibSvg();
  if(calibrating) {
    btn.classList.add('active');
    btn.innerText = '✕ Cancel calibration (Esc)';
    container.classList.add('calibrating');
    showToast('Click point 1 on a wall, then point 2 at the other end.');
  } else {
    btn.classList.remove('active');
    btn.innerText = '📏 Calibrate: click two points on a wall';
    container.classList.remove('calibrating');
    showToast('Drag to move • Click to select • R to rotate • Backspace to delete • Ctrl+Z to undo');
  }
}

function ensureCalibSvg() {
  let svg = document.getElementById('calibration-svg');
  if(!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'calibration-svg';
    document.getElementById('canvas-container').appendChild(svg);
  }
  return svg;
}

function clearCalibSvg() {
  const svg = document.getElementById('calibration-svg');
  if(svg) svg.remove();
}

function parseLengthToInches(s) {
  if(!s) return null;
  s = s.trim().toLowerCase();
  let m = s.match(/^(\d+(?:\.\d+)?)\s*['’]\s*(\d+(?:\.\d+)?)?\s*["”]?$/);
  if(m) return parseFloat(m[1]) * 12 + (m[2] ? parseFloat(m[2]) : 0);
  m = s.match(/^(\d+(?:\.\d+)?)\s*(ft|feet|f)$/);
  if(m) return parseFloat(m[1]) * 12;
  m = s.match(/^(\d+(?:\.\d+)?)\s*(in|inches|i|")$/);
  if(m) return parseFloat(m[1]);
  m = s.match(/^(\d+(?:\.\d+)?)$/);
  if(m) return parseFloat(m[1]) * 12;
  return null;
}

function finishCalibration() {
  const p1 = calibPoints[0], p2 = calibPoints[1];
  const pxDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const input = prompt(`Wall length?  (e.g. 13'4"  or  13.5ft  or  162in)\nPixel distance: ${pxDist.toFixed(1)}px`);
  if(!input) { toggleCalibration(); return; }
  const inches = parseLengthToInches(input);
  if(!inches || inches <= 0) { alert('Could not parse length. Try e.g. 13\'4", 13.5ft, 162in.'); toggleCalibration(); return; }

  const newPPI = pxDist / inches;
  const ratio = newPPI / PPI;
  itemsOnCanvas.forEach(it => { it.x *= ratio; it.y *= ratio; });
  canvasW *= ratio;
  canvasH *= ratio;
  PPI = newPPI;

  applyCanvasDims();
  renderCanvasItems();
  clearCalibSvg();
  toggleCalibration();
  saveState();
  showToast(`Calibrated: ${inches.toFixed(1)}" = ${pxDist.toFixed(1)}px → PPI ${PPI.toFixed(3)}`);
}
