//var uniD = {},
//var uniD.alg.GStarMod = unicrypt.math.algebra.multiplicative.classes.GStarMod.getInstance();


// var hashMap = unicrypt.helper.map.HashMap2D.getInstance(['int','int','string']);

// console.log(hashMap._generic_);
// hashMap.put(10,20,'hallo');
// console.log('here: ' + hashMap.get(10,20));

var bigInt = new u.BigInteger(60);
var bigInt2 = new u.BigInteger(30);
var bigInt = bigInt.subtract(bigInt2);
//console.log('BigInteger: ' + bigInt.intValue());

var gGstarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(11);
console.log('Modulus: ' + gGstarMod.getModulus().intValue());
console.log('ModuloFactorization: ' +  gGstarMod.getModuloFactorization().intValue());
console.log('orderFactorization: ' +  gGstarMod.getOrderFactorization().intValue());

console.log(gGstarMod.__proto__.constructor.name);
console.log(gGstarMod.__proto__.__proto__.constructor.name);
console.log(gGstarMod.__proto__.__proto__.__proto__.constructor.name);

var gGstarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(11);
var el = new u.BigInteger(3);
var gStarEl = gGstarMod.getElement(el);