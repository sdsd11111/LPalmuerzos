const fs = require('fs');
const path = require('path');

// Function to update dish titles to be centered
function updateDishTitles() {
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
                
                // Find and update the h1 element to be centered
                const updatedContent = content.replace(
                    /<h1([^>]*)class=["']([^"']*)["']([^>]*)>/g,
                    (match, beforeClass, classValue, afterClass) => {
                        // Add 'text-center' class if not already present
                        if (!classValue.includes('text-center')) {
                            return `<h1${beforeClass}class="${classValue} text-center"${afterClass}>`;
                        }
                        return match;
                    }
                );
                
                // Write the updated content back to the file
                if (updatedContent !== content) {
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    console.log(`✅ Updated: ${file}`);
                } else {
                    console.log(`ℹ️  Already centered: ${file}`);
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        });
        
        console.log('\n¡Se han centrado los títulos de todos los platos!');
    });
}

// Run the function
updateDishTitles();
