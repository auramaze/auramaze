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
│   ├── README.md
│   ├── mobile
│   │   └── README.md
│   └── web
│       ├── README.md
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       │   ├── favicon.ico
│       │   ├── index.html
│       │   └── manifest.json
│       ├── src
│       │   ├── app.js
│       │   ├── app.test.js
│       │   ├── art.css
│       │   ├── art.js
│       │   ├── artizen.css
│       │   ├── artizen.js
│       │   ├── auramaze-demo.png
│       │   ├── common.js
│       │   ├── fonts
│       │   │   ├── century_gothic_bold.TTF
│       │   │   ├── century_gothic_bold_italic.TTF
│       │   │   ├── century_gothic_italic.TTF
│       │   │   └── century_gothic_regular.TTF
│       │   ├── fonts.css
│       │   ├── footer.css
│       │   ├── footer.js
│       │   ├── home.css
│       │   ├── home.js
│       │   ├── icons
│       │   │   ├── camera-solid.svg
│       │   │   ├── headphones-alt-solid.svg
│       │   │   └── share-alt-solid.svg
│       │   ├── index.css
│       │   ├── index.js
│       │   ├── logo-white-frame.png
│       │   ├── logo-white-frame.svg
│       │   ├── map-with-marker.js
│       │   ├── navbar-mobile.css
│       │   ├── navbar-mobile.js
│       │   ├── navbar.css
│       │   ├── navbar.js
│       │   ├── pitch-card.css
│       │   ├── pitch-card.js
│       │   ├── pitch.css
│       │   ├── pitch.js
│       │   ├── registerServiceWorker.js
│       │   ├── search.css
│       │   ├── search.js
│       │   ├── searchbox.css
│       │   ├── searchbox.js
│       │   ├── slide.js
│       │   ├── slides.css
│       │   └── slides.js
│       └── yarn.lock
└── server
    ├── README.md
    └── api
        ├── README.md
        ├── app.js
        ├── bin
        │   └── www
        ├── npm-debug.log
        ├── package-lock.json
        ├── package.json
        ├── public
        │   └── stylesheets
        │       └── style.css
        ├── routes
        │   ├── art.js
        │   ├── artizen.js
        │   ├── common.js
        │   ├── index.js
        │   ├── search.js
        │   └── slide.js
        ├── scripts
        │   └── before_install.sh.enc
        ├── test
        │   └── test.js
        └── views
            ├── error.pug
            ├── index.pug
            └── layout.pug

52 directories, 121 files
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

### Server

* Run the server for AuraMaze with localhost.
```
cd auramaze/server/api/
npm install
npm start
```


