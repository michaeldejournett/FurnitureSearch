function getFilteredItems() {
  let items = currentFilterMode === -1
    ? [...masterLibrary]
    : masterLibrary.filter(i => i.plan === currentFilterMode);

  const q = searchQuery.trim().toLowerCase();
  if(q) {
    items = items.filter(i =>
      [i.text, i.type, i.retailer, i.room].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }
  if(roomFilter !== 'All') items = items.filter(i => i.room === roomFilter);

  switch(sortMode) {
    case 'price-asc': items.sort((a, b) => a.numPrice - b.numPrice); break;
    case 'price-desc': items.sort((a, b) => b.numPrice - a.numPrice); break;
    case 'name': items.sort((a, b) => a.text.localeCompare(b.text)); break;
    case 'size': items.sort((a, b) => (b.inW * b.inH) - (a.inW * a.inH)); break;
  }
  return items;
}

function renderRoomChips() {
  const wrap = document.getElementById('room-chips');
  wrap.innerHTML = '';
  const rooms = ['All', ...new Set(masterLibrary.map(i => i.room).filter(Boolean))];
  if(!rooms.includes(roomFilter)) roomFilter = 'All';
  rooms.forEach(room => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (roomFilter === room ? ' active' : '');
    chip.textContent = room;
    chip.onclick = () => {
      roomFilter = room;
      renderRoomChips();
      renderSidebar(currentFilterMode);
    };
    wrap.appendChild(chip);
  });
}

function renderSidebar(filterMode) {
  currentFilterMode = filterMode;
  const list = document.getElementById('item-list');
  list.innerHTML = '';

  const scopeItems = currentFilterMode === -1
    ? masterLibrary
    : masterLibrary.filter(i => i.plan === currentFilterMode);
  const viewItems = getFilteredItems();

  const countEl = document.getElementById('result-count');
  if(countEl) {
    countEl.innerText = viewItems.length === scopeItems.length
      ? `${scopeItems.length} items`
      : `${viewItems.length} of ${scopeItems.length}`;
  }

  if(viewItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<p>No furniture matches your search.</p>';
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear search & filters';
    clearBtn.onclick = () => {
      searchQuery = '';
      roomFilter = 'All';
      const input = document.getElementById('search-input');
      if(input) input.value = '';
      renderRoomChips();
      renderSidebar(currentFilterMode);
    };
    empty.appendChild(clearBtn);
    list.appendChild(empty);
    updateBudget();
    return;
  }

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

    const retailerStr = item.retailer ? ` · ${item.retailer}` : '';
    const metaStr = `<div class="item-meta">${item.type}${retailerStr} <a class="external-link" href="${item.url}" target="_blank" rel="noopener noreferrer" title="Open product page" onclick="event.stopPropagation()">↗</a></div>`;
    const titleStr = `<h2 class="item-title">${item.text}</h2>`;
    const dimStr = `<div class="item-dims">${item.dims} · ${item.room}</div>`;

    const bottomDiv = document.createElement('div');
    bottomDiv.className = 'item-bottom';
    bottomDiv.innerHTML = `<div class="item-price">$${item.numPrice.toLocaleString()}</div>`;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn ' + (isAdded ? 'remove' : 'add');
    toggleBtn.innerText = isAdded ? '✓ On floor' : '+ Add';
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      toggleItem(item.id);
      if(!isAdded && isMobileLayout()) {
        toggleCatalog(false);
        actionToast(`${item.text} added to floor`);
      }
    };
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
