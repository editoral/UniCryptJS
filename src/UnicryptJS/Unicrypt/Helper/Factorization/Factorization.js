//  unicrypt.helper.factorization.Factorization = Op.Class('Factorization', {
// 	'extends': unicrypt.UniCrypt
// },{
// 	value: null,
// 	primeFactors: [],
// 	exponents: [],
// 	_init: function(value, primeFactors, exponents) {
// 		this.value = value;
// 		this.primeFactors = primeFactors;
// 		this.exponents = exponents;
// 	}.paramType(['BigInteger','array','array']),
// 	getValue: function() {
// 		return this.value;
// 	}.returnType('BigInteger'),
// 	getPrimeFactors: function() {
// 		return this.primeFactors;
// 	}.returnType('array'),
// 	getExponents: function() {
// 		return this.exponents;
// 	}.returnType('array'),
// 	defaultToStringContent: function() {
// 		return "" + this.getValue();
// 	}.returnType('string'),
// 	hashCode: function() {
// 		int hash = 3;
// 		hash = 89 * hash + this.value.hashCode();
// 		return hash;
// 	}.returnType('int'),
// 	equals: function(obj) {
// 		if (obj == null) {
// 			return false;
// 		}
// 		if (obj instanceof Factorization) {
// 			final Factorization other = (Factorization) obj;
// 			return this.value.equals(other.value);
// 		}
// 		return false;
// 	}.paramType(['object']).returnType('boolean'),
// 	static: {
// 		getInstance: function() {
// 			var primeFactors = this.primeFactors;
// 			var value = this.value;
// 			var exponents = this.exponents;
// 			if (primeFactors == null || exponents == null || primeFactors.length != exponents.length) {
// 				throw new Error('IllegalArgumentException');
// 			}
// 			BigInteger value = BigInteger.ONE;
// 			for (var i = 0; i < primeFactors.length; i++) {
// 				if (primeFactors[i] == null || !MathUtil.isPrime(primeFactors[i]) || exponents[i] < 1) {
// 					throw new Error('IllegalArgumentException');
// 				}
// 				value = value.multiply(primeFactors[i].pow(exponents[i]));
// 			}
// 			var newPrimeFactors = MathUtil.removeDuplicates(primeFactors);
// 			var newLength = newPrimeFactors.length;
// 			var newExponents = new Array(newLength);
// 			for (var i = 0; i < newLength; i++) {
// 				for (var j = 0; j < primeFactors.length; j++) {
// 					if (newPrimeFactors[i].equals(primeFactors[j])) {
// 						newExponents[i] = newExponents[i] + exponents[j];
// 					}
// 				}
// 			}
// 			if (newLength == 1 && newExponents[0] == 1) {
// 				return new Prime(newPrimeFactors[0]);
// 			}
// 			if (newLength == 2 && newExponents[0] == 1 && newExponents[1] == 1) {
// 				return new PrimePair(newPrimeFactors[0], newPrimeFactors[1]);
// 			}
// 			return new Factorization(value, newPrimeFactors, newExponents);
// 		}.paramType(['array','array']).returnType('Factorization')
// 	}
// });