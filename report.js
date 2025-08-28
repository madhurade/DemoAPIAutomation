
const reporter =require( 'cucumber-html-reporter');
// report.js


const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',
  output: 'reports/cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: true
};

reporter.generate(options);
