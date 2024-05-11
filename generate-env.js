const fs = require('fs');

// Read the content of environment.sample file
const filePath = 'src/environments/environment.sample.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the placeholder with the actual value of GITHUB_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_DEFAULT_VALUE';
content = content.replace('{{GITHUB_TOKEN}}', GITHUB_TOKEN);

// Write the modified content to environment.prod.ts
fs.writeFileSync('src/environments/environment.prod.ts', content);

console.log('Environment file generated successfully!');
