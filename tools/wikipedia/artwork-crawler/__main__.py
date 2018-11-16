import sys
import operator
import math
import json
import pprint
import os
import re
import requests
import urllib.request

import numpy as np
from apiclient.discovery import build
from PIL import Image
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw
from unidecode import unidecode
from glob import glob


data_path = '../test/meta/'
# data_path = './'
# data_path = '../sample-data/meta/'
img_path = '../test/img/'

def artistQuery():
    artists = []
    with open(data_path + 'artists.json') as artists_json_file:
        artists_json = json.load(artists_json_file)
        for artist in artists_json:
            new_artist = {}
            original_name = artist['artistName']
            artist_name = re.sub(r'[^A-Za-z\s]+', '', unidecode(artist['artistName']).strip().rstrip())
            artist_name = artist_name.replace(' ', '-').lower()
            new_artist['artistName'] = original_name
            new_artist['username'] = artist_name
            new_artist['wikipediaLink'] = artist['wikipediaUrl']
            if artist['wikipediaUrl'] == '':
                try:
                    service = build('customsearch', 'v1',
                            developerKey='AIzaSyCqI-ixGbVm-y4svD41Dahyyhs4Edz86B0')

                    res = service.cse().list(
                          q=original_name + ' Wikipedia',
                          # q='Paul Ackerman Wikipedia',
                          cx='017007423820323933062:fhljekcpliy',
                        ).execute()

                    for item in res['items']:
                        if 'Wikipedia' in item['htmlTitle'] and 'jpg' not in item['htmlTitle']:
                            # pprint.pprint(item)
                            if original_name.split()[0] in item['htmlTitle']:
                                new_artist['wikipediaLink'] = item['formattedUrl']
                                break
                        else:
                            new_artist['wikipediaLink'] = 'NA'
                    print(original_name, new_artist['wikipediaLink'])
                except KeyError:
                    new_artist['wikipediaLink'] = 'NA'

            artists.append(new_artist)
    return artists


def otherQuery():
    avatar_dicts = []
    with open(data_path + 'wiki-museums.json') as other_json_file:
        other_json = json.load(other_json_file)
        # for other, value in other_json.items():
            # other_name = re.sub(r'[^A-Za-z\s]+', '', unidecode(other).strip().rstrip())
            # other_name = other_name.replace(' ', '-').lower()
            # new_other['username'] = other_name
            # new_other['styleName'] = other
            # if len(value) == 1:
            #     other_json[other] = value[0]
            # elif len(value) == 0:
            #     other_json[other] = {'museumName': other}
            #     others.append(other_json[other])
            #     continue
            # else:
            #     print(other, 'resized')
            #     other_json[other] = value[0]
            # other_json[other]['museumName'] = other
            # other_json[other]['locationName'] = other_json[other]['name']
            # del other_json[other]['name']
        for other in other_json:
            museum_name = other['museumName']
            if ',' in museum_name:
                museum_name = museum_name.split(',')[0]
            try:
                service = build('customsearch', 'v1',
                        developerKey='AIzaSyCqI-ixGbVm-y4svD41Dahyyhs4Edz86B0')

                res = service.cse().list(
                      # q=other + ' Wikipedia',
                      q=museum_name + ' Facebook site:facebook.com',
                      # q='Paul Ackerman Wikipedia',
                      cx='017007423820323933062:fhljekcpliy',
                    ).execute()

                for item in res['items']:
                    if 'facebook' in item['displayLink']:
                        # pprint.pprint(item)
                        other['facebook_link'] = item['formattedUrl']
                        # other_json[other]['wikipediaLink'] = item['formattedUrl']
                        break
                    else:
                        other['facebook_link'] = 'NA'
                        # other_json[other]['wikipediaLink'] = 'NA'
                print(museum_name, other['facebook_link'])
            except KeyError:
                other['facebook_link'] = 'NA'
                # other_json[other]['wikipediaLink'] = 'NA'
            avatar_dicts.append(other)

    return avatar_dicts


