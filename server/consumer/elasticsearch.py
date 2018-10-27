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
    :return: None
    '''
    r = requests.post(urllib.parse.urljoin(ES_HOST, path), json=data)
    r.raise_for_status()


def send_delete_request(path):
    '''
    Send delete request with requests
    :param str path: Relative path of ElasticSearch
    :return: None
    '''
    r = requests.delete(urllib.parse.urljoin(ES_HOST, path))
    r.raise_for_status()


def upsert_art(msg_value):
    '''
    Upsert art into ElasticSearch
    :param dict msg_value: Example: {'before': None, 'after': {'id': 10001081, 'username': 'e1-a73c-4336-a6f9-dbafe9d79270', 'title': '{"en":"This is title A","default":"This is title A"}', 'image': None, 'attributes': '{}', 'completion_year': 'c.1517'}, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1540588806, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 462266, 'row': 0, 'snapshot': False, 'thread': 2598, 'db': 'auramaze', 'table': 'art', 'query': None}, 'op': 'c', 'ts_ms': 1540588806426}
    '''
    try:
        id = msg_value['after']['id']
        username = msg_value['after']['username']
        title = json.loads(msg_value['after']['title']) if msg_value['after']['title'] else None
        completion_year = msg_value['after']['completion_year']

        data = {
            'doc': {
                'id': id,
                'username': username,
                'title': title,
                'completion_year': completion_year
            },
            'doc_as_upsert': True
        }

        send_post_request('art/_doc/{}/_update'.format(id), data)
    except (KeyError, json.decoder.JSONDecodeError) as e:
        print("Invalid message format for {}: {}".format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print("Error in sending request to ElasticSearch for {}: {}".format(msg_value, e), flush=True)


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
            },
            'doc_as_upsert': True
        }
        if len(type) > 0:
            # Only artizen with some type can be searched by name
            data['doc']['name'] = name
            data['doc']['type'] = type

        send_post_request('artizen/_doc/{}/_update'.format(id), data)
    except (KeyError, json.decoder.JSONDecodeError) as e:
        print("Invalid message format for {}: {}".format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print("Error in sending request to ElasticSearch for {}: {}".format(msg_value, e), flush=True)


def delete_art(msg_value):
    '''
    Delete art from ElasticSearch
    :param dict msg_value: Example: {'before': {'id': 10001117, 'username': 'b91145f-78f3-4e82-8f56-2f1de477860a', 'title': '{"en":"This is title A","default":"This is title A"}', 'image': None, 'attributes': '{}', 'completion_year': None}, 'after': None, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1540604393, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 542586, 'row': 0, 'snapshot': False, 'thread': 3381, 'db': 'auramaze', 'table': 'art', 'query': None}, 'op': 'd', 'ts_ms': 1540604393737}
    :return: None
    '''
    try:
        id = msg_value['before']['id']
        send_delete_request('art/_doc/{}'.format(id))
    except KeyError as e:
        print("Invalid message format for {}: {}".format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print("Error in sending request to ElasticSearch for {}: {}".format(msg_value, e), flush=True)


def delete_artizen(msg_value):
    '''
    Delete artizen from ElasticSearch
    :param dict msg_value: Example: {'before': {'id': 100239600, 'username': 'deed23-94f4-48c5-84c2-838ac9752e45', 'name': '{"en":"This is name A","default":"This is name A"}', 'type': '["museum","exhibition"]', 'avatar': None, 'attributes': '{}'}, 'after': None, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1540604392, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 537689, 'row': 0, 'snapshot': False, 'thread': 3381, 'db': 'auramaze', 'table': 'artizen', 'query': None}, 'op': 'd', 'ts_ms': 1540604392887}
    :return: None
    '''
    try:
        id = msg_value['before']['id']
        send_delete_request('artizen/_doc/{}'.format(id))
    except KeyError as e:
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

    print(msg.value(), flush=True)
    msg_value = msg.value()
    if msg_value is None:
        # Tombstone message
        continue

    try:
        if msg_value['source']['table'] == 'art':
            if msg_value['op'] in ['c', 'u']:
                upsert_art(msg_value)
            elif msg_value['op'] == 'd':
                delete_art(msg_value)
        elif msg_value['source']['table'] == 'artizen':
            if msg_value['op'] in ['c', 'u']:
                upsert_artizen(msg_value)
            elif msg_value['op'] == 'd':
                delete_artizen(msg_value)
    except (TypeError, KeyError) as e:
        print("Invalid message format for {}: {}".format(msg, e), flush=True)

c.close()
