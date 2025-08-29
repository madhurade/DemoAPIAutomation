const { SnippetsFormatter } = require('@cucumber/cucumber');
const { formatWithOptions } = require('util');

module.exports = {
  default: {
    formatoptions: {
      snippetInterface: 'async-await',
      resultsDir: "allure-results"
    },
    
    paths: ['src/test/features/*.feature'],
    require: ['src/test/steps/*.steps.ts','src/test/Support/hooks.ts'],
    dryRun: false,
    strict: false,
    requireModule: ['ts-node/register'],
    format: [
      "allure-cucumberjs/reporter",
      "json:reports/cucumber_report.json",
      "progress"
    ]
  },
};
