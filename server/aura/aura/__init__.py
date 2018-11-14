from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
from .elasticsearch_driver import AuraMazeSignatureES
from .photo import Photo
from operator import itemgetter
from queue import Queue
from threading import Thread
import time
import base64

app = Flask(__name__)

es = Elasticsearch(['https://search-auramaze-test-lvic4eihmds7zwtnqganecktha.us-east-2.es.amazonaws.com'])
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
                min_dist_index, min_dist_item = min(enumerate(l), key=lambda item: item[1]['dist'])
                if min_dist_item['dist'] < 0.3:
                    results['best'] = min_dist_item
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
            min_dist_index, min_dist_item = min(enumerate(l), key=lambda item: item[1]['dist'])
            if min_dist_item['dist'] < 0.3:
                return [min_dist_item]
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
    if request.form['type'] == 'base64':
        raw = base64.b64decode(request.form['data'])
    elif request.form['type'] == 'raw':
        raw = request.files['data'].read()
    else:
        return None, 400
    # start = time.time()
    results = search_image_sync(ses, raw)
    # end = time.time()
    # print(end - start)
    return jsonify({'art': results})
