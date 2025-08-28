import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import axios from 'axios';

let startTime: Date;

// Runs **once before all scenarios**
BeforeAll(async function () {
  console.log('*** Test Execution Started ***');
});

// Runs **before each scenario**
Before(async function (scenario) {
  startTime = new Date();
  console.log(`\n>>> Starting Scenario: ${scenario.pickle.name}`);
});

// Runs **after each scenario**
After(async function (scenario) {
  const endTime = new Date();
  const duration = (endTime.getTime() - startTime.getTime()) / 1000;
  console.log(`<<< Completed Scenario: ${scenario.pickle.name}`);
  console.log(`Duration: ${duration} seconds`);
  if (scenario.result?.status === 'FAILED') {
    console.log('Scenario failed. Capture logs or screenshots here.');
  }
});

// Runs **once after all scenarios**
AfterAll(async function () {
  console.log('*** Test Execution Finished ***');
});
