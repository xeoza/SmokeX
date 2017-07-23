/*global $, console, alert, App, Shopify*/
/*jshint unused:false, devel:true*/

// (function() {

// 	var App = window.App = (window.App || {});
// 	var Shopify = window.Shopify = (window.Shopify || {});

// 	// (c) Copyright 2009 Jaded Pixel. Author: Caroline Schnapp. All Rights Reserved.

// 	/*

// 	IMPORTANT:

// 	Ajax requests that update Shopify's cart must be queued and sent synchronously to the server.
// 	Meaning: you must wait for your 1st ajax callback to send your 2nd request, and then wait
// 	for its callback to send your 3rd request, etc.

// 	*/

// 	if ((typeof Shopify) === 'undefined') {
// 	  Shopify = {};
// 	}

// 	/*

// 	Override so that Shopify.formatMoney returns pretty
// 	money values instead of cents.

// 	*/

// 	Shopify.money_format = '$';

// 	/*

// 	Events (override!)

// 	Example override:
// 	  ... add to your theme.liquid's script tag....

// 	  Shopify.onItemAdded = function(line_item) {
// 	    $('message').update('Added '+line_item.title + '...');
// 	  }

// 	*/

// 	Shopify.onError = function(XMLHttpRequest, textStatus) {
// 	  // Shopify returns a description of the error in XMLHttpRequest.responseText.
// 	  // It is JSON.
// 	  // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
// 	  var data = eval('(' + XMLHttpRequest.responseText + ')');
// 	  if (!!data.message) {
// 	    alert(data.message + '(' + data.status  + '): ' + data.description);
// 	  } else {
// 	    alert('Error : ' + Shopify.fullMessagesFromErrors(data).join('; ') + '.');
// 	  }
// 	};

// 	Shopify.fullMessagesFromErrors = function(errors) {
// 	  var fullMessages = [];
// 	  jQuery.each(errors, function(attribute, messages) {
// 	    jQuery.each(messages, function(index, message) {
// 	      fullMessages.push(attribute + ' ' + message);
// 	    });
// 	  });
// 	  return fullMessages
// 	}

// 	Shopify.onCartUpdate = function(cart) {
// 	  alert('There are now ' + cart.item_count + ' items in the cart.');
// 	};

// 	Shopify.onCartShippingRatesUpdate = function(rates, shipping_address) {
// 	  var readable_address = '';
// 	  if (shipping_address.zip) readable_address += shipping_address.zip + ', ';
// 	  if (shipping_address.province) readable_address += shipping_address.province + ', ';
// 	  readable_address += shipping_address.country
// 	  alert('There are ' + rates.length + ' shipping rates available for ' + readable_address +', starting at '+ Shopify.formatMoney(rates[0].price) +'.');
// 	};

// 	Shopify.onItemAdded = function(line_item) {
// 	  alert(line_item.title + ' was added to your shopping cart.');
// 	};

// 	Shopify.onProduct = function(product) {
// 	  alert('Received everything we ever wanted to know about ' + product.title);
// 	};

// 	/* Tools */

// 	/*
// 	Examples of call:
// 	Shopify.formatMoney(600000, 'â‚¬ EUR')
// 	Shopify.formatMoney(600000, 'â‚¬ EUR')
// 	Shopify.formatMoney(600000, '$')
// 	Shopify.formatMoney(600000, '') in a Liquid template!

// 	In a Liquid template, you have access to a shop money formats with:
// 	
// 	
// 	
// 	All these formats are editable on the Preferences page in your admin.
// 	*/
// 	Shopify.formatMoney = function(cents, format) {
// 	  if (typeof cents == 'string') { cents = cents.replace('.',''); }
// 	  var value = '';
// 	  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
// 	  var formatString = (format || this.money_format);

// 	  function defaultOption(opt, def) {
// 	     return (typeof opt == 'undefined' ? def : opt);
// 	  }

// 	  function formatWithDelimiters(number, precision, thousands, decimal) {
// 	    precision = defaultOption(precision, 2);
// 	    thousands = defaultOption(thousands, ',');
// 	    decimal   = defaultOption(decimal, '.');

// 	    if (isNaN(number) || number == null) { return 0; }

// 	    number = (number/100.0).toFixed(precision);

