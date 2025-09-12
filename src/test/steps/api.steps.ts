import { Given, When, Then } from '@cucumber/cucumber';
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
  try {
    response = await axios.get(url, { headers: { 'x-api-key': 'reqres-free-v1' } });
  } catch (error: any) {
    console.error(`Error during GET request to ${url}:`, error.message);
    console.error('Response data:', error.response?.data);
    throw error; // Rethrow the error to ensure the test fails
  }
  //console.log('Response Data:', response.data);
  console.log('list:', response.status);
});

Then('the Get response status should be {int}', async function (statusCode: number) {
  if (!response) {
    throw new Error('Response object is missing!');
  }
  expect(response.status).toBe(statusCode);
});

Then('the response should contain a list of users', async function () {
  if (!response) {
    throw new Error('Response object is missing!');
  }
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
  try {
    response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
    });
  } catch (error: any) {
    console.error(`Error during POST request to ${url}:`, error.message);
    console.error('Response data:', error.response?.data);
    throw error; // Rethrow the error to ensure the test fails
  }
  console.log('Response Status of Post:', response.status);
});
Then('the Post response status should be {int}', async function (statusCode: number) {
  if (!response) {
    throw new Error('Response object is missing!');
  }
  expect(response.status).toBe(statusCode);
});

Then("the response should contain the created user's details", async function () {
  expect(response.data).toHaveProperty('name');
  expect(response.data).toHaveProperty('job');
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('createdAt');
});
//scenario 3: Update User
Given('I send a PUT request to {string} with body:', async function (url: string, dataTable) {
  const requestBody = await dataTable.rowsHash();
  try {
    response = await axios.put(url, requestBody, {
      headers: {
        Accept: 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
    });
  } catch (error: any) {
    console.error(`Error during PUT request to ${url}:`, error.message);
    console.error('Response data:', error.response?.data);
    throw error; // Rethrow the error to ensure the test fails
  }
  console.log('Response Status of PUT:', response.status);
});

Then('the Put response status should be {int}', async function (statusCode: number) {
  if (!response) {
    throw new Error('Response object is missing!');
  }
  expect(response.status).toBe(statusCode);
});

Then("the response should contain the updated user's details", async function () {
  expect(response.data).toHaveProperty('name');
  expect(response.data).toHaveProperty('job');
  expect(response.data).toHaveProperty('updatedAt');
});

//scenario 4: Delete User
Given('I send a DELETE request to {string}', async function (url: string) {
  try {
    response = await axios.delete(url, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });
  } catch (error: any) {
    console.error(`Error during DELETE request to ${url}:`, error.message);
    console.error('Response data:', error.response?.data);
    throw error; // Rethrow the error to ensure the test fails
  }
  console.log('Response Status of Delete:', response.status);
});
Then('the delete response status should be {int}', async function (statusCode: number) {
  if (!response) {
    throw new Error('Response object is missing!');
  }
  expect(response.status).toBe(statusCode);
});

//scenario 5: Create multiple users from JSON file
interface User {
  name: string;
  job: string;
}

let responses: AxiosResponse[] = [];

Given(
  'I send a POST request to {string} with body from {string}',
  async function (url: string, fileName: string) {
    try {
      const absolutePath = path.resolve(process.cwd(), `src/test/Data/${fileName}`);
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const users: User[] = JSON.parse(fileContent);

      responses = [];
      try {
        for (const user of users) {
          const response = await axios.post(url, user, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'reqres-free-v1',
            },
          });
          responses.push(response);
          console.log(`Created user: ${JSON.stringify(response.data)}`);
        }
      } catch (innerError: any) {
        console.error(`Error during POST request to ${url}:`, innerError.message);
        console.error('Response data:', innerError.response?.data);
        throw innerError; // Rethrow the error to ensure the test fails
      }
    } catch (error: any) {
      console.error('Error reading or parsing the JSON file:', error.message);
      throw error; // Rethrow the error to ensure the test fails
    }
  },
);

Then('the multiple post response status should be {int}', function (statusCode: number) {
  expect(responses.length).toBeGreaterThan(0);
  for (const res of responses) {
    expect(res.status).toBe(statusCode);
    expect(res.data).toHaveProperty('name');
    expect(res.data).toHaveProperty('job');
    expect(res.data).toHaveProperty('id');
    expect(res.data).toHaveProperty('createdAt');
  }
});

//scenario 6 :retrieve user with invalid Id

When('I send a GET request to invalid id {string}', async function (url: string) {
  try {
    response = await axios.get(url, { headers: { 'x-api-key': 'reqres-free-v1' } });
  } catch (error: any) {
    console.error(`GET request failed for URL: ${url}`, error.response?.data || error.message);
    response = error.response; // capture error response
  }
});

Then('the get user with invalid id response status should be {int}', function (statusCode: number) {
  try {
    expect(response.status).toEqual(statusCode);
  } catch (error) {
    console.error(`Expected status ${statusCode}, but got ${response?.status}`, error);
    throw error;
  }
});

Then('the response body should not contain user details', function () {
  try {
    expect(response.data.data).toBeUndefined;
  } catch (error) {
    console.error(`Validation failed: Response body contains user details`, error);
    throw error;
  }
});

//scenario 7 :updating user with invalid details

When(
  'I send a POST request to {string} with missing API key and valid body:',
  async function (url: string, body: string) {
    try {
      const requestBody = JSON.parse(body);
      response = await axios.post(url, requestBody);
    } catch (error: any) {
      if (error.response) {
        console.error(
          `POST request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
        response = error.response; // capture error response
      } else {
        console.error(`Unexpected error during POST request: ${error.message}`);
        throw error;
      }
    }
  },
);

Then('the response body should contain an error message', function () {
  try {
    expect(response?.data.error || response?.data.message).not.toBeEmpty;
  } catch (error) {
    console.error(`Validation failed: No error message found in response`);
    throw error;
  }
});
Then('the create user error response status should be {int}', function (statusCode: number) {
  try {
    expect(response?.status).toEqual(statusCode);
  } catch (error) {
    console.error(`Status check failed. Expected: ${statusCode}, Actual: ${response?.status}`);
    throw error;
  }
});
