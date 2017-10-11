/* global jQuery, module, require */
/*

Pano v1.2.1
jQuery plugin to display a 360 degree panoramic image
Sean Coyne
https://github.com/seancoyne/pano
https://seancoyne.github.io/pano

Updated for keyboard and A11Y by Laurence Lewis
https://github.com/Decrepidos/pano

*/
jQuery.fn.pano = function(options) {

    this.version = "1.1.1";

    // get a handle on the panorama and controls
    var $pano = this;
    var $leftCtrl = $pano.find(".controls").find(".left");
    var $rightCtrl = $pano.find(".controls").find(".right");
	//Added new variable for keyboard controls. (Laurence)
    var $leftCtrlKey = $pano.find(".controls.keyControls").find(".left");
    var $rightCtrlKey = $pano.find(".controls.keyControls").find(".right");

    var getImageWidth = function(imgSrc) {
        var img = new Image();
        img.src = imgSrc;
        return img.width;
    };

    var moveBackgroundTo = function(newPos, duration, cb) {
        duration = duration || 0;
        cb = cb || function() {};
        $pano.animate({
            "background-position": newPos.toString() + "px"
        }, duration, "linear", cb);
    };

    var moveBackgroundBy = function(distance, duration, cb) {
        duration = duration || 0;
        cb = cb || function() {};
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
        if (mouseXPos < maxLeft || mouseXPos > maxRight) {
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
        leftMover = setInterval(function() {
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
        rightMover = setInterval(function() {
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
    $leftCtrl.on("mouseover", function(event) {

        // dont process the drag events
        event.stopPropagation();

        moveLeft();


    }).on("touchstart", function(event) {

        // dont process the drag events
        event.stopPropagation();

        // don't show the context menu while holding
        event.preventDefault();

        moveLeft();

    }).on("mousedown click", function(event) {
        stopMoving();
        event.stopPropagation();
        jQuery(this).attr("aria-pressed", function(i, attr) {
            return attr === "false" ? "true" : "false";
        });
    });


    //Changed mouse down to mouseover otherwise this conflicts with focusin (Laurence)
    $rightCtrl.on("mouseover", function(event) {

        // dont process the drag events
        event.stopPropagation();

        moveRight();

    }).on("touchstart", function(event) {

        // dont process the drag events
        event.stopPropagation();

        // don't show the context menu while holding
        event.preventDefault();

        moveRight();
	
	/*
	Added click event for keyboard and aria-pressed after changing <a href to a native button in HTML (Laurence)
	HTML includes aria-label for screen reader users.
	*/
    }).on("mousedown click", function(event) {
		// dont process the drag events
        stopMoving();
        event.stopPropagation();
        jQuery(this).attr("aria-pressed", function(i, attr) {
            return attr === "false" ? "true" : "false";
        });
    });

    $pano.on("mousedown", function(event) {

        // indicate movement
        indicateMovement();

        var startPosition = event.pageX;

        $pano.on("mousemove", function(event) {

            var xPos = event.pageX;
            dragMove(xPos, startPosition, function() {
                // after animation is complete, set the "start" position to the current position
                startPosition = xPos;
            });

        });

    }).on("touchstart", function(event) {

        // indicate movement
        indicateMovement();

        // don't show the context menu while holding
        event.preventDefault();

        var startPosition = event.pageX;

        $pano.on("touchmove", function(event) {

            var xPos = event.originalEvent.changedTouches[0].pageX;
            dragMove(xPos, startPosition, function() {
                // after animation is complete, set the "start" position to the current position
                startPosition = xPos;
            });

        });

    });

    //Keyboard controls (Laurence)
	//Scroll left when button gains focus (Laurence)
    $leftCtrlKey.on("focusin", function(event) {
        event.stopPropagation();
        moveLeft();
    });
    //Stop scrolling when button loses focus (Laurence)
	$leftCtrlKey.on("focusout", function(event) {
        stopMoving();
        event.stopPropagation();
    });
	//Scroll right when button gains focus (Laurence)
    $rightCtrlKey.on("focusin", function(event) {
        event.stopPropagation();
        moveRight();
    });
	//Stop scrolling when button loses focus (Laurence)
    $rightCtrlKey.on("focusout", function(event) {
        stopMoving();
        event.stopPropagation();
    });

	//Add mouseout so scrolling stops when cursor is moved outside the button/s (Laurence)
    jQuery("body").on("mouseout mouseup", function() {
        stopMoving();
    }).on("touchend", function() {
        stopMoving();
    });
    return {
        moveLeft: moveLeft,
        moveRight: moveRight,
        stopMoving: stopMoving
    };

};