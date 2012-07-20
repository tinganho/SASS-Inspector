var SASSINSPECTOR = (function(Specificity){


  var C = {},


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
  const 
  TEXTMATE = 'txmt',
  SUBLIME = 'subl',
  EMACS = 'emacs',
  MACVIM = 'mvim'


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
    
    var n = 0,
    sassStylesheet = false,
    SASS_DEBUG_INFO = new Array();
    
    function is(elem, selector) {
      var div = document.createElement("div"),
      matchesSelector = div.webkitMatchesSelector;
      return typeof selector == "string" ? matchesSelector.call( elem, selector ) : selector === elem;
    }

    function trim(text) {
      return text.replace(/^\s+|\s+$/g, '');
    }
    
    function getFilePath(text) {
      var regEx = /file:\/\/(.*)'/,
      matches = text.match(regEx);
      return matches[0].substring(0, matches[0].length - 1);
    }

    function getFileName(text) {
      var regEx = /([^\/])*(?!\/)(\.scss)/,
      matches = text.match(regEx);
      return matches[0].substring(1, matches[0].length);
    }
    
    function getLineNumber(text) {
      var regEx = /(line)\s{\s(font\-family:\s')\d+'/,
      matches = text.match(regEx),
      newRegEx = /\d+/,
      lineNumber = (matches[0].match(newRegEx))[0];
      return parseInt(lineNumber, 10);
    }

    function getCSSProperties(text) {

      var regEx = /([a-z]|[\(\)\!\-\.\,])+\s*\:\s*([a-z]|[A-Z]|[0-9]|\s|[\(\)\!\-\.\,])+\;/gi;
      matches = text.match(regEx);
      properties = [];
      
      for(var i in matches) {
        var _properties = matches[i].split(':');
        propertyKey = trim(_properties[0]);
        propertyValue = trim(_properties[1].replace(';', ''));
        properties.push({propertyKey: propertyKey, propertyValue: propertyValue});
      }
      return properties;
    }

    function specificity(selector, isStyleAttribute) {

      selector = selector || "";
      function numMatches(regex) {
          return (selector.match(regex)||[]).length;
      }

      var numClasses = numMatches(/\.[\w-_]+\b/g);
      var numIds = numMatches(/#[\w-_]+\b/g);
      var numNamesInBraces = 0;
      var namesInBraces = selector.match(/\[[^\]]*\b[\w-_]+\b[^\]]*\]/g) || [];
      for (var idx = 0; idx < namesInBraces.length; ++idx) {
          numNamesInBraces += (namesInBraces[idx].match(/\b[\w-_]+\b/g)||[]).length;
      }

      var results = [0,0,0,0];
      results[0] = isStyleAttribute ? 1 : 0;
      results[1] = numIds;
      results[2] = numMatches(/\[[^\]]+\]/g) + numClasses;
      results[3] = numMatches(/\b[\w-_]+\b/g) - numIds - numClasses - numNamesInBraces;
      return results.join(',');
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

            var filePath = getFilePath(rules[i].cssText),
            fileName = getFileName(filePath);

            var tmp = {
              cssText: rules[i + 1].selectorText,
              filePath: filePath,
              fileName: fileName,
              lineNumber: getLineNumber(rules[i].cssText),
              cssProperties: getCSSProperties(rules[i + 1].cssText)
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
      if(!isException){
        
        if(result.length == 0) return;

        var cssSelectorList = document.createElement('ul');
        cssSelectorList.className = 'si-css-selector-list';
        document.body.appendChild(cssSelectorList);
        for(var i in result) {
          
          // Post element
          var li = document.createElement('li');
          cssSelectorList.appendChild(li);

          // Anchor 
          var cssSelector = document.createElement('a');
          cssSelector.className = 'si-file-name';
          cssSelector.innerHTML = result[i].fileName + ':' + result[i].lineNumber;
          cssSelector.href = TEXTMATE + '://open?url=' + result[i].filePath + '&line=' + result[i].lineNumber;
          li.appendChild(cssSelector);

          // CSS Selector
          var cssSelector = document.createElement('div');
          cssSelector.className = 'si-css-selector';
          cssSelector.innerHTML = result[i].cssText + ' {';
          li.appendChild(cssSelector);

          var cssProperties = document.createElement('ul');
          cssProperties.className = 'si-css-properties';
          li.appendChild(cssProperties);

          for(var y in result[i].cssProperties) {
            var cssProperty = document.createElement('li');
            cssProperty.innerHTML = '<span class="si-css-property-key">' + result[i].cssProperties[y].propertyKey + '</span>' + ': ' + result[i].cssProperties[y].propertyValue + ';';
            cssProperties.appendChild(cssProperty);
          }

          var endHardBracket = document.createElement('div');
          endHardBracket.innerHTML = '}';
          li.appendChild(endHardBracket);

        }
      }
    });
  }


  // Execute constructor
  C.constructor();

  // Return object
  return C;


})(Specificity);
