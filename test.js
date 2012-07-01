var SASSINSPECTOR = (function($){


  var C = {}, // Shortname use application name followed by a C, like for Twitter, use TC.


  /* 
  -------------------------------------------------------
  Private variables 
  -------------------------------------------------------
  */

  // Description of your variable
  SASS_DEBUG_INFO = [];
  
  /* 
  -------------------------------------------------------
  Constants
  -------------------------------------------------------
  */
  const editorProtocols = {
        txmt: "Textmate",
        mvim: "MacVim",
        emacs: "Emacs"
  };



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
    C.test();
  }

  /* 
  -------------------------------------------------------
  Private methods 
  -------------------------------------------------------
  */
 
 
  /**
   * @private method
   * 
   */
  function pageGetProperties() {
    
    var n = 0;
    var sassStylesheet = false;
    SASS_DEBUG_INFO = new Array();
    function searchAStyleSheet(styleSheet) {
      sassStylesheet = false;
      if(styleSheet.cssRules == null) return;
      
      var rules = styleSheet.cssRules;
      
      // Minimum requirements for a SASS debug stylesheet    
      if(rules[0].type == CSSRule.MEDIA_RULE) {
        if(rules[0].media.mediaText != '-sass-debug-info') return;
        sassStylesheet = true;
      }else if(rules[0].type == CSSRule.STYLE_RULE) {
        return;
      }

      for(var i = 0; i < rules.length; i++) {
        if(rules[i].type == CSSRule.IMPORT_RULE) {
          searchAStyleSheet(rules[i].styleSheet);
        }
        
        if(rules[i].type != CSSRule.MEDIA_RULE) continue;
        
        if(rules[i + 1].type != CSSRule.STYLE_RULE) continue;
        
        if(sassStylesheet){
          // console.log(jQuery($0));
        }
        
        if(jQuery($0).is(rules[i + 1].selectorText)) {
            var tmp = {
              sourceName: 'http://loc.unionen.se',
              cssText: rules[i + 1].cssText
            }
            SASS_DEBUG_INFO.push(tmp);
        }
      }
      
      
    }
    
    var styleSheets = document.styleSheets;
    for(var i in styleSheets) {
      if(styleSheets[i].cssRules == null) continue;
      searchAStyleSheet(styleSheets[i]);
    }
    return SASS_DEBUG_INFO;
    
  }
  
  /**
   * 
   */
  
  /* 
  -------------------------------------------------------
  Public methods 
  -------------------------------------------------------
  */
  C.test = function() {
    chrome.devtools.inspectedWindow.eval('(' + pageGetProperties.toString() + ')()', function(result, isException){
      if(!isException)
        document.write(JSON.stringify(result));
    });
    
  }

  // Execute constructor
  C.constructor();

  // Return object
  return C;


})(jQuery);
