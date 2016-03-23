module.exports = function(grunt) {
	"use strict";
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
		        src: ['test/oopTest.js']
      		},
      		testDemo: {
      			options: {
		          	reporter: 'spec',
		          	captureFile: 'results.txt', // Optionally capture the reporter output to a file 
		          	quiet: false, // Optionally suppress output to standard out (defaults to false) 
		          	clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
		        },
		        src: ['test/demoTest.js']		     
      		}
    	}
	});


	grunt.registerTask('default', ['concat:dist', 'mochaTest:test']);
	grunt.registerTask('demo', ['concat:demoDist', 'mochaTest:testDemo']);
};