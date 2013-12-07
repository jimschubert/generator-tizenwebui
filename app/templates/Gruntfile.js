/*global module:false*/
// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        packageInfo: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: true
            },
            files: ['src/js/*.js']
        },

        clean: ['build'],

        release: {
            options: {
                npm: false,
                npmtag: false,
                tagName: 'v<%%= version %>'
            }
        },

        tizen_configuration: {
            // location on the device to install the tizen-app.sh script to
            // (default: '/tmp')
            tizenAppScriptDir: '/home/developer/',

            // path to the config.xml file for the Tizen wgt file - post templating
            // (default: 'config.xml')
            configFile: 'build/wgt/config.xml',

            // path to the sdb command (default: process.env.SDB or 'sdb')
            sdbCmd: 'sdb'
        },

        package: {
            wgt: {
                appName: '<%%= packageInfo.name %>',
                version: '<%%= packageInfo.version %>',
                files: 'build/wgt/**',
                stripPrefix: 'build/wgt/',
                outDir: 'build',
                suffix: '.wgt',
                addGitCommitId: false
            }
        },

        copy: {
            common: {
                files: [
                    { expand: true, cwd: '.', src: ['src/css/**'], dest: 'build/app' },
                    { expand: true, cwd: '.', src: ['src/js/**'], dest: 'build/app' },
                    { expand: true, cwd: '.', src: ['src/img/**'], dest: 'build/app' },
                    { expand: true, cwd: '.', src: ['src/tizen-web-ui-fw/**'], dest: 'build/app' },
                    { expand: true, cwd: '.', src: ['src/index.html'], dest: 'build/app' },
                ]
            },
            wgt: {
                files: [
                    { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/wgt/' },
                    { expand: true, cwd: '.', src: ['src/icon.png'], dest: 'build/wgt/' }
                ]
            },
            wgt_config: {
                files: [
                    { expand: true, cwd: '.', src: ['config.xml'], dest: 'build/wgt/' }
                ],
                options: {
                    processContent: function (content, srcpath) {
                        return grunt.template.process(content);
                    }
                }
            }
        },
        tizen: {
            push: {
                action: 'push',
                localFiles: {
                    pattern: 'build/*.wgt',
                    filter: 'latest'
                },
                remoteDir: '/home/developer/'
            },
            install: {
                action: 'install',
                remoteFiles: {
                    pattern: '/home/developer/<%%= packageInfo.name %>*.wgt',
                    filter: 'latest'
                }
            },
            uninstall: {
                action: 'uninstall'
            },
            start: {
                action: 'start',
                stopOnFailure: true
            },
            stop: {
                action: 'stop',
                stopOnFailure: false
            },
            debug: {
                action: 'debug',
                browserCmd: 'google-chrome %URL%',
                localPort: 9090,
                stopOnFailure: true
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-tizen');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadTasks('tools/');

    grunt.registerTask('dist', [
        'clean',
        'copy:common'
    ]);

    grunt.registerTask('wgt', ['dist', 'copy:wgt', 'copy:wgt_config', 'package:wgt']);

    grunt.registerTask('install', [
        'tizen_prepare',
        'tizen:push',
        'tizen:stop',
        'tizen:uninstall',
        'tizen:install',
        'tizen:start'
    ]);

    grunt.registerTask('restart', ['tizen:stop', 'tizen:start']);

    grunt.registerTask('wgt-install', ['wgt', 'install']);

    grunt.registerTask('default', ['jshint', 'wgt-install']);

};
