
"use strict";

/**
 * @module cbo
 * 
 * @description
 * 
 * Define callback object, and provide some basic tool funtions.
 * 
 * # Contents #
 * 
 * 1. Definition
 *  * [Callback object					](#defineCallbackObject)
 * 
 * 2. Call tool
 *  * [.call()							]{@link module:cbo~call}
 * 
 * 3. Build tool
 *  * [.combine()						]{@link module:cbo~combine}
 * 
 *  * [.toCallback()					]{@link module:cbo~toCallback}
 * 
 * <a name='defineCallbackObject'></a>
 * 
 * ## Definition ##
 * ### Callback object ###
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
var cbo= require("cbo");

cbo.call(...);

*/


/**
 * Call a cbo
 * @function call
 * 
 * @param {cbo} cbo - A cbo object
 * @param {Array} [argArrayExtra] - Extra arguments array
 * @param {bool} [insertBefore] - Flag to insert `argArrayExtra` before original `argArray` of `cbo`
 * 
 * @return The value returned by the method of `cbo`
 */
function _call(cbo, argArrayExtra, insertBefore) {
	var func = (typeof cbo[1] == "string") ? cbo[0][cbo[1]] : cbo[1];

	if (argArrayExtra) {
		func.apply(cbo[0], cbo[2]?(insertBefore?argArrayExtra.concat(cbo[2]):cbo[2].concat(argArrayExtra)):argArrayExtra );
	} else {
		return cbo[2] ? func.apply(cbo[0], cbo[2]) : func.apply(cbo[0]);
	}
}


/**
 * Combine arguments into cbo
 * @function combine
 * 
 * @param {cbo} cbo - A cbo object
 * @param {Array} [argArrayExtra] - Extra arguments array
 * @param {bool} [insertBefore] - Flag to insert `argArrayExtra` before original `argArray` of `cbo`
 * 
 * @returns A new cbo
 */
function combine(cbo, argArrayExtra, insertBefore) {
	return [cbo[0], cbo[1], cbo[2] ? (insertBefore ? argArrayExtra.concat(cbo[2]) : cbo[2].concat(argArrayExtra)) : argArrayExtra];
}


/**
 * Create a normal callback function
 * @function toCallback
 * 
 * @param {cbo} cbo - A cbo object
 * @param {number} [reserve] - The count of reserved original prefix arguments
 * 
 * @returns A normal callback function
 * 
 * @example
 * function f(a1,a2,a3,a4){
 *     console.log([a1,a2,a3,a4]);
 * }
 * 
 * var cboTest= [null,f,['aa']];
 * var cb1= cbo.toCallback(cboTest);
 * cb1();	//aa
 * cb1('bb');	//bb,aa
 * cb1('bb','cc')	//bb,cc,aa
 * var cb2= cbo.toCallback(cboTest,0);
 * cb2();	//aa
 * cb2('bb');	//aa
 * var cb3= cbo.toCallback(cboTest,1);
 * cb3();	//undefined,aa
 * cb3('bb');	//bb,aa
 * cb3('bb','cc');	//bb,aa
 * 
 */
function toCallback(cbo, reserve) {
	if (!cbo[0] && !cbo[2]) return cbo[1];
	
	if( typeof(reserve) === "undefined" ) {
		return function () {
			_call(cbo, arguments.length?Array.prototype.slice.call(arguments):null, true);
		}
	}

	if( !reserve ) {
		return function () {
			_call(cbo);
		}
	}

	return function () {
		var arg= Array.prototype.slice.call(arguments,0,reserve);
		if( arg.length<reserve ) arg= arg.concat(new Array(reserve-arg.length));
		_call(cbo, arg, true);
	}
}


//module

module.exports = {
	call: _call,

	combine: combine,

	toCallback: toCallback

};

