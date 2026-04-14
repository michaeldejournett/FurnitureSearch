import csv
import urllib.request
import os

images_map = {
    "p0_desk.jpg": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80",
    "p0_futon.jpg": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80",
    "p0_tv.jpg": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=400&q=80",
    "p0_dining.jpg": "https://images.unsplash.com/photo-1617806118233-18e1c61364d4?auto=format&fit=crop&w=400&q=80",
    "p0_rug.jpg": "https://images.unsplash.com/photo-1626243936990-84bef2563f88?auto=format&fit=crop&w=400&q=80",

    "p1_desk.jpg": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    "p1_futon.jpg": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=400&q=80",
    "p1_tv.jpg": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    "p1_dining.jpg": "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=400&q=80",
    "p1_rug.jpg": "https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=400&q=80",

    "p2_desk.jpg": "https://images.unsplash.com/photo-1527698266440-12104e498b76?auto=format&fit=crop&w=400&q=80",
    "p2_futon.jpg": "https://images.unsplash.com/photo-1616422285623-13ff91620ec7?auto=format&fit=crop&w=400&q=80",
    "p2_tv.jpg": "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&w=400&q=80",
    "p2_dining.jpg": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
    "p2_rug.jpg": "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=400&q=80",

    "shared_bed.jpg": "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=400&q=80",
    "shared_wardrobe.jpg": "https://images.unsplash.com/photo-1595526114101-20a8fe340ec5?auto=format&fit=crop&w=400&q=80",
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)

os.makedirs("images", exist_ok=True)

for fname, url in images_map.items():
    print(f"Downloading {fname}...")
    try:
        urllib.request.urlretrieve(url, os.path.join("images", fname))
    except Exception as e:
        print("Failed", fname, e)
