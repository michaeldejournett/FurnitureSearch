import os
import urllib.request
import time

urls = {
    # Desks
    "b_desk.jpg": "https://images.unsplash.com/photo-1711051475117-f3a4d3ff6778?auto=format&fit=crop&w=400&q=80",
    "m_desk.jpg": "https://images.unsplash.com/photo-1621743018966-29194999d736?auto=format&fit=crop&w=400&q=80",
    "p_desk.jpg": "https://images.unsplash.com/photo-1625461291092-13d0c45608b3?auto=format&fit=crop&w=400&q=80",
    
    # Futons
    "b_futon.jpg": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80",
    "m_futon.jpg": "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?auto=format&fit=crop&w=400&q=80",
    "p_futon.jpg": "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=400&q=80",
    
    # TV Stands
    "b_tv.jpg": "https://images.unsplash.com/photo-1542487354-feaf93476caa?auto=format&fit=crop&w=400&q=80",
    "m_tv.jpg": "https://images.unsplash.com/photo-1521607630287-ee2e81ad3ced?auto=format&fit=crop&w=400&q=80",
    "p_tv.jpg": "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=400&q=80",
    
    # Dining
    "b_din.jpg": "https://images.unsplash.com/photo-1675744019321-f90d6d719da7?auto=format&fit=crop&w=400&q=80",
    "m_din.jpg": "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=400&q=80",
    "p_din.jpg": "https://images.unsplash.com/photo-1600623050499-84929aad17c9?auto=format&fit=crop&w=400&q=80",

    # Rugs
    "b_rug.jpg": "https://images.unsplash.com/photo-1610484557993-e4c19ef72659?auto=format&fit=crop&w=400&q=80",
    "m_rug.jpg": "https://images.unsplash.com/photo-1596701618210-90fe32ac68fc?auto=format&fit=crop&w=400&q=80",
    "p_rug.jpg": "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=400&q=80",
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)

os.makedirs("images", exist_ok=True)

for name, url in urls.items():
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, os.path.join("images", name))
    except Exception as e:
        print(f"Failed {name}: {e}")