// 	    var parts   = number.split('.'),
// 	        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
// 	        cents   = parts[1] ? (decimal + parts[1]) : '';

// 	    return dollars + cents;
// 	  }

// 	  switch(formatString.match(placeholderRegex)[1]) {
// 	    case 'amount':
// 	      value = formatWithDelimiters(cents, 2);
// 	      break;
// 	    case 'amount_no_decimals':
// 	      value = formatWithDelimiters(cents, 0);
// 	      break;
// 	    case 'amount_with_comma_separator':
// 	      value = formatWithDelimiters(cents, 2, '.', ',');
// 	      break;
// 	    case 'amount_no_decimals_with_comma_separator':
// 	      value = formatWithDelimiters(cents, 0, '.', ',');
// 	      break;
// 	  }

// 	  return formatString.replace(placeholderRegex, value);
// 	}

// 	Shopify.resizeImage = function(image, size) {
// 	  try {
// 	    if(size == 'original') { return image; }
// 	    else {
// 	      var matches = image.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
// 	      return matches[1] + '_' + size + '.' + matches[2];
// 	    }
// 	  } catch (e) { return image; }
// 	};

// 	/* Ajax API */

// 	// -------------------------------------------------------------------------------------
// 	// POST to cart/add.js returns the JSON of the line item associated with the added item.
// 	// -------------------------------------------------------------------------------------
// 	Shopify.addItem = function(variant_id, quantity, callback) {
// 	  var quantity = quantity || 1;
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/add.js',
// 	    data: 'quantity=' + quantity + '&id=' + variant_id,
// 	    dataType: 'json',
// 	    success: function(line_item) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(line_item);
// 	      }
// 	      else {
// 	        Shopify.onItemAdded(line_item);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/add.js returns the JSON of the line item.
// 	// ---------------------------------------------------------
// 	Shopify.addItemFromForm = function(form_id, callback) {
// 	    var params = {
// 	      type: 'POST',
// 	      url: '/cart/add.js',
// 	      data: jQuery('#' + form_id).serialize(),
// 	      dataType: 'json',
// 	      success: function(line_item) {
// 	        if ((typeof callback) === 'function') {
// 	          callback(line_item);
// 	        }
// 	        else {
// 	          Shopify.onItemAdded(line_item);
// 	        }
// 	      },
// 	      error: function(XMLHttpRequest, textStatus) {
// 	        Shopify.onError(XMLHttpRequest, textStatus);
// 	      }
// 	    };
// 	    jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// GET cart.js returns the cart in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.getCart = function(callback) {
// 	  jQuery.getJSON('/cart.js', function (cart, textStatus) {
// 	    if ((typeof callback) === 'function') {
// 	      callback(cart);
// 	    }
// 	    else {
// 	      Shopify.onCartUpdate(cart);
// 	    }
// 	  });
// 	};

