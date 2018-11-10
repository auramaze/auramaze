import json
import requests

if __name__ == '__main__':
    artizens = json.load(open('wiki-artists-merged.json'))
    for artizen in artizens:
        if artizen['wikipedia']:
            html = artizen['wikipedia']['html']
            payload = {'html': html}
            r = requests.post('http://localhost:8000/html-to-content', json=payload)
            try:
                artizen['wikipedia']['content'] = r.json()
            except:
                print(json.dumps(payload))
                print(html)
                exit(0)
                pass

    json.dump(artizens, open('wiki_intro_draftjs.json', 'w'), indent=4)
