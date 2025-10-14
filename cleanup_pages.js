const fs = require('fs');
const path = require('path');

// List of all HTML files to clean up
const pages = [
    'index.html',
    'sobre-nosotros.html',
    'contacto.html',
    'galeria.html',
    'menu/especialidades.html',
    'menu/pescados-mariscos.html',
    'menu/pastas.html',
    'menu/carnes.html',
    'menu/vegetariano.html',
    'menu/parrilladas.html',
    'menu/ensaladas-sopas.html',
    'menu/postres.html',
    'menu/bebidas.html'
];

// Function to clean up a single file
function cleanFile(filePath) {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        // Read file content
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 1. Remove header component if it exists
        content = content.replace(
            /<!-- Header Component -->[\s\S]*?<div id="header-component">[\s\S]*?<\/div>/,
            '<!-- Header Component will be loaded here -->'
        );

        // 2. Remove any existing header HTML
        content = content.replace(
            /<header[\s\S]*?<\/header>/,
            ''
        );

        // 3. Remove any existing sidebar/mobile menu
        content = content.replace(
            /<div id="sidebarOverlay"[\s\S]*?<\/div>/,
            ''
        );
        content = content.replace(
            /<aside id="sidebar"[\s\S]*?<\/aside>/,
            ''
        );

        // 4. Remove footer component if it exists
        content = content.replace(
            /<!-- Footer Component -->[\s\S]*?<div id="footer-component">[\s\S]*?<\/div>/,
            '<!-- Footer Component will be loaded here -->'
        );

        // 5. Remove any existing footer HTML
        content = content.replace(
            /<footer[\s\S]*?<\/footer>/,
            ''
        );

        // 6. Remove any remaining sticky/fixed positioning from inline styles
        content = content.replace(
            /(position:\s*(sticky|fixed);?|top:\s*0;?|z-index:\s*\d+;?|sticky\s*top-0)/g,
            ''
        );

        // 7. Clean up empty lines and multiple newlines
        content = content.replace(/\n{3,}/g, '\n\n');

        // Only write if content changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Cleaned up: ${filePath}`);
        } else {
            console.log(`No changes needed: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Process all pages
console.log('Starting cleanup process...');
pages.forEach(page => {
    const filePath = path.join(__dirname, page);
    cleanFile(filePath);
});

console.log('Cleanup completed!');
