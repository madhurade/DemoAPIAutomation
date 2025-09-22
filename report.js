const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap', // or 'hierarchy'
  jsonFile: 'reports/cucumber_report.json',
  output: 'reports/cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "QA",
  }
};

reporter.generate(options);
