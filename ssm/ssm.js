#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');
const tarsUtils = require('./lib/utils');
const args = process.argv.slice(2);
const cliRootPath = path.resolve(__dirname, '../');
let npmRootPath = path.join(cliRootPath, 'node_modules/');


try {
    fs.statSync(npmRootPath);
} catch (error) {
    npmRootPath = path.resolve(cliRootPath, '../') + path.sep;
}



// // Get root npm directory for global packages and create env-var with it.
process.env.cliRoot = cliRootPath;
process.env.npmRoot = npmRootPath;

program
    .usage('[command] [options] \n         Command without flags will be started in interactive mode.');

program
    .command('add-component <componentName>')
    .alias('add')
    .description('Add component to components directory')
    .option('-js', 'Add component without .js')
    .option('-scss', 'Add component without scss')
    .option('-html', 'Add component without html')
    .action((componentName, options) => {require('./lib/add-component')(componentName, options);});

program
    .command('delete-component <componentName>')
    .alias('del')
    .description('Delete component from components directory')
    .action((componentName) => {require('./lib/delete-component')(componentName);});

program.parse(process.argv);
