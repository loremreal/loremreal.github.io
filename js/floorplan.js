var fm_floorplan_engine = (function($){
	var floorplans = {
		'all' : []
	};
	var progress = 0;
	var lock = false;
	var category = '';

	//--funcs

	var shift = function(toWhat) {
		if(toWhat != 'all'){
			toWhat = 'slide-'+toWhat;
		}
		if(typeof floorplans[toWhat] != 'undefined') {
			if(!lock) {
				lock = true;
				var trig = false;
				$('.plan-categories .category-options').removeClass('opened');
				$('.slides').transition({
					'opacity' : 0,
					'z-index' : ''
				}, 600, function(){
					if(!trig) {
						trig = true;
						$(floorplans[toWhat][0]).css({
							'z-index' : 2
						});

						progress = 0;
						category = toWhat;
						if(floorplans[toWhat].length < 2) {
							$('.arw').addClass('faded');
						}
						else{
							$('.arw').removeClass('faded');	
						}
						$('.category-link').removeClass('current-cat');
						$('.category-link[data-trigger="'+toWhat.replace('slide-', '')+'"]').addClass("current-cat");
						$('.selected .text').text($('.category-link[data-trigger="'+toWhat.replace('slide-', '')+'"]').text());

						setTimeout(function(){
							$(floorplans[toWhat][0]).transition({
								'opacity' : 1
							}, 600, function(){
								lock = false;
							});
						}, 100);
					}
				});
			}
		}
	};

	var slide = function(s) {
		if(!lock) {
			lock = true;
			var next, pre, post;
			var limit = floorplans[category].length;

			if(!s) {
				next = progress - 1;
				if(next < 0) {
					next = limit - 1;
				}

				pre = '-100%';
				post = '100%';
			}
			else{
				next = progress + 1;
				if(next >= limit) {
					next = 0;
				}

				pre = '100%';
				post = '-100%';
			}

			$(floorplans[category][next]).css({
				'x' : pre,
				'z-index' : 2,
				'opacity' : 1
			});

			$(floorplans[category][progress]).transition({
				'x' : post
			}, 600);

			$(floorplans[category][next]).transition({
				'x' : 0
			}, 600, function(){
				$(floorplans[category][progress]).css({
					'z-index' : '',
					'opacity' : ''
				});
				progress = next;
				lock = false;
			});
		}
	};

	return {
		initialize: function(floorplanID) {
			var fps = $('#'+floorplanID).find('.slides').toArray();

			for(var fcc in fps) {
				if(typeof(floorplans[$(fps[fcc]).attr('class').split(' ')[1]]) == 'undefined'){
					floorplans[$(fps[fcc]).attr('class').split(' ')[1]] = [];
				}

				floorplans[$(fps[fcc]).attr('class').split(' ')[1]].push($(fps[fcc]));
				floorplans.all.push($(fps[fcc]));
			}

			shift('all');

			$('#'+floorplanID).find('.arw').on('click', function(){
				if($(this).hasClass('arrow-left')) {
					slide(false);
				}
				else{
					slide(true);
				}
			});

			$('#'+floorplanID).find('.category-link').on('click', function(){
				shift($(this).attr('data-trigger'));
			});

			$('#'+floorplanID).find('.selected').on('click', function(){
				$('.plan-categories .category-options').toggleClass('opened');
			});
		}
	};
})(jQuery);