// 	// ---------------------------------------------------------
// 	// GET cart/shipping_rates.js returns the cart in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.getCartShippingRatesForDestination = function(shipping_address, callback) {
// 	  var params = {
// 	    type: 'GET',
// 	    url: '/cart/shipping_rates.json',
// 	    data: Shopify.param({'shipping_address': shipping_address}),
// 	    dataType: 'json',
// 	    success: function(response) {
// 	      rates = response.shipping_rates
// 	      if ((typeof callback) === 'function') {
// 	        callback(rates, shipping_address);
// 	      }
// 	      else {
// 	        Shopify.onCartShippingRatesUpdate(rates, shipping_address);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  }
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// GET products/<product-handle>.js returns the product in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.getProduct = function(handle, callback) {
// 	  jQuery.getJSON('/products/' + handle + '.js', function (product, textStatus) {
// 	    if ((typeof callback) === 'function') {
// 	      callback(product);
// 	    }
// 	    else {
// 	      Shopify.onProduct(product);
// 	    }
// 	  });
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/change.js returns the cart in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.changeItem = function(variant_id, quantity, callback) {
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/change.js',
// 	    data:  'quantity='+quantity+'&id='+variant_id,
// 	    dataType: 'json',
// 	    success: function(cart) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(cart);
// 	      }
// 	      else {
// 	        Shopify.onCartUpdate(cart);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/change.js returns the cart in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.removeItem = function(variant_id, callback) {
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/change.js',
// 	    data:  'quantity=0&id='+variant_id,
// 	    dataType: 'json',
// 	    success: function(cart) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(cart);
// 	      }
// 	      else {
// 	        Shopify.onCartUpdate(cart);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/clear.js returns the cart in JSON.
// 	// It removes all the items in the cart, but does
// 	// not clear the cart attributes nor the cart note.
// 	// ---------------------------------------------------------
// 	Shopify.clear = function(callback) {
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/clear.js',
// 	    data:  '',
// 	    dataType: 'json',
// 	    success: function(cart) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(cart);
// 	      }
// 	      else {
// 	        Shopify.onCartUpdate(cart);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/update.js returns the cart in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.updateCartFromForm = function(form_id, callback) {
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/update.js',
// 	    data: jQuery('#' + form_id).serialize(),
// 	    dataType: 'json',
// 	    success: function(cart) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(cart);
// 	      }
// 	      else {
// 	        Shopify.onCartUpdate(cart);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/update.js returns the cart in JSON.
// 	// To clear a particular attribute, set its value to an empty string.
// 	// Receives attributes as a hash or array. Look at comments below.
// 	// ---------------------------------------------------------
// 	Shopify.updateCartAttributes = function(attributes, callback) {
// 	  var data = '';
// 	  // If attributes is an array of the form:
// 	  // [ { key: 'my key', value: 'my value' }, ... ]
// 	  if (jQuery.isArray(attributes)) {
// 	    jQuery.each(attributes, function(indexInArray, valueOfElement) {
// 	      var key = attributeToString(valueOfElement.key);
// 	      if (key !== '') {
// 	        data += 'attributes[' + key + ']=' + attributeToString(valueOfElement.value) + '&';
// 	      }
// 	    });
// 	  }
// 	  // If attributes is a hash of the form:
// 	  // { 'my key' : 'my value', ... }
// 	  else if ((typeof attributes === 'object') && attributes !== null) {
// 	    jQuery.each(attributes, function(key, value) {
// 	        data += 'attributes[' + attributeToString(key) + ']=' + attributeToString(value) + '&';
// 	    });
// 	  }
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/update.js',
// 	    data: data,
// 	    dataType: 'json',
// 	    success: function(cart) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(cart);
// 	      }
// 	      else {
// 	        Shopify.onCartUpdate(cart);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};

// 	// ---------------------------------------------------------
// 	// POST to cart/update.js returns the cart in JSON.
// 	// ---------------------------------------------------------
// 	Shopify.updateCartNote = function(note, callback) {
// 	  var params = {
// 	    type: 'POST',
// 	    url: '/cart/update.js',
// 	    data: 'note=' + attributeToString(note),
// 	    dataType: 'json',
// 	    success: function(cart) {
// 	      if ((typeof callback) === 'function') {
// 	        callback(cart);
// 	      }
// 	      else {
// 	        Shopify.onCartUpdate(cart);
// 	      }
// 	    },
// 	    error: function(XMLHttpRequest, textStatus) {
// 	      Shopify.onError(XMLHttpRequest, textStatus);
// 	    }
// 	  };
// 	  jQuery.ajax(params);
// 	};


// 	if (jQuery.fn.jquery >= '1.4') {
// 	  Shopify.param = jQuery.param;
// 	} else {
// 	  Shopify.param = function( a ) {
// 	    var s = [],
// 	      add = function( key, value ) {
// 	        // If value is a function, invoke it and return its value
// 	        value = jQuery.isFunction(value) ? value() : value;
// 	        s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
// 	      };

// 	    // If an array was passed in, assume that it is an array of form elements.
// 	    if ( jQuery.isArray(a) || a.jquery ) {
// 	      // Serialize the form elements
// 	      jQuery.each( a, function() {
// 	        add( this.name, this.value );
// 	      });

// 	    } else {
// 	      for ( var prefix in a ) {
// 	        Shopify.buildParams( prefix, a[prefix], add );
// 	      }
// 	    }

// 	    // Return the resulting serialization
// 	    return s.join("&").replace(/%20/g, "+");
// 	  }

// 	  Shopify.buildParams = function( prefix, obj, add ) {
// 	    if ( jQuery.isArray(obj) && obj.length ) {
// 	      // Serialize array item.
// 	      jQuery.each( obj, function( i, v ) {
// 	        if ( rbracket.test( prefix ) ) {
// 	          // Treat each array item as a scalar.
// 	          add( prefix, v );

// 	        } else {
// 	          Shopify.buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, add );
// 	        }
// 	      });

// 	    } else if ( obj != null && typeof obj === "object" ) {
// 	      if ( Shopify.isEmptyObject( obj ) ) {
// 	        add( prefix, "" );

// 	      // Serialize object item.
// 	      } else {
// 	        jQuery.each( obj, function( k, v ) {
// 	          Shopify.buildParams( prefix + "[" + k + "]", v, add );
// 	        });
// 	      }

// 	    } else {
// 	      // Serialize scalar item.
// 	      add( prefix, obj );
// 	    }
// 	  }

// 	  Shopify.isEmptyObject = function( obj ) {
// 	    for ( var name in obj ) {
// 	      return false;
// 	    }
// 	    return true;
// 	  }
// 	}


// 	/* Used by Tools */

// 	function floatToString(numeric, decimals) {
// 	  var amount = numeric.toFixed(decimals).toString();
// 	  if(amount.match(/^\.\d+/)) {return "0"+amount; }
// 	  else { return amount; }
// 	}

// 	/* Used by API */

// 	function attributeToString(attribute) {
// 	  if ((typeof attribute) !== 'string') {
// 	    // Converts to a string.
// 	    attribute += '';
// 	    if (attribute === 'undefined') {
// 	      attribute = '';
// 	    }
// 	  }
// 	  // Removing leading and trailing whitespace.
// 	  return jQuery.trim(attribute);
// 	}

// }());

// jshint ignore: start

(function() {
	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
	var isFirefox = /Mozilla/.test(navigator.userAgent) && navigator.vendor === '';
	var supported = null;
	function isActivexEnabled() {
		try {
			supported = !!new ActiveXObject("htmlfile");
		} catch (e) {
			supported = false;
		}
		return supported;
	}
	function isFullScreen() {
		return (window.innerWidth === screen.width && window.innerHeight === screen.height);
	}
	if(Function('/*@cc_on return document.documentMode===10@*/')()) {
		$("html").addClass("ie10");
		if (supported === false && isFullScreen === true) {
			console.log('probably metro?');
		}
	} else if (!(window.ActiveXObject) && "ActiveXObject" in window) {
		$("html").addClass("ie11");
	} else if (isChrome) {
		$("html").addClass("chrome");
	} else if (isSafari) {
		$("html").addClass("safari");
	} else if (isFirefox) {
		$("html").addClass("firefox");
	}
}());

// jshint ignore: end

(function() {

	var App = window.App = (window.App || {});
	var Shopify = window.Shopify = (window.Shopify || {});

	var $cartQty = $('#bag a strong');

	if ($('html').is('.ie9,.lt-ie9')) {
		$('#add-to-bag').before('<input type="submit" name="add" value="Add to Bag" class="cart_button" id="purchase">');
		$('#add-to-bag').remove();
	}

	App.addToBag= function() {
		var handle = $('body')[0].id;
		var VID = getVID();
		var quantity = $('#quantity option:selected').val();

		function getVID() {
			if ( $('#product-select').length ) {
				return $('#product-select option:selected').val();
			} else {
				return $("input[name='id']").val();
			}
		}

		// Check for .unavailable for browsers that don't support
		// pointer-events: none on non-svg elements (cough, IE10).
		if (!$('#add-to-bag').hasClass('unavailable')) {
			Shopify.addItem(VID, quantity);
		}
	};

	Shopify.addItem = function(variant_id, quantity, callback) {
	  var quantity = quantity || 1;
	  var params = {
	    type: 'POST',
	    url: '/cart/add.js',
	    data: 'quantity=' + quantity + '&id=' + variant_id,
	    dataType: 'json',
	    success: function(line_item) {
	      if ((typeof callback) === 'function') {
	        callback(line_item);
	      }
	      else {
	        Shopify.onItemAdded(line_item);
	      }
	    },
	    error: function(XMLHttpRequest, textStatus) {
	      Shopify.onError(XMLHttpRequest, textStatus);
	    }
	  };
	  jQuery.ajax(params);
	};

	Shopify.onItemAdded = function(line_item) {
		$('.adding-to-cart').each(function(){
			$(this).remove();
		})
		$('<div class="adding-to-cart"><img src="//cdn.shopify.com/s/files/1/0056/9682/t/9/assets/check.png?7156609559052120623"><br>Item added</div>').insertAfter('footer');
		//$('.tooltip').addClass("active").fadeIn(250).delay(2000).fadeOut(250).removeClass("active");


		  $('.tooltip').addClass("active").fadeIn(250, function () {
		    $(this).delay(1000).fadeOut(250, function () {
		    	$(this).removeClass("active")
		    });
		  });



		Shopify.getCart(function(cart){
			$cartQty.html(cart.item_count);
		});
	};

	Shopify.getCart = function(callback) {
	  jQuery.getJSON('/cart.js', function (cart, textStatus) {
	    if ((typeof callback) === 'function') {
	      callback(cart);
	    }
	    else {
	      Shopify.onCartUpdate(cart);
	    }
	  });
	};

	Shopify.onCartUpdate = function(cart) {
	  alert('There are now ' + cart.item_count + ' items in the cart.');
	};

}());

(function() {

	var App = window.App = (window.App || {});

	/* http://www.iandevlin.com/blog/2010/03/javascript/converting-decimal-numbers-to-roman-numerals-in-javascript */
	App.romanNum = function decimalToRomanSimple(value) {
		var roman = [];
		roman = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
		var decimal = [];
		decimal = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
		if (value <= 0 || value >= 4000) {
			return value;
		}
		var romanNumeral = "";
		for (var i=0; i<roman.length; i++) {
			while (value >= decimal[i]) {
			value -= decimal[i];
			romanNumeral += roman[i];
			}
		}
		return romanNumeral;
	};

	/* Make whole box clickable */
	$(".item, .slide, .hero figure, #notification-bar h4").click(function() {
		var thislink = $(this).find("a");
		if ( thislink.attr('target') === '_blank') {
			window.open(thislink.attr("href"));
		}
		else {
			window.location=thislink.attr("href");
		}
		return false;
	});

	// $('nav#mobile').click(function() {
	// 	App.MobileNav.toggle();
	// });

	/* Mobile Nav */
	var windowWidth = $(window).width();
	if(windowWidth < 768){
		if ($('body').hasClass('collection') === false) {
			$('nav.subnav li').first().addClass('active');
		}
		
		$('nav.subnav li.active a' ).click(function(e){
			e.preventDefault();
		    $('nav.subnav').toggleClass('expand');
		});
	}

	// Force iphone to redraw element that have vw units
	// http://dontwakemeup.com/vw-units-and-iphone-orientation-change/
	window.addEventListener("resize", function() {
		$('section.product ul.fullsize').hide().fadeIn(1); // Didn't work with .show()
	}, false);

	// Tool tip for cart icon
	if (!(md.mobile())) {
		$(".utility").hover(function () {
			$(".tooltip").addClass("active").fadeIn(250);  //Add the active class to the area is hovered
				}, function () {
			$(".tooltip").removeClass("active").fadeOut(250);
		});
	}
}());

// @codekit-prepend "modules/init.js"
// @codekit-prepend "modules/shopify.js"
// @codekit-prepend "modules/browser.js"
// @codekit-prepend "modules/addToBag.js"
// @codekit-prepend "modules/misc.js"

// Config to make JSHint stop being such a pest.

/*global $, console*/
/*jshint unused:false*/

(function() {

	var App = window.App = (window.App || {});

	App.settings = {};
	App.settings.name = "Brooklyn Slate";
	App.settings.version = "1.1.2";

	App.init = function() {
		//console.log('----');
		//console.log(this.settings.name + "(v" + this.settings.version + ") Started.");
		//console.log('----');

		var $year = $('.year');
		$year.text ( App.romanNum($year.text() ) );
		//console.log('Year romanized.');
	};

}());

$(function() {
	App.init();
	$('html').removeClass('no-js');
});


$(document).ready(function(){
	var height = $('.article .hero img').height();

	$('.blog-header').css('height', height);

	$(window).resize(function(){
	var height = $('.article .hero img').height();

		$('.blog-header').css('height', height);
	});
});

