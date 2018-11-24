'''
Add manual filter results to art json
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
    if username in status:
        art['wikipedia_match'] = status[username]
    if username in fault:
        art['wikipedia_url'] = fault[username]
        art['wikipedia_match'] = 1

json.dump(arts, open('wiki-art_{}-{}.json'.format(index, next), 'w+'), indent=4)
