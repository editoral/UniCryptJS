 generic = Op.Class('generic', {
	'generic': [
		'E'
	],
	'extends': {
		'class' : ,
		'generic': [
			'T', 'string'
		]
	}
},{
	init: function() {
		this.$$super();
		
	}.paramType(['int']),
	func: function() {

	}.paramType(['E']).returnType(''),
});