import json
import argparse
import copy


def main():
    parser = argparse.ArgumentParser(description='wikipedia parser')
    parser.add_argument('-org', '--in_org_path', action='store', required=True, type=str, help='specify input path for original file')
    parser.add_argument('-new', '--in_new_path', action='store', required=True, type=str, help='specify input path for new file')
    parser.add_argument('-out', '--output_path', action='store', required=True, type=str, help='specify output path for joined json')
    args = parser.parse_args()
    join(args.in_org_path, args.in_new_path, args.output_path)


def join(org_file, new_file, output_path):
    with open(org_file, 'r') as f:
        org_dict = json.load(f)
    with open(new_file, 'r') as f:
        new_dict = json.load(f)

    en_count = 0
    other_count = 0

    result_dict = copy.deepcopy(org_dict)
    for i in range(len(org_dict)):
        wiki = new_dict.get(org_dict[i]['username'], None)
        link = org_dict[i]['wikipediaLink']
        try:
            url = link.split('//')[1]
        except IndexError:
            url = 'NA'
        if not url.startswith('en.wiki'):
            print(link)
            if wiki:
                print(len(wiki['title']), len(wiki['html']))
            wiki = None
            other_count += 1
        else:
            en_count += 1
        result_dict[i]['wikipedia'] = wiki

    with open(output_path, 'w') as f:
        json.dump(result_dict, f, indent=4)

    print(en_count, other_count)


if __name__ == '__main__':
    main()
