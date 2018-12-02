'''
Add multilingual wikipedia url
'''

import json
import requests
from bs4 import BeautifulSoup
from requests.exceptions import MissingSchema

groups = ['artist', 'museum', 'genre', 'style']
langs = ['zh']
prev = 3
next = 4


def get_multilingual_url(en_url, lang):
    try:
        r = requests.get(en_url)
        html_doc = r.text

        soup = BeautifulSoup(html_doc, 'html.parser')
        link = soup.find(attrs={"lang": lang, "class": "interlanguage-link-target"})
        if link and link['href']:
            return link['href']
        return None
    except MissingSchema:
        return None


if __name__ == '__main__':
    for group in groups:
        artizens = json.load(open('wiki-{}-{}.json'.format(group, prev)))
        for artizen in artizens:
            if 'wikipedia_url' in artizen:
                wikipedia_url = artizen['wikipedia_url']
                print(wikipedia_url)
                for lang in langs:
                    multilingual_url = get_multilingual_url(wikipedia_url, lang)
                    if multilingual_url:
                        artizen['wikipedia_url_{}'.format(lang)] = multilingual_url
                        print(' --- ' + multilingual_url)
                    else:
                        artizen['wikipedia_url_{}'.format(lang)] = None
        json.dump(artizens, open('wiki-{}-{}.json'.format(group, next), 'w+'), indent=4)
