#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');
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
    .option('-j, --js', 'Add component without .js')
    .option('-c, --scss', 'Add component without scss')
    .option('-h, --html', 'Add component without html')
    .action((componentName, options) => {require('./lib/add-component')(componentName, options);});

program
    .command('add-template <componentName>')
    .description('Add component to components directory')
    .option('-j, --js', 'Add component without .js')
    .option('-c, --scss', 'Add component without scss')
    .option('-h, --html', 'Add component without html')
    .action((componentName, options) => {require('./lib/add-template')(componentName, options);});

program
    .command('remove-component <componentName>')
    .alias('del')
    .description('Delete component from components directory')
    .action((componentName) => {require('./lib/delete-component')(componentName);});

program
    .command('remove-template <componentName>')
    .description('Delete component from components directory')
    .action((componentName) => {require('./lib/delete-template')(componentName);});

program.parse(process.argv);
