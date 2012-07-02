var SASSINSPECTOR = (function(){


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
    C.evaluateCode();
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
    
    function is(elem, selector) {
      var div = document.createElement("div");
      var matchesSelector = div.webkitMatchesSelector;
      return typeof selector == "string" ? matchesSelector.call( elem, selector ) : selector === elem;
    }
    
    function getFileName(text) {
      var regEx = /file:\/\/(.*)'/;
      var matches = text.match(regEx);
      return matches[0].substring(0, matches[0].length - 1);
    }
    
    function getLineNumber(text){
      var regex = /(line)\s{\s(font\-family:\s')\d+'/;
      var matches = text.match(regex);
      var newRegEx = /\d+/;
      var lineNumber = (matches[0].match(newRegEx))[0];
      return parseInt(lineNumber, 10);
    }

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
          // console.log('hej');
        }
        
        if(is($0, rules[i + 1].selectorText)) {
            var tmp = {
              cssText: rules[i + 1].cssText,
              fileName: getFileName(rules[i].cssText),
              lineNumber: getLineNumber(rules[i].cssText)
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
 
  /**
   * @public method
   *  Evaluate code
   * @result void
   */
  C.evaluateCode = function() {
    chrome.devtools.inspectedWindow.eval('(' + pageGetProperties.toString() + ')()', function(result, isException){
      if(!isException)
        document.write(JSON.stringify(result));
    });
    
  }

  // Execute constructor
  C.constructor();

  // Return object
  return C;


})();
