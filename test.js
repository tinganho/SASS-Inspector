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
 
 
  /**
   * @constants object
   *  Contains URI schemas for different editors
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


  /* 
  -------------------------------------------------------
  Constructor
  -------------------------------------------------------
  */


  /**
   *  @constructor
   */
  C.constructor = function () {
    C.evaluateCode();
  }

  /* 
  -------------------------------------------------------
  Private methods 
  -------------------------------------------------------
  */
 
 
  /**
   * @private method
   *  Gets SASS properties like file names and line numbers for different CSS selectors
   * @result Array 
   *  Returns an array of objects containing css selectors, file names & CSS selectors
   */
  function getSASSProperties() {
    
    function getLineNumber() {
      
    }
    function getFileName() {
      
    }
    function searchAStyleSheet(styleSheet) {
      
      if(styleSheet.cssRules == null) return;
      
      var rules = styleSheet.cssRules;
      
      // Minimum requirements for a SASS debug stylesheet, for boosting performance 
      if(rules[0].type == CSSRule.MEDIA_RULE) {
        if(rules[0].media.mediaText != '-sass-debug-info') return;
      }else if(rules[0].type == CSSRule.STYLE_RULE) {
        return;
      }

      for(var i = 0; i < rules.length; i++) {
        if(rules[i].type == CSSRule.IMPORT_RULE) {
          searchAStyleSheet(rules[i].styleSheet);
        }
        if(rules[i].type != CSSRule.MEDIA_RULE) continue;
        
        if(rules[i + 1].type != CSSRule.STYLE_RULE) continue;
        
        if($($0).is(rules[i + 1].selectorText)) {
            var tmp = {
              sourceName: 'http://loc.unionen.se',
              cssText: rules[i + 1].cssText
            }
            SASS_DEBUG_INFO.push(tmp);
        }
      }
    }
    SASS_DEBUG_INFO = new Array();
    var styleSheets = document.styleSheets;
    for(var i in styleSheets) {
      if(styleSheets[i].cssRules == null) continue;
      searchAStyleSheet(styleSheets[i]);
    }
    return SASS_DEBUG_INFO;
    
  }
  
  
  /* 
  -------------------------------------------------------
  Public methods 
  -------------------------------------------------------
  */
 
 
  /**
   * @public method
   *  Evaluates code in the context of the inspected window
   * @result void
   */
  C.evaluateCode = function() {
    chrome.devtools.inspectedWindow.eval('(' + getSASSProperties.toString() + ')()', function(result, isException){
      document.write(JSON.stringify(result));
    });
  }
  
  
  /**
   * @public method
   *  Sorts CSS selector text based on specificity
   * @param Array selectors
   *  A selector of arrays
   * @param Object element
   *  The html element that is being "viewed"
   */ 
  C.sortCSSText(selectors, element) {
    
  }
  
  // Execute constructor
  C.constructor();

  // Return object
  return C;


})(jQuery);
