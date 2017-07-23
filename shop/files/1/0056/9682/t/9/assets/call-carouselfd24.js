/* Phones are too small for carousel. Stack images instead */
if (!(md.phone())) {
		$(window).load(function(){
			sizeGallery();
		});

		$(window).resize(function () {	
			sizeGallery();
		});	

		/* Resize Gallery */
		function sizeGallery() {

			bw = $('body').width();
		
			elements = '#carousel-wrap .prev, #carousel-wrap .next';

			$('#carousel-wrap figure.active img');
			
			actual_w = $('#carousel-wrap img').attr('width');
		
			w = (bw - actual_w - 6)/2;
				
			$(elements).css('width',w);
			
		}	

		var waitForFinalEvent = (function () {
		  var timers = {};
		  return function (callback, ms, uniqueId) {
		    if (!uniqueId) {
		      uniqueId = "Don't call this twice without a uniqueId";
		    }
		    if (timers[uniqueId]) {
		      clearTimeout (timers[uniqueId]);
		    }
		    timers[uniqueId] = setTimeout(callback, ms);
		  };
		})();


			var swit=false;
			$(function () {
			  var $highlight = function() {
			    if(!swit){
			      swit=true;
			    var $this = $("#carousel");
			    $("#carousel-wrap").addClass( "scrolling" );
			  
			    //get all visible items (in this case 3 slides)
			    var items = $this.triggerHandler("currentVisible");
			    
			    // remove all .active classes
			    $this.children().removeClass("active");
			    $this.children().addClass("inactive");
			    
			    //add .active class to 2nd / centered item
			    items.filter(":eq(1)").addClass("active").removeClass("inactive");
			      setTimeout(function(){swit=false;},300);
			      //slideNext;
			      //slidePrev;
			    }
			   } //End $highlight

			   var $highlight2 = function() { 
					if(!swit){
					swit=true;
					var $this = $("#carousel");
					$("#carousel-wrap").addClass( "scrolling" );

					$this.addClass("animating");

					//get all visible items (in this case 3 slides)
					var items = $this.triggerHandler("currentVisible");

					// remove all .active classes
					$this.children().removeClass("active");
					$this.children().addClass("inactive");

					//add .active class to 2nd / centered item
					items.filter(":eq(2)").addClass("active").removeClass("inactive");
					setTimeout(function(){swit=false;},300);

					$this.removeClass("animating");
					}
				} //End $highlight2

				var switchBlock = function(){
				 swit = true;
				 setTimeout(function(){swit=false;},500);
				} //End switchBlock

				var notScrolling = function() {
						$("#carousel-wrap").removeClass('scrolling'); 
				}
			   
				$('#carousel').carouFredSel({
					width: '100%',
				    align: 'center',
					items: {
						visible: 3,
						minimum: 3,
						start: -1
					},
					scroll: {
						items: 1,
						duration: 1000,
						timeoutDuration: 100000,
				      	onBefore : $highlight2,
					},
				    prev : {
				      button : ".carousel-nav.prev",
				      key : "left",
				      onBefore:$highlight,
				      onAfter: notScrolling
				    },
				    next : {
				      button : ".carousel-nav.next",
				      key : "right",
				       onAfter: notScrolling
				    },
				    pagination: {
				      container: '.carousel-pagination',
				      deviation: 1,
				      onBefore:switchBlock,
				      onAfter:$highlight
				    }
				});

				$('#carousel').swipe({
		            excludedElements: "",
		            swipeLeft: function() {
		                $('#carousel').trigger('next', true);
		            },
		            swipeRight: function() {
		                $('#carousel').trigger('prev', true);
		            },
		            tap: function(event, target) {
		                // in case of an image wrapped by a link click on image will fire parent link
		                $(target).parent().trigger('click');
		            }
		        });
		  
			});
}
