(function($){
  chrome.devtools.panels.elements.createSidebarPane(
    "SASS Properties",
    function(sidebar) {
      function updateElementProperties() {
        sidebar.setPage('src/sidebar.html');
        // sidebar.setExpression("(" + pageGetProperties.toString() + ")()");
      }
      updateElementProperties();
      chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
  });
})();
