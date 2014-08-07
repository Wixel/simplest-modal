/*!
 * Simplest possible jQuery Modal plugin
 *
 * @author   : http://twitter.com/SeanNieuwoudt
 * @author   : http://twitter.com/wixelhq
 * @url		   : http://github.com/Wixel/jquery-popdown.git
 * @copyright: 2014 Wixel
 * @license  : MIT license
 * @version  : 1.0
 */
;(function($) {
	$.fn.open_modal = function(el, id, url) {
  	if($('div.modal-opacity').is(':visible')) {
  		return;
  	} else {
			_modal   = $(id);
			_opacity = $('<div class="modal-opacity"></div>');
			_loader  = $('<span id="modal-loader">Loading...</span>');

  		_modal.css({
  			left: ($(window).outerWidth(true) / 2) - (_modal.outerWidth(true) / 2)
  		});  		

  		_opacity.css({
  			height: $(window).outerHeight(true),
				width:  $(window).outerWidth(true),
				overflowY: "scroll"
  		});  	  		

  		if(typeof url !== 'undefined') {
  			$('body').append(_loader);

  			_loader.css({
  				display:"block",
  				color: "#fff",
  				width:"100%",
  				textAlign:"center",
  				position:"absolute",
  				zIndex:1000,
  				left:0,
  				top:($(window).outerHeight(true) / 2) - (_loader.outerHeight(true) / 2)
  			});  			

  			_loader.wrap(_opacity);

				$.ajax({
				  type: "GET",
				  url: url,
				  cache: false,
				}).done(function(html) {
					_loader.unwrap().remove();

					_modal = $(html).attr("ajax", true).hide(); 		  				

					$('body').append(_modal);

					_modal.css({
						left: ($(window).outerWidth(true) / 2) - (_modal.outerWidth(true) / 2)
					});   				

					_modal.wrap(_opacity).fadeIn('fast', function() {
						$(this).addClass('modal-done').append('<a href="#" class="close-modal">Close</a>');
					});  				    
				}).fail(function(xhr, status){
					_loader.html("Shucks, that page could not be loaded.");
				});
  		} else {
	  		_modal.wrap(_opacity).fadeIn('fast', function() {
	  			$(this).addClass('modal-done').append('<a href="#" class="close-modal">Close</a>');
	  		});  	
  		}
  	}
	};

	// Close the modal and remove attributes
	$.fn.close_modal = function() {
  	if($('div.modal-opacity').is(':visible')) {
  		_modal = $('div.modal-opacity').find('.modal');
			
			_modal.find('a.close-modal').remove();

  		if(_modal.attr('ajax')) {
  			_modal.fadeOut().hide().unwrap().removeClass('modal-done').remove();	
  		} else {
  			_modal.fadeOut().hide().unwrap().removeClass('modal-done');	
  		}  		
  	}		
	};

	// Check if the modal is already open
	$.fn.modal_open = function() {
  	return $('div.modal-opacity').is(':visible');	
	};

	// Initialize the modal
	$.fn.modal = function(tag, bind_dynamically) { 

		$(document).keyup(function(e){

			if(e.keyCode === 27 && $('div.modal-opacity').is(':visible')) {
				$.fn.close_modal();
			}			

			if(e.keyCode === 27 && $('#modal-loader').is(':visible')) {
				$('#modal-loader').unwrap().remove();
			}			
		});

	  $(document).on('click', 'a.close-modal', function(e){
	  	e.preventDefault();
	  	$.fn.close_modal();
	  });			

	  $(window).resize(function() {
			if($.fn.modal_open()) {

				_modal = $('.modal');

	  		$('.modal-opacity').css({
	  			height: $(window).outerHeight(true),
					width:  $(window).outerWidth(true),
					overflowY: "scroll"
	  		});  	
				_modal.css({
					left: ($(window).outerWidth(true) / 2) - (_modal.outerWidth(true) / 2)
				});   				  		
			} 
	  });    	  

	  $(document).on('click', tag, function(e){
	  	e.preventDefault();

			var self = $(this);

			if($.fn.modal_open()) {
				$.fn.close_modal();
			} 

			if(self.data('src')) {
				$.fn.open_modal(self, false, self.data('src'));
			} else {
				$.fn.open_modal(self, self.data('modal'));
			}			
	  });
	};

})(jQuery, document, window);