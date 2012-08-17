(function(){
  chrome.devtools.panels.elements.createSidebarPane(
    "SASS Properties",
    function(sidebar) {
      function updateElementProperties() {
        sidebar.setPage('src/sidebar.html');
        var _iframe = document.createElement('iframe');
        _iframe.src = 'sidebar.html';
        _iframe.addEventListener('load', function(){
          console.log(_iframe.contentDocument.readyState)
            setTimeout(function(){
              var height = _iframe.contentWindow.getComputedStyle(_iframe.contentDocument.body).height;
              var height = parseInt(height.replace('px', ''), 10) - 25;
              sidebar.setHeight(height + 'px');
            }, 200);
        }, false);
        document.body.appendChild(_iframe)

      }


      updateElementProperties();
      chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });
})();
