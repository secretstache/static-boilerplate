'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const del = require('del');
const ssmUtils = require('./utils');
const cwd = process.cwd();
let newComponentName;

function actionsOnError(error, newComponentPath) {
    console.log('\n');
    ssmUtils.ssmSay(chalk.red('Something is gone wrong...'));
    ssmUtils.ssmSay('Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com', true);
    console.error(error.stack);
}

function getNewComponentPath() {
    let newComponentPath = {};
    newComponentPath.js = `${cwd}/src/assets/scripts/layout-builder/components/`;
    newComponentPath.scss = `${cwd}/src/assets/styles/layout-builder/components/`;
    newComponentPath.html = `${cwd}/src/partials/layout-builder/components/`;
  
    return newComponentPath;
}


/**
 * Create component 
 * @param  {String} componentName The name of new component
 * @param  {Object} options       Inquirer options
 */
module.exports = function deleteComponent(componentName) {
    
    const newComponentPath = getNewComponentPath();


    fs.unlink(`${newComponentPath.js}/${componentName}.js`, (err) => {
        
    });

    fs.unlink(`${newComponentPath.scss}/_${componentName}.scss`, (err) => {
   
    });

    fs.unlink(`${newComponentPath.html}/${componentName}.html`, (err) => {

    });

    ssmUtils.ssmSay(chalk.green(`${componentName} was deleted \n`), true);


};