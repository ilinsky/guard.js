/*
 * Guard.js - JavaScript API call validation library
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Licensed under the MIT license.
 *
 */

// Validation implementation
var fGuard	= function(aArguments, aParameters) {
	// Determining API caller function reference
	var fCallee	= aArguments.callee;
//->Debug
	// Determine fGuard caller function name
	var sName	= cString(fCallee).match(rGuard_function) ? cRegExp.$1 : "<anonymous>",
		sArgument;
//<-Debug
	// Validate arguments
	for (var nIndex = 0, aParameter, nLength = aArguments.length, vValue, bUndefined; aParameter = aParameters[nIndex]; nIndex++) {
		vValue		= aArguments[nIndex];
		bUndefined	= typeof vValue == "undefined";
//->Debug
		sArgument	=(nIndex + 1)+ aGuard_endings[nIndex < 3 ? nIndex : 3];
//<-Debug
		// See if argument is missing
		if (bUndefined && !aParameter[2])
			throw new cGuard_Exception(cGuard_Exception.ARGUMENT_MISSING_ERR,
//->Debug
					[sArgument, aParameter[0], sName]
//<-Debug
			);

		if (nLength > nIndex) {
			if (vValue === null) {
				// See if null is not allowed
				if (!aParameter[3])
					throw new cGuard_Exception(cGuard_Exception.ARGUMENT_NULL_ERR,
//->Debug
							[sArgument, aParameter[0], sName]
//<-Debug
					);
			}
			else {
				// See if argument has correct type
				if (!fGuard_instanceOf(vValue, aParameter[1]))
					throw new cGuard_Exception(cGuard_Exception.ARGUMENT_TYPE_ERR,
//->Debug
							[sArgument, aParameter[0], sName, cString(aParameter[1]).match(rGuard_function) ? cRegExp.$1 : "<unknown>", bUndefined ? "undefined" : cString(fGuard_typeOf(vValue)).match(rGuard_function) ? cRegExp.$1 : "<unknown>"]
//<-Debug
					);
			}
		}
	}
};

var rGuard_object	= /object\s([^\s]+)\]/;
function fGuard_instanceOf(vValue, cType) {
	var sType	= cObject.prototype.toString.call(vValue).match(rGuard_object)[1];
	switch (cType) {
		// Primitive types
		case cString:
			return sType == "String";
		case cBoolean:
			return sType == "Boolean";
		case cNumber:
			return sType == "Number";
		case cArray:
			return sType == "Array";
		case cFunction:
			return sType == "Function";
		case cRegExp:
			return sType == "RegExp";
			// Special type cGuard_Arguments (pseudo type for JavaScript arguments object)
		case cGuard_Arguments:
			return typeof vValue == "object" && "callee" in vValue;
		default:
			// Complex types
			return cType == cObject ? true : vValue instanceof cType;
	}
};

function fGuard_typeOf(vValue) {
	return typeof vValue == "object" && "callee" in vValue ? cGuard_Arguments : vValue.constructor;
};

// Function Guard.Exception
var cGuard_Exception	= function(nCode) {
	this.code	= nCode;
	this.message= "Guard.Exception" + ' ' + nCode;
//->Debug
	if (arguments.length > 1)
		this.message	+= ':' + ' ' + fGuard_format(hGuard_Exception_messages[nCode], arguments[1]);
//<-Debug
};

cGuard_Exception.ARGUMENT_MISSING_ERR	= 1;
cGuard_Exception.ARGUMENT_TYPE_ERR		= 2;
cGuard_Exception.ARGUMENT_NULL_ERR		= 3;

cGuard_Exception.prototype	= new cError;

cGuard_Exception.prototype.code		= null;
cGuard_Exception.prototype.message	= null;

//->Debug
var hGuard_Exception_messages	= {};
hGuard_Exception_messages[cGuard_Exception.ARGUMENT_MISSING_ERR]	= 'Missing %0 required argument "%1" in "%2" function call.';
hGuard_Exception_messages[cGuard_Exception.ARGUMENT_TYPE_ERR]		= 'Incompatible type of %0 argument "%1" in "%2" function call. Expected "%3", got "%4".';
hGuard_Exception_messages[cGuard_Exception.ARGUMENT_NULL_ERR]		= 'null is not allowed value of %0 argument "%1" in "%2" function call.';
//<-Debug

// Function cGuard_Arguments (pseudo type for JavaScript arguments object)
var cGuard_Arguments	= function() {

};

//
function fGuard_sign(vValue, sName) {
	(vValue.toString	= function() {
		return "function " + sName + "() { [guard code] }";
	}).toString	= fGuard_sign_toString;
	return vValue;
};

function fGuard_sign_toString() {
	return "function toString() { [guard code] }";
};
fGuard_sign_toString.toString	= fGuard_sign_toString;

//->Debug
// Utility functions etc
var aGuard_endings	= 'st-nd-rd-th'.split('-'),
	rGuard_function	= /function\s([^\(]+)\(/;
function fGuard_format(sMessage, aArguments) {
	for (var nIndex = 0; nIndex < aArguments.length; nIndex++)
		sMessage	= sMessage.replace('%' + nIndex, aArguments[nIndex]);
	return sMessage;
};
//<-Debug
