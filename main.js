e = console.log;

(function($){

	/************************************************************
	*
	*	auto_scrolling
	*	==============
	*
	*	Function for autoscroll top and bottom to anchor
	*
	*	How to use ?
	*	------------
	*	
	*	$(".scrolling").apply_autoscroll({
	*       'menu'				: true,						// (bool) true || false, defaut true
	*		'menu_id'			: 'scroll_menu',			// (string) defaut scroll_menu => absolutely required
	*		'menu_class'		: null,						// (string) defaut null => you can add somme classes
	*		'menu_parent'   	: 'body',					// (string) defaut body => selector for parent menu, the menu is prepend on this element
	*		'quiet_period'		: 500,						// (int) defaut 500 => quiet period for prevent human scroll add jQuery scrolling animation
	*		'animation_time'	: 1000,						// (int) defaut 1000 (1 seconde) => duration of scrolling
	*		'first_element'		: $(el[0]),					// (jQuery selector) defaut is the first element of scrolling selector
	*		'last_element'		: $(el[ el.length - 1 ]),	// (jQuery selector) defaut is the last element of scrolling selector
	*	});
	*	
	*	Warning
	*	-------
	*	id option should not be null
	*
	************************************************************/
    $.fn.apply_autoscroll = function(apply_autoscroll_options = null){
		el = this;
		
		//defaut options
        var apply_autoscroll_defauts = {
	        'menu'				: true,
			'menu_id'			: 'scroll_menu',
			'menu_class'		: null,
			'menu_parent'   	: 'body',
			'quiet_period'		: 500,
			'animation_time'	: 1000,
			'first_element'		: $(el[0]),
			'last_element'		: $(el[ el.length - 1 ]),
        };  
        apply_autoscroll_options = $.extend(apply_autoscroll_defauts, apply_autoscroll_options);

        //calculate data for first and last element to activate auto scroll
        apply_autoscroll_options.top_scroll_limit 		= apply_autoscroll_options.first_element.position().top;
        apply_autoscroll_options.bottom_scroll_working 	= apply_autoscroll_options.last_element.position().top;
        //time for prevent scrolling
        apply_autoscroll_options.last_animation			= 0;
		//set defaut lastdirection -> use for detect minimum 2 scroll in one direction (debug on tactile mouse)
		apply_autoscroll_options.last_direction 		= null;


		////////////////////////////
		//
        //	Manage menu
        //
        ////////////////////////////
        if(apply_autoscroll_options.menu){
	        //add selector
	        apply_autoscroll_options.menu_selector = '#' + apply_autoscroll_options.menu_id;
	        
	        //add html menu
	        $( apply_autoscroll_options.menu_parent ).prepend('<ul ' + ( apply_autoscroll_options.menu_id != null ? 'id="' + apply_autoscroll_options.menu_id + '"' : "" ) + ( apply_autoscroll_options.menu_class != null ? 'class="' + apply_autoscroll_options.menu_class + '"' : "" ) + '></ul>');
		    
		    //add li element
	        for (i = 0; i < el.length; i++) {
	            $(apply_autoscroll_options.menu_selector).prepend('<li></li>');
	        }
	        
	        //function to update menu
	        function update_menu(elem) {
	            index = $(el).index( elem );
	            $(apply_autoscroll_options.menu_selector).find("li").removeClass("active");
	            $(apply_autoscroll_options.menu_selector).find("li:eq(" + index + ")").addClass("active"); 
	        }
	        
	        //scroll on click menu
	        $(apply_autoscroll_options.menu_selector).find("li:not(.active)").click(function () {
		        //index of li
	            index = $(this).index( $(apply_autoscroll_options.menu_selector).find("li") );
				//launch scroll to el
	            scroll_to( $(el).eq(index) );
	
	            return false;
	        });
        }    
        
        
		////////////////////////////
		//
        //	Launch scrolling
        //	----------------
        //
        ////////////////////////////
        $(document).bind('mousewheel DOMMouseScroll', event_scroll);

        //fonction qui scroll
        function event_scroll(event) {
	        //delta
            var delta = event.originalEvent.wheelDelta;
            if (isNaN(delta)) {
                delta = -event.originalEvent.detail;
            }

            if (delta < 0) {
                if (apply_autoscroll_options.last_direction != "bas") {
                    event.preventDefault();
                } else {
	                //scroll down
                    pos = $(window).scrollTop();
                    el_proche = next_elem_bottom(pos);
                    if (el_proche) {
                        event.preventDefault();
                        init_scroll(event, delta, el_proche);
                    }
                }
                apply_autoscroll_options.last_direction = "bas";
            } else if (delta > 0) {
                if (apply_autoscroll_options.last_direction != "haut") {
                    event.preventDefault();
                } else {
                    //scroll top
                    pos = $(window).scrollTop();
                    el_proche = next_elem_top(pos);
                    if (el_proche) {
                        event.preventDefault();
                        init_scroll(event, delta, el_proche);
                    }
                }
                apply_autoscroll_options.last_direction = "haut";
            }
        }
        
        
		////////////////////////////
		//
        //	Utilities scrolling
        //	-------------------
        //
        ////////////////////////////
        
        //search closer element top of current position
        function next_elem_top(pos) {
            closer = false;
            $($(el).get().reverse()).each(function (k, v) {
                element_position_top = Math.floor($(v).position().top);
                if (pos - 2 > element_position_top && closer == false) {
                    closer = v;
                }
            });
            return closer;
        }
        
		//search closer element bottom of current position
        function next_elem_bottom(pos) {
            closer = false;
            $.each($(el), function (k, v) {
                element_position_top = Math.ceil($(v).position().top);
                if (pos + 2 < element_position_top && closer == false) {
                    closer = v;
                }
            });
            return closer;
        }
             
        //init scroll and prevent human scrolling when computer scrolling is on the way
        function init_scroll(event, delta, el_proche) {
            deltaOfInterest = delta;

            var time_now = new Date().getTime();

            if (time_now - apply_autoscroll_options.last_animation < apply_autoscroll_options.quiet_period + apply_autoscroll_options.animation_time) {
                event.preventDefault();
                return;
            }

            scroll_to(el_proche);

            apply_autoscroll_options.last_animation = time_now;
        }   
        
        //fonction to scroll with animate
        function scroll_to(elem) {
            $('html, body').animate({scrollTop: $(elem).position().top}, apply_autoscroll_options.quiet_period, function () {
	            if(apply_autoscroll_options.menu){
                	update_menu(elem);
                }
            });
        }
        
           
    };
	
	
	
	
	
	/************************************************************
	*
	*	apply_full_height
	*	=================
	*
	*	Function to set height of element has full-height class
	*
	*	How to use ?
	*	------------
	*	
	*	$(YOUR_SELECTOR).apply_full_height();
	*
	************************************************************/
    $.fn.apply_full_height = function(options = null){
    	el = this;
		
		//set height for div
		init_apply_full_height = function(){	
			//get window height
			window_height = $(window).height();	
			//set height of each elem
			$(el).each(function(k,v){
				$(v).css("minHeight",window_height);
			});
		};
        
        //apply full height on resize event
        $( window ).resize(function() {
			init_apply_full_height();
		});
        
        //launch apply_full_height
        init_apply_full_height();
    };
})(jQuery);















