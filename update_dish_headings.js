const fs = require('fs');
const path = require('path');

// Function to update dish headings
function updateDishHeadings() {
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
                
                // Update the h1 size and add a subtle text shadow for better visibility
                const updatedContent = content.replace(
                    /<h1[^>]*class="([^"]*)">([^<]*)<\/h1>/g,
                    (match, classes, title) => {
                        // Add or update the text size classes
                        const newClasses = classes
                            .replace(/text-\w+-\w+\s?/g, '') // Remove existing size classes
                            .replace(/\s+/g, ' ') // Clean up multiple spaces
                            .trim() + ' text-4xl md:text-5xl';
                            
                        return `<h1 class="${newClasses} tracking-tight">${title}</h1>`;
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
        
        console.log('\n¡Se han actualizado los títulos de todos los platos!');
    });
}

// Run the function
updateDishHeadings();
