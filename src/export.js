/*
 * Guard.js - JavaScript API call validation library
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Licensed under the MIT license.
 *
 */

fGuard_sign(fGuard, "Guard");

fGuard.sign		= fGuard_sign(function(vValue) {
	// Validate own call (we call fGuard here directly instead of fGuard as we are sure we pass proper arguments!)
//->Guard
	fGuard(arguments, [
		["value",	cObject]
	]);
//<-Guard
	// Invoke
	return fGuard_sign(vValue);
}, "sign");

// Public API functions
fGuard.instanceOf	= fGuard_sign(function(vValue, cType) {
	// Validate own call (we call fGuard here directly instead of fGuard as we are sure we pass proper arguments!)
//->Guard
	fGuard(arguments, [
		["value",	cObject],
		["type",	cFunction]
	]);
//<-Guard
	// Invoke
	return fGuard_instanceOf(vValue, cType);
}, "instanceOf");

fGuard.typeOf	= fGuard_sign(function(vValue) {
	// Validate own call (we call fGuard here directly instead of fGuard as we are sure we pass proper arguments!)
//->Guard
	fGuard(arguments, [
		["value",	cObject]
	]);
//<-Guard
	// Invoke
	return fGuard_typeOf(vValue);
}, "typeOf");

fGuard.Arguments	= fGuard_sign(cGuard_Arguments, "Arguments");
fGuard.Exception	= fGuard_sign(cGuard_Exception, "Exception");

// Publish
scope == window ? Guard	= fGuard : scope.Guard	= fGuard;
