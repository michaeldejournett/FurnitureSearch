import os

def rect(x, y, w, h, fill, stroke="black", sw=2, text="", cls="", text_offset_y=15):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" class="{cls}" />'
    if text:
        s += f'<text x="{x+w/2}" y="{y+h/2+text_offset_y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12" fill="black" font-weight="bold">{text}</text>'
    return s

def draw_plan(name, filename, config):
    # Scale: 1 sq ft = 18 pixels to make it bigger and crisper.
    S = 18
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" style="background: white;">']
    
    def r(x_ft, y_ft, w_ft, h_ft, fill="#f4f4f4", label=""):
        return rect(50 + x_ft*S, 650 - y_ft*S - h_ft*S, w_ft*S, h_ft*S, fill, text=label, text_offset_y=-5 if not label else 0)
        
    # Draw apartment footprint (rooms)
    svg.append(r(0, 0, 11.8, 13.25, "#e0e0e0", "Bedroom 2 (11'10\" x 13'3\")"))
    svg.append(r(14, 4, 11.25, 9.3, "#ffe4e1", "Kitchen (9'4\" x 11'3\")"))
    svg.append(r(25.25, 4, 8, 15.75, "#e0e0e0", "Dining (8' x 15'9\")"))
    svg.append(r(33.25, 4, 12.3, 15.3, "#e0e0e0", "Living Area (12'4\" x 15'4\")"))
    svg.append(r(33.25, 19.3, 12.5, 13.25, "#e0e0e0", "Bedroom 1 (12'6\" x 13'3\")"))
    
    # Balcony and entry marker
    svg.append(r(33.25, 0, 12.3, 4, "#d3f8d3", "Balcony"))
    
    # Bathrooms/Closets (Roughly above kitchen & bed 2)
    svg.append(r(0, 13.25, 11.8, 6, "#e6f2ff", "Bath / Closet"))
    svg.append(r(14, 13.3, 11.25, 9, "#e6f2ff", "Laundry / Bath"))

    # Kitchen Island
    svg.append(r(18, 6, 2.5, 6, "#333", ""))
    
    # Existing Bed 1 Bed (top wall)
    svg.append(r(36, 26, 6, 6.5, "#ffeca8", "Bed"))
    
    # **Proposed Furniture**
    
    # TV on top wall of living room (y=19.3 partition)
    svg.append(r(36.5, 18.5, 6, 0.8, config['tv_color'], "TV Stand"))
    
    # Couch: Sectional L-shape facing TV
    svg.append(r(35, 9, 8, 3, config['couch_color'], "Sectional"))
    svg.append(r(35, 12, 3, 5, config['couch_color'], ""))
    
    # Coffee Table
    svg.append(r(38, 14, 3.5, 2, config['coffee_color'], "Table"))
    
    # Dining Table
    svg.append(r(26.5, 9, 5, 3.5, config['dining_color'], "Dining (6-Seat)"))
    
    # L-Desk in Bed 1 (bottom right corner: x=45.75 max width, y=19.3)
    # The room is x=33.25 to x=45.75
    # Let's put desk at x=41.75 to 45.75, y=19.3
    svg.append(r(43.75, 19.3, 2, 5.5, config['desk_color'], "L-Desk"))
    svg.append(r(39.75, 19.3, 4, 2, config['desk_color'], ""))
    
    svg.append(f'<text x="450" y="30" font-size="28" text-anchor="middle" font-family="Arial" font-weight="bold">{name}</text>')
    
    svg.append('</svg>')
    
    with open(filename, 'w') as f:
        f.write("\n".join(svg))

configs = [
    {"name": "Plan 1 - Budget Minimalist Layout", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/plan1.svg", 
     "cfg": {'couch_color': '#a9a9a9', 'tv_color': '#d2b48c', 'coffee_color': '#d2b48c', 'dining_color': '#f5deb3', 'desk_color': '#d2b48c'}},
    {"name": "Plan 2 - Modern Mid-Range Layout", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/plan2.svg", 
     "cfg": {'couch_color': '#6c7a89', 'tv_color': '#5c4033', 'coffee_color': '#5c4033', 'dining_color': '#3e2723', 'desk_color': '#2f4f4f'}},
    {"name": "Plan 3 - Premium Cozy Layout", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/plan3.svg", 
     "cfg": {'couch_color': '#8b4513', 'tv_color': '#111111', 'coffee_color': '#c0c0c0', 'dining_color': '#654321', 'desk_color': '#1a1a1a'}}
]

for c in configs:
    draw_plan(c["name"], c["file"], c["cfg"])
print("Generated SVGs successfully")
