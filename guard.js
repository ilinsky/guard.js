/*
 * Guard.js - JavaScript API call validation library
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Licensed under the MIT license.
 *
 */

(function(scope) {
	// Function fGuard
	var fGuard;
	(fGuard	= function(aArguments, aParameters) {
		// Determing API caller function reference
		var fCaller		= null;
		// Has to be wrapped in try/catch because Firebug throws "Permission denied to get property on Function.caller" in XMLHttpRequest
		try {
			fCaller		= fGuard.caller.caller;
		} catch (oError) {}
	
		// Determine fGuard caller function name
		var sFunction	= "<anonymous>";
		try {
			sFunction	= String(fGuard.caller).match(rFunction) ? RegExp.$1 : "<anonymous>";
		} catch (oError) {}

		// Validate arguments 
		for (var nIndex = 0, aParameter, nLength = aArguments.length, vValue, sArgument; aParameter = aParameters[nIndex]; nIndex++) {
			vValue		= aArguments[nIndex];
			sArgument	=(nIndex + 1)+ aEndings[nIndex < 3 ? nIndex : 3];
	
			// See if argument is missing
			if (nLength < nIndex + 1 && !aParameter[2])
				throw new fGuard.Exception(
							fGuard.Exception.ARGUMENT_MISSING_ERR, 
							fCaller, 
							[sArgument, aParameter[0], sFunction]
				)

			if (nLength > nIndex) {
				if (vValue === null) {
					// See if null is not allowed
					if (!aParameter[3])
						throw new fGuard.Exception(
								fGuard.Exception.ARGUMENT_NULL_ERR, 
								fCaller, 
								[sArgument, aParameter[0], sFunction]
						)
				}
				else {
					// See if argument has correct type
					if (!fInstanceOf(vValue, aParameter[1]))
						throw new fGuard.Exception(
								fGuard.Exception.ARGUMENT_WRONG_TYPE_ERR, 
								fCaller,
								[sArgument, aParameter[0], sFunction, String(aParameter[1]).match(rFunction) ? RegExp.$1 : "<Unknown>"]
						)
				}
			}
		}
	}).toString	= function() {
		return "[fGuard]";
	};
	
	// Public API function
	(fGuard.instanceOf	= function(vValue, cType) {
		// Guard
		fGuard(arguments, [
				["value",	Object],
				["type",	Function]
		]);

		// Invoke
		return fInstanceOf(vValue, cType);
	}).toString	= function() {
		return "function instanceOf() {\n\t[guard code]\n}";
	};
	
	// Class fGuard.Exception
	(fGuard.Exception	= function(nException, fCaller, aArguments) {
		this.code	= nException;
		this.message=(function(sMessage) {
							for (var nIndex = 0; nIndex < aArguments.length; nIndex++)
								sMessage	= sMessage.replace('%' + nIndex, aArguments[nIndex]);
							return sMessage;
					})(fGuard.Exception.messages[nException]);
		this.caller	= fCaller;
	}).toString	= function() {
		return "[fGuard.Exception]";
	};
	
	fGuard.Exception.ARGUMENT_MISSING_ERR		= 1;
	fGuard.Exception.ARGUMENT_WRONG_TYPE_ERR	= 2;
	fGuard.Exception.ARGUMENT_NULL_ERR			= 3;
	
	fGuard.Exception.prototype.code		= null;
	fGuard.Exception.prototype.message	= null;
	fGuard.Exception.prototype.caller	= null;
	
	fGuard.Exception.prototype.toString	= function() {
		return "[Exception... " + this.message + " code:" + this.code + " caller:" + this.caller + "]";
	};
	
	fGuard.Exception.messages	= {};
	fGuard.Exception.messages[fGuard.Exception.ARGUMENT_MISSING_ERR]	= 'Missing required %0 argument "%1" in "%2" function call.';
	fGuard.Exception.messages[fGuard.Exception.ARGUMENT_WRONG_TYPE_ERR]	= 'Incompatible type of %0 argument "%1" in "%2" function call. Expecting "%3".';
	fGuard.Exception.messages[fGuard.Exception.ARGUMENT_NULL_ERR]		= 'null is not allowed value of %0 argument "%1" in "%2" function call.';

	// Utility functions etc
	var aEndings	= 'st-nd-rd-th'.split('-'),
		rFunction	= /function ([^\s]*)\(/;
	function fInstanceOf(vValue, cType) {
		// Primitive types
		if (cType == String) {
			if (typeof vValue == "string")
				return true;
		}
		else
		if (cType == Boolean) {
			if (typeof vValue == "boolean")
				return true;
		}
		else
		if (cType == Number) {
			if (typeof vValue == "number")
				return true;
		}
		// Complex types
		return vValue instanceof cType;
	};
	
	// Expose object
	scope.Guard	= fGuard;
})(this);