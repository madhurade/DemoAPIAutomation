const { SnippetsFormatter } = require("@cucumber/cucumber");
const { formatWithOptions } = require("util");

 module.exports = {default: {
    "formatoptions": {
        snippetInterface: "async-await"},
    paths: ['src/test/features/*.feature'],
    require : ['src/test/steps/*.steps.ts'],
    "dryRun": false,
    
    
    requireModule: ['ts-node/register' ]    
  }};