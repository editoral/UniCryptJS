Function.prototype.inherit = function(obj) {

}

Op = {}

Op.Class = function()  {
	var parent;
	var methods;
	var newClass = function() {
		this.initialize.apply(this, arguments);
	}
	extend = function(destination, source) {   
		for (var property in source) {
			destination[property] = source[property];
		}
		destination.$super =  function(method) {
			return this.$parent[method].apply(this.$parent, Array.prototype.slice.call(arguments, 1));
		}
		return destination;
	}

	if (typeof arguments[0] === 'function') {       
		parent  = arguments[0];       
		methods = arguments[1];     
	} else {       
		methods = arguments[0];     
	}     

	if (parent !== undefined) {       
		extend(newClass.prototype, parent.prototype);       
		newClass.prototype.$parent = parent.prototype;
	}
	extend(newClass.prototype, methods);  
	newClass.prototype.constructor = newClass;      

	if (!newClass.prototype.initialize) newClass.prototype.initialize = function(){};        

	return newClass;   
}


Op.helper = {}

// Op.helper.iterateObj = function* (obj) {
// 	for (var key in obj) {
// 		if (obj.hasOwnProperty(key)) {
// 			yield obj[key];
// 		}
// 	}
// }


var Myclass = Op.Class({
	initialize: function(name, age) {
		this.name = name;
		this.age  = age;
	},
	print: function() {
		console.log(this.name + " " + this.age);
	}
});

var inst = new Myclass("Bob",29);
inst.print();