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
            return false;
        }

        // Read file content
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        let changesMade = false;

        // Remove header component placeholder
        const headerComponentRegex = /\s*<!-- Header Component[\s\S]*?<\/div>\s*/;
        if (headerComponentRegex.test(content)) {
            content = content.replace(headerComponentRegex, '\n');
            console.log(`  - Removed header component from ${filePath}`);
            changesMade = true;
        }

        // Remove footer component placeholder if it exists
        const footerComponentRegex = /\s*<!-- Footer Component[\s\S]*?<\/div>\s*/;
        if (footerComponentRegex.test(content)) {
            content = content.replace(footerComponentRegex, '\n');
            console.log(`  - Removed footer component from ${filePath}`);
            changesMade = true;
        }

        // Remove any remaining script tags that might be related to header/footer
        const scriptRegex = /<script[^>]*>\s*\/\/(.*header|.*footer|.*menu|.*nav|.*sidebar)[\s\S]*?<\/script>/gi;
        if (scriptRegex.test(content)) {
            content = content.replace(scriptRegex, '');
            console.log(`  - Removed header/footer related scripts from ${filePath}`);
            changesMade = true;
        }

        // Clean up multiple newlines
        content = content.replace(/\n{3,}/g, '\n\n');

        // Only write if changes were made
        if (changesMade) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Successfully cleaned: ${filePath}`);
            return true;
        } else {
            console.log(`ℹ️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Process all pages
console.log('🚀 Starting final cleanup process...\n');
let cleanedFiles = 0;

pages.forEach(page => {
    const filePath = path.join(__dirname, page);
    console.log(`\n🔍 Processing: ${filePath}`);
    if (cleanFile(filePath)) {
        cleanedFiles++;
    }
});

console.log(`\n✨ Final cleanup completed! Processed ${pages.length} files, cleaned ${cleanedFiles} files.`);
