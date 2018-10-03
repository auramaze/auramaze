# starter-app

> Starter App of AuraMaze group in EECS 441

## Folder Structure and File List

```
.
├── README.md				# documentation of the project
├── android_project			# root directory of android project
│   ├── app
│   │   ├── build.gradle		# module-specific build configurations
│   │   ├── proguard-rules.pro		# configuration of ProGuard rules
│   │   └── src				# all code and resource files for the module in the following subdirectories
│   │       ├── androidTest		# code for an instrumented test
│   │       │   └── java
│   │       │       └── ke
│   │       │           └── zian
│   │       │               └── chatter
│   │       │                   └── ExampleInstrumentedTest.java
│   │       ├── main			# Android code and resources shared by all build variants
│   │       │   ├── AndroidManifest.xml # description of the nature of the application and each of its components
│   │       │   ├── java		# Java code sources
│   │       │   │   └── ke
│   │       │   │       └── zian
│   │       │   │           └── chatter
│   │       │   │               ├── Chatt.java
│   │       │   │               ├── ChattAdapter.java
│   │       │   │               ├── PostActivity.java
│   │       │   │               └── TimelineActivity.java
│   │       │   └── res			# application resources
│   │       │       ├── drawable
│   │       │       │   └── ic_launcher_background.xml
│   │       │       ├── drawable-v24
│   │       │       │   └── ic_launcher_foreground.xml
│   │       │       ├── layout
│   │       │       │   ├── activity_post.xml
│   │       │       │   ├── activity_timeline.xml
│   │       │       │   └── chatt_item.xml
│   │       │       ├── mipmap-anydpi-v26
│   │       │       │   ├── ic_launcher.xml
│   │       │       │   └── ic_launcher_round.xml
│   │       │       ├── mipmap-hdpi
│   │       │       │   ├── ic_launcher.png
│   │       │       │   └── ic_launcher_round.png
│   │       │       ├── mipmap-mdpi
│   │       │       │   ├── ic_launcher.png
│   │       │       │   └── ic_launcher_round.png
│   │       │       ├── mipmap-xhdpi
│   │       │       │   ├── ic_launcher.png
│   │       │       │   └── ic_launcher_round.png
│   │       │       ├── mipmap-xxhdpi
│   │       │       │   ├── ic_launcher.png
│   │       │       │   └── ic_launcher_round.png
│   │       │       ├── mipmap-xxxhdpi
│   │       │       │   ├── ic_launcher.png
│   │       │       │   └── ic_launcher_round.png
│   │       │       └── values
│   │       │           ├── colors.xml
│   │       │           ├── strings.xml
│   │       │           └── styles.xml
│   │       └── test			# code for local tests that run on your host JVM
│   │           └── java
│   │               └── ke
│   │                   └── zian
│   │                       └── chatter
│   │                           └── ExampleUnitTest.java
│   ├── build.gradle			# build configuration that apply to all modules
│   ├── gradle				# gradle-affiliated files
│   │   └── wrapper
│   │       ├── gradle-wrapper.jar
│   │       └── gradle-wrapper.properties
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   └── settings.gradle
└── django_project			# root project of django project
    ├── chatter				# core codes of the chatter module
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── migrations
    │   │   └── __init__.py
    │   ├── models.py
    │   ├── tests.py
    │   └── views.py
    ├── django_project			# the project’s connection with Django
    │   ├── __init__.py
    │   ├── settings.py
    │   ├── settings.py.orig
    │   ├── urls.py
    │   └── wsgi.py
    └── manage.py			# sets the DJANGO_SETTINGS_MODULE environment variable

35 directories, 50 files
```



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Clone the GitHub repository
```
git clone https://github.com/zianke/eecs441-starter-app-auramaze.git
```

### Setup

#### Front-end

* Install Android Studio
* Create an Android project from the folder `eecs441-starter-app-auramaze/android_project`
* Install all dependencies
* Create an Android emulator with Nexus 5X and Oreo x86 API 27
* Run the project app on the Android emulator

#### Back-end

* Set up PostgreSQl database
```
sudo -u postgres psql
\connect django
```
* Create tables
```
CREATE TABLE users (username varchar(255), name varchar(255), email varchar(255));
CREATE TABLE chatts (username varchar(255), message varchar(255), time timestamp DEFAULT CURRENT_TIMESTAMP);
INSERT INTO chatts values('testuser1', 'Hello world');
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO django;
ALTER USER django WITH PASSWORD 'auramaze';
```
* Run Django server
```
cd eecs441-starter-app-auramaze/django_project
python manage.py runserver localhost:9000 
```
* Test API
```
curl localhost:9000/getchatts/
# {"chatts": [["testuser1", "Hello world", "2018-09-23T01:26:45.231"]]} （Timestamp may be different)
```


## Built With

- [Django](https://docs.djangoproject.com/en/2.1/) - Python web framework
- [Android](https://developer.android.com/reference/org/w3c/dom/Document) - Mobile platform
