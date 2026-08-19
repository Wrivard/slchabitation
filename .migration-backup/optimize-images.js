const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image optimization function
async function optimizeImage(inputPath, outputDir, baseName) {
  const sizes = [500, 800, 1080, 1600, 2000];
  const ext = path.extname(inputPath);
  const nameWithoutExt = baseName.replace(ext, '');
  
  console.log(`Optimizing ${baseName}...`);
  
  try {
      // Read original image and apply EXIF orientation (this auto-rotates and removes orientation tag)
      const image = sharp(inputPath);
      // Use rotate() without angle to auto-rotate based on EXIF and strip orientation
      const imageRotated = image.rotate(); // Auto-applies EXIF rotation and removes orientation tag
      const metadata = await imageRotated.metadata();
      
      // Create optimized versions for each size
      for (const size of sizes) {
        const outputPath = path.join(outputDir, `${nameWithoutExt}-p-${size}${ext}`);
        
        // Only resize if original is larger than target size
        if (metadata.width > size) {
          let pipeline = imageRotated
            .clone()
            .resize(size, null, {
              withoutEnlargement: true,
              fit: 'inside'
            });
        
          // Apply format-specific optimization
          if (ext.toLowerCase() === '.png') {
            pipeline = pipeline.png({ quality: 90, compressionLevel: 9 });
          } else {
            pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
          }
        
          await pipeline.toFile(outputPath);
        
          const stats = fs.statSync(outputPath);
          console.log(`  Created ${size}w: ${(stats.size / 1024).toFixed(2)}KB`);
        }
      }
    
    // Calculate original size for reporting
    const originalSize = fs.statSync(inputPath).size;
    const totalOptimizedSize = sizes.reduce((sum, size) => {
      const optPath = path.join(outputDir, `${nameWithoutExt}-p-${size}${ext}`);
      if (fs.existsSync(optPath)) {
        return sum + fs.statSync(optPath).size;
      }
      return sum;
    }, 0);
    
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Optimized versions: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB total`);
    
  } catch (error) {
    console.error(`Error optimizing ${baseName}:`, error.message);
  }
}

// Recursively process directory
async function processDirectory(dirPath, baseDir) {
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
        files.push({ path: fullPath, name: item.name });
      }
    }
  }
  
  // Process files in current directory
  if (files.length > 0) {
    console.log(`\nProcessing ${path.relative('images', dirPath)}: ${files.length} images`);
    for (const file of files) {
      await optimizeImage(file.path, dirPath, file.name);
    }
  }
  
  // Recursively process subdirectories
  for (const subdir of subdirs) {
    await processDirectory(subdir, baseDir);
  }
}

// Main function
async function main() {
  const imagesDir = 'images';
  const targetFolders = ['COMMERCIAL', 'EXTÉRIEUR', 'INTÉRIEUR'];
  
  for (const folder of targetFolders) {
    const folderPath = path.join(imagesDir, folder);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder ${folder} not found, skipping...`);
      continue;
    }
    
    await processDirectory(folderPath, imagesDir);
  }
  
  console.log('\n✅ Image optimization complete!');
}

main().catch(console.error);
