'''
Download en wiki
'''
import json
import requests

prev = 4
next = 5
index = 1

arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))

for art in arts:
    username = art['username']
    if 'wikipedia_url' in art and art['wikipedia_url']:
        wikipedia_url = art['wikipedia_url']
        print(wikipedia_url)
        r = requests.get(wikipedia_url)
        if r.status_code == 200:
            html_doc = r.text
            with open('art-html/{}.html'.format(username), 'w+') as f:
                f.write(html_doc)
