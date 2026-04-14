import csv
import urllib.request
import urllib.parse
import json
import time
import re

def search_image(query):
    try:
        # DDG HTML search
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query + ' product')
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        # Look for vqd
        vqd_match = re.search(r'vqd=([\d-]+)', html)
        if not vqd_match:
            return None
            
        vqd = vqd_match.group(1)
        
        # DDG Image search
        img_url = f'https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}'
        req = urllib.request.Request(
            img_url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://duckduckgo.com/'
            }
        )
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        if 'results' in data and len(data['results']) > 0:
            return data['results'][0]['image']
            
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return None

def update_csv():
    rows = []
    with open('furniture_proposals.csv', 'r') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)
        for row in reader:
            if not row or len(row) < 11:
                continue
            product_name = row[4]
            retailer = row[5]
            if product_name and product_name != "Unknown Item":
                print(f"Searching image for {product_name}...")
                img = search_image(product_name + " " + retailer)
                if img:
                    row[10] = img
                    print(f"Found: {img}")
                time.sleep(1)
            rows.append(row)
            
    with open('furniture_proposals.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

if __name__ == "__main__":
    update_csv()
