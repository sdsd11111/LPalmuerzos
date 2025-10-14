const fs = require('fs');
const path = require('path');

const dishPagesDir = path.join(__dirname, 'public', 'menu', 'platos');
const templatePath = path.join(__dirname, 'public', 'festival_de_mariscos.html');

// Read the template file
const template = fs.readFileSync(templatePath, 'utf8');

// Function to update a single dish page
function updateDishPage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the dish-specific content
    const dishContentMatch = content.match(/<div id="plato-content">([\s\D]*?)<\/div>/i);
    const dishContent = dishContentMatch ? dishContentMatch[1] : '';
    
    // Create the new content with the template structure
    const newContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${path.basename(filePath, '.html').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Los Sartenes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        body { font-family: 'Open Sans', sans-serif; padding-top: 0; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        main { min-height: calc(100vh - 16rem); padding: 2rem 0; }
    </style>
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
    <script src="/js/components.js"></script>
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
