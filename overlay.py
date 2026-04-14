from PIL import Image, ImageDraw

def draw_overlay(config, output_filename):
    base_img = Image.open('Layout.png').convert('RGBA')
    overlay = Image.new('RGBA', base_img.size, (255, 255, 255, 0))
    d = ImageDraw.Draw(overlay)
    
    def r(x, y, w, h, fill, opacity=180, label=""):
        fill = fill.lstrip('#')
        rgb = tuple(int(fill[i:i+2], 16) for i in (0, 2, 4))
        rgba = rgb + (opacity,)
        d.rectangle([x, y, x+w, y+h], fill=rgba, outline=(0,0,0,255), width=2)
    
    # Living Room (Top Left Quadrant)
    # TV on the left-side wall
    r(135, 230, 20, 80, config['tv'], label="TV")
    
    # Sectional (Floating in middle, facing TV on left)
    r(220, 210, 45, 120, config['couch'], label="Sofa")
    r(220, 290, 80, 40, config['couch']) # Chaise element
    
    # Coffee table between them
    r(170, 250, 35, 50, config['coffee'])
    
    # Dining Table (Right behind the Sectional)
    r(370, 210, 60, 90, config['dining'], label="Dining")
    
    # Bedroom 1 (Top Right Quadrant)
    # L-Desk in the top-right corner of the room
    r(650, 140, 70, 25, config['desk'])
    r(695, 140, 25, 70, config['desk'])
    
    out = Image.alpha_composite(base_img, overlay)
    out = out.convert('RGB')
    out.save(output_filename)

plans = [
    {"file": "layout_images/overlay_plan1.png", "cfg": {'couch': '#708090', 'tv': '#d2b48c', 'coffee': '#d2b48c', 'dining': '#deb887', 'desk': '#d2b48c'}},
    {"file": "layout_images/overlay_plan2.png", "cfg": {'couch': '#36454F', 'tv': '#3e2723', 'coffee': '#3e2723', 'dining': '#4e342e', 'desk': '#2f4f4f'}},
    {"file": "layout_images/overlay_plan3.png", "cfg": {'couch': '#8b4513', 'tv': '#1a1a1a', 'coffee': '#a9a9a9', 'dining': '#5d4037', 'desk': '#111111'}}
]

for p in plans:
    draw_overlay(p['cfg'], p['file'])
print("Overlays generated!")
