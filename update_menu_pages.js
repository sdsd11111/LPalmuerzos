const fs = require('fs');
const path = require('path');

// Path to the menu directory
const menuDir = path.join(__dirname, 'menu');

// Get all HTML files in the menu directory
fs.readdir(menuDir, (err, files) => {
    if (err) {
        console.error('Error reading menu directory:', err);
        return;
    }

    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        const filePath = path.join(menuDir, file);
        
        // Read the file content
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${file}:`, err);
                return;
            }

            // Replace the header section
            let updatedContent = data.replace(
                /<header[\s\S]*?<\/header>[\s\S]*?<div id="sidebarOverlay"[\s\S]*?<\/aside>/,
                '    <!-- Header Component -->\n    <div id="header-component">\n        <!-- El contenido del header se cargará aquí mediante JavaScript -->\n    </div>\n    \n    <!-- Espacio para el contenido principal (debajo del header fijo) -->\n    <div class="pt-20">'
            );

            // Replace the footer section
            updatedContent = updatedContent.replace(
                /<footer[\s\S]*?<\/footer>[\s\S]*?<script>[\s\S]*?<\/script>/,
                '    </div> <!-- Cierre del div de contenido principal -->\n\n    <!-- Footer Component -->\n    <div id="footer-component">\n        <!-- El contenido del footer se cargará aquí mediante JavaScript -->\n    </div>\n\n    <!-- JavaScript -->\n    <script src="../js/components.js"></script>\n    <script src="../js/main.js"></script>'
            );

            // Write the updated content back to the file
            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file ${file}:`, err);
                    return;
                }
                console.log(`Updated ${file} successfully`);
            });
        });
    });
});
