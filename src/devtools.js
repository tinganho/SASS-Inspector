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
        var _iframe = document.createElement('iframe');
        _iframe.src = 'sidebar.html';
        _iframe.addEventListener('load', function(){
            setTimeout(function(){
              var height = _iframe.contentWindow.getComputedStyle(_iframe.contentDocument.body).height;
              var height = parseInt(height.replace('px', ''), 10) - 25;
              sidebar.setHeight(height + 'px');
            }, 200);
        }, false);
        document.body.appendChild(_iframe);

      }
      updateElementProperties();
      chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });
})();
