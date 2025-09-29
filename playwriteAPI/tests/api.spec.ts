import { test, expect } from '@playwright/test';
import axios from 'axios';
import * as fs from 'fs';
import { ok } from 'node:assert';
import { request } from 'node:http';
import { json } from 'node:stream/consumers';
import * as path from 'path';

test.describe('ReqRes API Tests', () => {
  test('GET list of users', async ({ request }) => {
    const response = await axios.get('https://reqres.in/api/users?page=2');
    console.log('Status:', response.status);
    expect(response.status).toBe(200);
    //expect(response.).toBeTruthy();ssss

    const data = await response.data;
    console.log('Response:', data);

    expect(data.page).toBe(2);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('POST create a new user', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      job: 'QA Engineer',
    };

    const response = await axios.post('https://reqres.in/api/users', newUser, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });
    expect(response.status).toBe(201);

    const responseData = await response.data;
    console.log('Created User:', responseData);

    expect(responseData.name).toBe(newUser.name);
    expect(responseData.job).toBe(newUser.job);
  });

  test('PUT update user', async ({ request }) => {
    const updatedUser = {
      name: 'John Updated',
      job: 'Automation Lead',
    };

    const response = await axios.put('https://reqres.in/api/users/1', updatedUser, {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });
    expect(response.status).toBe(200);

    const responseData = await response.data;
    console.log('Updated User:', responseData);

    expect(responseData.name).toBe(updatedUser.name);
  });

  test('DELETE user', async ({ request }) => {
    const response = await axios.delete('https://reqres.in/api/users/1', {
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });
    expect(response.status).toBe(204);
  });
  function readfile(filepath: string) {
    const jsonFile = path.join(__dirname, filepath);
    const requestBody = fs.readFileSync(jsonFile, 'utf-8');
  }
  test('reading static data', async ({ request }) => {
    //const jsonFile = path.join(__dirname, 'testdata.json');
    const requestBody = readfile('./testdata.json');
    console.log('Request Body from static data:', requestBody);

    const response = await axios.post('https://restful-booker.herokuapp.com/booking', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    expect(response.status).toBe(200);
    const responseData = await response.data;
    console.log('Response from static data:', responseData);
    expect(responseData).toHaveProperty('bookingid');
    expect(responseData).toHaveProperty('booking');
    //expect(responseData.booking).toMatchObject(JSON.parse(requestBody));
  });

  test('chaining request', async ({ request }) => {
    //create booking
    const requestBody = readfile('./testdata.json');
    const createResponse = await axios.post(
      'https://restful-booker.herokuapp.com/booking',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    await expect(createResponse.status).toBe(200);
    //extract booking id
    const bookingId = createResponse.data.bookingid;

    //create token
    const tokenBody = readfile('./tokendata.json');
    const tokenResponse = await axios.post('https://restful-booker.herokuapp.com/auth', tokenBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await expect(tokenResponse.status).toBe(200);
    const token = tokenResponse.data.token;
    console.log('token:', token);

    //update booking
    const updatedBooking = readfile('./updatebooking.json');
    const updateResponse = await axios.put(
      `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      updatedBooking,
      {
        headers: { getSetCookie: `token=${token}`, 'Content-Type': 'application/json' },
      },
    );
    await expect(updateResponse.status).toBe(200);
  });
});