def facebookAvatar():
    facebook_dict = {}
    with open(data_path + 'facebook.json', 'r') as wiki:
        facebook_dict = json.load(wiki)
    handle_list = []
    for facebook in facebook_dict:
        url = facebook['facebook_link']
        if url == 'NA':
            print(facebook['username'], 'not found')
            continue
        extracted_id = url.split('/')[3]
        if extracted_id in ['pages', 'events', 'public', 'people', 'apps']:
            extracted_id = ''
        if '...' in extracted_id:
            if len(url.split('/')) >= 5:
                extracted_id = url.split('/')[4]
            else:
                extracted_id = ''
        if extracted_id != '':
            decoded_avartar = 'http://graph.facebook.com/{}/picture?type=large'.format(extracted_id)
            try:
                img = requests.get(decoded_avartar)
                file_name = facebook['username']
                if img.status_code == 404:
                    print(facebook['username'], '404')
                    continue
                with open(os.path.join('./museum_avatar/', file_name + '.jpg'), 'wb') as f:
                    f.write(img.content)
                print(facebook['username'], extracted_id)
            except Exception as e:
                print(facebook['username'], str(e))
                continue
        else:
            print(facebook['username'], 'not found')
            handle_list.append((facebook['username'], extracted_id))
            continue
    print('-------------')
    print(handle_list)


def constructQuery():
    queries = {}
    with open(data_path + 'artists.json') as artists_json_file:
        artists_json = json.load(artists_json_file)
        for artist in artists_json:
            # artist_name = artist['artistName']
            artist_name = artist['name']['default']
            # works_filename = artist['url'] + '.json'
            works_filename = artist['username'] + '.json'
            try:
                with open(data_path + works_filename) as works_json_file:
                    works_json = json.load(works_json_file)
                    for work in works_json:
                        work_dic = {}
                        work_name = work['title'] + ' ' + str(work['completitionYear'])
                        # if work['galleryName'] != '':
                        #     work_name += ' ' + work['galleryName'].split(',')[0]
                        work_dic['artist'] = artist_name
                        work_dic['query'] = artist_name + ' ' + work_name + ' wikipedia'
                        work_dic['image'] = work['image']
                        work_dic['username'] = work['url']
                        queries[work['title']] = work_dic
            except FileNotFoundError:
                print(works_filename + ' not found.')
    return queries


def searchQuery(query):
    service = build('customsearch', 'v1',
            developerKey='AIzaSyCqI-ixGbVm-y4svD41Dahyyhs4Edz86B0')

    res = service.cse().list(
          q=query,
          cx='017007423820323933062:fhljekcpliy',
        ).execute()

    for item in res['items']:
        if 'Wikipedia' in item['htmlTitle'] and 'jpg' not in item['htmlTitle']:
            # pprint.pprint(item)
            return item['formattedUrl']
    return 'NA'


def downloadWiki(title, link):
    try:
        headers = {}
        headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17'
        req = urllib.request.Request(link, headers = headers)
        resp = urllib.request.urlopen(req)
        respData = str(resp.read().decode('utf-8'))

        f = open('museum-html/{}.html'.format(title), 'w+', encoding='utf-8')
        f.write(respData)
        f.close()
        print(title, 'download')
    except Exception as e:
        print(title, str(e))


def parseWiki(html):
    wiki_dic = {}

    start_title = html.find('<title')
    end_start_title = html.find('>', start_title+1)
    stop_title = html.find(' - Wikipedia', end_start_title + 1)
    title = html[end_start_title + 1 : stop_title]
    wiki_dic['title'] = title

    start_introduction = html.find('<p>')
    stop_introduction = html.find('<div id="toctitle">', start_introduction + 1)
    if '<div id="toctitle">' not in html:
        stop_introduction = html.find('</p>', start_introduction + 1)
    raw_introduction = html[start_introduction : stop_introduction]
    introduction = (re.sub(r'<.+?>', '', raw_introduction))
    wiki_dic['introduction'] = introduction

    return wiki_dic


def museumUsername(museum_dict):
    for museum in museum_dict:
        for location in museum_dict[museum]:
            museum_name = location['name']
            museum_name = re.sub(r'[^A-Za-z\s]+', '', unidecode(museum_name).strip().rstrip())
            museum_name = museum_name.replace(' ', '-').lower()
            print(museum_name)
            location['username'] = museum_name
    return museum_dict


def imageSimilarity(img1, img2):
    i1 = load_image(img1)
    i2 = load_image(img2)
    # print(i1, i2)
    # print(i1.shape, i2.shape)
    distance, path = fastdtw(i1, i2, dist=euclidean)
    return distance


