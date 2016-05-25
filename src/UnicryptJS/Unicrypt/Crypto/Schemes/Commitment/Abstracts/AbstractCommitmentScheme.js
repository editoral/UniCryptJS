unicrypt.crypto.schemes.commitment.abstracts.AbstractCommitmentScheme = Op.AbstractClass('AbstractCommitmentScheme', {
	'generic': ['M', 'C'],
	'extends': {
		'class': unicrypt.crypto.schemes.scheme.abstracts.AbstractScheme,
		'generic': ['M']
	}
}, {
	_commitmentSpace: null,
	_commitmentFunction: null,
	_decommitmentFunction: null,
	_init: function(messageSpace, commitmentSpace) {
		this.$$super(messageSpace);
		this._commitmentSpace = commitmentSpace;
	}.paramType(['M', 'C']),
	getCommitmentSpace: function() {
		return this._commitmentSpace;
	}.paramType(['M']),
	getCommitmentFunction: function() {
		if (this._commitmentFunction == null) {
			this._commitmentFunction = this._abstractGetCommitmentFunction();
		}
		return this._commitmentFunction;
	},
	getDecommitmentFunction: function() {
		if (this._decommitmentFunction == null) {
			this._decommitmentFunction = this._abstractGetDecommitmentFunction();
		}
		return this._decommitmentFunction;
	}
});