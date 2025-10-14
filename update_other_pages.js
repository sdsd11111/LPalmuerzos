const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = ['sobre-nosotros.html', 'contacto.html', 'galeria.html'];

pages.forEach(page => {
    const filePath = path.join(__dirname, page);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log(`File ${page} does not exist, skipping...`);
        return;
    }
    
    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${page}:`, err);
            return;
        }

        let updatedContent = data;
        
        // Check if header component is already present
        if (!data.includes('id="header-component"')) {
            // Replace any existing header with the new component
            updatedContent = data.replace(
                /<header[\s\S]*?<\/header>/,
                '    <!-- Header Component -->\n    <div id="header-component">\n        <!-- El contenido del header se cargará aquí mediante JavaScript -->\n    </div>\n    \n    <!-- Espacio para el contenido principal (debajo del header fijo) -->\n    <div class="pt-20">'
            );
        }

        // Check if footer component is already present
        if (!data.includes('id="footer-component"')) {
            // Replace any existing footer with the new component
            updatedContent = updatedContent.replace(
                /<footer[\s\S]*?<\/footer>/,
                '    <!-- Footer Component -->\n    <div id="footer-component">\n        <!-- El contenido del footer se cargará aquí mediante JavaScript -->\n    </div>'
            );
            
            // Add scripts if not present
            if (!data.includes('js/components.js')) {
                updatedContent = updatedContent.replace(
                    /<\/body>/,
                    '    <!-- JavaScript -->\n    <script src="js/components.js"></script>\n    <script src="js/main.js"></script>\n</body>'
                );
            }
        }

        // Write the updated content back to the file
        fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${page}:`, err);
                return;
            }
            console.log(`Updated ${page} successfully`);
        });
    });
});
