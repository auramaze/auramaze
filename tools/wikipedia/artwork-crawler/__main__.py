import sys
import operator
import math
import json
import pprint
import re
import requests
import urllib.request

import numpy as np
from apiclient.discovery import build
from PIL import Image
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw
from unidecode import unidecode


data_path = "../test/meta/"
# data_path = "../sample-data/meta/"
img_path = "../test/img/"

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
                    service = build("customsearch", "v1",
                            developerKey="AIzaSyCqI-ixGbVm-y4svD41Dahyyhs4Edz86B0")

                    res = service.cse().list(
                          q=original_name + ' Wikipedia',
                          # q='Paul Ackerman Wikipedia',
                          cx='017007423820323933062:fhljekcpliy',
                        ).execute()

                    for item in res["items"]:
                        if 'Wikipedia' in item["htmlTitle"] and 'jpg' not in item["htmlTitle"]:
                            # pprint.pprint(item)
                            if original_name.split()[0] in item["htmlTitle"]:
                                new_artist['wikipediaLink'] = item["formattedUrl"]
                                break
                        else:
                            new_artist['wikipediaLink'] = 'NA'
                    print(original_name, new_artist['wikipediaLink'])
                except KeyError:
                    new_artist['wikipediaLink'] = 'NA'

            artists.append(new_artist)
    return artists


def otherQuery():
    others = []
    with open(data_path + 'museums.json') as other_json_file:
        other_json = json.load(other_json_file)
        for other, value in other_json.items():
            # other_name = re.sub(r'[^A-Za-z\s]+', '', unidecode(other).strip().rstrip())
            # other_name = other_name.replace(' ', '-').lower()
            # new_other['username'] = other_name
            # new_other['styleName'] = other
            if len(value) == 1:
                other_json[other] = value[0]
            elif len(value) == 0:
                other_json[other] = {'museumName': other}
                others.append(other_json[other])
                continue
            else:
                print(other, 'resized')
                other_json[other] = value[0]
            other_json[other]['museumName'] = other
            other_json[other]['locationName'] = other_json[other]['name']
            del other_json[other]['name']
            try:
                service = build("customsearch", "v1",
                        developerKey="AIzaSyCqI-ixGbVm-y4svD41Dahyyhs4Edz86B0")

                res = service.cse().list(
                      q=other + ' Wikipedia',
                      # q='Paul Ackerman Wikipedia',
                      cx='017007423820323933062:fhljekcpliy',
                    ).execute()

                for item in res["items"]:
                    if 'Wikipedia' in item["htmlTitle"] and 'jpg' not in item["htmlTitle"]:
                        # pprint.pprint(item)
                        other_json[other]['wikipediaLink'] = item["formattedUrl"]
                        break
                    else:
                        other_json[other]['wikipediaLink'] = 'NA'
                print(other, other_json[other]['wikipediaLink'])
            except KeyError:
                other_json[other]['wikipediaLink'] = 'NA'

            others.append(other_json[other])
    return others


def validateLink():
    pass

def constructQuery():
    queries = {}
    with open(data_path + 'artists.json') as artists_json_file:
        artists_json = json.load(artists_json_file)
        for artist in artists_json:
            # artist_name = artist["artistName"]
            artist_name = artist["name"]["default"]
            # works_filename = artist["url"] + '.json'
            works_filename = artist["username"] + '.json'
            try:
                with open(data_path + works_filename) as works_json_file:
                    works_json = json.load(works_json_file)
                    for work in works_json:
                        work_dic = {}
                        work_name = work["title"] + ' ' + str(work["completitionYear"])
                        # if work["galleryName"] != "":
                        #     work_name += ' ' + work["galleryName"].split(',')[0]
                        work_dic["artist"] = artist_name
                        work_dic["query"] = artist_name + ' ' + work_name + ' wikipedia'
                        work_dic["image"] = work["image"]
                        work_dic["username"] = work["url"]
                        queries[work["title"]] = work_dic
            except FileNotFoundError:
                print(works_filename + ' not found.')
    return queries


