#!/usr/bin/env node

/*

Deploy demo to gh-pages branch

*/

var fs = require("fs");
var path = require("path");
var exec  = require('child_process').exec;

var repoSlug = process.argv[2] || process.env.TRAVIS_REPO_SLUG || "seancoyne/pano";
var ghToken = process.argv[3] || process.env.GH_TOKEN;
var gitName = process.argv[4] || process.env.GIT_NAME;
var gitEmail = process.argv[5] || process.env.GIT_EMAIL;

if (!ghToken) {
	console.log("No token found, relying on SSH keys being in place");
	var repoURL = "git@github.com:" + repoSlug + ".git";	
} else {
	var repoURL = "https://" + ghToken + "@github.com/" + repoSlug + ".git";	
}

var baseDir = __dirname;
var buildDir = path.normalize(baseDir + "/build");

var demoFiles = [
	"index.html",
	"jquery.pano.js",
	"sphere.jpg"
];

var copyFile = function(from, to, cwd, cb) {
	exec("cp " + from + " " + to, { cwd: cwd }, function(err, stdout, stderr){
		if (cb) {
			cb(err, stdout, stderr);
		}
	});
};

var deleteFile = function(file, cb) {
	fs.unlink(file, function(err){
		if (cb) {
			cb(err);	
		}
	});
}

var setGitConfigValue = function(configKey, value, cb, errorMessage) {
	errorMessage = errorMessage || "Error setting git config value for key " + configKey + " with value " + value;
	exec("git config --local " + configKey + ' "' + value + '"', { cwd: buildDir }, function(err){
		if (err) {
			console.error(errorMessage, err);
			throw err;
		}
		if (cb) {
			cb();
		}
	});
};

var setGitName = function(name, cb) {
	setGitConfigValue("user.name", name, cb);
};

var setGitEmail = function(email, cb) {
	setGitConfigValue("user.email", email, cb);
};

exec("rm -rf " + buildDir, { cwd: baseDir }, function (err){
	
	if (err) {
		console.error("Error deleting build directory", err);
		throw err;
	}

	// clone into ./build
	exec("git clone " + repoURL + " build", { cwd: baseDir }, function(err){
		
		if (err) {
			console.error("Error cloning into build", err);
			throw err;
		}
		
		// switch to gh-pages branch
		exec("git checkout gh-pages", { cwd: buildDir }, function(err){
			
			if (err) {
				console.error("Error checking out gh-pages", err);
				throw err;
			}
			
			// delete all current files
			fs.readdir(buildDir, function(err, files){
				
				if (err) {
					console.error("Error reading current file list", err);
					throw err;
				}
				
				var filesDeleted = [];
				files.forEach(function(file) {
					if (file !== ".git") {
						deleteFile(buildDir + "/" + file, function(err){
							if (err) console.error(err);
							console.log("deleted", file);	
							if (demoFiles.indexOf(file) == -1) {
								filesDeleted.push(file);
							}
						});
						
					}
				});	
				
				// copy the demo files from master into gh-pages
				completeCount = 0;
				demoFiles.forEach(function(file){
					
					copyFile(baseDir + "/" + file, buildDir + "/", baseDir, function(err){
						
						if (err) {
							console.error("Error copying file", file , err);
							throw err;
						}
						console.log("copied",baseDir + "/" + file, "to", buildDir);
						completeCount++;	
						
						if (completeCount >= demoFiles.length) {
							// continue
							console.log("copying files complete.");
							
							exec("git add " + demoFiles.join(" "), { cwd: buildDir }, function(err, stdout, stderr){
								
								if (err) {
									console.error("Error adding files to git", err);
									throw err;
								}
								
								console.log("Added files to git");
								
								// remove files
								
								var deleteCallback = function(err){
											
									if (err) {
										console.error("Error removing files from git", err);
										throw err;
									}
									
									console.log("Removed files from git");
									
									var nextStep = function() {
										
										exec('git commit -m "Update demo from latest master (automated)"', { cwd: buildDir }, function(err, stdout, stderr){
											
											if (err && stdout.indexOf("Your branch is up-to-date with 'origin/gh-pages'.") == -1) {
												console.error("Error committing changes to git", err, stdout, stderr);
												throw err;
											}
											
											console.log(stdout);	
											
											// push
											
											exec("git push origin gh-pages", { cwd: buildDir }, function(err, stdout, stederr){
												
												if (err) {
													console.error("Error pushing changes to github", err);
													throw err;
												}
												
												console.log("Changes pushed to github", stdout);
												
												// delete the build dir
												exec("rm -rf " + buildDir, { cwd: baseDir }, function (err){
													console.log("Complete!");
												});
												
											});
											
										});
										
									};
									
									if (gitName) {
										setGitName(gitName, function(){
											if (gitEmail) {
												setGitEmail(gitEmail, function(){
													nextStep();
												});
											} else {
												console.log("No git email found, relying on global config setting...");
												nextStep();
											}
										});
									} else if (gitEmail) {
										console.log("No git name found, relying on global config setting...");
										setGitEmail(gitEmail, function(){
											nextStep();
										});
									} else {
										console.log("No credentials found, relying on global config setting...");
										nextStep();
									}
									
								};
								
								if (filesDeleted.length) {
									exec("git rm " + filesDeleted.join(" "), { cwd: buildDir }, deleteCallback);
								} else {
									deleteCallback();
								}
								
							});
							
						}
						
					});
					
				});
				
			});
			
		});	
		
	});

});