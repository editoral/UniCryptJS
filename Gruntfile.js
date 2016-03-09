module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
 	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		concat: {
			options: {
				separator: '\n',
			},
			dist: {
				src: ['src/*.js'],
				dest: 'dist/built.js',
			},
			demoDist: {
				src: ['demo/*.js', 'src/*.js'],
				dest: 'dist/demoBuilt.js'
			}
		},
		mochaTest: {
	      	test: {
		        options: {
		          	reporter: 'spec',
		          	captureFile: 'results.txt', // Optionally capture the reporter output to a file 
		          	quiet: false, // Optionally suppress output to standard out (defaults to false) 
		          	clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
		        },
		        src: ['test/**/*.js']
      		}
    	}
	});


	grunt.registerTask('default', ['concat', 'mochaTest']);
};