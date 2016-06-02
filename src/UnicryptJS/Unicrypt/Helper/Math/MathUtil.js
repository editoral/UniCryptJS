unicrypt.helper.math.MathUtil = Op.Class('MathUtil', {

},{
	static: {
		areRelativelyPrime: function(value1, value2) {
			return value1.gcd(value2).equals(u.BigInteger.ONE())
		}.paramType(['BigInteger', 'BigInteger']),
		NUMBER_OF_PRIME_TESTS: 40,
		isPrime: function(value) {
			return value.signum() > 0 && value.isProbablePrime(unicrypt.helper.math.MathUtil.NUMBER_OF_PRIME_TESTS);
		},
		// removeDuplicates: function(a) {
		//     var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

		//     return a.filter(function(item) {
		//         var type = typeof item;
		//         if(type in prims)
		//             return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
		//         else
		//             return objs.indexOf(item) >= 0 ? false : objs.push(item);
		//     });
		// }.paramType('array').returnType('array'),
	}
});