globalScope.u = {},
u.BigInteger = Op.Class('BigInteger',null, {
	bigInt: null,
	init: function init(num) {
		this.bigInt = new BigInteger(''+num);
	}.paramType(['long']),
	signum: function() {
		return this.bigInt.signum();
	},
	isProbablePrime: function(num) {
		return this.bigInt.isProbablePrime(num);
	}.paramType(['int']),
	add: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.add(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),
	subtract: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.subtract(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),
	divide: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.divide(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),
	multiply: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.multiply(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),	
	intValue: function() {
		return this.bigInt.intValue();
	}.returnType('int'),
	compareTo: function(value) {
		return this.bigInt.compareTo(value.bigInt);
	}.paramType(['BigInteger']),
	gcd: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.gcd(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),
	equals: function(value) {
		return this.bigInt.equals(value.bigInt);
	}.paramType(['BigInteger']),
	mod: function(mod) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.mod(mod.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),	
	modInverse: function(mod) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.modInverse(mod.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']).returnType('BigInteger'),
	bitLength: function() {
		return this.bigInt.bitLength();
	}.returnType('int'),
	testBit: function(bit) {
		return this.bigInt.testBit(bit)
	}.paramType(['int']).returnType('boolean'),
	modPow: function(exponent, m) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.modPow(exponent.bigInt, m.bigInt);
		return newBigInt;
	}.paramType(['BigInteger', 'BigInteger']),
	static: {
		valueOf: function(long) {
			return new u.BigInteger(long)
		}.paramType(['long']),
		ONE: function() {
			return new u.BigInteger(1);
		}
	}
	
		
});