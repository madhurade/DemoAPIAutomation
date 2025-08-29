@smoke
Feature: Get Users from ReqRes API
Background:
  Given I have access to the ReqRes API 
Scenario: Retrieve users from page 2
    Given I send a GET request to "https://reqres.in/api/users?page=2"
    Then the Get response status should be 200
    Then the response should contain a list of users
    
    
@regression
Scenario:create user using below data
    Given I send a POST request to "https://reqres.in/api/users" with body:
      | name  | John |
      | job   | Developer |
    Then the Post response status should be 201
    And the response should contain the created user's details

@regression
Scenario: Update user information
    Given I send a PUT request to "https://reqres.in/api/users/2" with body:
      | name  | job         |
      | Jane  | Manager     |
    Then the Put response status should be 200  

@regression
Scenario: Delete a user
    Given I send a DELETE request to "https://reqres.in/api/users/2"
    Then the delete response status should be 204
  
@regression
Scenario: Create multiple users from JSON file
    Given I send a POST request to "https://reqres.in/api/users" with body from "testData.json"
    Then the multiple post response status should be 201
    