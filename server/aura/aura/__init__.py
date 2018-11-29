from dotenv import load_dotenv

load_dotenv()

import os
import time
import base64
from flask import Flask, request, jsonify
from operator import itemgetter
from queue import Queue
from threading import Thread
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionTimeout
from urllib3.exceptions import ReadTimeoutError
import socket
import binascii
from .elasticsearch_driver import AuraMazeSignatureES
from .photo import Photo

app = Flask(__name__)

es = Elasticsearch([os.getenv('ES_HOST')])
ses = AuraMazeSignatureES(es, distance_cutoff=0.5)
num_trials = 6
num_workers = 3


def worker(q, ses, results):
    while True:
        painting = q.get()
        # print('get-{}-{}'.format(painting_hash(painting), time.time()))
        if painting is None:
            break
        if results['best'] is None:
            l = ses.search_image(painting, all_orientations=True, bytestream=True)
            if len(l):
                if l[0]['dist'] < 0.3:
                    results['best'] = l[0]
                results['list'].extend(l)
        q.task_done()


def search_image(ses, raw):
    photo = Photo(raw)
    paintings = photo.generate_paintings()
    results = {'list': [], 'best': None}

    q = Queue()
    threads = []
    for i in range(num_workers):
        t = Thread(target=worker, args=(q, ses, results))
        t.start()
        threads.append(t)

    for _, painting in zip(range(num_trials), paintings):
        if results['best']:
            break
        q.put(painting)
        # print('put-{}-{}'.format(painting_hash(painting), time.time()))

    def block_queue(q):
        # block until all tasks are done
        q.join()

    t = Thread(target=block_queue, args=(q,), daemon=True)
    t.start()

    while results['best'] is None and t.is_alive():
        time.sleep(0.1)

    # stop workers
    for i in range(num_workers):
        q.put(None)

    if results['best']:
        return [results['best']]

    results['list'] = sorted(results['list'], key=itemgetter('dist'))
    ids = set()
    unique = []
    for item in results['list']:
        if item['id'] not in ids:
            unique.append(item)
            ids.add(item['id'])

    return unique


def search_image_sync(ses, raw):
    photo = Photo(raw)
    paintings = photo.generate_paintings()
    results = []
    for _, painting in zip(range(num_trials), paintings):
        # print(_)
        # print('start-{}'.format(time.time()))
        l = ses.search_image(painting, all_orientations=True, bytestream=True)
        # print('end-{}'.format(time.time()))
        if len(l):
            if l[0]['dist'] < 0.3:
                return l[:1]
            results.extend(l)

    results = sorted(results, key=itemgetter('dist'))
    ids = set()
    unique = []
    for item in results:
        if item['id'] not in ids:
            unique.append(item)
            ids.add(item['id'])

    return unique


def painting_hash(painting):
    import hashlib
    return hashlib.md5(str(painting).encode('utf-8')).hexdigest()


@app.route('/aura', methods=['POST'])
def aura():
    # start = time.time()
    try:
        raw = base64.b64decode(request.json['image'])
        results = search_image_sync(ses, raw)
    except (ConnectionTimeout, ReadTimeoutError, socket.timeout):
        results = []
    # end = time.time()
    # print(end - start)
    return jsonify({'data': results})
