const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Fix EXIF orientation in images
async function fixOrientation(inputPath) {
  try {
    const ext = path.extname(inputPath);
    const dir = path.dirname(inputPath);
    const baseName = path.basename(inputPath);
    const tempPath = path.join(dir, `_temp_${baseName}`);
    
    // Read image, apply EXIF rotation, and save (this removes orientation tag)
    await sharp(inputPath)
      .rotate() // Auto-rotates based on EXIF and removes orientation tag
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(tempPath);
    
    // Replace original with fixed version
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);
    
    console.log(`✓ Fixed: ${baseName}`);
    return true;
  } catch (error) {
    console.error(`✗ Error fixing ${path.basename(inputPath)}:`, error.message);
    // Clean up temp file if it exists
    const tempPath = path.join(path.dirname(inputPath), `_temp_${path.basename(inputPath)}`);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return false;
  }
}

// Main function
async function main() {
  const folders = ['COMMERCIAL', 'EXTÉRIEUR', 'INTÉRIEUR'];
  
  for (const folder of folders) {
    const folderPath = path.join('images', folder);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder ${folder} not found, skipping...`);
      continue;
    }
    
    // Get all original images (not optimized versions)
    const files = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .filter(file => !file.includes('-p-')) // Skip optimized versions
      .filter(file => !file.startsWith('_temp_')); // Skip temp files
    
    if (files.length === 0) {
      console.log(`\nNo images to fix in ${folder} folder`);
      continue;
    }
    
    console.log(`\nFixing orientation in ${folder} folder: ${files.length} images`);
    
    for (const file of files) {
      const inputPath = path.join(folderPath, file);
      await fixOrientation(inputPath);
    }
  }
  
  console.log('\n✅ Image orientation fix complete!');
  console.log('Now run: node optimize-images.js');
}

main().catch(console.error);
