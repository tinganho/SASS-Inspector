/*!
 * SASS Inspector
 *
 * Released under the MIT license
 * https://github.com/tinganho/SASS-Inspector
 *
 * Date: Wed Aug 22nd 2012 03:49:00 GMT+0200 (Eastern Daylight Time)
 */

(function(){
  chrome.devtools.panels.elements.createSidebarPane(
    "SASS Properties",
    function(sidebar) {
      function updateElementProperties() {
        sidebar.setPage('src/sidebar.html');
        sidebar.onShown.addListener(function(win){
          setTimeout(function(){
            var ul = win.document.body.getElementsByClassName('si-css-selector-list');
            if(!ul) return false;
            var cheight = win.getComputedStyle(ul[0]).height
            height = parseInt(cheight.replace('px', ''), 10);
            if(height > 1200) height = 400;
            sidebar.setHeight(height + 'px');
          }, 300);

        });
      }
      updateElementProperties();
      chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-53743351-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
})();
