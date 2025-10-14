const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'admin');
const publicAdminDir = path.join(__dirname, '..', 'public', 'admin');

// Create admin directory if it doesn't exist
if (!fs.existsSync(adminDir)) {
  console.log('Creating admin directory...');
  fs.mkdirSync(adminDir, { recursive: true });
}

// Create public/admin directory if it doesn't exist
if (!fs.existsSync(publicAdminDir)) {
  console.log('Creating public/admin directory...');
  fs.mkdirSync(publicAdminDir, { recursive: true });
}

console.log('Admin directories verified successfully!');
