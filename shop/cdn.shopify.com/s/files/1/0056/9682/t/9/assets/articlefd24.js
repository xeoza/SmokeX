$(document).ready(function($) {
	$('.lookbook .byline').appendTo('.lookbook .intro');
	
	sizeContent();

	/* Add background color to nav based on position of .content */	
	$(window).scroll(function() {

		offset = $('.article .intro').offset().top + $('.article .intro').innerHeight();
		
	    if ( $(window).scrollTop() >= offset ) {
	        $('.all').addClass('fixed');
	    }
	    else $('.all').removeClass('fixed');
	});

	$(window).resize(function () {
		sizeContent();
	}); 

	function sizeContent() {

		var ww = $(window).width();
			
		if (ww < 1054) {		
			$('.all').addClass('min');
		}
		else {
			$('.all').removeClass('min');
		}
	} // end sizeContent			

});