#!/usr/bin/env python
# -*- coding: utf-8 -*-

from dotenv import load_dotenv

load_dotenv()

import os
import json
import urllib.parse
import requests
from confluent_kafka import KafkaError
from confluent_kafka.avro import AvroConsumer
from confluent_kafka.avro.serializer import SerializerError
from elasticsearch import Elasticsearch
from elasticsearch_driver import AuraMazeSignatureES
from urllib.error import HTTPError
from elasticsearch.exceptions import NotFoundError
from numpy.core._internal import AxisError

ES_HOST = os.getenv('ES_HOST')
KAFKA_HOST = os.getenv('KAFKA_HOST')


def update_signature(msg_value):
    '''
    Updata image signature in ElasticSearch
    :param dict msg_value: Example: {'before': {'id': 10001807, 'username': 'e7b4f-f091-401d-b1a0-4f35015b9af1', 'title': '{"en":"This is title A","default":"This is title A"}', 'image': None, 'metadata': None, 'completion_year': None}, 'after': {'id': 10001807, 'username': 'e7b4f-f091-401d-b1a0-4f35015b9af1', 'title': '{"en":"This is title A","default":"This is title A"}', 'image': '{"default":{"url":"https://s3.us-east-2.amazonaws.com/auramaze-test/images/rembrandt/1653/9223372032559808999.jpg","width":2500,"height":2641}}', 'metadata': None, 'completion_year': None}, 'source': {'version': '0.8.3.Final', 'name': 'aurora', 'server_id': 1507882181, 'ts_sec': 1541446293, 'gtid': None, 'file': 'mysql-bin-changelog.000004', 'pos': 6125418, 'row': 0, 'snapshot': False, 'thread': 49535, 'db': 'auramaze', 'table': 'art', 'query': None}, 'op': 'u', 'ts_ms': 1541446293054}
    '''
    id = msg_value['after']['id']
    image_dict = json.loads(msg_value['after']['image']) if msg_value['after']['image'] else None
    try:
        ses.update_image(id, image_dict)
    except (UnicodeEncodeError, AxisError, ValueError) as e:
        print('Invalid image: {}: {}'.format(msg_value, e), flush=True)


es = Elasticsearch([ES_HOST])
ses = AuraMazeSignatureES(es)

c = AvroConsumer({
    'bootstrap.servers': '{}:9092'.format(KAFKA_HOST),
    'group.id': '3',
    'enable.auto.commit': False,
    'schema.registry.url': 'http://{}:8081'.format(KAFKA_HOST)})

c.subscribe(['aurora.auramaze.art'])

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

    msg_value = msg.value()
    if msg_value is None:
        # Tombstone message
        continue
    # print(msg_value, flush=True)

    try:
        if msg_value['op'] in ['c', 'u']:
            update_signature(msg_value)
        c.commit(message=msg)
    except (TypeError, KeyError) as e:
        print('Invalid message format: {}: {}'.format(msg_value, e), flush=True)
    except (HTTPError, NotFoundError) as e:
        print('Invalid image url: {}: {}'.format(msg_value, e), flush=True)
    except Exception as e:
        print('Uncaught exception: {}: {}'.format(msg_value, e), flush=True)
        c.close()
        raise e

c.close()
