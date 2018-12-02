import json
import requests

if __name__ == '__main__':
    for group in ['artist', 'genre', 'style', 'museum']:
        artizens = json.load(open('wiki-json/wiki-{}-2.json'.format(group)))
        for artizen in artizens:
            if artizen['wikipedia']:
                html = artizen['wikipedia']['html']
                if html:
                    payload = {'html': html}
                    r = requests.post('http://localhost:8000/html-to-content', json=payload)
                    try:
                        artizen['wikipedia']['content'] = r.json()
                    except:
                        print(json.dumps(payload))
                        print(html)
                        exit(0)
                else:
                    artizen['wikipedia']['content'] = None

            if artizen['wikipedia_zh']:
                html = artizen['wikipedia_zh']['html']
                if html:
                    payload = {'html': html}
                    r = requests.post('http://localhost:8000/html-to-content', json=payload)
                    try:
                        artizen['wikipedia']['content'] = r.json()
                    except:
                        print(json.dumps(payload))
                        print(html)
                        exit(0)
                else:
                    artizen['wikipedia']['content'] = None

        with open('wiki-json/wiki-{}-3.json'.format(group), 'w', encoding='utf8') as f:
            json.dump(artizens, f, indent=4, ensure_ascii=False)
