import os

def rect(x, y, w, h, fill, stroke="black", sw=2, text="", cls="", text_offset_y=15):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" class="{cls}" />'
    if text:
        s += f'<text x="{x+w/2}" y="{y+h/2+text_offset_y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12" fill="black" font-weight="bold">{text}</text>'
    return s

def draw_plan(name, filename, config):
    S = 18 # scale
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="950" height="750" style="background: white;">']
    
    def r(x_ft, y_ft, w_ft, h_ft, fill="#f4f4f4", label="", stroke="black", sw=3):
        # Y goes down in SVG, which matches our top-down reading
        return rect(50 + x_ft*S, 50 + y_ft*S, w_ft*S, h_ft*S, fill, stroke=stroke, sw=sw, text=label, text_offset_y=-5 if not label else 0)
        
    # Draw architectural boundaries based EXACTLY on Image 1 (Blueprint)
    # Living / Dining Room (Top Left)
    svg.append(r(0, 5, 28, 20, "#e0e0e0", "Living/Dining Room"))
    
    # Kitchen (Middle Right, adjacent to Living)
    svg.append(r(28, 5, 10, 12, "#ffe4e1", "Kitchen"))
    
    # Bedroom 1 (Top Right) -> In Image 1, it protrudes UP, matching top wall of living
    svg.append(r(38, 2, 13, 14, "#e0e0e0", "Bedroom 1"))
    
    # Bath 1 & Closet (Below Bed 1)
    svg.append(r(38, 16, 13, 7, "#e6f2ff", "Bath 1 & Closet"))
    
    # Bedroom 2 (Bottom Left)
    svg.append(r(0, 27, 14, 13, "#e0e0e0", "Bedroom 2"))
    
    # Bath 2 (Right of Bed 2)
    svg.append(r(14, 27, 8, 8, "#e6f2ff", "Bath 2"))
    
    # Entry / Hall (Bottom Middle)
    svg.append(r(24, 27, 14, 13, "#f4f4f4", "Entry & Hallway"))
    
    # ** Fixed Apartment Fixtures **
    # Kitchen Counters & Island
    svg.append(r(36, 5, 2, 8, "#aaaaaa", "")) # Wall counter
    svg.append(r(31, 6, 2.5, 5, "#333333", "")) # Kitchen Island
    
    # Bedroom 1 Existing Furniture (User said they have a bed and wardrobe)
    # Bed on Top Wall
    svg.append(r(41, 2, 6.5, 6.5, "#ffeca8", "Existing Bed"))
    # Wardrobe on bottom wall of Bedroom 1
    svg.append(r(39, 14.5, 5, 1.5, "#d3d3d3", "Wardrobe"))
    
    # ** Proposed Furniture Layout **
    
    # L-Shaped Desk in Bedroom 1 (Corner to the right of the bed, top right)
    svg.append(r(48, 2, 3, 5.5, config['desk_color'], "L-Desk", sw=1))
    svg.append(r(46.5, 2, 1.5, 2.5, config['desk_color'], "", sw=1))

    # Living Room Furniture
    # Let's put the TV on the top wall of the Living Room (facing down) or the left wall
    # TV on the LEFT wall (x=0) facing right.
    svg.append(r(0.5, 10, 1.5, 6, config['tv_color'], "TV Stand", sw=1))
    
    # Sectional Couch facing the TV (left). L-chaise extending down and facing left.
    svg.append(r(8, 10, 3, 7, config['couch_color'], "Sectional", sw=1)) # Main part
    svg.append(r(8, 14, 6, 3, config['couch_color'], "", sw=1)) # Chaise
    
    # Coffee table between sectional and TV
    svg.append(r(4.5, 12, 2.5, 3.5, config['coffee_color'], "Table", sw=1))

    # Dining Table (Right behind the sectional, or near the island)
    # Space between x=15 and x=28 is totally open. Let's put it there.
    svg.append(r(18, 9, 4, 6, config['dining_color'], "Dining", sw=1))
    
    svg.append(f'<text x="475" y="30" font-size="28" text-anchor="middle" font-family="Arial" font-weight="bold">{name}</text>')
    
    svg.append('</svg>')
    
    with open(filename, 'w') as f:
        f.write("\n".join(svg))

configs = [
    {"name": "Blueprint Overlay: Plan 1 (Budget)", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/bp_plan1.svg", 
     "cfg": {'couch_color': '#a9a9a9', 'tv_color': '#d2b48c', 'coffee_color': '#d2b48c', 'dining_color': '#f5deb3', 'desk_color': '#d2b48c'}},
    {"name": "Blueprint Overlay: Plan 2 (Modern)", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/bp_plan2.svg", 
     "cfg": {'couch_color': '#6c7a89', 'tv_color': '#5c4033', 'coffee_color': '#5c4033', 'dining_color': '#3e2723', 'desk_color': '#2f4f4f'}},
    {"name": "Blueprint Overlay: Plan 3 (Premium)", "file": "/home/michaeldejournett/FurnitureSearch/layout_images/bp_plan3.svg", 
     "cfg": {'couch_color': '#8b4513', 'tv_color': '#111111', 'coffee_color': '#c0c0c0', 'dining_color': '#654321', 'desk_color': '#1a1a1a'}}
]

for c in configs:
    draw_plan(c["name"], c["file"], c["cfg"])
print("Generated Blueprint SVGs successfully")
