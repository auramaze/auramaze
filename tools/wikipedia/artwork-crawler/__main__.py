import sys
import operator
import math
import json
import pprint
import re
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


def downloadWiki(link):
    try:
        headers = {}
        headers['User-Agent'] = "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17"
        req = urllib.request.Request(link, headers = headers)
        resp = urllib.request.urlopen(req)
        respData = str(resp.read())
        return respData
    except Exception as e:
        print(str(e))


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
        print('usage: [-a(art)/-i(imageSimilarity)]')
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

if __name__ == '__main__':
    main()
