from PIL import Image, ImageDraw, ImageFont
import os

def draw_plan(name, filename, config):
    S = 18 # scale
    W, H = 950, 850
    img = Image.new('RGB', (W, H), color='white')
    draw = ImageDraw.Draw(img)
    
    # Try getting a basic font, fallback to default
    try:
        font = ImageFont.truetype("arial.ttf", 14)
        title_font = ImageFont.truetype("arial.ttf", 28)
    except IOError:
        font = ImageFont.load_default()
        title_font = ImageFont.load_default()

    def r(x_ft, y_ft, w_ft, h_ft, fill="#f4f4f4", label="", stroke="black", sw=3):
        x0, y0 = 50 + x_ft*S, 50 + y_ft*S
        x1, y1 = x0 + w_ft*S, y0 + h_ft*S
        draw.rectangle([x0, y0, x1, y1], fill=fill, outline=stroke, width=sw)
        if label:
            # Approximate text centering
            if hasattr(font, 'getbbox'):
                bbox = font.getbbox(label)
                tw = bbox[2] - bbox[0]
                th = bbox[3] - bbox[1]
            else:
                tw = len(label) * 6
                th = 10
            draw.text((x0 + (w_ft*S - tw)/2, y0 + (h_ft*S - th)/2), label, fill="black", font=font)

    # Architectural boundaries
    r(0, 5, 28, 20, "#e0e0e0", "Living/Dining Room")
    r(28, 5, 10, 12, "#ffe4e1", "Kitchen")
    r(38, 2, 13, 14, "#e0e0e0", "Bedroom 1")
    r(38, 16, 13, 7, "#e6f2ff", "Bath 1 & Closet")
    r(0, 27, 14, 13, "#e0e0e0", "Bedroom 2")
    r(14, 27, 8, 8, "#e6f2ff", "Bath 2")
    r(24, 27, 14, 13, "#f4f4f4", "Entry & Hallway")
    
    # Fixed Apartment Fixtures
    r(36, 5, 2, 8, "#aaaaaa", "")
    r(31, 6, 2.5, 5, "#333333", "")
    r(41, 2, 6.5, 6.5, "#ffeca8", "Existing Bed")
    r(39, 14.5, 5, 1.5, "#d3d3d3", "Wardrobe")
    
    # Proposed Furniture
    r(48, 2, 3, 5.5, config['desk_color'], "L-Desk", sw=1)
    r(46.5, 2, 1.5, 2.5, config['desk_color'], "", sw=1)
    r(0.5, 10, 1.5, 6, config['tv_color'], "TV Stand", sw=1)
    r(8, 10, 3, 7, config['couch_color'], "Sectional", sw=1)
    r(8, 14, 6, 3, config['couch_color'], "", sw=1)
    r(4.5, 12, 2.5, 3.5, config['coffee_color'], "Table", sw=1)
    r(18, 9, 4, 6, config['dining_color'], "Dining", sw=1)
    
    # Title
    draw.text((W/2 - 150, 15), name, fill="black", font=title_font)
    
    img.save(filename)

configs = [
    {"name": "Blueprint Overlay: Plan 1 (Budget)", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/bp_plan1.png", 
     "cfg": {'couch_color': '#a9a9a9', 'tv_color': '#d2b48c', 'coffee_color': '#d2b48c', 'dining_color': '#f5deb3', 'desk_color': '#d2b48c'}},
    {"name": "Blueprint Overlay: Plan 2 (Modern)", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/bp_plan2.png", 
     "cfg": {'couch_color': '#6c7a89', 'tv_color': '#5c4033', 'coffee_color': '#5c4033', 'dining_color': '#3e2723', 'desk_color': '#2f4f4f'}},
    {"name": "Blueprint Overlay: Plan 3 (Premium)", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/bp_plan3.png", 
     "cfg": {'couch_color': '#8b4513', 'tv_color': '#111111', 'coffee_color': '#c0c0c0', 'dining_color': '#654321', 'desk_color': '#1a1a1a'}}
]

for c in configs:
    draw_plan(c["name"], c["file"], c["cfg"])
print("Generated PNGs successfully")
