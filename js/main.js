async function autoLoadCSV() {
  try {
    const res = await fetch('data/furniture_proposals.csv');
    if (!res.ok) return;
    const text = await res.text();
    Papa.parse(text, { header: true, skipEmptyLines: true, complete: processCSV });
  } catch(e) {
    // Running from file:// or file missing — leave manual picker visible
  }
}

document.getElementById('csv-file').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if(!file) return;
  Papa.parse(file, { header: true, skipEmptyLines: true, complete: processCSV });
});

window.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select';

  if((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); return; }
  if(e.key === 'Escape') {
    if(helpIsOpen()) { closeHelp(); return; }
    if(calibrating) { toggleCalibration(); return; }
    if(!typing && selectedElement) { selectItem(null); return; }
  }
  if(typing) return;
  if(e.key === '?') { openHelp(); return; }
  if(selectedElement) {
    if(e.key === 'r' || e.key === 'R') rotateSelected();
    if(e.key === 'd' || e.key === 'D') duplicateSelected();
    if(e.key === 'Backspace' || e.key === 'Delete') deleteSelected();
  }
});

installDragHandlers();
installBackgroundHandlers();
installUIHandlers();
autoLoadCSV();
