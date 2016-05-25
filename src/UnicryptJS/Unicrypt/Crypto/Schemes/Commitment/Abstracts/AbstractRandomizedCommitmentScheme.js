unicrypt.crypto.schemes.commitment.abstracts.AbstractRandomizedCommitmentScheme = Op.AbstractClass('AbstractRandomizedCommitmentScheme', {
	'generic': ['M', 'N', 'C', 'D', 'R'],
	'extends': {
		'class': unicrypt.crypto.schemes.scheme.abstracts.AbstractCommitmentScheme,
		'generic': ['M', 'C']
	}
}, {
	_randomizationSpace: null,
	_init: function(messageSpace, commitmentSpace, randomizationSpace) {
		this.$$super(messageSpace);
		this._randomizationSpace = randomizationSpace;		
	}.paramType(['M', 'C', 'R']),
	getRandomizationSpace: function() {
		return this._randomizationSpace;
	}.paramType(['M']),
	commit: function(message, randomization) {
		return this.getCommitmentFunction().apply(message, randomization);
	}.paramType('Element', 'Element'),
	decommit: function(message, randomization, commitment) {
		return this.getDecommitmentFunction().apply(message, randomization, commitment);
	}.returnType('boolean'),
	_abstractGetDecommitmentFunction: function() {
		var decommitFunction = function() {

		}
		return decommitFunction;
	}
});