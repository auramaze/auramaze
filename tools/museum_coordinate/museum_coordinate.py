import requests
import json


def main():
    with open('api_key') as f:
        api_key = f.read()
        api_key.strip('\n')

    with open('name.json') as f:
        name_list = json.load(f)

    results = {}
    for name in name_list['museum']:
        try:
            param = {
                'key': api_key,
                'input': name,
                'inputtype': 'textquery',
                'fields': 'name,geometry,formatted_address'
            }
            url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
            r = requests.get(url, params=param)
            result = r.json()['candidates']
            print(len(result), result[0]['geometry']['location'], result[0]['name'])
            results[name] = []
            for candidate in result:
                dict = {
                    'name': candidate['name'],
                    'location': candidate['geometry']['location'],
                    'address': candidate['formatted_address']
                }
                results[name].append(dict)
        except IndexError:
            print('NOT FOUND:\t' + name)
            results[name] = [{'NOT FOUND'}]
        except requests.RequestException as e:
            print('REQUESTS ERROR: ' + e.message + '\t' + name)
            results[name] = [{'REQUEST ERROR'}]

    with open('location.json', 'w+') as f:
        json.dump(results, f, indent=4)


if __name__ == '__main__':
    main()
