/**
 * plugin to insert responsive oas banners on demand
 *
 * on demand means that you don't need to stop the page load while the banner is loading
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
		var url = options.url + options.sitepage + '/1' + r + '@' + listpos.join() + '?' + options.oasQuery;
		$.getScript(url).done(function(script, textStatus) {
			$this.each(function(index, element) {
				var $element = $(this);
				var pos = $element.data('oas-pos');
				var useIframe = $element.data('oas-use-iframe');

				// Here document.write function is overwritten
				// so the banner is not directly written in the document
				// and is inserted later, in the element/iframe that should contain the banner
				// the code is stored in content
				// we havent tested it with document.writeln but it should work too
				var originalDocumentWrite = document.write;
				var content = '';
				document.write = function(code) {
					content += code
				}
				// The banner is now written to content
				OAS_RICH(pos);

				// document.write is restored
				document.write = originalDocumentWrite;

				var checkBanner = function($emptyImage, $element, x) {
					if ($emptyImage.size() == 1 && $emptyImage.width() == 1) {
						// this code communicates when the banner is empty
						$element.trigger('is-empty');
					} else {
						// empty image is not present, something was loaded
						$element.trigger('load', x);
					}
				}

				if (useIframe) {

					// some of this code was stolen from https://github.com/jugglinmike/srcdoc-polyfill
					var x = document.createElement("IFRAME");
					var supportsSrcdoc = !!("srcdoc" in x);
					x.scrolling = 'no';
					x.style.border = 'none';
					content = '<!DOCTYPE html><html><body style="margin:0;">' + content + '</body></html>';
					x.setAttribute("srcdoc", content);

					if (!supportsSrcdoc) {
						// The value returned by a script-targeted URL will be used as
						// the iFrame's content. Create such a URL which returns the
						// iFrame element's `srcdoc` attribute.
						var jsUrl = "javascript: window.frameElement.getAttribute('srcdoc');";
						x.setAttribute("src", jsUrl);
					}
					$element.append(x);

					$(x).on('load', function() {
						// this code handles when the banner is loaded
						$emptyImage = $(x.contentWindow.document).find('img[src*=empty]');
						checkBanner($emptyImage, $element, x);
					});
				} else {
					$element.append(content);
					// this code handles when the banner is loaded
					$emptyImage = $element.find('img[src*=empty]');
					checkBanner($emptyImage, $element, undefined);
				}

				// The banner link target attr is forced
				if (options.target) {
					$element.find('a').attr('target', options.target);
				}
			});

			// An event is now fired, so other logic can be called
			$this.trigger('ready');
		});
		return this;
	};

	$.fn.oas.defaults = {
		target: false,
		sitepage: window.location.hostname + window.location.pathname,
		oasQuery: ''
	};
})(jQuery);
