function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Status,Type,Product Name,Dimensions,Cost,Link\r\n";
  const added = new Set(itemsOnCanvas.map(i => i.id));
  itemsOnCanvas.forEach(item => {
    csvContent += `"ADDED","${item.type}","${item.text}","${item.dims}",$${item.numPrice},"${item.url}"\r\n`;
  });
  masterLibrary.filter(i => !added.has(i.id)).forEach(item => {
    csvContent += `"NOT_ADDED","${item.type}","${item.text}","${item.dims}",$${item.numPrice},"${item.url}"\r\n`;
  });
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "apartment_layout_bom.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadCSVTemplate() {
  const rows = [
    'PlanID,Style,Room,Item Type,Product Name,Retailer,Price,Link,Width,Depth,ImageURL',
    '0,My Style,Living Room,Sectional Couch,Example Sofa,Example Retailer,599,https://example.com/product,85,40,https://example.com/image.jpg',
    '0,My Style,Bedroom,Bed,Owned Bed,Existing,0,#,54,75,images/shared_bed.jpg'
  ];
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.join('\r\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', 'furniture_proposals_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveAsImage() {
  const c = document.createElement('canvas');
  const cont = document.getElementById('canvas-container');
  const W = cont.clientWidth, H = cont.clientHeight; c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = "white"; ctx.fillRect(0, 0, W, H);

  const bg = new Image(); bg.crossOrigin = "Anonymous";
  bg.onload = () => {
    ctx.drawImage(bg, 0, 0, W, H);
    itemsOnCanvas.forEach(item => {
      const w = item.inW * PPI, h = item.inH * PPI;
      ctx.save(); ctx.translate(item.x + w/2, item.y + h/2); ctx.rotate(item.rot * Math.PI / 180);
      ctx.fillStyle = item.c; ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.lineWidth = 2;

      if(item.isL) {
        const legPx = (item.leg || 30) * PPI;
        ctx.fillRect(-w/2, -h/2, w, legPx); ctx.strokeRect(-w/2, -h/2, w, legPx);
        ctx.fillRect(-w/2, -h/2 + legPx, legPx, h - legPx); ctx.strokeRect(-w/2, -h/2 + legPx, legPx, h - legPx);
        ctx.fillRect(-w/2 + 2, -h/2 + legPx - 2, legPx - 4, 4);
      } else {
        ctx.fillRect(-w/2, -h/2, w, h); ctx.strokeRect(-w/2, -h/2, w, h);
      }

      const texts = item.type.split(" ")[0];
      ctx.font = "bold 13px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      let tx = 0, ty = 0;
      if(item.isL) { const legPx = (item.leg || 30) * PPI; tx = -w/2 + legPx/2; ty = -h/2 + legPx/2; }
      ctx.strokeStyle = "white"; ctx.lineWidth = 4; ctx.strokeText(texts, tx, ty);
      ctx.fillStyle = "black"; ctx.fillText(texts, tx, ty);
      ctx.restore();
    });

    const link = document.createElement('a'); link.download = 'My_Custom_Apartment_Plan.png';
    link.href = c.toDataURL('image/png'); link.click();
  };
  bg.src = currentBgUrl;
}
