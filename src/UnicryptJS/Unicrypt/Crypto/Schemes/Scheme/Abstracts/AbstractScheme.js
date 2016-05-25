unicrypt.crypto.schemes.scheme.abstracts.AbstractScheme = Op.AbstractClass('AbstractScheme', {
	'extends': unicrypt.UniCrypt,
	//'implements': [unicrypt.math.algebra.general.interfaces.Set],
	'generic': [
		'M'
	]
}, {
	_messageSpace: null,
	_init: function(messageSpace) {
		this._messageSpace = messageSpace;
	}.paramType(['M']),
	getMessageSpace: function() {
		return this._messageSpace;
	}.paramType(['M']),
	_defaultToStringContent: function() {
		return this.getMessageSpace() + '';
	}.returnType('string')

});