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

// Patterns to remove
const patterns = [
    // Header patterns
    { 
        name: 'header component', 
        regex: /<!-- Header Component[\s\S]*?<\/div>/,
        replacement: ''
    },
    { 
        name: 'header tag', 
        regex: /<header[\s\S]*?<\/header>/g,
        replacement: ''
    },
    
    // Sidebar/menu patterns
    { 
        name: 'sidebar overlay', 
        regex: /<div[^>]*id=["']sidebarOverlay["'][\s\S]*?<\/div>/g,
        replacement: ''
    },
    { 
        name: 'sidebar', 
        regex: /<aside[^>]*id=["']sidebar["'][\s\S]*?<\/aside>/g,
        replacement: ''
    },
    
    // Footer patterns
    { 
        name: 'footer component', 
        regex: /<!-- Footer Component[\s\S]*?<\/div>/,
        replacement: ''
    },
    { 
        name: 'footer tag', 
        regex: /<footer[\s\S]*?<\/footer>/g,
        replacement: ''
    },
    
    // Navigation patterns
    { 
        name: 'navigation', 
        regex: /<nav[^>]*class=["']*[^"']*nav[^"']*["'][^>]*>[\s\S]*?<\/nav>/g,
        replacement: ''
    },
    
    // Script patterns
    { 
        name: 'menu scripts', 
        regex: /<script>[\s\S]*?menu[\s\S]*?<\/script>/g,
        replacement: ''
    },
    
    // Inline styles
    { 
        name: 'sticky/fixed styles', 
        regex: /(position\s*:\s*(sticky|fixed);?|top\s*:\s*0;?|z-index\s*:\s*\d+;?)/g,
        replacement: ''
    },
    
    // Empty classes and styles
    { 
        name: 'empty attributes', 
        regex: /(class|style)="\s*"/g,
        replacement: ''
    },
    
    // Multiple newlines
    { 
        name: 'multiple newlines', 
        regex: /\n{3,}/g,
        replacement: '\n\n'
    }
];

// Function to clean a single file
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

        // Apply all patterns
        patterns.forEach(pattern => {
            const newContent = content.replace(pattern.regex, pattern.replacement);
            if (newContent !== content) {
                console.log(`  - Removed ${pattern.name} from ${filePath}`);
                changesMade = true;
                content = newContent;
            }
        });

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
console.log('🚀 Starting deep cleanup process...\n');
let cleanedFiles = 0;

pages.forEach(page => {
    const filePath = path.join(__dirname, page);
    console.log(`\n🔍 Processing: ${filePath}`);
    if (cleanFile(filePath)) {
        cleanedFiles++;
    }
});

console.log(`\n✨ Cleanup completed! Processed ${pages.length} files, cleaned ${cleanedFiles} files.`);
