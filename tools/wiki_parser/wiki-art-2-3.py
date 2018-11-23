'''
Add art image url
'''

from fuzzywuzzy import fuzz
import requests
import json
import os
from bs4 import BeautifulSoup

prev = 2
next = 3
index = 0

meta_dir = '/Users/zianke/Google Drive/University of Michigan/EECS 441/wikiart/meta'
excludes = ['artists.json', 'museums.json', 'genres.json', 'styles.json']
art_dict = {}

for file in os.listdir(meta_dir):
    if file.endswith('.json') and file not in excludes:
        arts = json.load(open(os.path.join(meta_dir, file)))
        for art in arts:
            art_dict[art['url']] = art['image'] if 'image' in art else None

arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))
for art in arts:
    art['image_url'] = art_dict[art['username']]

json.dump(arts, open('wiki-art_{}-{}.json'.format(index, next), 'w+'), indent=4)
