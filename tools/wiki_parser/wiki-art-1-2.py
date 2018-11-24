'''
Calculate Levenshtein Distance between art title and Wikipedia title
'''

from fuzzywuzzy import fuzz
import requests
import json
from bs4 import BeautifulSoup

prev = 1
next = 2
index = 2

arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))
for i, art in enumerate(arts):
    title = art['title']
    wikipedia_url = art['wikipedia_url']
    if 'en.wikipedia.org' in wikipedia_url:
        html_doc = requests.get(wikipedia_url).text
        soup = BeautifulSoup(html_doc, 'html.parser')
        wiki_title = soup.find('title').get_text().rstrip(' - Wikipedia')
        art['levenshtein_distance'] = fuzz.ratio(title, wiki_title)
        print('{} - {} - {} - {}'.format(i, title, wiki_title, art['levenshtein_distance']))

json.dump(arts, open('wiki-art_{}-{}.json'.format(index, next), 'w+'), indent=4)
