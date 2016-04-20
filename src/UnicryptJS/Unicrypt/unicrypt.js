unicrypt.UniCrypt = Op.AbstractClass('UniCrypt', null, {
	toString: function() {
		var str1 = this._defaultToStringType();
		var str2 = this._defaultToStringContent();
		if(str1.length() == 0) {
			return str2;
		}
		if(str2.length() == 0) {
			return str1;
		}
		return str1 + "[" + str2 + "]";
	}.returnType('string'),
	_defaultToStringType: function() {
		return this.constructor.name;
	},
	_defaultToStringContent: function() {
		return "";
	}
});