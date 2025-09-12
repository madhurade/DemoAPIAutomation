import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
const { getLogs, clearLogs } = require('../utils/logger');

const screenshotsDir = path.join(process.cwd(), 'screenshots');

// Ensure directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}
let startTime: Date;

// Runs **once before all scenarios**
BeforeAll(async function () {
  await console.log('*** Test Execution Started ***');
});

// Runs **before each scenario**
Before(async function (scenario) {
  startTime = new Date();
  await console.log(`\n>>> Starting Scenario: ${scenario.pickle.name}`);
});

// Runs **after each scenario**
After(async function (scenario) {
  const endTime = new Date();
  const duration = (await (endTime.getTime() - startTime.getTime())) / 1000;
  await console.log(`<<< Completed Scenario: ${scenario.pickle.name}`);
  await console.log(`Duration: ${duration} seconds`);
  if (!this.attach) return; // safety check

  const logs = getLogs().join('\n');
  if (logs) {
    this.attach(logs, 'text/plain'); // attach logs to scenario
  }

  clearLogs(); // reset for next scenario
  if ((await scenario.result?.status) === 'FAILED') {
    const fileName = `response_${Date.now()}.json`;
    const filePath = path.join(screenshotsDir, fileName);

    // Save response as JSON file
    fs.writeFileSync(filePath, JSON.stringify(this.response.data, null, 2));

    // Attach response to Allure report
    if (this.attach) {
      await this.attach(fs.readFileSync(filePath), 'application/json');
    }

    console.log(`API response saved at: ${filePath}`);
  }
});

// Runs **once after all scenarios**
AfterAll(async function () {
  await console.log('*** Test Execution Finished ***');
});
