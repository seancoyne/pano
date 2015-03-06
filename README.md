pano
====

[![Build Status](https://travis-ci.org/seancoyne/pano.svg?branch=master)](https://travis-ci.org/seancoyne/pano)

jQuery plugin to display a 360 degree panoramic image

## Requires

This plugin has been tested against jQuery 1.8.3.  It should support newer versions but they have not been tested.

## Options

* `img` - The URL to the background image.  This should be a 360 degree panoramic image.  You should set the CSS so that the width and height of the containing block are your desired size.
* `interval` - How often to trigger the move command when the user holds down the mouse button, touch or if you call the `moveLeft` or `moveRight` API methods. (Default 100ms)
* `speed` - How fast should the animation move? (Default 50ms)

It will add a class of `.moving` whenever the background image is being moved (whether drag & drop or via the controls).

## API

The plugin returns a public API with 3 methods:

* `moveLeft(interval, speed)` - Starts moving the image to the left at the indicated interval and speed.  If the arguments are not provided, it will use the defaults.
* `moveRight(interval, speed)` - Starts moving the image to the right at the indicated interval and speed.  If the arguments are not provided, it will use the defaults.
* `stopMoving()` - Stops all motion.

## Example

See https://seancoyne.github.io/pano for working example.

```javascript
$(document).ready(function(){
	var pano = $("#myPano").pano({
		img: "/path/to/image.jpg",
		interval: 100,
		speed: 50
	});
	
	pano.moveLeft();
	pano.stopMoving();
	pano.moveRight();
	pano.stopMoving();
	
});
```

## Other Usage

The plugin supports the CommonJS module system so you can require it using npm and bundle via Browserify.