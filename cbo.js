
"use strict";

/**
 * @module cbo
 * 
 * @description
 * 
 * Callback object tool
 * 
 * # Contents #
 * 
 * 1. Definition
 *  * [Callback object					](#defineCallbackObject)
 * 2. Call tool
 *  * [.call()							]{@link module:cbo~call}
 *  * [.setTimeout()					]{@link module:cbo~setTimeout}
 * 
 * 3. Build tool
 *  * [.combine()						]{@link module:cbo~combine}
 * 
 *  * [.toCallback()					]{@link module:cbo~toCallback}
 *  * [.toCallbackOnce()				]{@link module:cbo~toCallbackOnce}
 * 
 * <a name='defineCallbackObject'></a>
 * 
 * ## Definition ##
 * ### callback object ###
 * A callback object is an array object defined as :
 *  > a. `[ thisObj, methodName, argArray ]`
 *  > b. `[ thisObj, method, argArray ]`
 *  > c. `[ null, method, argArray ]`
 * 
 * @property  {object} thisObj - The this objecct
 * @property  {string} methodName - A function name of `thisObj`
 * @property  {function} method - A function
 * @property  {Array} [argArray] - An `arguments` array for calling the method
 *
 * 
 * @example
var $cbo= require("./cbo.js");

$cbo.call(...);

*/


/**
 * call a cbo
 * @function call
 * 
 * @param {cbo} cbo - a cbo object
 * @param {Array} [argArrayExtra] - extra arguments array
 * @param {bool} [insertBefore] - flag to insert `argArrayExtra` before original `argArray` of `cbo`
 * 
 * @return according to the `cbo`
 */
function _call(cbo, argArrayExtra, insertBefore) {
	var func = (typeof cbo[1] == "string") ? cbo[0][cbo[1]] : cbo[1];

	if (argArrayExtra) {
		if (insertBefore) {
			return cbo[2] ? func.apply(cbo[0], argArrayExtra.concat(cbo[2])) : func.apply(cbo[0], argArrayExtra);
		} else {
			return cbo[2] ? func.apply(cbo[0], cbo[2].concat(argArrayExtra)) : func.apply(cbo[0], argArrayExtra);
		}
	} else {
		return cbo[2] ? func.apply(cbo[0], cbo[2]) : func.apply(cbo[0]);
	}
}


/**
 * combine arguments into cbo
 * @function combine
 * 
 * @param {cbo} cbo - a cbo object
 * @param {Array} [argArrayExtra] - extra arguments array
 * @param {bool} [insertBefore] - flag to insert `argArrayExtra` before original `argArray` of `cbo`
 * 
 * @returns a new cbo
 */
function combine(cbo, argArrayExtra, insertBefore) {
	return [cbo[0], cbo[1], cbo[2] ? (insertBefore ? argArrayExtra.concat(cbo[2]) : cbo[2].concat(argArrayExtra)) : argArrayExtra];
}


/**
 * create a normal callback function
 * @function toCallback
 * 
 * @param {cbo} cbo - a cbo object
 * 
 * @returns a callback function
 */
function toCallback(cbo) {
	if (!cbo[0] && !cbo[2]) return cbo[1];
	else return function () {
		_call(cbo);
	}
}


/**
 * create a normal callback function that can be called only once
 * @function toCallbackOnce
 * 
 * @param {cbo} cbo - a cbo object
 * 
 * @returns a callback function
 */
function toCallbackOnce(cbo) {
	if (!cbo[0] && !cbo[2]) return cbo[1];
	else return function () {
		_call(cbo);
		cbo = null;
	}
}


/**
 * call system `setTimeout` by cbo
 * @function setTimeout
 * 
 * @param {cbo} cbo - a cbo object
 * @param {number} ms - milliseconds to delay
 * 
 * @return system timer id
 */
function _setTimeout(cbo, ms) {
	return setTimeout(this.toCallbackOnce(cbo), ms);
}

//module

module.exports = {
	call: _call,

	combine: combine,

	toCallback: toCallback,
	toCallbackOnce: toCallbackOnce,

	setTimeout: _setTimeout,
};

