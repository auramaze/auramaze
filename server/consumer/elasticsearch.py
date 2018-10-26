from confluent_kafka import KafkaError
from confluent_kafka.avro import AvroConsumer
from confluent_kafka.avro.serializer import SerializerError
import sys

c = AvroConsumer({
    'bootstrap.servers': '18.223.196.223:9092',
    'group.id': '2',
    'schema.registry.url': 'http://18.223.196.223:8081'})

c.subscribe(['aurora.auramaze.art', 'aurora.auramaze.artizen', 'aurora.auramaze.archive', 'aurora.auramaze.text'])

while True:
    try:
        msg = c.poll(10)

    except SerializerError as e:
        print("Message deserialization failed for {}: {}".format(msg, e))
        break

    if msg is None:
        continue

    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        else:
            print(msg.error())
            break

    print(msg.value())
    sys.stdout.flush()

c.close()
