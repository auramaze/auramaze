import json
import argparse
import copy


def join(en_path, zh_path, input_path, output_path):
    with open(en_path, 'r') as f:
        en_dict = json.load(f)
    with open(zh_file, 'r') as f:
        zh_dict = json.load(f)
    with open(input_path, 'r') as f:
        input_list = json.load(f)

    en_valid_count = 0
    en_invalid_count = 0
    zh_valid_count = 0
    zh_invalid_count = 0

    result_list = copy.deepcopy(input_list)
    for i in range(len(input_list)):
        en_wiki = get_wiki(input_list[i]['username'], en_dict, 'en')
        zh_wiki = get_wiki(input_list[i]['username'], zh_dict, 'zh')
        if wiki == '':
            wiki = None
        link = input_list[i]['wikipedia_url']
        try:
            url = link.split('//')[1]
        except IndexError:
            url = 'NA'
        if not url.startswith('en.wiki'):
            wiki = None
            other_count += 1
        else:
            en_count += 1
        result_dict[i]['wikipedia'] = wiki

    with open(output_path, 'w') as f:
        json.dump(result_dict, f, indent=4)

    print('valid wiki:', en_count, 'invalid wiki: ', other_count)

def get_wiki(username, dict, lang):
    html = 

def main():
    # parser = argparse.ArgumentParser(description='wikipedia parser')
    # parser.add_argument('-org', '--in_org_path', action='store', required=True, type=str, help='specify input path for original file')
    # parser.add_argument('-new', '--in_new_path', action='store', required=True, type=str, help='specify input path for new file')
    # parser.add_argument('-out', '--output_path', action='store', required=True, type=str, help='specify output path for joined json')
    # args = parser.parse_args()
    # join(args.in_org_path, args.in_new_path, args.output_path)

    for type in ['artist', 'museum', 'style', 'genre']:
        en_path = 'wiki-json/wiki-{}-en.json'.format(type)
        zh_path = 'wiki-json/wiki-{}-zh.json'.format(type)
        input_path = 'wiki-json/wiki-{}-1.json'.format(type)
        output_path = 'wiki-json/wiki-{}-2.json'.format(type)

        join(en_path, zh_path, input_path, output_path)


if __name__ == '__main__':
    main()
