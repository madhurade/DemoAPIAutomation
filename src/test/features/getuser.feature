Feature: Get Users from ReqRes API
Background:
  Given I have access to the ReqRes API 
Scenario: Retrieve users from page 2
    Given I send a GET request to "https://reqres.in/api/users?page=2"
    Then the response status should be 200
    And the response should contain a list of users 
    