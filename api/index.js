// This file is needed for Vercel to properly handle API routes
const app = require('../server');
const serverless = require('serverless-http');

// Export the serverless handler
exports.handler = serverless(app);

// Also export the app for testing purposes
module.exports = app;
