var Specificity = (function() {

    var C = {};

    function numMatches(selector, regex) {
        return (selector.match(regex) || []).length;
    }

    function is(selector, element) {
        var div = document.createElement("div"),
            matchesSelector = div.webkitMatchesSelector;
        return typeof selector == "string" ? matchesSelector.call(element, selector) : selector === element;
    }

    function getBiggestPoint(points) {
        points = C.sortPoints(points);
        return points[0];
    }

    C.sortPoints = function(points) {
        points.sort(function(a, b) {
            if (a[0] > b[0]) return -1;
            if (a[0] < b[0]) return 1;
            if (a[1] > b[1]) return -1;
            if (a[1] < b[1]) return 1;
            if (a[2] > b[2]) return -1;
            if (a[2] < b[2]) return 1;
            else return 0;
        });

        return points;
    }

    C.getSpecificity = function(selector, element) {

        var splittedSelector = selector.split(',');
        var points = [];

        for (var i in splittedSelector) if (splittedSelector.hasOwnProperty(i)) {

            if (!is(splittedSelector[i], element)) continue;

            var numClasses = numMatches(splittedSelector[i], /\.[\w-_]+\b/g);
            var numIds = numMatches(splittedSelector[i], /#[\w-_]+\b/g);
            var numAttributes = 0;
            var attributes = splittedSelector[i].match(/\[[^\]]*\b[\w-_]+\b[^\]]*\]/g) || [];
            for (var idx = 0; idx < attributes.length; ++idx) {
                numAttributes += (attributes[idx].match(/\b[\w-_]+\b/g) || []).length;
            }
            var results = [0, 0, 0];
            results[0] = numIds;
            results[1] = numMatches(splittedSelector[i], /\[[^\]]+\]/g) + numClasses;
            results[2] = numMatches(splittedSelector[i], /\b[\w-_]+\b/g) - numIds - numClasses - numAttributes;
            points.push(results);
        }

        return getBiggestPoint(points);
    }

    return C;
    
})();

var SASSINSPECTOR = (function(Specificity){


  var C = {},


  /* 
  -------------------------------------------------------
  Private variables 
  -------------------------------------------------------
  */

  // Description of your variable
  SASS_DEBUG_INFO = [];
  
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
   *  @private setPoints
   *    Sets CSS points to selectors
   *  @param Result Object
   */
  function sortDebugInfo(result) {

    // Set points
    var element = document.createElement(result.inspectedElement.tagName);
    console.log(element)
    for(var i in result.inspectedElement.attributes) {
      with(result.inspectedElement) {
        element.setAttribute(attributes[i].name, attributes[i].value);
      }
    }
    console.log(element)
    for(var i in result) if(result.hasOwnProperty(i)){
      var point = Specificity.getSpecificity(result.sassDebugInfo[i].cssText, element);
      result.sassDebugInfo[i].point = point;
    }

    result.sassDebugInfo.sort(function(a, b) {
      if (a.points[0] > b.points[0]) return -1;
      if (a.points[0] < b.points[0]) return 1;
      if (a.points[1] > b.points[1]) return -1;
      if (a.points[1] < b.points[1]) return 1;
      if (a.points[2] > b.points[2]) return -1;
      if (a.points[2] < b.points[2]) return 1;
      else return 0;
    });

    return result;
  }
 
 
  /**
   * @private method
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

    var attributes = [];
    for(var i in $0.attributes) if($0.attributes.hasOwnProperty(i)) {
      if(typeof $0.attributes[i] == 'number') break;
      var name = $0.attributes[i].name,
      value = $0.attributes[i].value;
      attributes.push({name: name, value: value});
    }

    return { sassDebugInfo: SASS_DEBUG_INFO, inspectedElement: {tagName: $0.tagName, attributes: attributes} };
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

    chrome.devtools.inspectedWindow.eval('(' + pageGetProperties.toString() + ')()', function(result, isException) {
      console.log(result);
      if(!isException){
        document.write(JSON.stringify(result));
        if(result.sassDebugInfo.length == 0) return;
        sortDebugInfo(result);
        C.renderSideBarPane(sassDebugInfo);
      }
    });
  }

  C.renderSideBarPane = function(sassDebugInfo) {

    var cssSelectorList = document.createElement('ul');
    cssSelectorList.className = 'si-css-selector-list';
    document.body.appendChild(cssSelectorList);
    for(var i in sassDebugInfo) {
      
      // Post element
      var li = document.createElement('li');
      cssSelectorList.appendChild(li);

      // Anchor 
      var cssSelector = document.createElement('a');
      cssSelector.className = 'si-file-name';
      cssSelector.innerHTML = sassDebugInfo[i].fileName + ':' + sassDebugInfo[i].lineNumber;
      cssSelector.href = TEXTMATE + '://open?url=' + sassDebugInfo[i].filePath + '&line=' + sassDebugInfo[i].lineNumber;
      li.appendChild(cssSelector);

      // CSS Selector
      var cssSelector = document.createElement('div');
      cssSelector.className = 'si-css-selector';
      cssSelector.innerHTML = sassDebugInfo[i].cssText + ' {';
      li.appendChild(cssSelector);

      var cssProperties = document.createElement('ul');
      cssProperties.className = 'si-css-properties';
      li.appendChild(cssProperties);

      for(var y in sassDebugInfo[i].cssProperties) {
        var cssProperty = document.createElement('li');
        cssProperty.innerHTML = '<span class="si-css-property-key">' + sassDebugInfo[i].cssProperties[y].propertyKey + '</span>' + ': ' + sassDebugInfo[i].cssProperties[y].propertyValue + ';';
        cssProperties.appendChild(cssProperty);
      }

      var endHardBracket = document.createElement('div');
      endHardBracket.innerHTML = '}';
      li.appendChild(endHardBracket);

    }
  }


  // Execute constructor
  C.constructor();

  // Return object
  return C;


})(Specificity);
