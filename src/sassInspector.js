var SASSINSPECTOR = (function(){


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
  
 
 
  /**
   * @private method
   */
  function pageGetProperties() {
    var n = 0,
    sassStylesheet = false,
    sassDebugInfo = [];

    function trim(text) {
      return text.replace(/^\s+|\s+$/g, '');
    }

    function is(selector, element) {
        var div = document.createElement("div"),
            matchesSelector = div.webkitMatchesSelector;
        return typeof selector == "string" ? matchesSelector.call(element, selector) : selector === element;
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

    function numMatches(selector, regex) {
        return (selector.match(regex) || []).length;
    }

    function getBiggestPoint(points) {
        points = sortPoints(points);
        return points[0];
    }

    function sortPoints(points) {
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

    function getSpecificity(selector, element) {

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
        
        if(is(rules[i + 1].selectorText, $0)) {

            var filePath = getFilePath(rules[i].cssText),
            fileName = getFileName(filePath);
            var tmp = {
              cssText: rules[i + 1].selectorText,
              filePath: filePath,
              fileName: fileName,
              lineNumber: getLineNumber(rules[i].cssText),
              cssProperties: getCSSProperties(rules[i + 1].cssText),
              point: getSpecificity(rules[i + 1].selectorText, $0),
              order: n
            }
            sassDebugInfo.push(tmp);
            n++;
        }
      }
    }

    function sortDebugInfo(sassDebugInfo) {

      sassDebugInfo.sort(function(a, b) {
        
        if (a.point[0] > b.point[0]) return -1;
        if (a.point[0] < b.point[0]) return 1;
        if (a.point[1] > b.point[1]) return -1;
        if (a.point[1] < b.point[1]) return 1;
        if (a.point[2] > b.point[2]) return -1;
        if (a.point[2] < b.point[2]) return 1;
        if (a.order > b.order) return -1;
        if (a.order < b.order) return 1;
        else return 0;

      });

      return sassDebugInfo;

    }
    
    var styleSheets = document.styleSheets;
    for(var i in styleSheets) {
      if(styleSheets[i].cssRules == null) continue;
      searchAStyleSheet(styleSheets[i]);
    }

    sassDebugInfo = sortDebugInfo(sassDebugInfo);

    return sassDebugInfo;
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

    chrome.devtools.inspectedWindow.eval('(' + pageGetProperties.toString() + ')()', function(sassDebugInfo, isException) {
      console.log(sassDebugInfo)
      if(!isException){
        if(sassDebugInfo.length == 0) return;
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


})();
