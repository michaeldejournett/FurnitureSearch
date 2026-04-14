urls=(
    "b_desk|https://www.amazon.com/dp/B0BWR3KMYQ"
    "b_futon|https://www.nfm.com/ashley-marleton-2-piece-right-facing-sectional-with-chaise-in-gray-64749740/64749740.html"
    "b_tv|https://www.nfm.com/ashley-trinell-60-tv-stand-in-brown-66129446/66129446.html"
    "b_din|https://www.nfm.com/ashley-cabalynn-coffee-table-in-light-brown-65305922/65305922.html"
    "b_rug|https://www.nfm.com/safavieh-adirondack-adr109d-8-x-10-ivory-and-teal-area-rug-3744135/3744135.html"
    "m_desk|https://www.nfm.com/sauder-willow-place-l-shaped-desk-66982034/66982034.html"
    "m_futon|https://www.nfm.com/northwestern-2-piece-sectional-65954745/65954745.html"
    "m_tv|https://www.nfm.com/signature-design-by-ashley-trinell-63-5-tv-stand-in-brown/46005385.html"
    "m_din|https://www.nfm.com/millennium-burkhaus-coffee-table-in-white-and-dark-brown-64081250/64081250.html"
    "m_rug|https://www.nfm.com/safavieh-isabella-8-x-10-dark-grey-and-cream-area-rug-5347234/5347234.html"
    "p_desk|https://www.flexispot.com/l-shaped-standing-desk-e7l"
    "p_futon|https://www.nfm.com/northwestern-2-piece-sectional-65954745/65954745.html"
    "p_tv|https://www.nfm.com/ashley-wildenauer-76-tv-stand-in-brown-and-black-68966522/68966522.html"
    "p_din|https://www.ashleyfurniture.com/p/johurst_lift_top_coffee_table/T873-9.html"
    "p_rug|https://www.nfm.com/safavieh-isabella--traditional-9-x-12-cream-and-beige-area-rug-5347176/5347176.html"
)

mkdir -p images_true

for item in "${urls[@]}"; do
    name="${item%%|*}"
    url="${item##*|}"
    
    echo "Processing $name from $url"
    
    # Grab HTML, find og:image or twitter:image. Use grep, sed
    img_url=$(curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: en-US,en;q=0.9" "$url" | grep -o 'property="og:image"[^>]*content="[^"]*"' | grep -o 'content="[^"]*"' | cut -d'"' -f2 | head -n 1)
    
    if [ -z "$img_url" ]; then
        img_url=$(curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "$url" | grep -o 'name="twitter:image"[^>]*content="[^"]*"' | grep -o 'content="[^"]*"' | cut -d'"' -f2 | head -n 1)
    fi

    if [ -n "$img_url" ]; then
        echo "Found: $img_url"
        curl -sL -A "Mozilla/5.0" -o "images_true/${name}.jpg" "$img_url"
    else
        echo "NOT FOUND for $name"
    fi
    sleep 1
done