def load_image(filename) :
    img = Image.open(filename)
    img.load()
    data = np.asarray(img, dtype='int32')
    return data


def exportJSON(dict, path, name):
    output_jsonfile = open(path + name + '.json', 'w')
    r = json.dumps(dict, sort_keys=True, indent=4)
    output_jsonfile.write(str(r))
    output_jsonfile.close()


def main():
    args = sys.argv[1:]

    if not args:
        print('usage: [-a(art)/-i(imageSimilarity)/--artist/--location/--download/--other/--post/--postAPI]')
        sys.exit(1)

    elif args[0] == '-a':
        queries = constructQuery()
        art_id = 0
        for key, value in queries.items():
            art_id += 1
            if art_id == 900:
                print('stopped at ' + key)
                break;
            try:
                link = searchQuery(value['query'])
            except:
                print('limit reached.')
                break;
            queries[key]['wikipediaUrl'] = link
            # if link != 'NA':
            #     raw_html = downloadWiki(link)
            #     try:
            #         wiki_dic = parseWiki(raw_html)
            #     except AttributeError:
            #         print(link + ' empty.')
            #         wiki_dic = {}
            # else:
            #     wiki_dic = {}
            # queries[key]['wiki'] = wiki_dic
            queries[key]['id'] = format(art_id, '08')
            queries[key]['type'] = 'art'
        exportJSON(queries, './', 'wiki-sample-link')
        # pprint.pprint(queries)

    elif args[0] == '-i':
        print(imageSimilarity(img_path + 'mona-lisa.jpg', img_path + '/mona-lisa-f-1.jpg'))

    elif args[0] == '--artist':
        artists = artistQuery()
        # pprint.pprint(artists)
        exportJSON(artists, './', 'wiki-artists')

    elif args[0] == '--location':
        museum_dict = {}
        with open(data_path + 'location.json') as museum_json_file:
            museum_dict = json.load(museum_json_file)
        locations = museumUsername(museum_dict)
        exportJSON(museum_dict, './', 'museum-locations')

    elif args[0] == '--download':
        download_json = {}
        with open(data_path + 'wiki-museums.json') as download_json_file:
            download_json = json.load(download_json_file)
        for download in download_json:
            if 'wikipediaLink' in download:
                downloadWiki(download['username'], download['wikipediaLink'])

    elif args[0] == '--other':
        others = otherQuery()
        exportJSON(others, './', 'facebook')

    elif args[0] == '--help':
        original_json = {}
        new_json = {}
        with open('wiki-museum.json') as original_json_file:
            original_json = json.load(original_json_file)
        with open('wiki-museums.json') as new_json_file:
            new_json = json.load(new_json_file)
        for museum in new_json:
            if len(original_json[museum['museumName']]) != 0:
                if 'username' in original_json[museum['museumName']][0]:
                    museum['username'] = original_json[museum['museumName']][0]['username']
                else:
                    print('type 1', museum['museumName'])
            else:
                print('type 2', museum['museumName'])
                museum_name = museum['museumName'].split(',')[0]
                museum_name = re.sub(r'[^A-Za-z\s]+', '', unidecode(museum_name).strip().rstrip())
                museum_name = museum_name.replace(' ', '-').lower()
                museum['username'] = museum_name
                museum['locationName'] = 'NA'
                museum['address'] = 'NA'
                museum['location'] = {}
                museum['wikipediaLink'] = 'NA'
        exportJSON(new_json, './', 'wiki-museums')

    elif args[0] == '--post':
        post_dicts = []
        jsons = ['post-artist.json', 'post-genre.json', 'post-museum.json', 'post-style.json']
        for json_name in jsons:
            new_json = {}
            old_json = []
            counter = 1
            with open('./post/' + json_name) as original_json_file:
                old_json = json.load(original_json_file)
            for old in old_json:
                new_json[old['name']['default']] = old['username']
                print(old['username'], counter)
                counter += 1
            exportJSON(new_json, './fastlookup/', json_name.split('.')[0])

    elif args[0] == '--postAPI':
        post_dicts = []
        # with open('draftjs/wiki-museums-draftjs.json') as original_json_file:
        with open('post/post-artist.json') as original_json_file:
            post_dicts = json.load(original_json_file)
        for payload in post_dicts:
            try:
                # r = requests.get('https://apidev.auramaze.org/v1/artizen/{}'.format(payload['username']), json=payload)
                # res = r.json()
                # token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDEwLCJleHAiOjE1NDc0NDc1MDEsImlhdCI6MTU0MjI2MzUwMX0.rbxVNHVMJxZsAbizp092PFTrKjJ4TBmh-RJOcKDNqJg'
                # header = {'Authorization': 'Bearer ' + token}
                # url = 'https://apidev.auramaze.org/v1/artizen/{}/introduction'.format(res['id'])
                url = 'https://apidev.auramaze.org/v1/artizen/{}'.format(payload['username'])
                # if payload['wikipedia'] and payload['wikipedia']['content']:
                #     content = {'author_id': '100000010', 'content': payload['wikipedia']['content']}
                #     r = requests.post(url, json=content, headers=header)
                #     print(r.status_code)
                # else:
                #     print(payload['username'], 'no Wikipedia')
                img_link = 'https://s3.us-east-2.amazonaws.com/auramaze-test/artist-avatar/{}.jpg'.format(payload['username'])
                r1 = requests.get(img_link)
                if r1.status_code == 200:
                    content = {'avatar': img_link}
                    r = requests.post(url, json=content)
                    print(payload['username'], r.status_code)
                else:
                    print(payload['username'], 'no avatar')
            except Exception as e:
                print(str(e), res)

    elif args[0] == '--avatar':
        facebookAvatar()

    elif args[0] == '--lookup':
        queries = {}
        artists_json = []

        # import dictionaries
        with open('./post/post-artist.json') as artists_json_file:
            artists_json = json.load(artists_json_file)
        with open('./fastlookup/fast-artist.json') as fast_artist_json_file:
            artist_lookup = json.load(fast_artist_json_file)
        with open('./fastlookup/fast-genre.json') as fast_genre_json_file:
            genre_lookup = json.load(fast_genre_json_file)
        with open('./fastlookup/fast-museum.json') as fast_museum_json_file:
            museum_lookup = json.load(fast_museum_json_file)
        with open('./fastlookup/fast-style.json') as fast_style_json_file:
            style_lookup = json.load(fast_style_json_file)

        # run the merge
        works_list = []
        counter = 0
        for artist in artists_json:
            artist_name = artist['name']['default']
            works_filename = artist['username'] + '.json'
            try:
                with open(data_path + works_filename) as works_json_file:
                    works_json = json.load(works_json_file)
                    for work in works_json:
                        work_dict = {}
                        # basic fields
                        work_dict['title'] = {'default': work['title'], 'en': work['title']}
                        if work['yearAsString']: work_dict['completion_year'] = work['yearAsString']
                        work_dict['image'] = {"default": {
                            "url": work['image'],
                            "width": work['width'],
                            "height": work['height']
                        }}
                        work_dict['username'] = work['url']

                        # check relations
                        work_dict_relations = []
                        if not work['artistName']:
                            if work['artistName'] in artist_lookup:
                                work_dict_relations.append({'artizen': artist_lookup[work['artistName']], 'type': 'artist'})
                        if work['genre']:
                            genres = work['genre'].split(',')
                            for genre in genres:
                                genre = genre.strip().rstrip()
                                if genre in genre_lookup:
                                    work_dict_relations.append({'artizen': genre_lookup[genre], 'type': 'genre'})
                        if work['galleryName']:
                            if work['galleryName'] in museum_lookup:
                                work_dict_relations.append({'artizen': museum_lookup[work['galleryName']], 'type': 'museum'})
                        if work['style']:
                            styles = work['style'].split(',')
                            for style in styles:
                                style = style.strip().rstrip()
                                if style in style_lookup:
                                    work_dict_relations.append({'artizen': style_lookup[style], 'type': 'style'})
                        if len(work_dict_relations) != 0:
                            work_dict['relations'] = work_dict_relations
                        works_list.append(work_dict)

                    if len(works_list) >= 10000:
                        exportJSON(works_list, './art_posts/', 'arts-{}'.format(counter))
                        print('arts-{}'.format(counter), len(works_list), 'exported')
                        counter += 1
                        works_list = []
            except FileNotFoundError:
                continue
                print(works_filename + ' not found.')
        exportJSON(works_list, './art_posts/', 'arts-{}'.format(counter))
        print('arts-{}'.format(counter), len(works_list), 'exported')

if __name__ == '__main__':
    main()
