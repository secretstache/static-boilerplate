'use strict';

import plugins from 'gulp-load-plugins';
import yargs from 'yargs';
import browser from 'browser-sync';
import gulp from 'gulp';
import panini from 'panini';
import rimraf from 'rimraf';
import sherpa from 'style-sherpa';
import yaml from 'js-yaml';
import fs from 'fs';
import webpackStream from 'webpack-stream';
import webpack2 from 'webpack';
import named from 'vinyl-named';
import styleguide from 'sc5-styleguide';


// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
	let ymlFile = fs.readFileSync('config.yml', 'utf8');
	return yaml.load(ymlFile);
}

gulp.task('styleguide',
	gulp.series(styleguideGenerate, styleguideApply));

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
	gulp.series(clean, gulp.parallel(pages, sass, javascript, images, copy), 'styleguide'));

// Build the site, run the server, and watch for file changes
gulp.task('default',
	gulp.series('build',server, watch));



// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
	rimraf(PATHS.dist, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
	return gulp.src(PATHS.assets)
		.pipe(gulp.dest(PATHS.dist + '/assets'));
}

// Copy page templates into finished HTML files
function pages() {
	return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
		.pipe(panini({
			root: 'src/pages/',
			layouts: 'src/layouts/',
			partials: 'src/partials/',
			data: 'src/data/',
			helpers: 'src/helpers/'
		}))
		.pipe(gulp.dest(PATHS.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
	panini.refresh();
	done();
}


// Generate a style guide from the Markdown content and HTML template in styleguide/
function styleGuide(done) {
	sherpa('src/styleguide/index.md', {
		output: PATHS.dist + '/styleguide.html',
		template: 'src/styleguide/template.html'
	}, done);
}

function styleguideGenerate() {
	return gulp.src(PATHS.styleSrc)
	.pipe(styleguide.generate({
		title: 'Styleguide',
		server: true,
		rootPath: PATHS.style,
		overviewPath: 'styleguide.md',
		appRoot: '/styleguide',
		commonClass: 'sg-common',
		extraHead: [
			'<style>body {font-size:18px; margin: 0; padding: 0; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;} .sg-design {display: none;} .sg-footer {display: none;} .sg-search-field {margin-top: 20px;height: 40px;padding: 0 10px;} .sg {box-sizing: border-box;}</style>'
		]
	  }))
	.pipe(gulp.dest(PATHS.style));
}


function styleguideApply() {
	return gulp.src('src/assets/styles/main.scss')
	.pipe($.sass({
	  includePaths: PATHS.sass
	}).on('error', $.sass.logError))
	.pipe(styleguide.applyStyles())
	.pipe(gulp.dest(PATHS.style));
}


// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
	return gulp.src(PATHS.sassEntries)
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: COMPATIBILITY
		}))
		// Comment in the pipe below to run UnCSS in production
		//.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
		.pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie9' })))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe($.concat('main.css'))
		.pipe(gulp.dest(PATHS.dist + '/assets/styles'))
		.pipe(browser.reload({ stream: true }));
}

let webpackConfig = {
	module: {
		rules: [
			{
				test: /.scripts$/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			}
		]
	}
}
// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
	return gulp.src(PATHS.entries)
		.pipe(named())
		.pipe($.sourcemaps.init())
		.pipe(webpackStream(webpackConfig, webpack2))
		.pipe($.if(PRODUCTION, $.uglify()
			.on('error', e => { console.log(e); })
		))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe($.concat('main.js'))
		.pipe(gulp.dest(PATHS.dist + '/assets/scripts'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
	return gulp.src('src/assets/images/**/*')
		.pipe($.if(PRODUCTION, $.imagemin({
			progressive: true
		})))
		.pipe(gulp.dest(PATHS.dist + '/assets/images'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
	browser.init({
		server: PATHS.dist, port: PORT
	});
	done();
}

// Reload the browser with BrowserSync
function reload(done) {
	browser.reload();
	done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
	gulp.watch(PATHS.assets, copy);
	gulp.watch('src/pages/**/*.html').on('all', gulp.series(pages, browser.reload));
	gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages, browser.reload));
	gulp.watch('src/assets/styles/**/*.scss').on('all', gulp.series(sass, styleguideGenerate, styleguideApply));
	gulp.watch('src/assets/scripts/**/*.js').on('all', gulp.series(javascript, browser.reload));
	gulp.watch('src/assets/images/**/*').on('all', gulp.series(images, browser.reload));
}
