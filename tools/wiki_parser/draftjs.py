import json
import requests
from tqdm import tqdm
import time

if __name__ == '__main__':
    for group in ['artist', 'genre', 'style', 'museum']:
        artizens = json.load(open('wiki-json/wiki-{}-2.json'.format(group)))
        for artizen in tqdm(artizens):
            time.sleep(0.05)
            for key_type in ['wikipedia', 'wikipedia_zh']:
                if artizen[key_type]:
                    html = artizen[key_type]['html']
                    if html:
                        payload = {'html': html}
                        r = requests.post('http://localhost:8000/html-to-content', json=payload)
                        try:
                            artizen[key_type]['content'] = r.json()
                        except Exception as e:
                            print(json.dumps(payload))
                            print(html)
                            raise e
                    else:
                        artizen[key_type]['content'] = None

        with open('wiki-json/wiki-{}-3.json'.format(group), 'w', encoding='utf8') as f:
            json.dump(artizens, f, indent=4, ensure_ascii=False)