def searchQuery(query):
    service = build("customsearch", "v1",
            developerKey="AIzaSyCqI-ixGbVm-y4svD41Dahyyhs4Edz86B0")

    res = service.cse().list(
          q=query,
          cx='017007423820323933062:fhljekcpliy',
        ).execute()

    for item in res["items"]:
        if 'Wikipedia' in item["htmlTitle"] and 'jpg' not in item["htmlTitle"]:
            # pprint.pprint(item)
            return item["formattedUrl"]
    return 'NA'


def downloadWiki(title, link):
    try:
        headers = {}
        headers['User-Agent'] = "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17"
        req = urllib.request.Request(link, headers = headers)
        resp = urllib.request.urlopen(req)
        respData = str(resp.read().decode('utf-8'))

        f = open('museum-html/{}.html'.format(title), 'w+', encoding='utf-8')
        f.write(respData)
        f.close()
        print(title, "download")
    except Exception as e:
        print(title, str(e))


def parseWiki(html):
    wiki_dic = {}

    start_title = html.find("<title")
    end_start_title = html.find(">", start_title+1)
    stop_title = html.find(" - Wikipedia", end_start_title + 1)
    title = html[end_start_title + 1 : stop_title]
    wiki_dic["title"] = title

    start_introduction = html.find("<p>")
    stop_introduction = html.find('<div id="toctitle">', start_introduction + 1)
    if '<div id="toctitle">' not in html:
        stop_introduction = html.find('</p>', start_introduction + 1)
    raw_introduction = html[start_introduction : stop_introduction]
    introduction = (re.sub(r'<.+?>', '', raw_introduction))
    wiki_dic["introduction"] = introduction

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
    data = np.asarray(img, dtype="int32")
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
                print("stopped at " + key)
                break;
            try:
                link = searchQuery(value["query"])
            except:
                print("limit reached.")
                break;
            queries[key]["wikipediaUrl"] = link
            # if link != 'NA':
            #     raw_html = downloadWiki(link)
            #     try:
            #         wiki_dic = parseWiki(raw_html)
            #     except AttributeError:
            #         print(link + ' empty.')
            #         wiki_dic = {}
            # else:
            #     wiki_dic = {}
            # queries[key]["wiki"] = wiki_dic
            queries[key]["id"] = format(art_id, '08')
            queries[key]["type"] = "art"
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
        exportJSON(others, './', 'wiki-museums')

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
        json_dicts = []
        post_dicts = []
        with open('wiki-museums.json') as original_json_file:
            json_dicts = json.load(original_json_file)
        for json_dict in json_dicts:
            post_dict = {'name': {}, 'type': ['museum']}
            post_dict['name']['default'] = post_dict['name']['en'] = json_dict['museumName']
            post_dict['username'] = json_dict['username']
            post_dict['wikipedia_url'] = json_dict['wikipediaLink']
            print(post_dict['name']['default'])
            post_dicts.append(post_dict)
        exportJSON(post_dicts, './post/', 'post-museum')

    elif args[0] == '--postAPI':
        post_dicts = []
        with open('draftjs/wiki-artists-draftjs.json') as original_json_file:
            post_dicts = json.load(original_json_file)
        for payload in post_dicts:
            try:
                r = requests.get("https://apidev.auramaze.org/v1/artizen/{}".format(payload['username']), json=payload)
                res = r.json()
                url = "https://apidev.auramaze.org/v1/artizen/{}/introduction".format(res['id'])
                if payload['wikipedia'] and payload['wikipedia']['content']:
                    content = {"author_id": "100000010", "content": payload['wikipedia']['content']}
                    r = requests.post(url, json=content)
                    print(r.status_code, r.content)
                else:
                    print(payload['username'], 'no Wikipedia')
            except Exception as e:
                print(str(e), res)

if __name__ == '__main__':
    main()
