'''
Add multilingual wikipedia url
'''

import json
import requests
from bs4 import BeautifulSoup
from requests.exceptions import MissingSchema

langs = ['zh']
prev = 4
next = 5
index = 1


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
    arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))
    for art in arts:
        if 'wikipedia_url' in art and art['wikipedia_url']:
            wikipedia_url = art['wikipedia_url']
            print(wikipedia_url)
            for lang in langs:
                multilingual_url = get_multilingual_url(wikipedia_url, lang)
                if multilingual_url:
                    art['wikipedia_url_{}'.format(lang)] = multilingual_url
                    print(' --- ' + multilingual_url)
                else:
                    art['wikipedia_url_{}'.format(lang)] = None
    json.dump(arts, open('wiki-art_{}-{}.json'.format(index, next), 'w+'), indent=4)
