const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.join(__dirname, '..', 'admin');
const destDir = path.join(__dirname, '..', 'public', 'admin');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files from admin to public/admin
try {
  console.log('Copying admin files...');
  
  // Use xcopy on Windows or cp on Unix
  if (process.platform === 'win32') {
    execSync(`xcopy "${sourceDir}\\*" "${destDir}\\*" /E /H /C /I /Y`);
  } else {
    execSync(`cp -R "${sourceDir}/"* "${destDir}/"`);
  }
  
  console.log('Admin files copied successfully!');
} catch (error) {
  console.error('Error copying admin files:', error);
  process.exit(1);
}
