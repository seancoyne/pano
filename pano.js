$.fn.pano = function(options){
	
	// get a handle on the panorama and controls
	var $pano = this;
	var $leftCtrl = $pano.find(".controls").find("a.left");
	var $rightCtrl = $pano.find(".controls").find("a.right");
	
	var getImageWidth = function(imgSrc) {
		var img = new Image;
		img.src = imgSrc;
		return img.width;
	};
	
	var moveBackgroundTo = function(newPos, duration, cb) {
		try {
		duration = duration || 0;
		cb = cb || function(){};
		console.log("moveBackgroundTo", "duration", duration);
		$pano.animate({
			"background-position-x": newPos.toString() + "px"
		}, duration, "easing", cb);
	} catch (err) {
		console.error("moveBackgroundTo", err);
	}
	};
	
	var moveBackgroundBy = function(distance, duration, cb) {
		try {
		duration = duration || 0;
		cb = cb || function(){};
		console.log("moveBackgroundBy", "duration", duration);
		moveBackgroundTo(getCurrentPosition() + distance, duration, cb);
		} catch (err) {
		console.error("moveBackgroundBy", err);
	}
	};
	
	var getCurrentPosition = function() {
		return parseInt($pano.css("background-position-x").replace("px", ""));
	};
	
	var indicateMovement = function() {
		$pano.addClass("moving");
	};
	
	var noMovement = function() {
		$pano.removeClass("moving");
	}
	
	var leftMover,
		rightMover,
		ctrlInterval = 100,
		ctrlSpeed = 50;
		
	// setup the initial styling
	$pano.css({
		"background-image": "url('" + options.img + "')",
		"background-position": "50% 50%",
	    "background-size": "auto 100%",
	    "background-repeat": "repeat-x"
	});
	
	// set the initial position in pixels (easier math)
	var halfWidth = (getImageWidth(options.img) / 2);
	moveBackgroundTo(halfWidth);
		
	$leftCtrl.on("mousedown", function(event){
		
		// dont process the drag events
		event.stopPropagation();
		
		// indicate movement
		indicateMovement();
		
		// immediately move 
		moveBackgroundBy(-ctrlSpeed, 300);
		
		// move left on interval
		leftMover = setInterval(function(){
			moveBackgroundBy(-ctrlSpeed, 300);
		}, ctrlInterval);
		
	});
	
	$rightCtrl.on("mousedown", function(event){
		
		// dont process the drag events
		event.stopPropagation();
		
		// indicate movement
		indicateMovement();
		
		// immediately move 
		moveBackgroundBy(ctrlSpeed, 300);
		
		// move right on interval
		rightMover = setInterval(function(){
			moveBackgroundBy(ctrlSpeed, 300);
		}, ctrlInterval);
		
	});
	
	$pano.on("mousedown", function(event){
		
		// indicate movement
		indicateMovement();
		
		var startPosition = event.pageX;
		
		$pano.on("mousemove", function(event){
            
            // dont move if you're outside the image
            var $offsetLeft = $pano.offset().left;
            var maxLeft = $offsetLeft;
            var maxRight = $offsetLeft + $pano.width();
            if (event.pageX < maxLeft || event.pageX > maxRight) {
                return false;
            } 
            
            // calculate the change in position
			var diff = (event.pageX - startPosition);
			
			// move it
    		moveBackgroundBy(diff, 0, function(){
    			// after animation is complete, set the "start" position to the current position
    			startPosition = event.pageX;
    		});
            
		});
		
	});
	
	$("body").on("mouseup", function(){
        $pano.off("mousemove");
		$pano.stop(true, true);
		clearInterval(leftMover);
		clearInterval(rightMover);
		noMovement();
	});
	
};

$(document).ready(function(){
	$("#myPano").pano({
		img: "./sphere.jpg"
	});
});