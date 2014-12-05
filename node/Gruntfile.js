module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    //-- Read the package.json file content
    pkg: grunt.file.readJSON("package.json"),


    //-- CONCURRENT
    concurrent: {
        dev: {
            tasks: ["test", "buildDebug", "copy", "nodemon", "watch"],
            options: {
                logConcurrentOutput: true
            }
        }
    },


    //-- NODEMON
    nodemon: {
        dev: {
            script: "server.js",
            options: {
                watch: ["server.js", "../app/**/*.js"],
                delay: 300
            }
        }
    },


    //-- LINTING
    jshint: {
      // define the files to lint
      files: ["gruntfile.js", "../app/**/*.js", "test/**/*.js", "!../app/js/angular-ui-router.min.js"],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },


    //-- NODE TESTS
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          quiet: false,
          clearRequireCache: false
        },
        src: ["test/**/*.js"]
      }
    },


    //-- KARMA TESTS
    karma: {
      unit: {
        configFile: "karma.conf.js"
      }
    },


    //-- WATCH
    watch: {
      files: ["<%= jshint.files %>"],
      tasks: ["buildDebug"]
    },


    //-- CONCAT
    concat: {
      options: {
        separator: ";",
      },
      dist: {
        src: ["../app/app.js", "../app/controllers/*.js", "../app/directives/*.js", "../app/services/*.js", "../app/js/*.js"],
        dest: "../public/js/app.js",
      },
    },


    //-- COPY
    copy: {
      dist: {
        files: [
          { expand: true, flatten: true, src: ["../app/js/data.json"], dest: "../public/js/", filter: "isFile" },
          { expand: true, flatten: true, src: ["../app/views/css/*"], dest: "../public/css/", filter: "isFile" },
          { expand: true, flatten: true, src: ["../app/views/img/*", "!../app/views/img/*.ico"], dest: "../public/img/", filter: "isFile" },
          { expand: true, flatten: true, src: ["../app/views/img/favicon.ico"], dest: "../public/", filter: "isFile" },
          { expand: true, flatten: true, src: ["../app/views/index.html"], dest: "../public/", filter: "isFile" },
          { expand: true, flatten: true, src: ["../app/views/*", "!../app/views/index.html"], dest: "../public/views/", filter: "isFile" },
          { expand: true, flatten: true, src: ["../app/js/MathRounding.js"], dest: "../public/js/", filter: "isFile" }
        ],
      },
    },


    //-- UGLIFY
    uglify: {
      debug: {
        options: {
          mangle: false
        },
        files: {
          "../public/js/app.min.js": ["../public/js/app.js"]
        }
      },
      dist: {
        files: {
          "../public/js/app.min.js": ["../public/js/app.js"]
        }
      }
    },

    clean: {
      dist: {
        options: {
          force: true
        },
        src: ["../public/css/*", "../public/img/*", "../public/js/*", "../public/views/*", "../public/index.html"]
      }
    }

  });


  //-- Load NPM tasks
  grunt.loadNpmTasks( "grunt-nodemon" );
  grunt.loadNpmTasks( "grunt-concurrent" );
  grunt.loadNpmTasks( "grunt-mocha-test" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-karma" );


  //-- Register tasks
  grunt.registerTask( "test", ["jshint", "karma"] );
  grunt.registerTask( "buildDebug", ["test", "clean", "minifyDebug", "copy"] );
  grunt.registerTask( "minifyDebug", ["concat:dist", "uglify:debug"] );
  grunt.registerTask( "minifyDist", ["concat:dist", "uglify:dist"] );
  grunt.registerTask( "default", ["clean", "minifyDebug", "copy", "concurrent:dev"] );

};