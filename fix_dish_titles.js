const fs = require('fs');
const path = require('path');

// Function to convert filename to title
function formatTitle(filename) {
    // Remove .html extension and replace underscores with spaces
    return filename
        .replace(/\.html$/, '')  // Remove .html
        .replace(/_/g, ' ')      // Replace underscores with spaces
        .split(' ')              // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
        .join(' ');              // Join back with spaces
}

// Process all HTML files in the platos directory
const platosDir = path.join(__dirname, 'public', 'menu', 'platos');

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
            
            // Find and replace the title in the main heading
            const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
                const formattedTitle = formatTitle(file);
                
                if (currentTitle !== formattedTitle) {
                    content = content.replace(
                        /<h1[^>]*>([^<]*)<\/h1>/, 
                        `<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair text-center"> ${formattedTitle} </h1>`
                    );
                    
                    // Also update the page title in the head
                    content = content.replace(
                        /<title>[^<]+<\/title>/, 
                    
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`✅ Updated: ${file}`);
                } else {
                    console.log(`ℹ️  Already formatted: ${file}`);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    });
    
    console.log('\n¡Se han actualizado los títulos de todos los platos!');
});
