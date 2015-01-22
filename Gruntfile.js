var serverRootUri = 'http://127.0.0.1:8000';
var mochaPhantomJsTestRunner = serverRootUri + '/public/test/index.html';

module.exports = function (grunt) {
  function getBanner (pkg) {
    return [
      '/*! ' + pkg.name + ' - v' + pkg.version + ' - ',
      grunt.template.today('yyyy-mm-dd') + '\n',
      '* Copyright (c) ' + grunt.template.today('yyyy') + ' ' + pkg.author + ';*/\n'
    ].join('');
  }
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: getBanner(grunt.file.readJSON('package.json')),

    files: {
      src: [
        'src/index.js'
      ],
      require: [
        'src/index.js'
      ],
      test: {
        commonJS: [
          'test/commonJS/*.js'
        ],
        amd: [
          'test/commonJS/*.js',
          'test/AMD/*.js'
        ]
      }
    },

    jshint: {
      files: [
        '<%= files.src %>',
        '<%= files.test.commonJS %>',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // mochaTests for commonjs testing before cleaning and browserifying the
    // public files
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [ '<%= files.test.commonJS %>' ]
      }
    },

    clean: {
      files: ['./public/dist/*']
    },

    browserify: {
      options: {
        banner: '<%= banner %>'
      },
      // This browserify build be used by users of the module. It contains a
      // UMD (universal module definition) and can be used via an AMD module
      // loader like RequireJS or by simply placing a script tag in the page,
      // which registers mymodule as a global var. You can see examples for both
      // usages in browser/example/index.html (script tag) and
      // browser/example/index-require.html (RequireJS).
      standalone: {
        src: [ '<%= files.src %>' ],
        dest: './public/dist/<%= pkg.name %>.standalone.js',
        options: {
          standalone: '<%= pkg.name %>'
        }
      },
      // This browserify build can be required by other browserify modules that
      // have been created with an --external parameter. See
      // browser/test/index.html for an example.
      require: {
        banner: '<%= banner %>',
        src: [ '<%= files.require %>' ],
        dest: './public/dist/<%= pkg.name %>.require.js',
        options: {
          alias: [ './src/index.js:' ]
        }
      },
      // These are the browserified tests. We need to browserify the tests to
      // be able to run the mocha tests while writing the tests as clean,
      // simple CommonJS mocha tests (that is, without cross-platform
      // boilerplate code). This build will also include the testing libs
      // chai, sinon and sinon-chai but must not include the module under test.
      tests: {
        src: [ '<%= files.test.amd %>' ],
        dest: './public/test/test_bundle.js',
        external: [ './src/index.js' ]
      }
    },

    // compress public dist files using uglify
    uglify: {
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.standalone.min.js':
              ['<%= browserify.standalone.dest %>'],
          'public/dist/<%= pkg.name %>.require.min.js':
              ['<%= browserify.require.dest %>']
        }
      }
    },

    // Used for mocha-phantomjs tests
    connect: {
      server: {},
      keepalive: {
        options: {
          keepalive: true
        }
      }
    },

    // run the mocha tests in the browser via PhantomJS
    'mocha_phantomjs': {
      all: {
        options: {
          urls: [
            mochaPhantomJsTestRunner
          ]
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'clean',
    'browserify',
    'uglify',
    'connect:server',
    'mocha_phantomjs'
  ]);
};
