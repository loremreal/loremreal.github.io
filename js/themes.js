(function($){
	$(document).ready(function(){
		$('.tr-0').addClass('act');
		$('.theme-0').addClass('shownd');

		$('.theme-switch-trigger').on('click', function(e){
			var targ = $(this).attr('data-index').replace('t-', '');
			var parb = $(this).closest('.theme-copy');
			$(parb).find('.theme-switch-trigger').removeClass('act');
			$(parb).find('.tr-'+targ).addClass('act');

			$(parb).find('.theme-images').removeClass('shownd');
			$(parb).find('.theme-'+targ).addClass('shownd');
		});
	});
})(jQuery);