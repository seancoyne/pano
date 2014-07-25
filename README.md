pano
====

jQuery plugin to display a 360 degree panoramic image

Options:

img: The URL to the background image.  This should be a 360 degree panoramic image.  You should set the CSS so that the width and height of the containing block are your desired size.

It will add a class of `.moving` whenever the background image is being moved (whether drag & drop or via the controls).

See https://seancoyne.github.io/pano for example or below:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>Pano demo</title>  
		<style>
		.pano {
        width: 500px;
        height: 500px;
        margin: 0 auto;
        cursor: move;
    }
    .pano .controls {
    	position: relative;
    	top: 40%;
    }
    .pano .controls a {
    	position: absolute;
    	display: inline-block;
    	text-decoration: none;
    	color: #eee;
    	font-size: 3em;
    	width: 20px;
    	height: 20px;
    }
    .pano .controls a.left {
    	left: 10px;
    }
    .pano .controls a.right {
    	right: 10px;
    }
    .pano.moving .controls a {
    	opacity: 0.4;
    	color: #eee;
    }
		</style>
		<script src="//code.jquery.com/jquery-1.8.3.js"></script>
		<script src="jquery.pano.js"></script>
		<script>
		$(document).ready(function(){
    	$("#myPano").pano({
    		img: "./sphere.jpg"
    	});
    });
		</script>
	</head>
	<body>
		<div id="myPano" class="pano">
			<div class="controls">
				<a href="#" class="left">&laquo;</a>
				<a href="#" class="right">&raquo;</a>
			</div>
		</div>
	</body>
</html>
```
