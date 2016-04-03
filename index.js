'use strict';

const uncss = require('uncss');
const CleanCSS = require('clean-css');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

var unCssOptions = { uncssrc: '.uncssrc' };
var getPath = _.partial(path.join, __dirname);
var rawHTML = fs.readFileSync(getPath('./dev.html'));
var htmlOptions = require('./data/info.json');
var config = require('./data/config.json');
var minifyHTML = require('html-minifier').minify;

function getHTML (config) {
	config = _.extend({}, config);
	return _.template(rawHTML)(config);
}

uncss(getHTML(htmlOptions), unCssOptions, function (error, css) {
	if (error) {
		console.error(error);
		return;
	}
	var finalOptions = _.extend({}, htmlOptions);
	finalOptions.css = [];
	var minified = new CleanCSS(config.css).minify(css).styles;
	finalOptions.processedCss = minified;
	var finalHTML = getHTML(finalOptions);
	fs.writeFileSync(getPath('./index.html'), minifyHTML(finalHTML, config.html));
});
