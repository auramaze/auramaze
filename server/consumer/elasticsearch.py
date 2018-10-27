#!/usr/bin/env python
# -*- coding: utf-8 -*-

from dotenv import load_dotenv

load_dotenv()

import os
import json
import urllib.parse
import requests
import MySQLdb
from confluent_kafka import KafkaError
from confluent_kafka.avro import AvroConsumer
from confluent_kafka.avro.serializer import SerializerError

ES_HOST = os.getenv('ES_HOST')
KAFKA_HOST = os.getenv('KAFKA_HOST')
AWS_RDS_HOST = os.getenv('AWS_RDS_HOST')
AWS_RDS_USER = os.getenv('AWS_RDS_USER')
AWS_RDS_PASSWORD = os.getenv('AWS_RDS_PASSWORD')
AWS_RDS_DATABASE = os.getenv('AWS_RDS_DATABASE')


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
        print('Invalid message format: {}: {}'.format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print('Error in sending request to ElasticSearch: {}: {}'.format(msg_value, e), flush=True)


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
        print('Invalid message format: {}: {}'.format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print('Error in sending request to ElasticSearch: {}: {}'.format(msg_value, e), flush=True)


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
        print('Invalid message format: {}: {}'.format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print('Error in sending request to ElasticSearch: {}: {}'.format(msg_value, e), flush=True)


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
        print('Invalid message format: {}: {}'.format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print('Error in sending request to ElasticSearch: {}: {}'.format(msg_value, e), flush=True)


def update_relation(msg_value):
    '''
    Get all related artizens of an art regarding some type from Aurora and update ElasticSearch
    :param dict msg_value: Example: {'before': None, 'after': {'art_id': 10001153, 'artizen_id': 100239657, 'type': 'exhibition'}, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1540606868, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 636255, 'row': 0, 'snapshot': False, 'thread': 3522, 'db': 'auramaze', 'table': 'archive', 'query': None}, 'op': 'c', 'ts_ms': 1540606868839}
    :return: None
    '''
    try:
        if msg_value['op'] == 'c':
            art_id = msg_value['after']['art_id']
            type = msg_value['after']['type']
        elif msg_value['op'] == 'd':
            art_id = msg_value['before']['art_id']
            type = msg_value['before']['type']
        else:
            raise KeyError("Should not update archive")

        cur = db.cursor()
        cur.execute(
            'SELECT artizen.name FROM archive INNER JOIN artizen ON archive.artizen_id=artizen.id WHERE archive.art_id=%s AND archive.type=%s',
            [art_id, type])
        relations = list(map(lambda item: json.loads(item[0]), cur.fetchall()))
        cur.close()

        data = {
            'doc': {
                type: relations,
            },
            'doc_as_upsert': True
        }

        send_post_request('art/_doc/{}/_update'.format(art_id), data)
    except KeyError as e:
        print('Invalid message format: {}: {}'.format(msg_value, e), flush=True)
    except MySQLdb.Error as e:
        print('Error in MySQL operation: {}: {}'.format(msg_value, e), flush=True)
    except requests.exceptions.HTTPError as e:
        print('Error in sending request to ElasticSearch: {}: {}'.format(msg_value, e), flush=True)


c = AvroConsumer({
    'bootstrap.servers': '{}:9092'.format(KAFKA_HOST),
    'group.id': '2',
    'schema.registry.url': 'http://{}:8081'.format(KAFKA_HOST)})

c.subscribe(['aurora.auramaze.art', 'aurora.auramaze.artizen', 'aurora.auramaze.archive', 'aurora.auramaze.text'])

db = MySQLdb.connect(host=AWS_RDS_HOST,
                     user=AWS_RDS_USER,
                     passwd=AWS_RDS_PASSWORD,
                     db=AWS_RDS_DATABASE,
                     charset='utf8')

while True:
    try:
        msg = c.poll(10)

    except SerializerError as e:
        print('Message deserialization failed: {}: {}'.format(msg, e), flush=True)
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
        elif msg_value['source']['table'] == 'archive':
            update_relation(msg_value)
    except (TypeError, KeyError) as e:
        print('Invalid message format: {}: {}'.format(msg, e), flush=True)

db.close()
c.close()
