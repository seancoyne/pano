pano
====

[![Build Status](https://travis-ci.org/seancoyne/pano.svg?branch=master)](https://travis-ci.org/seancoyne/pano)

jQuery plugin to display a 360 degree panoramic image

## Options

`img` - The URL to the background image.  This should be a 360 degree panoramic image.  You should set the CSS so that the width and height of the containing block are your desired size.

It will add a class of `.moving` whenever the background image is being moved (whether drag & drop or via the controls).

## Example

See https://seancoyne.github.io/pano for working example.

```javascript
$(document).ready(function(){
	$("#myPano").pano({
		img: "/path/to/image.jpg"
	});
});
```