/**
 * plugin to insert responsive oas banners on demand
 *
 * on demand means that you don't need to load it in a separated iframe or
 * stop the page load while the banner is loading or any other weird trick.
 * the banner is loaded whenever you initialize the plugin
 *
 * responsive because it will use media queries to decides which banners to load
 */
(function($) {
	// options is an object with the following keys:
	// url (required) The url of the adserver
	// sitepage (required) The page to be sent for the ad server
	// target (optional) if the code inserted is html, it forces the target attr in the link
	// values of target are _blank _self _parent _top or a framename
	// if target is not present is left intact
	// positions are defined by the data-oas-pos attribute in each the element.

	$.fn.oas = function(options) {

		// Reading user options and mixing them with the defaults
		options = $.extend({}, $.fn.oas.defaults, options);
		$this = this;

		if ($this.size() <= 0) {
			return $this;
		}

		// Here we append all the positions so just one request is made
		var listpos = [];
		$this.each(function() {
			listpos.push($(this).data("oas-pos"));
		});

		// Here we build the url
		var r = String(Math.random()).substring (2, 11);
		var url = options.url + options.sitepage + '/1' + r + '@' + listpos.join() + '?' + '';
		$.getScript(url).done(function(script, textStatus) {
			$this.each(function(index, element) {
				// Here document.write is overwritten so the banner is not directly written in the document
				// and is inserted in the element that should contain the banner
				// we havent tested it with document.writeln but it should work too
				var originalDocumentWrite = document.write;
				var $element = $(this);
				document.write = function(code) {
					$element.append(code);
					// this code handles when the banner image is loaded
					// this won't be triggered if the banner is a flash
					$element.find('img:not([src*=empty])').on('load', function(e) {
						$element.trigger('loaded');
					});
				}

				// The position name is read from the element
				var pos = $element.data('oas-pos');

				// The banner is now written
				OAS_RICH(pos);
				// document.write is restored
				document.write = originalDocumentWrite;

				// If the banner didnt load, we fire an event to let you decide what to do
				if($element.find('img').width() == 1) {
					// this code communicates when the banner is empty
					$element.trigger('is-empty');
				}

				// The banner link target attr is forced
				if (options.target) {
					$element.find('a').attr('target', options.target);
				}
			});
		});
		return this;
	};

	$.fn.oas.defaults = {
		target: false,
		sitepage: window.location.hostname + window.location.pathname
	};
})(jQuery);
