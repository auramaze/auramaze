# auramaze
[![Build Status](https://travis-ci.com/auramaze/auramaze.svg?branch=master)](https://travis-ci.com/auramaze/auramaze)
[![Coverage Status](https://coveralls.io/repos/github/auramaze/auramaze/badge.svg?branch=master)](https://coveralls.io/github/auramaze/auramaze?branch=master)

> Smart audio guide for Art Museums

## Folder Structure and File List

```
.
├── README.md
├── Starter App
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
│   │   ├── local.properties
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
│       ├── npm-debug.log
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
│   │   ├── npm-debug.log
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
└── tree.txt

66 directories, 202 files
```



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Clone the GitHub repository
```
git clone https://github.com/auramaze/auramaze.git
```

### Setup

* Install Node.js and npm
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Web Client

* Run the web client for AuraMaze with localhost.
```
cd auramaze/client/web/
npm install
npm start
```

### Mobile Client

* Run the mobile client for AuraMaze with localhost.
* We use Expo client to run simulations of smart phones. Click [here](https://expo.io/tools#client) to download Expo client in your iOS or Android mobile.
```
cd auramaze/client/monile/
npm install
npm start
```

### Server

* Run the server for AuraMaze with localhost.
```
cd auramaze/server/api/
npm install
npm start
```
