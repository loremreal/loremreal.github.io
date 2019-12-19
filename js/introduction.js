var video = (function(){
	var vimeo_url = '';
	var template = '<div id="video_instance" class="shader"><div class="video-window"><div class="close form-close-light"></div></div></div>';
	var video = '<iframe src="[EMBED_LINK]?wmode=opaque" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" data-ready="true"></iframe>';
	return {
		initialize : function(vid){
			vid = vid.replace('http://vimeo.com', 'http://player.vimeo.com/video');
			vid = vid.replace('https://vimeo.com', 'https://player.vimeo.com/video');

			vid = vid.replace('http://www.vimeo.com', 'http://player.vimeo.com/video');
			vid = vid.replace('https://www.vimeo.com', 'https://player.vimeo.com/video');
			vimeo_url = vid;
			return vid;
		},
		open : function(onclosefunction){
			//process link
			$('body').append(template);
			$('#video_instance').transition({
				'opacity' : 1
			}, 600, function(){
				$('.video-window').transition({
					'opacity' : 1,
					'x' : '-50%',
					'y' : '-50%'
				}, 600, function(){
					$('.video-window').append(video.replace('[EMBED_LINK]', vimeo_url));

					$('#video_instance').find('.close').on('click', function(e){
						onclosefunction();
					});

					$('#video_instance').on('click', function(e){
						e.stopPropagation();
						onclosefunction();
					});
				});
			});

		},
		close : function() {
			$('#video_instance').css({
				'pointer-events' : 'none'
			});
			$('.video-window').transition({
				'opacity' : 0,
				'x' : '-50%',
				'y' : '-70%'
			}, 600, function(){
				$('#video_instance').transition({
					'opacity' : 0
				}, 600, function(){
					$('#video_instance').remove();
				});
			});
		}
	};
})(jQuery);
(function($){
	$(document).ready(function(){
		// scrollactions.add()
		if(!$('header').hasClass('introductor')) {
			$('header').addClass('introductor');
		}

		if(!$('body').hasClass('intro-present')) {
			$('body').addClass('intro-present');
		}

		var scrollDiv = document.createElement("div");
			scrollDiv.className = "scrollbar-measure";
			document.body.appendChild(scrollDiv);

		// Get the scrollbar width
		$('.side-links').css({
			'margin-right' : scrollDiv.offsetWidth - scrollDiv.clientWidth
		});

		// Delete the DIV 
		document.body.removeChild(scrollDiv);

		// Create the measurement node
		$(window).on('resize', function(){
			scrollDiv = document.createElement("div");
			scrollDiv.className = "scrollbar-measure";
			document.body.appendChild(scrollDiv);

			// Get the scrollbar width
			$('.side-links').css({
				'margin-right' : scrollDiv.offsetWidth - scrollDiv.clientWidth
			});

			// Delete the DIV
			document.body.removeChild(scrollDiv);
		});

		scrollactions.add('nav-layout-change',function(event){
			if($('#wrapper').scrollTop() > 10) {
				$('header').removeClass('introductor');
			}
			else{
				$('header').addClass('introductor');
			}
		});

		$('.video-link').on('click', function(e) {
			if(Modernizr.video) {
				e.preventDefault();
				video.initialize($(this).attr('href'));
				video.open(function(){
					video.close();
				});
			}
		});
		


	});
	
	
	$(window).on('load', function(){
		var timer = parseFloat($('.introduction').attr('data-timeout'));
		$('.before-frame').transition({
			'opacity' : 1
		}, parseInt(timer/2), function(){
			setTimeout(function(){
				$('.before-frame').transition({
					'opacity' : 0
				}, parseInt(timer/2), function(){
					$('.after-frame').transition({
						'opacity' : 1
					}, parseInt(timer/2));
				});
			}, timer);
		});
	});
})(jQuery);