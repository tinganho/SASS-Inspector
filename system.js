(function($){
	$.isEmpty = function (value) {
		if(typeof value == 'undefined'){
			return true;
		}
		$.trim(value);
		if(		value == null
			|| 	value == 'null'
			|| 	value ==  0
			|| 	value == '') 
		{
			return true;

		}
		return false;
	}
	$.isDocumentInFullScreenMode = function () {  
  		// Note that the browser fullscreen (triggered by short keys) might  
  		// be considered different from content fullscreen when expecting a boolean  
  		return ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard methods  
      			(document.webkitIsFullScreen));
	}
	$.refreshBrowser = function () {
		window.location.href = window.location.href
	}
})(jQuery);