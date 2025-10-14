const fs = require('fs');
const path = require('path');

const dishPagesDir = path.join(__dirname, 'public', 'menu', 'platos');
const templatePath = path.join(__dirname, 'public', 'festival_de_mariscos.html');

// Read the template file
const template = fs.readFileSync(templatePath, 'utf8');

// Extract the head content from the template
const headMatch = template.match(/<head>([\s\S]*?)<\/head>/i);
const headContent = headMatch ? headMatch[1] : '';

// Extract the body content from the template
const bodyMatch = template.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const bodyContent = bodyMatch ? bodyMatch[1] : '';

// Function to update a single dish page
function updateDishPage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the dish-specific content
    const dishContentMatch = content.match(/<div id="plato-content">([\s\S]*?)<\/div>/i);
    const dishContent = dishContentMatch ? dishContentMatch[1] : '';
    
    // Create the new content with the template structure
    const newContent = `<!DOCTYPE html>
<html lang="es">
<head>
    ${headContent}
    <script src="/js/components.js" defer></script>
</head>
<body class="bg-white flex flex-col min-h-screen">
    <!-- Componente Header -->
    <div id="header-component" class="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>
    
    <!-- Espaciador para el header fijo -->
    <div class="h-16"></div>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div id="plato-content">
                ${dishContent.trim()}
            </div>
        </div>
    </main>

    <!-- Footer -->
    <div id="footer-component"></div>
    
    <!-- Scripts -->
    <script src="/js/scripts.js"></script>
</body>
</html>`;

    // Write the updated content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
}

// Process all HTML files in the dish pages directory
fs.readdir(dishPagesDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        const filePath = path.join(dishPagesDir, file);
        updateDishPage(filePath);
    });
    
    console.log(`\nUpdated ${htmlFiles.length} dish pages.`);
});
