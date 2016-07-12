# geodrawer

Hello folks, this is a js library designed to let an user easily draw shapes over a google map and import/export them in order to make something useful, i.e. save them to a database engine.

Its simplest usage scenario is when you need to geolocalize some entities and save such info in the database, along with all other stuff (name, description and so on...)

It was designed with the simplicity of usage and integration as primary focus, so that it can be integrated and used in any web application backoffice with no pain:

- no css files involved
- no static assets involved
- just source a js file and instantiate the library

## Features

Some features:

- draw shapes over the map: points, polylines, polygons, circles.
- set a maximum number of drawable shapes per type
- use the geodecoder service to center the map or draw a point
- clear or export the map (the drawn shapes)
- fullscreen functionality
- import shapes and edit them before exporting again

## Usage

### Installation

Just download or clone the repo

    $ git clone https://github.com/abidibo/geodrawer.git

or use bower ;)

    $ bower install geodrawer

### How to

Include the min library (`dist/geodrawer.min`) in the head of your document or in the body, or load it async, it's up to you
