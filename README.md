# AuraMaze
[![Build Status](https://travis-ci.com/auramaze/auramaze.svg?branch=master)](https://travis-ci.com/auramaze/auramaze)
[![Coverage Status](https://coveralls.io/repos/github/auramaze/auramaze/badge.svg?branch=master)](https://coveralls.io/github/auramaze/auramaze?branch=master)

> Smart audio guide for Art Museums

## Getting Started

```
git clone https://github.com/auramaze/auramaze.git
```

## Load Balancer
* Connect
```
ssh -i auramaze-test-load-balancer.pem ubuntu@<IP>
```

* Config
```
upstream api {
	server api1.auramaze.org;
	server api2.auramaze.org;
	server api3.auramaze.org;
}

server {
    server_name api.auramaze.org;

	location / {
		proxy_pass http://api;
	}

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/api.auramaze.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/api.auramaze.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}


server {
    if ($host = api.auramaze.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

	listen 80;
        server_name api.auramaze.org;
    return 404; # managed by Certbot
}
```

## API
* Connect
```
ssh -i auramaze-test-api.pem ubuntu@<IP>
```

* Config
```
echo 'COVERALLS_REPO_TOKEN=<SECRET>
API_ENDPOINT=https://apidev.auramaze.org/v1
AWS_ACCESS_KEY_ID=<SECRET>
AWS_SECRET_ACCESS_KEY=<SECRET>
AWS_REGION=us-east-2
AWS_RDS_HOST=<SECRET>
AWS_RDS_USER=auramaze
AWS_RDS_PASSWORD=<SECRET>
AWS_RDS_DATABASE=auramaze
SECRET=<SECRET>
SESSION_SECRET=<SECRET>
ESROOT=<SECRET>
GOOGLE_KEY=<SECRET>
GOOGLE_SECRET=<SECRET>
FACEBOOK_KEY=<SECRET>
FACEBOOK_SECRET=<SECRET>
GITHUB_KEY=<SECRET>
GITHUB_SECRET=<SECRET>
' > ~/auramaze/server/api/.env

echo 'ES_HOST=<SECRET>
' > ~/auramaze/server/aura/.env

echo 'server {
    server_name apidev.auramaze.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/apidev.auramaze.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/apidev.auramaze.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = apidev.auramaze.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name apidev.auramaze.org;
    return 404; # managed by Certbot
}' > /etc/nginx/sites-available/default

cd ~/auramaze/server/aura
sudo docker build -t aura .
sudo docker run -p 5000:5000 --name=aura -d aura

forever start -c "npm start" ~/auramaze/server/api
```

## Aurora

* Connect
```
mysql -h <SECRET> -D auramaze --ssl-ca=rds-combined-ca-bundle.pem --ssl-mode=VERIFY_IDENTITY -u auramaze -p
<SECRET>
mysql> set global log_bin_trust_function_creators=1; # DB Parameter Group
mysql> set global binlog_format=ROW; # DB Cluster Parameter Group
```

## ElasticSearch

* Config
```
export ESROOT=<SECRET>
curl -X DELETE $ESROOT/art
curl -X PUT $ESROOT/art --header "Content-Type: application/json" --data-binary @art_mapping.json
curl -X POST $ESROOT/art/_doc/_bulk --header "Content-Type: application/json" --data-binary @art.json
curl -X DELETE $ESROOT/artizen
curl -X PUT $ESROOT/artizen --header "Content-Type: application/json" --data-binary @artizen_mapping.json
curl -X POST $ESROOT/artizen/_doc/_bulk --header "Content-Type: application/json" --data-binary @artizen.json
```

## Kafka Broker & Debezium

* Connect
```
ssh -i auramaze-test-kafka.pem ubuntu@<IP>
```

* Config
```
sudo apt-get update
sudo snap install docker
sudo docker pull debezium/zookeeper:0.8
sudo docker pull debezium/kafka:0.8
sudo docker pull confluentinc/cp-schema-registry
sudo docker pull debezium/connect:0.8
sudo docker-compose -f ~/auramaze/server/broker/docker-compose-mysql-avro.yaml up -d
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d '{ "name": "auramaze-connector", "config": { "connector.class": "io.debezium.connector.mysql.MySqlConnector", "tasks.max": "1", "database.hostname": "auramaze-test.cxhpauspfezh.us-east-2.rds.amazonaws.com", "database.port": "3306", "database.user": "auramaze", "database.password": "<SECRET>", "database.server.id": "184054", "database.server.name": "aurora", "database.whitelist": "auramaze", "database.history.kafka.bootstrap.servers": "kafka:9092", "database.history.kafka.topic": "schema-changes.auramaze" } }'
# sudo docker-compose -f ~/auramaze/server/broker/docker-compose-mysql-avro.yaml down
```

## Consumer

* Connect
```
ssh -i auramaze-test-consumer.pem ubuntu@<IP>
```

* Config
```
echo 'ES_HOST=<SECRET>
KAFKA_HOST=<IP>
AWS_RDS_HOST=<SECRET>
AWS_RDS_USER=auramaze
AWS_RDS_PASSWORD=<SECRET>
AWS_RDS_DATABASE=auramaze
' > ~/auramaze/server/consumer/elasticsearch/.env
echo 'ES_HOST=<SECRET>
KAFKA_HOST=<IP>
' > ~/auramaze/server/consumer/signature/.env

sudo apt-get update
sudo apt-get install build-essential default-jre python3-venv python3-wheel python3-setuptools python3-dev libmysqlclient-dev
sudo snap install docker
cd ~/auramaze/server/consumer/elasticsearch
sudo docker build -t consumer-elasticsearch .
sudo docker run --name=consumer-elasticsearch -d consumer-elasticsearch
# sudo docker logs consumer-elasticsearch
# sudo docker stop consumer-elasticsearch
cd ~/auramaze/server/consumer/signature
sudo docker build -t consumer-signature .
sudo docker run --name=consumer-signature -d consumer-signature
# sudo docker logs consumer-signature
# sudo docker stop consumer-signature
```

## Web

* Connect
```
ssh -i auramaze-test-web.pem ubuntu@<IP>
```

* Config
```
echo 'REACT_APP_GOOGLE_API_KEY=<SECRET>
' > ~/auramaze/client/web/.env

sudo echo 'server {
    server_name dev.auramaze.org;

    root /home/ubuntu/auramaze/client/web/build;

    location / {
        try_files $uri /index.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/dev.auramaze.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/dev.auramaze.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = dev.auramaze.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name dev.auramaze.org;
    return 404; # managed by Certbot
}' > /etc/nginx/sites-available/default
```
