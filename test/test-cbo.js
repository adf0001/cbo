
var cbo= require("../cbo.js");

var o={
	
	func1: function(){
		console.log("func1");
	},

	func2: function(a){
		console.log("func2, " + a );
	},

	func3: function(a,b){
		console.log("func3, " + a + ", " + b );
	},

	func4: function(){
		console.log("func4, " + Array.prototype.slice.call(arguments) );
	},
	
};

var cbo1= [ o, "func1" ];
cbo.call(cbo1);

var cbo2= [ o, "func2", ["aa"] ];
cbo.call(cbo2);

var cbo3= [ o, "func3", ["aa"] ];
cbo.call(cbo3, ["bb"]);			//aa, bb
cbo.call(cbo3, ["bb"], true);	//bb, aa

var cb3= cbo.toCallback(cbo3);
cb3("ccc");
cb3("ccc","ddd");	//'aa' lost

var cb3b= cbo.toCallback(cbo3,1);
cb3b("ccc");
cb3b("ccc","ddd");	//'aa' kept, 'ddd' lost

var cbo4= [ o, "func4", ["aa"] ];
var cb4= cbo.toCallback(cbo4,5);
cb4("ccc");
cb4("ccc","ddd");

console.log("////////////////////////////////////");

function f(a1,a2,a3,a4){
    console.log([a1,a2,a3,a4]);
}

var cboTest= [null,f,['aa']];
var cb1= cbo.toCallback(cboTest);
cb1();	//aa
cb1('bb');	//bb,aa
cb1('bb','cc')	//bb,cc,aa
var cb2= cbo.toCallback(cboTest,0);
cb2();	//aa
cb2('bb');	//aa
var cb3= cbo.toCallback(cboTest,1);
cb3();	//undefined,aa
cb3('bb');	//bb,aa
cb3('bb','cc');	//bb,aa
   