import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import axios from 'axios';

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
  const duration = await (endTime.getTime() - startTime.getTime()) / 1000;
  await console.log(`<<< Completed Scenario: ${scenario.pickle.name}`);
  await console.log(`Duration: ${duration} seconds`);
  if (await scenario.result?.status === 'FAILED') {
    await console.log('Scenario failed. Please check the logs for details.');
  }
});

// Runs **once after all scenarios**
AfterAll(async function () {
 await console.log('*** Test Execution Finished ***');
});
