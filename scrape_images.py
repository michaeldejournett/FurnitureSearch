import urllib.request
import re
import os
import time

urls = {
    "b_desk.jpg": "https://www.amazon.com/dp/B0BWR3KMYQ",
    "b_futon.jpg": "https://www.nfm.com/ashley-marleton-2-piece-right-facing-sectional-with-chaise-in-gray-64749740/64749740.html",
    "b_tv.jpg": "https://www.nfm.com/ashley-trinell-60-tv-stand-in-brown-66129446/66129446.html",
    "b_din.jpg": "https://www.nfm.com/ashley-cabalynn-coffee-table-in-light-brown-65305922/65305922.html",
    "b_rug.jpg": "https://www.nfm.com/safavieh-adirondack-adr109d-8-x-10-ivory-and-teal-area-rug-3744135/3744135.html",
    "m_desk.jpg": "https://www.nfm.com/sauder-willow-place-l-shaped-desk-66982034/66982034.html",
    "m_futon.jpg": "https://www.nfm.com/northwestern-2-piece-sectional-65954745/65954745.html", # Used willet for bailey
    "m_tv.jpg": "https://www.nfm.com/signature-design-by-ashley-trinell-63-5-tv-stand-in-brown/46005385.html", # Alternative
    "m_din.jpg": "https://www.nfm.com/millennium-burkhaus-coffee-table-in-white-and-dark-brown-64081250/64081250.html",
    "m_rug.jpg": "https://www.nfm.com/safavieh-isabella-8-x-10-dark-grey-and-cream-area-rug-5347234/5347234.html",
    "p_desk.jpg": "https://www.flexispot.com/l-shaped-standing-desk-e7l",
    "p_futon.jpg": "https://www.nfm.com/northwestern-2-piece-sectional-65954745/65954745.html",
    "p_tv.jpg": "https://www.nfm.com/ashley-wildenauer-76-tv-stand-in-brown-and-black-68966522/68966522.html",
    "p_din.jpg": "https://www.ashleyfurniture.com/p/johurst_lift_top_coffee_table/T873-9.html",
    "p_rug.jpg": "https://www.nfm.com/safavieh-isabella--traditional-9-x-12-cream-and-beige-area-rug-5347176/5347176.html"
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')]
urllib.request.install_opener(opener)

os.makedirs("images", exist_ok=True)

import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for name, url in urls.items():
    try:
        req = urllib.request.Request(url)
        resp = urllib.request.urlopen(req, context=ctx)
        html = resp.read().decode('utf-8', errors='ignore')
        
        match = re.search(r'property="og:image"\s+content="([^"]+)"', html)
        if not match:
            # try name="twitter:image"
            match = re.search(r'name="twitter:image"\s+content="([^"]+)"', html)
            
        if match:
            img_url = match.group(1).replace('&amp;', '&')
            print(f"Downloading {name} from {img_url}")
            urllib.request.urlretrieve(img_url, os.path.join("images", name))
        else:
            print(f"No og:image found for {name} on {url}")
    except Exception as e:
        print(f"Failed {name} from {url}: {e}")
    time.sleep(0.5)
