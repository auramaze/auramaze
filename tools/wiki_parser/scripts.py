import json
import copy
import os
from glob import glob

def replace_json():
    for type in ['artist', 'museum']:

        with open('fastlookup/replace-%s.json' % type) as f:
            lookup = json.load(f)

        with open('wiki-json/wiki-%s-0.json' % type) as f:
            target = json.load(f)

        replaced = []
        for item in target:
            old_name = item['username']
            new_name = lookup.get(old_name, old_name)
            if new_name != old_name:
                print(old_name, new_name)
            new_item = copy.deepcopy(item)
            new_item['username'] = new_name
            replaced.append(new_item)

        with open('wiki-%s-new.json' % type, 'w') as f:
            json.dump(replaced, f, indent=4)

def replace_html():
    for type in ['artist', 'museum']:
        with open('fastlookup/replace-%s.json' % type) as f:
            lookup = json.load(f)

        filenames = glob('wiki-html/%s-html/*' % type)
        for filename in filenames:
            username = filename.split('/')[-1][:-5]
            if username in lookup:
                new_name = lookup[username]
                print(username, new_name)
                new_filename = 'wiki-html/%s-html/%s.html' % (type, new_name)
                os.rename(filename, new_filename)

def add_zh_json():
    for type in ['artist', 'museum', 'style', 'genre']:
        origin_path = 'wiki-json/wiki-{}-0.json'.format(type)
        zh_path = 'wiki-json/wiki-{}-4.json'.format(type)
        output_path = 'wiki-json/wiki-{}-1.json'.format(type)

        with open(origin_path) as f:
            origin_dict = json.load(f)

        with open(zh_path) as f:
            zh_dict = json.load(f)

        for i in range(len(origin_dict)):
            origin_dict[i]['wikipedia_url_zh'] = zh_dict[i]['wikipedia_url_zh']
            if origin_dict[i]['wikipedia_url'] == 'NA':
                origin_dict[i]['wikipedia_url'] = None

        with open(output_path, 'w') as f:
            json.dump(origin_dict, f, indent=4)

def count_word():
    for type in ['artist', 'museum', 'style', 'genre']:
        origin_path = 'wiki-json/wiki-{}-en.json'.format(type)

        with open(origin_path) as f:
            dict = json.load(f)

        for entry in dict:
            print(dict[entry]['title'])
            for section in dict[entry]['html']:
                print('\t', len(section['content'].split()), section['header'])


if __name__ == '__main__':
    count_word()
