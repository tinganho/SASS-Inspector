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