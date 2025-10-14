const fs = require('fs');
const path = require('path');

// Function to update dish images
function updateDishImages() {
    const platosDir = path.join(__dirname, 'public', 'menu', 'platos');
    
    // Get all HTML files in the platos directory
    fs.readdir(platosDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const htmlFiles = files.filter(file => file.endsWith('.html') && file !== '_template.html');
        
        htmlFiles.forEach(file => {
            const filePath = path.join(platosDir, file);
            
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Find and update the image container and image
                const updatedContent = content.replace(
                    /<div class="bg-gray-100 rounded-lg overflow-hidden mb-8">\s*<img([^>]*)class="([^"]*)"([^>]*)>/g,
                    (match, beforeClass, classValue, afterClass) => {
                        // Add max-w-3xl and mx-auto to the container
                        // and update the image classes to be more compact
                        return `<div class="bg-gray-100 rounded-lg overflow-hidden mb-8 max-w-3xl mx-auto">
                    <img${beforeClass}class="${classValue} w-full h-auto max-h-[400px] object-cover"${afterClass}>`;
                    }
                );
                
                // Write the updated content back to the file
                if (updatedContent !== content) {
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    console.log(`✅ Updated: ${file}`);
                } else {
                    console.log(`ℹ️  Already updated: ${file}`);
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        });
        
        console.log('\n¡Se han ajustado las imágenes de todos los platos!');
    });
}

// Run the function
updateDishImages();
