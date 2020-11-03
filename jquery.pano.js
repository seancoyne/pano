/* global jQuery, module, require */

/*!

Pano v1.3.0
jQuery plugin to display a 360 degree panoramic image
Sean Coyne
https://github.com/seancoyne/pano
https://seancoyne.github.io/pano

*/

(function (factory) {
  if(typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(function($) {

	$.fn.pano = function(options){
		
		this.version = "1.3.0";
		
		// get a handle on the panorama and controls
		var $pano = this;
		var $leftCtrl = $pano.find(".controls").find("a.left");
		var $rightCtrl = $pano.find(".controls").find("a.right");
		
		var getImageWidth = function(imgSrc) {
			var img = new Image();
			img.src = imgSrc;
			return img.width;
		};
		
		var moveBackgroundTo = function(newPos, duration, cb) {		
			duration = duration || 0;
			cb = cb || function(){};
			$pano.animate({
				"background-position": newPos.toString() + "px"
			}, duration, "linear", cb);
		};
		
		var moveBackgroundBy = function(distance, duration, cb) {
			duration = duration || 0;
			cb = cb || function(){};
			moveBackgroundTo(getCurrentPosition() + distance, duration, cb);
		};
		
		var getCurrentPosition = function() {
			return parseInt($pano.css("background-position").split(" ")[0].replace("px", ""));
		};
		
		var indicateMovement = function() {
			$pano.addClass("moving");
		};
		
		var noMovement = function() {
			$pano.removeClass("moving");
		};
		
		var insideImage = function(mouseXPos) {
			var $offsetLeft = $pano.offset().left;
			var maxLeft = $offsetLeft;
			var maxRight = $offsetLeft + $pano.width();
			if( mouseXPos < maxLeft || mouseXPos > maxRight) {
				return false;
			}
			return true;
		};
		
		var dragMove = function(xPos, startPosition, cb) {
		
			// dont move if you're outside the image
			if (!insideImage(xPos)) {
				return false;
			} 
			
			// calculate the change in position
			var diff = (xPos - startPosition);
			
			// move it
			moveBackgroundBy(diff, 0, cb);
			
		};
		
		var leftMover,
			rightMover,
			ctrlInterval = options.interval || 100,
			ctrlSpeed = options.speed || 50;
			
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
		
		var moveLeft = function(interval, speed) {
			
			interval = interval || ctrlInterval;
			speed = speed || ctrlSpeed;
			
			// indicate movement
			indicateMovement();
			
			// immediately move 
			moveBackgroundBy(speed, 100);
			
			// move left on interval
			leftMover = setInterval(function(){
				moveBackgroundBy(speed, 100);
			}, interval);
			
		};
		
		var moveRight = function(interval, speed) {
			
			interval = interval || ctrlInterval;
			speed = speed || ctrlSpeed;
			
			// indicate movement
			indicateMovement();
			
			// immediately move 
			moveBackgroundBy(-speed, 100);
			
			// move right on interval
			rightMover = setInterval(function(){
				moveBackgroundBy(-speed, 100);
			}, interval);
		};
		
		var stopMoving = function() {
			$pano.off("touchmove");
			$pano.off("mousemove");
			$pano.stop(true, true);
			clearInterval(leftMover);
			clearInterval(rightMover);
			noMovement();
		};
		
		$leftCtrl.on("mousedown", function(event){
			
			// dont process the drag events
			event.stopPropagation();
			
			moveLeft();
			
			
		}).on("touchstart", function(event){
			
			// dont process the drag events
			event.stopPropagation();
			
			// don't show the context menu while holding
			event.preventDefault();
			
			moveLeft();
			
		});
		
		$rightCtrl.on("mousedown", function(event){
			
			// dont process the drag events
			event.stopPropagation();
			
			moveRight();
			
		}).on("touchstart", function(event){
			
			// dont process the drag events
			event.stopPropagation();
			
			// don't show the context menu while holding
			event.preventDefault();
			
			moveRight();
			
		});
		
		$pano.on("mousedown", function(event){
			
			// indicate movement
			indicateMovement();
			
			var startPosition = event.pageX;
			
			$pano.on("mousemove", function(event){
				
				var xPos = event.pageX;
				dragMove(xPos, startPosition, function(){
					// after animation is complete, set the "start" position to the current position
					startPosition =xPos;
				});
				
			});
			
		}).on("touchstart", function(event){
			
			// indicate movement
			indicateMovement();
			
			// don't show the context menu while holding
			event.preventDefault();
			
			var startPosition = event.pageX;
			
			$pano.on("touchmove", function(event){
				
				var xPos = event.originalEvent.changedTouches[0].pageX;
				dragMove(xPos, startPosition, function(){
					// after animation is complete, set the "start" position to the current position
					startPosition = xPos;
				});
				
			});
			
		});
		
		$("body").on("mouseup", function(){
			stopMoving();
		}).on("touchend", function(){
			stopMoving();
		});
		
		return {
			moveLeft: moveLeft,
			moveRight: moveRight,
			stopMoving: stopMoving
		};
		
	};

}));