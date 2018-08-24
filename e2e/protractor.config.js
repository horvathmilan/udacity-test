'use strict';

const GLOBAL_TIMEOUT = 40e3;
const os = require('os');
const path = require('path');
const requireIt = require('require-it');

exports.config = {
    specs: 'features/**/*.feature',
    capabilities: {
        browserName: 'chrome'
    },
    directConnect: true,
    cucumberOpts: {
        require: ['step_definitions/**/*.js'],
        tags: ['~@wip','@current'],
        format: ['pretty', 'json:cucumber.json']
    },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    chromeDriver: path.join(requireIt.directory('protractor'), 'node_modules', 'webdriver-manager', 'selenium', 'chromedriver_2.41' + (os.platform() === 'win32' ? '.exe' : '')),
    onPrepare: function () {
        global.GLOBAL_TIMEOUT = GLOBAL_TIMEOUT;
        global.pageLoadTime = 5000;
        global.extraWait = 3000;
        global.ec = protractor.ExpectedConditions;

        const chai = require('chai');
        chai.use(require('chai-as-promised'));
        global.expect = chai.expect;
        
        global.convertDataTable = table => {
            let array = [];
            table.raw().forEach(element => {
                array.push(element[0]);
            });
            return array;
        };

        global.deleteCommas = array =>{
            let newArray = [];
            let string;
            if (array.length === 1){
                return array;
            }
                for (let i=0; i<array.length; i++){
                    if (i !== array.length-1){
                        string = array[i].substring(0,array[i].length-1);
                        newArray.push(string);
                    } else {
                        string = array[i];
                        newArray.push(string);
                    }
                }
                return newArray;
        };
        
        protractor.ElementFinder.prototype.isVisible = function () {
            return this.isPresent().then(present => {
                if (present) {
                    return this.isDisplayed();
                }
                return false;
            })
        };

        browser.waitForAngularEnabled(false);
        return browser.manage().window().maximize().catch(() => {
            return browser.manage().window().setSize(1800, 1012);
        });

    }
};