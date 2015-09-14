Plugin to insert responsive oas banners on demand.

on demand means that you don't need to stop the page load while the banner is loading
the banner is loaded whenever you initialise the plugin

responsive because it will use media queries to decides which banners to load

How to use it
-------------

::

    <div id="some_div_banner" data-oas-pos="Top5"></div>
    <p id="some_element_banner" data-oas-pos="Top2" data-oas-use-iframe="true"></p>
    <div id="another_banner" data-oas-pos="Top3"></div>

    $('#some_div_banner, #some_element_banner, #another_banner').oas({
        url: document.location.protocol + '//de.yapo.cl/RealMedia/ads/adstream_mjx.ads/',
        target: '_blank'
    });

With this code, just one request is made to the OAS server for the 3 banners and you should **always** call it once because:

- just one request is made to the server
- the function that prints a banner will be overwritten if you make more than one request

Async v/s Sync
--------------

We highly recommend you to use async banners, see:

- http://googledevelopers.blogspot.cl/2013/07/an-async-script-for-adsense-tagging.html
- http://adsense.blogspot.cl/2013/07/faster-more-robust-web-with-adsense.html
- https://support.google.com/adxseller/answer/3398247?hl=en

But if you want to use sync banner be sure to add data-oas-use-iframe="true" to your element, so the code is sync loaded in an iframe.


Events
------

For now the events triggered are:

- is-empty
- load
- ready
