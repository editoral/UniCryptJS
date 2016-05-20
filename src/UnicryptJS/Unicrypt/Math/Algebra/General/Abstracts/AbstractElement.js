unicrypt.math.algebra.general.abstracts.AbstractElement = Op.AbstractClass('Element', {
	'generic': [
		'S', 'E', 'V'
	],
	'extends': unicrypt.UniCrypt
},{
	set: null,
	value: null,
	_init: function(set, value) {
		this.set = set;
		this.value = value;
	},
	getSet: function() {
		return this.set;
	},
	getValue: function() {
		return this.value;
	}
});