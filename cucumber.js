const { SnippetsFormatter } = require('@cucumber/cucumber');
const { formatWithOptions } = require('util');

module.exports = {
  default: 
    `--require-module ts-node/register --require src/test/steps/**/*.ts src/test/features/**/*.feature`,
    formatoptions: {
      snippetInterface: 'async-await',
      resultsDir: "allure-results"
    },
 

    paths: ['/src/test/features/getuser.feature'],
    require: ['/src/test/steps','src/test/Support'],
    dryRun: false,
    strict: false,
    requireModule: ['ts-node/register'],
    format: [
      "allure-cucumberjs/reporter",
      "json:reports/cucumber_report.json",// Use custom reporter"
      "progress"
    ],
    publishQuiet: true,

  };
