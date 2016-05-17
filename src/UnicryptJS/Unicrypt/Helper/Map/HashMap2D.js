unicrypt.helper.map.HashMap2D = Op.Class('HashMap2D', {
	'extends': unicrypt.UniCrypt,
	'generic': [
		'K','J','V'
	]
},{
	_hashMaps: {},
	_init: function() {
	},
	get: function(key1, key2) {
		var hashMap = null;
		if(this._hashMaps.hasOwnProperty(key1)) {
			hashMap = this._hashMaps[key1];
		} else {
			return null;
		}
		return hashMap[key2];
	}.paramType(['K','J']).returnType('V'),
	put: function(key1, key2, value) {
		var hashMap = null;
		if(this._hashMaps.hasOwnProperty(key1)) {
			hashMap = this._hashMaps[key1];
		} else {
			hashMap = {};
		}
		hashMap[key2] = value;
		this._hashMaps[key1] = hashMap;
	}.paramType(['K','J','V']),
	static: {
		getInstance: function(genericTyping) {
			return new unicrypt.helper.map.HashMap2D(genericTyping);
		}.paramType(['array'])
	}
});