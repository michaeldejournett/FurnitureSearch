import urllib.request
import time

imgs = {
    "desk.jpg": "https://m.media-amazon.com/images/I/71R2M3I+EIL._AC_SL1500_.jpg",
    "futon.jpg": "https://m.media-amazon.com/images/I/810lqj4HOfL._AC_SL1500_.jpg",
    "tv_stand.jpg": "https://m.media-amazon.com/images/I/81s3O6xszYL._AC_SL1500_.jpg",
    "dining.jpg": "https://m.media-amazon.com/images/I/81P2h8O53CL._AC_SL1500_.jpg",
    "bed.jpg": "https://m.media-amazon.com/images/I/816aRz-Ew3L._AC_SL1500_.jpg",
    "wardrobe.jpg": "https://m.media-amazon.com/images/I/71LhP-U7mCL._AC_SL1500_.jpg",
    "rug.jpg": "https://m.media-amazon.com/images/I/91r4R0zN0fL._AC_SL1500_.jpg"
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')]
urllib.request.install_opener(opener)

import os
os.makedirs("images", exist_ok=True)

for name, url in imgs.items():
    try:
        print(f"Downloading {name}...")
        urllib.request.urlretrieve(url, f"images/{name}")
        time.sleep(1)
    except Exception as e:
        print(f"Failed {name}: {e}")
