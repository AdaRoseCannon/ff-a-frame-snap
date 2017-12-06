# ff-a-frame-snap
Service to Screenshot A-Frame Sites

# Installation

* requres node >7 to run
* clone this repo
* `npm install`
* `npm run start` (An empty chrome instance will start ready for taking screenshots)
* Open in your browser of choice http://localhost:3000/?url=https://earthy-course.glitch.me/

It will take a 360 screenshot like this:

![Example Equirecangular Screenshot](https://raw.githubusercontent.com/AdaRoseEdwards/ff-a-frame-snap/master/snaps/screenshot-nine%20worlds%20demo-1506091687898.png)

# How it works

This project uses Selenium to open up Firefox and take Equirectangular Screenshots in Node
