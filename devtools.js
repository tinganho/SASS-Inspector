var CHROMESASS = (function($){


  var C = {}, // Shortname use application name followed by a C, like for Twitter, use TC.


  /* 
  -------------------------------------------------------
  Private variables 
  -------------------------------------------------------
  */

  // Description of your variable
  YOUR_FIRST_VARIABLE = null



  /* 
  -------------------------------------------------------
  Public variables 
  -------------------------------------------------------
  */

  // Description of your variable
  C.your_first_public_variable;

  /**
   *  @object 
   *    Example object, this is an example project
   *  @method
   */
  C.example_object = {
    method1: function () {

    }
  }


  /* 
  -------------------------------------------------------
  Constructor
  -------------------------------------------------------
  */


  /**
   *  @constructor
   */
  C.constructor = function () {
    C.createSidebarPane();
  }

  /* 
  -------------------------------------------------------
  Private methods 
  -------------------------------------------------------
  */
  function page_getProperties() {
    // Make a shallow copy with a null prototype, so that sidebar does not
    // expose prototype.
    var styleSheets = document.styleSheets;
    
    for(var i in styleSheets) {
      var rules = styleSheets[i].cssRules;
      for(var y in rules[i]) {
        if(rules[i][y].type == CSSRule.IMPORT_RULE) {
          
        }
        
        if(rules[i][y].type == CSSRule.MEDIA_RULE) {
          
        }
        
        if(rules[i][y].type == CSSRule.STYLE_RULE) {
          
        }
        
        
      }
    }
  }

  /* 
  -------------------------------------------------------
  Public methods 
  -------------------------------------------------------
  */
 
  /**
   * @method
   *  Creates the sidebar in Chrome Developer Tools
   * @result void
   */
  C.createSidebarPane = function() {
    chrome.devtools.panels.elements.createSidebarPane(
      "SASS Properties",
      function(sidebar) {
        function updateElementProperties() {
          sidebar.setExpression("(" + page_getProperties.toString() + ")()");
        }
        updateElementProperties();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
    });
  }


  // Execute constructor
  C.constructor();

  // Return object
  return C;


})(jQuery);
