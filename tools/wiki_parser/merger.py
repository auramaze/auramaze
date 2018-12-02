import json
import argparse
import copy
import re

WORD_LIMIT_EN = 150
WORD_LIMIT_ZH = 150

def join(en_path, zh_path, input_path, output_path):
    with open(en_path, 'r') as f:
        en_dict = json.load(f)
    with open(zh_path, 'r') as f:
        zh_dict = json.load(f)
    with open(input_path, 'r') as f:
        input_list = json.load(f)

    # en_valid_count = 0
    # en_invalid_count = 0
    # zh_valid_count = 0
    # zh_invalid_count = 0

    result_list = copy.deepcopy(input_list)
    for i in range(len(input_list)):
        en_link, en_wiki = get_wiki(input_list[i], en_dict, 'en')
        zh_link, zh_wiki = get_wiki(input_list[i], zh_dict, 'zh')

        result_list[i]['wikipedia_url'] = en_link
        result_list[i]['wikipedia_url_zh'] = zh_link
        result_list[i]['wikipedia'] = en_wiki
        result_list[i]['wikipedia_zh'] = zh_wiki

        # if wiki == '':
        #     wiki = None
        # link = input_list[i]['wikipedia_url']
        # try:
        #     url = link.split('//')[1]
        # except IndexError:
        #     url = 'NA'
        # if not url.startswith('en.wiki'):
        #     wiki = None
        #     other_count += 1
        # else:
        #     en_count += 1
        # result_dict[i]['wikipedia'] = wiki

    with open(output_path, 'w', encoding='utf8') as f:
        json.dump(result_list, f, indent=4, ensure_ascii=False)

    # print('valid wiki:', en_count, 'invalid wiki: ', other_count)

def get_wiki(user, html_dict, lang):
    if lang not in ['en', 'zh']:
        raise RuntimeError
    if lang == 'en':
        link = user['wikipedia_url']
    elif lang == 'zh':
        link = user['wikipedia_url_zh']
    if link is None:
        return 'NA', None
    try:
        url = link.split('//')[1]
    except IndexError:
        # print(url)
        return 'NA', None
    if not url.startswith(lang + '.wiki'):
        return 'NA', None

    wiki = {}
    html = ''
    word_count = 0
    try:
        wiki['title'] = html_dict[user['username']]['title']
        html_list = html_dict[user['username']]['html']
    except KeyError:
        # print('username html not found: ' + user['username'])
        return 'NA', None
    for para in html_list:
        if lang == 'en':
            if re.search(r'default|life|biography|career|education|art|influence|work|influences|background|Reputation|childhood|years|history|education', para['header'], re.IGNORECASE):
                html = html + para['content']
                word_count = word_count + len(para['content'].split())
                if word_count > WORD_LIMIT_EN:
                    break
        elif lang == 'zh':
            html = html + para['content']
            word_count = word_count + len(para['content'])
            if word_count > WORD_LIMIT_ZH:
                break

    if word_count < 50 and word_count > 0:
        print(word_count, lang, user['username'])
    if html == '':
        # print('username html has no content: ' + user['username'])
        return 'NA', None

    wiki['html'] = html
    return link, wiki


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
