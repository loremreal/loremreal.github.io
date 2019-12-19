var detect = (function($){
	return {
		svg: function(){
			if(Modernizr.svgasimg && Modernizr.svg) {
				return true;
			}
			else{
				return false;
			}
		}
	};
})(jQuery);

var scrollactions = (function($){
	var functions = {};

	return {
		run : function(evt){
			var g;
			for(var i in functions) {
				if(typeof functions[i] == 'function') {
					g = functions[i];

					g(evt);
				}
			}
		},
		add : function(name, forAdding) {
			if(typeof forAdding == 'function') {
				functions[name] = forAdding;
			}
		},
		remove : function(name) {
			if(typeof functions[name] == 'function') {
				delete functions[name];
			}
		}
	};
})(jQuery);

var disclaimer = (function(){
	var template = '';
	return {
		initialize: function(disclaimer) {
			template = '<div id="disclaimer_instance" class="shader"><div class="disclaimer-window"><div class="disclaimer-prime"><h2>Privacy Policy</h2>'+disclaimer+'</div><div class="close form-close-light"></div></div></div>';
		},
		open : function(onclosefunction){
			//process link
			
			$('body').append(template);

			$('#disclaimer_instance').transition({
				'opacity' : 1
			}, 600, function(){
				$('.disclaimer-window').transition({
					'opacity' : 1,
					'x' : '-50%',
					'y' : '-50%'
				}, 600, function(){
					$('.disclaimer-window').on('click', function(e){
						e.preventDefault();
					});

					$('#disclaimer_instance').on('click', function(){
						onclosefunction();
					});

					$('#disclaimer_instance .close').on('click', function(){
						onclosefunction();
					});
				});
			});
		},
		close : function() {
			$('.disclaimer-window').transition({
				'opacity' : 0,
				'x' : '-50%',
				'y' : '-70%'
			}, 600, function(){
				$('#disclaimer_instance').transition({
					'opacity' : 0
				}, 600, function(){
					$('#disclaimer_instance').remove();
				});
			});
		}
	};
})(jQuery);
(function($){
	$(document).ready(function(){
		var vexels = $('.vector-icon').toArray();
		var vexgrounds = $('.vector-background').toArray();
		var i;
		var o;


		if(detect.svg()) {
			for(i in vexels) {
				$(vexels[i]).attr('src', $(vexels[i]).attr('vector-src'));
			}

			for(o in vexgrounds) {
				$(vexgrounds[o]).find('.bg').css({
					'background-image' : 'url(\''+$(vexgrounds[o]).attr('vector-src')+'\')'
				});
			}
		}
		else{
			for(i in vexels) {
				$(vexels[i]).attr('src', $(vexels[i]).attr('raster-src'));
			}

			for(o in vexgrounds) {
				$(vexgrounds[o]).find('.bg').css({
					'background-image' : 'url(\''+$(vexgrounds[o]).attr('raster-src')+'\')'
				});
			}
		}

		$('#mobile-menu-trigger').on('click', function(){
			$('body').toggleClass('menu-open');
			if($('body').hasClass('menu-open')) {
				$('nav').css({
					'height' : $('nav').attr('data-stacks') * 55
				});
			}
			else{
				$('nav').css({
					'height' : ''
				});
			}
		});


		$(window).on('resize', function(){
			$('body').removeClass('menu-open');
			$('nav').css({
				'height' : ''
			});
		});

		$('.scrolldown').on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			var target = $(this).closest('.section');

			$('#wrapper').animate({
				'scrollTop' : $('#wrapper').scrollTop() + $(target).position().top + parseInt($(target).css('height'), 10)
			}, 600);
		});

		$('#wrapper').on('scroll', function(e){
			scrollactions.run(e);
		});

		disclaimer.initialize($('#d-info').html());
	});
})(jQuery);