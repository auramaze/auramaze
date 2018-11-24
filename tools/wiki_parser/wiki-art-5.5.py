'''
Add multilingual wikipedia url
'''

import json
import requests
from bs4 import BeautifulSoup
from requests.exceptions import MissingSchema

langs = ['zh']
prev = 5
next = 6
index = 1

if __name__ == '__main__':
    arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))
    for art in arts:
        for lang in langs:
            if 'wikipedia_url_{}'.format(lang) in art:
                username = art['username']
                wikipedia_url = art['wikipedia_url_{}'.format(lang)]
                if wikipedia_url:
                    print(wikipedia_url)
                    r = requests.get(wikipedia_url)
                    if r.status_code == 200:
                        html_doc = r.text
                        with open('art-html-{}/{}.html'.format(lang, username), 'w+') as f:
                            f.write(html_doc)
