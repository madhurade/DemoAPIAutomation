import { test, expect } from '@playwright/test';
import axios from 'axios';
test.describe('ReqRes API Tests', () => {

  test('GET list of users', async ({ request }) => {
    const response = await axios.get('https://reqres.in/api/users?page=2');
    console.log('Status:', response.status);
    expect(response.status).toBe(200);
    //expect(response.).toBeTruthy();

    const data = await response.data;
    console.log('Response:', data);

    expect(data.page).toBe(2);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('POST create a new user', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      job: 'QA Engineer'
    };

    const response = await axios.post('https://reqres.in/api/users', newUser,{headers: {
        'x-api-key':'reqres-free-v1'
      }});
    expect(response.status).toBe(201);

    const responseData = await response.data;
    console.log('Created User:', responseData);

    expect(responseData.name).toBe(newUser.name);
    expect(responseData.job).toBe(newUser.job);
  });

  test('PUT update user', async ({ request }) => {
    const updatedUser = {
      name: 'John Updated',
      job: 'Automation Lead'
    };

    const response = await axios.put('https://reqres.in/api/users/1', updatedUser,{ headers: {
        'x-api-key':'reqres-free-v1'}});
    expect(response.status).toBe(200);

    const responseData = await response.data;
    console.log('Updated User:', responseData);

    expect(responseData.name).toBe(updatedUser.name);
  });

  test('DELETE user', async ({ request }) => {
    const response = await axios.delete('https://reqres.in/api/users/1',{ headers: {
        'x-api-key':'reqres-free-v1'}});
    expect(response.status).toBe(204);
  });

});
