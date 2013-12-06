/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('tizenwebui generator', function () {
    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('tizenwebui:app', [
                '../../app'
            ]);
            done();
        }.bind(this));
    });

    it('creates expected files', function (done) {
        var expected = [
            'config.xml',
            'package.json',
            'bower.json',
            'Gruntfile.js',
            'src/css/main.css',
            'src/css/normalize.css',
            'src/css/normalize.min.css',
            'src/js/main.js',
            'src/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js',
            'src/img/tizen_32.png',
            'tools/grunt-package.js',
            'tools/grunt-package.license',
            'tools/scripts/launch_emulator.sh',
            'src/icon.png',
            'src/index.html',
            'src/css/main.css',
            '.editorconfig',
            '.jshintrc',
            '.gitignore',
            '.bowerrc'
        ];

        helpers.mockPrompt(this.app, {
            'projectName': 'Some example app',
            'authorName': 'Jim Schubert',
            'authorEmail': 'james.schubert@gmail.com',
            'authorUrl': 'http://ipreferjim.com',
            'tizenSdk': '~/tizen-sdk',
            'useTizenIndex': true
        });
        this.app.options['skip-install'] = true;
        this.app.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });
});
