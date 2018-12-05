# auramaze
[![Build Status](https://travis-ci.com/auramaze/auramaze.svg?branch=master)](https://travis-ci.com/auramaze/auramaze)
[![Coverage Status](https://coveralls.io/repos/github/auramaze/auramaze/badge.svg?branch=master)](https://coveralls.io/github/auramaze/auramaze?branch=master)

> Smart audio guide for Art Museums

## Folder Structure and File List

```
.
├── README.md
├── Starter\ App
│   ├── README.md
│   ├── android_project
│   │   ├── app
│   │   │   ├── build.gradle
│   │   │   ├── proguard-rules.pro
│   │   │   └── src
│   │   │       ├── androidTest
│   │   │       │   └── java
│   │   │       │       └── ke
│   │   │       │           └── zian
│   │   │       │               └── chatter
│   │   │       │                   └── ExampleInstrumentedTest.java
│   │   │       ├── main
│   │   │       │   ├── AndroidManifest.xml
│   │   │       │   ├── java
│   │   │       │   │   └── ke
│   │   │       │   │       └── zian
│   │   │       │   │           └── chatter
│   │   │       │   │               ├── Chatt.java
│   │   │       │   │               ├── ChattAdapter.java
│   │   │       │   │               ├── PostActivity.java
│   │   │       │   │               └── TimelineActivity.java
│   │   │       │   └── res
│   │   │       │       ├── drawable
│   │   │       │       │   └── ic_launcher_background.xml
│   │   │       │       ├── drawable-v24
│   │   │       │       │   └── ic_launcher_foreground.xml
│   │   │       │       ├── layout
│   │   │       │       │   ├── activity_post.xml
│   │   │       │       │   ├── activity_timeline.xml
│   │   │       │       │   └── chatt_item.xml
│   │   │       │       ├── mipmap-anydpi-v26
│   │   │       │       │   ├── ic_launcher.xml
│   │   │       │       │   └── ic_launcher_round.xml
│   │   │       │       ├── mipmap-hdpi
│   │   │       │       │   ├── ic_launcher.png
│   │   │       │       │   └── ic_launcher_round.png
│   │   │       │       ├── mipmap-mdpi
│   │   │       │       │   ├── ic_launcher.png
│   │   │       │       │   └── ic_launcher_round.png
│   │   │       │       ├── mipmap-xhdpi
│   │   │       │       │   ├── ic_launcher.png
│   │   │       │       │   └── ic_launcher_round.png
│   │   │       │       ├── mipmap-xxhdpi
│   │   │       │       │   ├── ic_launcher.png
│   │   │       │       │   └── ic_launcher_round.png
│   │   │       │       ├── mipmap-xxxhdpi
│   │   │       │       │   ├── ic_launcher.png
│   │   │       │       │   └── ic_launcher_round.png
│   │   │       │       └── values
│   │   │       │           ├── colors.xml
│   │   │       │           ├── strings.xml
│   │   │       │           └── styles.xml
│   │   │       └── test
│   │   │           └── java
│   │   │               └── ke
│   │   │                   └── zian
│   │   │                       └── chatter
│   │   │                           └── ExampleUnitTest.java
│   │   ├── build.gradle
│   │   ├── gradle
│   │   │   └── wrapper
│   │   │       ├── gradle-wrapper.jar
│   │   │       └── gradle-wrapper.properties
│   │   ├── gradle.properties
│   │   ├── gradlew
│   │   ├── gradlew.bat
│   │   └── settings.gradle
│   └── django_project
│       ├── chatter
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── migrations
│       │   │   └── __init__.py
│       │   ├── models.py
│       │   ├── tests.py
│       │   └── views.py
│       ├── django_project
│       │   ├── __init__.py
│       │   ├── settings.py
│       │   ├── settings.py.orig
│       │   ├── urls.py
│       │   └── wsgi.py
│       └── manage.py
├── client
│   ├── mobile
│   │   ├── App.js
│   │   ├── README.md
│   │   ├── app.json
│   │   ├── art
│   │   │   └── art.js
│   │   ├── assets
│   │   │   ├── fonts
│   │   │   │   ├── century-gothic.ttf
│   │   │   │   ├── century_gothic_bold.TTF
│   │   │   │   ├── century_gothic_italic.TTF
│   │   │   │   ├── segoeui.ttf
│   │   │   │   └── segoeuib.ttf
│   │   │   ├── icon.png
│   │   │   ├── loading.png
│   │   │   └── splash.png
│   │   ├── components
│   │   │   ├── bottom-nav.js
│   │   │   └── top-bar.js
│   │   ├── home.js
│   │   ├── icons
│   │   │   ├── camera.png
│   │   │   ├── camera.svg
│   │   │   ├── compass-regular.svg
│   │   │   ├── compass.png
│   │   │   ├── journal.png
│   │   │   ├── left.png
│   │   │   ├── left.svg
│   │   │   ├── lines.png
│   │   │   ├── noun_journal_1069823.svg
│   │   │   ├── noun_lines_445260.svg
│   │   │   ├── noun_recommend_1966408.svg
│   │   │   ├── recommand.png
│   │   │   ├── share.png
│   │   │   └── share.svg
│   │   ├── package-lock.json
│   │   └── package.json
│   └── web
│       ├── README.md
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       │   ├── favicon.ico
│       │   ├── images
│       │   │   ├── img_0.png
│       │   │   ├── img_1.png
│       │   │   ├── img_10.png
│       │   │   ├── img_11.png
│       │   │   ├── img_12.png
│       │   │   ├── img_13.png
│       │   │   ├── img_14.png
│       │   │   ├── img_15.png
│       │   │   ├── img_16.png
│       │   │   ├── img_17.png
│       │   │   ├── img_18.png
│       │   │   ├── img_2.png
│       │   │   ├── img_3.png
│       │   │   ├── img_4.png
│       │   │   ├── img_5.png
│       │   │   ├── img_6.png
│       │   │   ├── img_7.png
│       │   │   ├── img_8.png
│       │   │   └── img_9.png
│       │   ├── index.html
│       │   └── manifest.json
│       ├── src
│       │   ├── app.js
│       │   ├── app.test.js
│       │   ├── art
│       │   │   ├── art.css
│       │   │   └── art.js
│       │   ├── artizen
│       │   │   ├── artizen-header.css
│       │   │   ├── artizen-header.js
│       │   │   ├── artizen.css
│       │   │   └── artizen.js
│       │   ├── common.css
│       │   ├── common.js
│       │   ├── components
│       │   │   ├── art-card-layout.css
│       │   │   ├── art-card-layout.js
│       │   │   ├── art-card.css
│       │   │   ├── art-card.js
│       │   │   ├── artizen-card-layout.css
│       │   │   ├── artizen-card-layout.js
│       │   │   ├── artizen-card.css
│       │   │   ├── artizen-card.js
│       │   │   ├── footer.css
│       │   │   ├── footer.js
│       │   │   ├── item-list.css
│       │   │   ├── item-list.js
│       │   │   ├── map-with-marker.js
│       │   │   ├── navbar-mobile.css
│       │   │   ├── navbar-mobile.js
│       │   │   ├── navbar.css
│       │   │   ├── navbar.js
│       │   │   ├── searchbox.css
│       │   │   ├── searchbox.js
│       │   │   ├── section-title.css
│       │   │   ├── section-title.js
│       │   │   ├── slick-next-arrow.js
│       │   │   ├── slick-prev-arrow.js
│       │   │   ├── text-card.css
│       │   │   └── text-card.js
│       │   ├── fonts
│       │   │   └── fonts.css
│       │   ├── home
│       │   │   ├── data.json
│       │   │   ├── home.css
│       │   │   ├── home.js
│       │   │   ├── library-card.css
│       │   │   ├── library-card.js
│       │   │   ├── pitch-card.css
│       │   │   ├── pitch-card.js
│       │   │   ├── pitch.css
│       │   │   ├── pitch.js
│       │   │   ├── slide.js
│       │   │   ├── slides.css
│       │   │   └── slides.js
│       │   ├── icons
│       │   │   ├── artist.png
│       │   │   ├── artist.svg
│       │   │   ├── camera-solid.svg
│       │   │   ├── critic.png
│       │   │   ├── critic.svg
│       │   │   ├── genre.png
│       │   │   ├── genre.svg
│       │   │   ├── headphones-alt-solid.svg
│       │   │   ├── museum.png
│       │   │   ├── museum.svg
│       │   │   ├── share-alt-solid.svg
│       │   │   ├── style.png
│       │   │   └── style.svg
│       │   ├── index.css
│       │   ├── index.js
│       │   ├── registerServiceWorker.js
│       │   ├── search
│       │   │   ├── search.css
│       │   │   └── search.js
│       │   └── static
│       │       ├── auramaze-demo.png
│       │       ├── logo-white-frame.png
│       │       └── logo-white-frame.svg
│       └── yarn.lock
├── server
│   ├── README.md
│   ├── api
│   │   ├── README.md
│   │   ├── app.js
│   │   ├── bin
│   │   │   └── www
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── public
│   │   │   └── stylesheets
│   │   │       └── style.css
│   │   ├── routes
│   │   │   ├── art.js
│   │   │   ├── artizen.js
│   │   │   ├── common.js
│   │   │   ├── index.js
│   │   │   ├── search.js
│   │   │   └── slide.js
│   │   ├── test
│   │   │   └── test.js
│   │   └── views
│   │       ├── error.pug
│   │       ├── index.pug
│   │       └── layout.pug
│   ├── broker
│   │   └── docker-compose-mysql-avro.yaml
│   └── consumer
│       └── elasticsearch
│           ├── Dockerfile
│           ├── elasticsearch.py
│           └── requirements.txt
└── tools
    ├── __init__.py
    ├── face_detection.py
    ├── haarcascades
    │   ├── haarcascade_eye.xml
    │   ├── haarcascade_eye_tree_eyeglasses.xml
    │   ├── haarcascade_frontalcatface.xml
    │   ├── haarcascade_frontalcatface_extended.xml
    │   ├── haarcascade_frontalface_alt.xml
    │   ├── haarcascade_frontalface_alt2.xml
    │   ├── haarcascade_frontalface_alt_tree.xml
    │   ├── haarcascade_frontalface_default.xml
    │   ├── haarcascade_fullbody.xml
    │   ├── haarcascade_lefteye_2splits.xml
    │   ├── haarcascade_licence_plate_rus_16stages.xml
    │   ├── haarcascade_lowerbody.xml
    │   ├── haarcascade_profileface.xml
    │   ├── haarcascade_righteye_2splits.xml
    │   ├── haarcascade_russian_plate_number.xml
    │   ├── haarcascade_smile.xml
    │   └── haarcascade_upperbody.xml
    └── wikipedia
        ├── artwork-crawler
        │   ├── __init__.py
        │   └── __main__.py
        ├── setup.py
        └── wiki-artists.json

70 directories, 221 files
```



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
