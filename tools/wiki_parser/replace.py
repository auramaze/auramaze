import json
import copy

if __name__ == '__main__':
    with open('lookup.json') as f:
        lookup = json.load(f)

    with open('source_json/wiki-museums.json') as f:
        target = json.load(f)

    replaced = []
    for item in target:
        old_name = item['username']
        new_name = lookup.get(old_name, old_name)
        new_item = copy.deepcopy(item)
        new_item['username'] = new_name
        replaced.append(new_item)

    with open('wiki-museums-new.json', 'w') as f:
        json.dump(replaced, f, indent=4)

