'''
Add multilingual wikipedia url
'''

import json
import requests
from bs4 import BeautifulSoup
from requests.exceptions import MissingSchema

groups = ['artist', 'museum', 'genre', 'style']
langs = ['zh']
prev = 4

if __name__ == '__main__':
    for group in groups:
        artizens = json.load(open('wiki-{}-{}.json'.format(group, prev)))
        for artizen in artizens:
            for lang in langs:
                if 'wikipedia_url_{}'.format(lang) in artizen:
                    username = artizen['username']
                    wikipedia_url = artizen['wikipedia_url_{}'.format(lang)]
                    if wikipedia_url:
                        print(wikipedia_url)
                        r = requests.get(wikipedia_url)
                        if r.status_code == 200:
                            html_doc = r.text
                            with open('{}-html-{}/{}.html'.format(group, lang, username), 'w+') as f:
                                f.write(html_doc)