function renderSidebar(filterMode) {
  currentFilterMode = filterMode;
  const list = document.getElementById('item-list');
  list.innerHTML = '';

  const viewItems = filterMode === -1 ? masterLibrary : masterLibrary.filter(i => i.plan === filterMode);

  viewItems.forEach(item => {
    const instances = itemsOnCanvas.filter(i => i.id === item.id);
    const isAdded = instances.length > 0;

    const card = document.createElement('div');
    card.className = 'item-card' + (isAdded ? ' added' : '');
    card.id = 'card-' + item.id;

    card.onclick = () => {
      const spawned = itemsOnCanvas.find(i => i.id === item.id);
      if(spawned) selectItem(spawned.uuid);
    };

    if(instances.length > 1) {
      const badge = document.createElement('div');
      badge.className = 'count-badge';
      badge.innerText = '×' + instances.length;
      card.appendChild(badge);
    }

    const imgDiv = document.createElement('div');
    imgDiv.className = 'item-image';
    if(item.img && item.img.trim().length > 5) imgDiv.style.backgroundImage = `url('${item.img}')`;
    else { imgDiv.style.backgroundColor = item.c; imgDiv.innerText = item.icon; }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';

    const metaStr = `<div class="item-meta">${item.type} <a class="external-link" href="${item.url}" target="_blank" title="${item.retailer}" onclick="event.stopPropagation()">[↗ Link]</a></div>`;
    const titleStr = `<h3 class="item-title">${item.text}</h3>`;
    const dimStr = `<div class="item-dims">${item.dims}</div>`;

    const bottomDiv = document.createElement('div');
    bottomDiv.className = 'item-bottom';
    bottomDiv.innerHTML = `<div class="item-price">$${item.numPrice}</div>`;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn ' + (isAdded ? 'remove' : 'add');
    toggleBtn.innerText = isAdded ? '✓ On Floor' : '+ Add';
    toggleBtn.onclick = (e) => { e.stopPropagation(); toggleItem(item.id); };
    bottomDiv.appendChild(toggleBtn);

    if(isAdded) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerText = '+1';
      copyBtn.title = 'Add another copy';
      copyBtn.onclick = (e) => { e.stopPropagation(); addCopy(item.id); };
      bottomDiv.appendChild(copyBtn);
    }

    infoDiv.innerHTML = metaStr + titleStr + dimStr;
    infoDiv.appendChild(bottomDiv);

    card.appendChild(imgDiv);
    card.appendChild(infoDiv);
    list.appendChild(card);
  });
  updateBudget();
}
