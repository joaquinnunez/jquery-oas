Plugin to insert responsive oas banners on demand.

on demand means that you don't need to load it in a separated iframe or stop the page load while the banner is loading or any other weird trick.
the banner is loaded whenever you initialise the plugin

responsive because it will use media queries to decides which banners to load

How to use it
-------------

::

    $('#some_div_banner, #some_element_banner, #another_banner').oas({
        url: document.location.protocol + '//de.yapo.cl/RealMedia/ads/adstream_mjx.ads/',
        target: '_blank'
    });

With this code, just one request is made to the OAS server for the 3 banners and you should always try to call it once because:

- just one request is made to the server
- the function that prints a banner will be overwritten if you make more than one request