var panorama = (function($){
	var template = '<div id="panorama_instance" class="shader"><div class="panoramic-window"><div class="floor-controls"><div class="floor-shader"><div class="link-handle"></div></div></div><div class="slideshow"></div><div class="loading"><div class="progress"><div class="p-text">Loading Panorama[s]</div><div class="p-rail"><div class="p-bar"></div></div></div></div></div></div>';
	var ordinal = function ordinal_suffix_of(i) {
		var j = i % 10,
		k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	};

	var slides;
	var flrs;

	var progress = 0;

	var activate = function(){
		var np = 0;
		var gtime;
		$('#panorama_instance').find('.slide').on('mousedown', function(e){
			e.preventDefault();
			var el = $(this);
			var bp = parseFloat($(el).css('backgroundPosition').split(' ')[0]);
			$(window).on('mousemove', function(ev){
				np = bp + (ev.pageX - e.pageX);
				$(el).css({
					'background-position' : np+'px 0px'
				});
			});

			$(window).on('mouseup', function(){
				$('.slide').css({
					'background-position' : np+'px 0px'
				});
				$(window).off('mousemove');
				$(window).off('mouseup');
			});
		});
		
		$('#panorama_instance').find('.floor-controls').on('mousedown', function(e){
			e.preventDefault();
			var el = $(slides[progress]);
			var bp = parseFloat($(el).css('backgroundPosition').split(' ')[0]);
			$(window).on('mousemove', function(ev){
				np = bp + (ev.pageX - e.pageX);
				$(el).css({
					'background-position' : np+'px 0px'
				});
			});

			$(window).on('mouseup', function(){
				$('.slide').css({
					'background-position' : np+'px 0px'
				});
				$(window).off('mousemove');
				$(window).off('mouseup');
			});
		});

		$('.controls').on('mousedown', function(e){
			e.stopPropagation();
		});

		$('.farw').on('click', function(e){
			e.stopPropagation();
			clearInterval(gtime);
			$('.help-file').removeClass("sh");
			var targ = $(this).closest('.slide');
			
			var xp = parseFloat($(targ).css('backgroundPosition').split(' ')[0]);
			var dp = parseFloat($('#wrapper').css('width'));

			if(!$(this).hasClass('form-left')) {
				dp = dp * - 1;
			}

			var ttl = xp + dp;
			$(targ).transition({
				'background-position' : ttl+'px 0'
			}, 600, function(){
				$('.slide').css({
					'background-position' : ttl+'px 0'
				});

				np = ttl;
			});
		});

		$('.panoramic-window').on('click', function(e){
			e.stopPropagation();
		});

		$('.help').on('click', function(e){
			e.stopPropagation();
			$('.help-file').toggleClass("sh");
			clearInterval(gtime);
			
			if($('.help-file').hasClass('sh')) {
				gtime = setTimeout(function(){
					$('.help-file').removeClass("sh");
				}, 20000);
			}
		});

		$('#panorama_instanec').on('click', function(){
			close();
		});

		$('#panorama_instance .close').on('click', function(e){
			e.stopPropagation();
			close();
		});

		$('.alt-flr-trigger').on('click', function(e){
			e.stopPropagation();
			var trg = $(this).attr('data-ind');

			$('.'+trg).click();
		});

		$('.floor-link').on('click', function(e){
			e.stopPropagation();
			if(progress != $(this).attr('data-ind')) {
				var next = $(this).attr('data-ind');
				var pre, post;
			
				if(parseFloat(next) > parseFloat(progress)) {
					pre = '-100%';
					post = '100%';
				}
				else{
					pre = '100%';
					post = '-100%';
				}

				$(flrs).removeClass('tkd');

				$(flrs[flrs.length - 1 - next]).addClass('tkd');

				$(slides[next]).css({
					'x' : 0,
					'y' : pre,
					'z-index' : 2
				});

				$(slides[progress]).transition({
					'x' : 0,
					'y' : post
				}, 600);


				$(slides[next]).transition({
					'x' : 0,
					'y' : 0
				}, 600, function(){
					$(slides[progress]).css({
						'z-index' : ''
					});

					progress = next;
				});

			}
		});
	};

	var close = function(){
		$('.panoramic-window').transition({
			'opacity' : 0,
			'x' : '-50%',
			'y' : '-70%'
		}, 600, function(){
			$('#panorama_instance').transition({
				'opacity' : 0
			}, 600, function(){
				$('#panorama_instance').remove();
			});
		});
	};

	return {
		initialize: function(el) {
			var available_floors = JSON.parse($(el).attr('data-floors')).join(' ');

			$(el).find('.views').on('click', function(e){
				e.preventDefault();
				var target = $(this).attr('href');
				var plan_info = $(this).attr('data-plan-info').split('/');
				

				if(available_floors.split(' ').length == 1) {
					$('body').append(template.replace('[s]', ''));
				}
				else {
					$('body').append(template.replace('[s]', 's'));
				}
				$('.panoramic-window').append('<div class="plan-info"><div class="close form-close-light close-loading"></div><div class="plan-name">Viewing: '+plan_info[0]+'</div><div class="plan-spec">'+plan_info[1]+'</div><div class="plan-floors"><div class="floor-head">Available Floors:</div></div></div>');

				$('#panorama_instance').transition({
					'opacity' : 1
				}, 600, function(){
					$('.panoramic-window').transition({
						'opacity' : 1,
						'x' : '-50%',
						'y' : '-50%'
					}, 600, function(){
						$.ajax({
							type: "POST",
							url: target,
							data: {
								id : $(el).attr('data-id'),
								floors : available_floors
							},
							success: function(floordata){
								var imgs = '';
								var limit = 0;
								var done = 0;

								var help = '<div class="help-file">Use the left and right arrows below or drag the background image to rotate the camera. Use links on the right side of the panoramic panel to change floors.</div>';
								var ctrls = '<div class="controls"><div class="help" title="Help"></div><div class="farw form-left"></div><div class="farw form-right"></div></div>';

								var links = '';
								for(var fd in floordata) {
									imgs += '<div class="slide">'+help+ctrls+'<img src="'+floordata[fd].img+'" /></div>';
									links = '<div class="floor-link flr-trigger-'+limit+'" data-ind="'+limit+'"><span>'+ordinal(floordata[fd].floor)+' Floor</span></div>'+links;
									$('.plan-floors').append('<span class="alt-flr-trigger" data-ind="flr-trigger-'+limit+'">'+ordinal(floordata[fd].floor)+' Floor</span>');
									limit++;
								}

								$('.slideshow').append(imgs);

								$('.link-handle').append(links);

								slides = $('.slide').toArray();
								flrs = $('.floor-link').toArray();

								$(slides[0]).css({
									'z-index' : 2
								});

								$(flrs[limit - 1]).addClass('tkd');

								$('.slide img').on('load', function(){
									var el = $(this);
									$(el).parent().css({
										'background-image' : 'url('+$(el).attr('src')+')'
									});
									done++;	
								});

								$('.slide img').on('error', function(){
									done++;	
								});

								var x = setInterval(function(){
									if(done == limit) {
										clearInterval(x);
										
										//do
										$('.p-bar').css({
											'width' : parseFloat((done/limit) * 100).toFixed(3)+'%'
										});

										//setup
										setTimeout(function(){
											$('.slide img').remove();
											$('.loading').transition({
												'opacity' : 0
											}, 600, function(){
												$('.loading').remove();
												
												activate();
											});
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
			});
		}
	};
})(jQuery);

var modal = (function(){
	var template = '<div id="video_instance" class="shader"><div class="view-360-window"><div class="close form-close-light"></div></div></div>';
	var open = function(srcurl, tooltip, onclosefunction){
		//process link
		$('body').append(template);
		$('<div class="frame-handler"><iframe src="'+srcurl+'" frameborder="0"></iframe></div><div class="link"><a href="'+srcurl+'" target="_blank">'+tooltip+'</a></div>')
		.load(function() {
		 
		}).appendTo('#video_instance .view-360-window');
		$('#video_instance').transition({
			'opacity' : 1
		}, 600, function(){
			$('.view-360-window').transition({
				'opacity' : 1,
				'x' : '-50%',
				'y' : '-50%'
			}, 600, function(){
				$('.view-360-window').transition({
					'opacity' : 1,
					'x' : '-50%',
					'y' : '-50%'
				}, 600, function(){

					$('#video_instance .view-360-window').on('click', function(e){
						e.stopPropagation();
					});

					$('#video_instance').find('.close').on('click', function(e){
						onclosefunction();
					});

					$('#video_instance').on('click', function(e){
						e.stopPropagation();
						onclosefunction();
					});
				});
			});
		});

	};

	var close = function() {
		$('#video_instance').css({
			'pointer-events' : 'none'
		});
		$('.view-360-window').transition({
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
	};

	return {
		initialize : function(trigger){
			$(trigger).on('click', function(e){
				e.preventDefault();
				open($(this).attr('href'), $(this).attr('data-tooltip'), close);
			});
		}
	};
})(jQuery);

(function($){
	$(document).ready(function(){
		var fps = $('.floorplans-main').toArray();

		for(var f in fps) {
			fm_floorplan_engine.initialize($(fps[f]).attr('id'));
		}

		var slds = $('.slides').toArray();

		for(var sl in slds) {
			panorama.initialize($(slds[sl]));
		}

		if($('#external-embed').length) {
			modal.initialize($('.tour-trigger'));
		}
	});
})(jQuery);