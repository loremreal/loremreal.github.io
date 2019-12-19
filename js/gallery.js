var gallery = (function($){
	var template = '<div id="gallery_instance" class="shader"><div class="gallery-preloader"></div><div class="gallery-window"><div class="controls"><div class="arrow form-left"></div><div class="arrow form-right"></div></div><div class="slideshow"></div><div class="loading"><div class="progress"><div class="p-text">Loading Images</div><div class="p-rail"><div class="p-bar"></div></div></div></div><div class="close form-close-light close-loading"></div></div></div>';
	var slides = [];
	var showindex = 0;
	var showlimit = 0;
	var lock = false;

	var initialize = function(cb){
		slides = $('.slideshow .slide').toArray();

		$(slides[0]).css({
			'z-index' : 2
		});

		$('#gallery_instance .loading').transition({
			'opacity' : 0
		}, 600, function(){
			$('#gallery_instance .loading').remove();
		});

		$('#gallery_instance .close').css({
			'color' : '#ffffff',
			'text-shadow' : '0 0 10px rgba(0,0,0,0.2)'
		});

		//actions

		$('#gallery_instance').find('.arrow').on('click', function(e){
			e.stopPropagation();
			if($(this).hasClass('form-left')) {
				move(false);
			}
			else if($(this).hasClass('form-right')) {
				move(true);
			}
		});

		$('#gallery_instance .gallery-window').on('click', function(e){
			e.stopPropagation();
		});

		$('#gallery_instance').on('click', function(e){
			cb();
		});

		$('#gallery_instance .close').on('click', function(e){
			e.stopPropagation();
			cb();
		});
	};

	var move = function(fwd) {
		if(!lock) {
			lock = true;
			var next, pre, post;
			if(fwd) {
				next = showindex + 1;
				if(next >= showlimit) {
					next = 0;
				}

				pre = '100%';
				post = '-100%';
			}
			else {
				next = showindex - 1;
				if(next < 0) {
					next = showlimit - 1;
				}

				pre = '-100%';
				post = '100%';
			}

			$(slides[next]).css({
				'z-index' : 2,
				'x' : pre
			});

			$(slides[showindex]).transition({
				'x' : post
			}, 600);

			$(slides[next]).transition({
				'x' : 0
			}, 600, function(){
				showindex = next;
				lock = false;
			});
		}
	};

	return {
		open: function(target, gallery, closedirective){
			$('body').append(template);

			$('#gallery_instance').transition({
				'opacity' : 1
			}, 600, function(){
				$('.gallery-window').transition({
					'opacity' : 1,
					'x' : '-50%',
					'y' : '-50%'
				}, 600, function(){
					$.ajax({
						type: "POST",
						url: target,
						data: {
							id : gallery
						},
						success: function(response){
							var imgs = '';
							var limit = 0;
							var done = 0;
							for(var ind in response) {
								imgs += '<img src="'+response[ind]+'" />';
								$('.slideshow').append('<div class="slide" style="background-image: url(\''+response[ind]+'\')"></div>');
								limit++;
							}
							$('.gallery-preloader').append(imgs);
							
							$('.gallery-preloader img').on("load", function(){
								done++;
							});

							$('.gallery-preloader img').on("error", function(){
								$(this).remove();
								done++;
							});
							showlimit = limit;

							var x = setInterval(function(){
								if(done == limit) {
									clearInterval(x);
									//done
									$('.gallery-preloader').remove();
									//do

									$('.p-bar').css({
										'width' : parseFloat((done/limit) * 100).toFixed(3)+'%'
									});

									//setup
									setTimeout(function(){
										initialize(closedirective);
									}, 600);
								}
								else{
									$('.p-bar').css({
										'width' : parseFloat((done/limit) * 100).toFixed(3)+'%'
									});
								}
							}, 10);
						}
					});
				});
			});
		}, 
		close: function(){
			$('.shader, .gallery-window, .gallery-window .arrow').css({
				'pointer-events' : 'none'
			});

			$('.gallery-window').transition({
				'opacity' : 0,
				'x' : '-50%',
				'y' : '-70%'
			}, 600, function(){
				$('#gallery_instance').transition({
					'opacity' : 0
				}, 600, function(){
					$('.shader').remove();
					slides = [];
					showindex = 0;
					showlimit = 0;
					lock = false;
				});
			});
		}
	};
})(jQuery);
(function($){

	$(document).ready(function(){
		$('.trigger_gallery').on('click', function(e){
			e.preventDefault();
			gallery.open('', $(this).closest('.section').attr('data-gallery-id'), gallery.close);
		});
	});
})(jQuery);