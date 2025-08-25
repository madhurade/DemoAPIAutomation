import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios, { AxiosResponse } from "axios";

let response: AxiosResponse;
let baseUrl: string;

// Background step
Given("I have access to the ReqRes API", async function () {
  baseUrl = "https://reqres.in/api";
});

// Scenario steps
Given("I send a GET request to {string}", async function (url: string) {
  response = await axios.get(url);
  console.log("Response Data:", response.data);
});

Then("the response status should be {int}", async function (statusCode: number) {
  expect(response.status).toBe(statusCode);
});

Then("the response should contain a list of users", async function () {
  expect(response.data).toHaveProperty("data");
  expect(Array.isArray(response.data.data)).toBe(true);
  expect(response.data.data.length).toBeGreaterThan(0);
});
