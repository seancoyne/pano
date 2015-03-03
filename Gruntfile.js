/* global module, process */
(function(module, process){

	"use strict";

	module.exports = function(grunt) {

		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-gh-pages');
		
		var repoSlug = process.env.TRAVIS_REPO_SLUG || "seancoyne/pano";
		var ghToken = process.env.GH_TOKEN;
		
		grunt.initConfig({

			jshint: {
				options: {
					jshintrc: true,
					force: false
				},
				grunt: [ 'Gruntfile.js' ],
				project: [ "jquery.pano.js" ],
				all: [ 'Gruntfile.js', "jquery.pano.js" ]
			},
			
			'gh-pages': {
				options: {
					base: '.',
					repo: ((ghToken) ? "https://" + ghToken + "@github.com/" + repoSlug + ".git" : "git@github.com:" + repoSlug + ".git"),
					branch: "gh-pages",
					user: {
						name: (process.env.GIT_NAME || "Sean Coyne"),
						email: (process.env.GIT_EMAIL || "sean@n42designs.com")
					}
				},
				src: [ "index.html", "jquery.pano.js", "sphere.jpg" ]
			}
			
		});

		grunt.registerTask('lint', [ 'jshint:all' ]);
		grunt.registerTask("build", [ "jshint:project", "gh-pages" ]);

	};

})(module, process);
