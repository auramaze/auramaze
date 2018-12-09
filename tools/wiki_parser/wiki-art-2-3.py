'''
Add art image url
'''

from fuzzywuzzy import fuzz
import requests
import json
import os
import random

random.seed(10)
import re
from bs4 import BeautifulSoup
from unidecode import unidecode

prev = 2
next = 3
index = 14


def get_new_artist_url(artist_url):
    if artist_url == '':
        new_artist_url = 'artist-' + str(random.randint(0, 100))
    else:
        new_artist_url = artist_url if str(artist_url[0]).islower() else 'artist-' + artist_url
    if not re.match(r'^(?!.*--)[a-z][a-z0-9-]{1,900}[a-z0-9]$', new_artist_url):
        print(new_artist_url)
        raise AssertionError
    return new_artist_url


def get_new_art_url(artist_url, art_url):
    new_art_url = art_url
    if not (str(art_url[0]).islower() or str(art_url[0]).isdigit()):
        new_art_url = 'art-' + new_art_url
    new_art_url = unidecode(new_art_url.replace('_', '-'))
    new_art_url = get_new_artist_url(artist_url) + '-' + new_art_url
    new_art_url = re.sub(r'-{2,}', '-', new_art_url)
    new_art_url = new_art_url.strip('-')

    if new_art_url == 'gustave-moreau-salome':
        new_art_url = new_art_url + '-' + str(random.randint(0, 100))

    if not re.match(r'^(?!.*--)[a-z][a-z0-9-]{1,900}[a-z0-9]$', new_art_url):
        print(new_art_url)
        raise AssertionError
    return new_art_url


meta_dir = '/Users/zianke/Google Drive/University of Michigan/EECS 441/wikiart/meta'
art_dict = {}

artists = json.load(open(os.path.join(meta_dir, 'artists.json')))

for artist in artists:
    file = artist['url'] + '.json'
    if os.path.isfile(os.path.join(meta_dir, file)):
        arts = json.load(open(os.path.join(meta_dir, file)))
        for art in arts:
            art_dict[get_new_art_url(art['artistUrl'], art['url'])] = art['image'] if 'image' in art else None

arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))
for art in arts:
    art['image_url'] = art_dict[art['new_username']]

json.dump(arts, open('wiki-art_{}-{}.json'.format(index, next), 'w+'), indent=4)
