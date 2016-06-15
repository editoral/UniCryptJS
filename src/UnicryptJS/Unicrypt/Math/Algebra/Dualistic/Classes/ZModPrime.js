unicrypt.math.algebra.dualistic.classes.ZModPrime  = Op.Class('ZModPrime', {
	'extends': unicrypt.math.algebra.dualistic.classes.ZMod
},{
	_init: function(prime) {
		super(prime.getValue());
	}.paramType(['BigInteger']),
	static: {
		getInstance: function(modulus) {
			if (modulus == null) {
				throw new Error('IllegalArgumentException');
			}
			var instance = new unicrypt.math.algebra.dualistic.classes.ZModPrime(modulus);
			return instance;			
		}.paramType(['BigInteger'])
	}

});