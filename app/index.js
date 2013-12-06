'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');

// @breck7   https://github.com/breck7
function resolvePath (string) {
  if (string.substr(0,1) === '~')
    string = process.env.HOME + string.substr(1)
  return path.resolve(string)
}

var TizenwebuiGenerator = module.exports = function TizenwebuiGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(TizenwebuiGenerator, yeoman.generators.Base);

TizenwebuiGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
  { name: "projectName", message: "Your project's name?", required: true },
  { name: "authorName", message: "Your full name?", required: true },
  { name: "authorEmail", message: "Your email?", required: true },
  { name: "authorUrl", message: "Your url?", required: true },
  { name: "tizenSdk", message: "Path to Tizen SDK installation", default: "~/tizen-sdk", required: true},
  { name: "useTizenIndex", message: "Use Tizen's web template? (NO uses initializr.com's mobile-ready template)", type: 'confirm', default: true }
  ];

  this.prompt(prompts, function (props) {
    function makeid() {
        var parts = [];
        var alphanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            parts.push(alphanum.charAt(Math.floor(Math.random() * alphanum.length)));

        return parts.join('');
    }

    this.projectName = props.projectName;
    this.authorName = props.authorName;
    this.authorEmail = props.authorEmail;
    this.authorUrl = props.authorUrl;
    this.tizenSdk = resolvePath(props.tizenSdk);
    this.projectId = makeid();
    this.tizenHtml = props.useTizenIndex;

    cb();
  }.bind(this));
};

TizenwebuiGenerator.prototype.app = function app() {
  this.mkdir('src');
  
  this.mkdir('tools');
  this.mkdir('build');
  
  this.template('_config.xml', 'config.xml');
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('Gruntfile.js', 'Gruntfile.js');

  this.directory('staging/css/', 'src/css');
  this.directory('staging/js/', 'src/js');
  this.directory('staging/img/', 'src/img');
  this.directory('staging/tools/', 'tools');

  this.copy('staging/icon.png', 'src/icon.png');
  if(this.tizenHtml) {
      this.template('staging/_index.html', 'src/index.html');
      this.copy('staging/tizen.css', 'src/css/main.css');
  } else {
      this.template('staging/_initialzr.html', 'src/index.html');
  }
};

TizenwebuiGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('bowerrc', '.bowerrc');
};
