import json
import copy

if __name__ == '__main__':

    for type in ['artist', 'genre', 'museum', 'style']:

        with open('fastlookup/fast-%s.json' % type) as f:
            lookup = json.load(f)

        with open('wiki-json/wiki-%s-0.json' % type) as f:
            old = json.load(f)

        replace = {}
        for item in old:
            old_name = item['username']
            try:
                name = item['name']
                if isinstance(name, dict):
                    name = name['default']
                new_name = lookup[name]
            except KeyError:
                print(item['name'])
                new_name = ''
            if old_name != new_name:
                replace[old_name] = new_name

        with open('replace-%s.json' % type, 'w') as f:
            json.dump(replace, f, indent=4, sort_keys = True)
