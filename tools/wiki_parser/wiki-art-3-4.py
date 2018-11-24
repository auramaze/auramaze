'''
Filter wikipedia url with status 1 or 2
'''
import json

prev = 3
next = 4
index = 1

try:
    fault = json.load(open('wiki-art_{}-{}.4.json'.format(index, prev)))
except FileNotFoundError:
    fault = {}
status = json.load(open('wiki-art_{}-{}.5.json'.format(index, prev)))
arts = json.load(open('wiki-art_{}-{}.json'.format(index, prev)))

for art in arts:
    username = art['username']
    match = 0
    if username in status:
        match = status[username]
    if username in fault:
        art['wikipedia_url'] = fault[username]
        match = 1
    if match == 0:
        art['wikipedia_url'] = None

json.dump(arts, open('wiki-art_{}-{}.json'.format(index, next), 'w+'), indent=4)
