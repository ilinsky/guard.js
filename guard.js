/*
 * Guard.js - JavaScript API call validation library
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Licensed under the MIT license.
 *
 */

(function() {
	// Get base folder
	var scripts	= document.getElementsByTagName("script"),
		self	= scripts[scripts.length-1],
		base	= self.src.replace(/\/?[^\/]+$/, '/');
	// Remove self
	self.parentNode.removeChild(self);
	// Include loader
	document.write('<script type="text/javascript" src="' + base + 'res/assemble.js?path=' + base + 'api/"></script>');
})();
