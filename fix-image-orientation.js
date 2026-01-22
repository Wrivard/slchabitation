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

// Recursively process directory
async function processDirectory(dirPath, folderName) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  const subdirs = [];
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      subdirs.push(fullPath);
    } else if (item.isFile() && /\.(jpg|jpeg|png)$/i.test(item.name)) {
      if (!item.name.includes('-p-') && !item.name.startsWith('_temp_')) {
        files.push(fullPath);
      }
    }
  }
  
  // Process files in current directory
  if (files.length > 0) {
    console.log(`\nFixing orientation in ${path.relative('images', dirPath)}: ${files.length} images`);
    for (const filePath of files) {
      await fixOrientation(filePath);
    }
  }
  
  // Recursively process subdirectories
  for (const subdir of subdirs) {
    await processDirectory(subdir, folderName);
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
    
    await processDirectory(folderPath, folder);
  }
  
  console.log('\n✅ Image orientation fix complete!');
  console.log('Now run: node optimize-images.js');
}

main().catch(console.error);
