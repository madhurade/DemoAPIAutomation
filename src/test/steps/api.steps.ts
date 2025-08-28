import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

let response: AxiosResponse;
let baseUrl: string;
//scenario1
// Background step
Given('I have access to the ReqRes API', async function () {
  baseUrl = 'https://reqres.in/api';
});

// Scenario steps
Given('I send a GET request to {string}', async function (url: string) {
  response = await axios.get(url,{ headers: {'x-api-key':'reqres-free-v1'} });
  //console.log('Response Data:', response.data);
  console.log('list:', response.status);
});

Then('the response status should be {int}', async function (statusCode: number) {
  expect(response.status).toBe(statusCode);
});

Then('the response should contain a list of users ', async function () {
  expect(response.status).toBe(200); // Ensure response is OK

  const responseBody = response.data;

  // Validate that the response contains a 'data' property and it's an array
  expect(responseBody).toHaveProperty('data');
  expect(Array.isArray(responseBody.data)).toBe(true);

  // Ensure the array is not empty
  expect(responseBody.data.length).toBeGreaterThan(0);

  // Optional: Check if the first user has expected properties
  const firstUser = responseBody.data[0];
  expect(firstUser).toHaveProperty('id');
  expect(firstUser).toHaveProperty('email');
  expect(firstUser).toHaveProperty('first_name');
  expect(firstUser).toHaveProperty('last_name');
});

//Scenario:create user using below data
Given('I send a POST request to {string} with body:', async function (url: string, dataTable) {
  const requestBody = await dataTable.rowsHash();
  response = await axios.post(url, requestBody, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':'reqres-free-v1'
    },
  });
   console.log('Response Status of Post:', response.status);
});
Then('the response status should be {int} for creation', async function (statusCode: number) {
  expect(response.status).toBe(statusCode);
});

Then('the response should contain the created user details', async function () {
  expect(response.data).toHaveProperty('name');
  expect(response.data).toHaveProperty('job');
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('createdAt');
});
//scenario 3: Update User
Given('I send a PUT request to {string} with body:', async function (url: string, dataTable) {
  const requestBody = await dataTable.rowsHash();
  response = await axios.put(url, requestBody, {
    headers: {
      'Accept': 'application/json',
      'x-api-key':'reqres-free-v1'
    },
  });
   console.log('Response Status of PUT:', response.status);
});
Then("the response should contain the updated user's details", async function () {
  expect(response.data).toHaveProperty('name');
  expect(response.data).toHaveProperty('job');
  expect(response.data).toHaveProperty('updatedAt');
});

//scenario 4: Delete User
Given('I send a DELETE request to {string}', async function (url: string) {
  response = await axios.delete(url, {
    headers: {
      'x-api-key':'reqres-free-v1'
    }});

   console.log('Response Status of Delete:', response.status);
});
Then('the response status should be {int} for deletion', async function (statusCode: number) {
  expect(response.status).toBe(statusCode);
});


//scenario 5: Create multiple users from JSON file
interface User {
  name: string;
  job: string;
}

let responses: AxiosResponse[] = [];

Given('I send a POST request to {string} with body from {string}', async function (url: string, fileName: string) {
  const absolutePath = path.resolve(process.cwd(), `src/test/Data/${fileName}`);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const users: User[] = JSON.parse(fileContent);

  responses = [];

  for (const user of users) {
    const response = await axios.post(url, user, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1'
      }
    });
    responses.push(response);
    console.log(`✅ Created user: ${JSON.stringify(response.data)}`);
  }
});

Then('the response status should be {int}', function (statusCode: number) {
  expect(responses.length).toBeGreaterThan(0);
  for (const res of responses) {
    expect(res.status).toBe(statusCode);
    expect(res.data).toHaveProperty('name');
    expect(res.data).toHaveProperty('job');
    expect(res.data).toHaveProperty('id');
    expect(res.data).toHaveProperty('createdAt');
  }
});