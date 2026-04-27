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
  if((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); return; }
  if(e.key === 'Escape' && calibrating) { toggleCalibration(); return; }
  if(selectedElement) {
    if(e.key === 'r' || e.key === 'R') rotateSelected();
    if(e.key === 'Backspace' || e.key === 'Delete') deleteSelected();
  }
});

installDragHandlers();
installBackgroundHandlers();
autoLoadCSV();
