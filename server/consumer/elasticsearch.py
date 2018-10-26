import json
import urllib.parse
import requests
from confluent_kafka import KafkaError
from confluent_kafka.avro import AvroConsumer
from confluent_kafka.avro.serializer import SerializerError

ES_HOST = 'https://search-auramaze-test-lvic4eihmds7zwtnqganecktha.us-east-2.es.amazonaws.com'


def send_post_request(path, data):
    '''
    Send post request with requests
    :param str path: Relative path of ElasticSearch
    :param dict data: Request data, should be in JSON format
    :return int: Status code of response
    '''
    r = requests.post(urllib.parse.urljoin(ES_HOST, path), json=data)
    r.raise_for_status()


def upsert_art(msg_value):
    '''
    Upsert art into ElasticSearch
    :param dict msg_value: Example: {'before': None, 'after': {'id': 10001036, 'username': 'e54035a3-c70f-4727-800b-d14998accc82', 'title': '{"en":"This is title A","default":"This is title A"}', 'image': None, 'attributes': '{}'}, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1540586936, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 348708, 'row': 0, 'snapshot': False, 'thread': 2489, 'db': 'auramaze', 'table': 'art', 'query': None}, 'op': 'c', 'ts_ms': 1540586936266}
    '''
    print(msg_value)


def upsert_artizen(msg_value):
    '''
    Upsert artizen into ElasticSearch
    :param dict msg_value: Example: {'before': None, 'after': {'id': 100239445, 'username': 'c5ba-0897-41a8-b8d5-4aea5abb7f65', 'name': '{"en":"This is name B","default":"This is name B"}', 'type': '["museum","exhibition"]', 'avatar': None, 'attributes': '{}'}, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1540581990, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 240894, 'row': 0, 'snapshot': False, 'thread': 2230, 'db': 'auramaze', 'table': 'artizen', 'query': None}, 'op': 'c', 'ts_ms': 1540581990570}
    '''
    try:
        id = msg_value['after']['id']
        username = msg_value['after']['username']
        name = json.loads(msg_value['after']['name']) if msg_value['after']['name'] else None
        type = json.loads(msg_value['after']['type']) if msg_value['after']['type'] else []

        data = {
            'doc': {
                'id': id,
                'username': username,
                'name': name,
                'type': type
            },
            'doc_as_upsert': True
        }
        send_post_request('artizen/_doc/{}/_update'.format(id), data)
    except (KeyError, json.decoder.JSONDecodeError) as e:
        print("Invalid message format for {}: {}".format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print("Error in sending request to ElasticSearch for {}: {}".format(msg_value, e), flush=True)


c = AvroConsumer({
    'bootstrap.servers': '18.223.196.223:9092',
    'group.id': '2',
    'schema.registry.url': 'http://18.223.196.223:8081'})

c.subscribe(['aurora.auramaze.art', 'aurora.auramaze.artizen', 'aurora.auramaze.archive', 'aurora.auramaze.text'])

while True:
    try:
        msg = c.poll(10)

    except SerializerError as e:
        print("Message deserialization failed for {}: {}".format(msg, e), flush=True)
        break

    if msg is None:
        continue

    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        else:
            print(msg.error(), flush=True)
            break

    # print(msg.value(), flush=True)
    msg_value = msg.value()
    try:
        if msg_value['source']['table'] == 'art':
            if msg_value['op'] in ['c', 'u']:
                upsert_art(msg_value)
        elif msg_value['source']['table'] == 'artizen':
            if msg_value['op'] in ['c', 'u']:
                upsert_artizen(msg_value)

    except (TypeError, KeyError) as e:
        print("Invalid message format for {}: {}".format(msg, e), flush=True)

c.close()
