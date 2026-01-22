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

// Main function
async function main() {
  // Get all subdirectories in images folder
  const imagesDir = 'images';
  const subdirs = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Filter to only process COMMERCIAL, EXTÉRIEUR, INTÉRIEUR folders
  const targetFolders = subdirs.filter(folder => 
    folder.toUpperCase().includes('COMMERCIAL') || 
    folder.toUpperCase().includes('EXT') || 
    folder.toUpperCase().includes('INT')
  );
  
  for (const folder of targetFolders) {
    const folderPath = path.join(imagesDir, folder);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder ${folder} not found, skipping...`);
      continue;
    }
    
    const files = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .filter(file => !file.includes('-p-')) // Skip already optimized files
      .filter(file => !file.includes('p-500') && !file.includes('p-800') && !file.includes('p-1080') && !file.includes('p-1600') && !file.includes('p-2000')); // Skip optimized versions
    
    if (files.length === 0) {
      console.log(`\nNo images to optimize in ${folder} folder`);
      continue;
    }
    
    console.log(`\nProcessing ${folder} folder: ${files.length} images`);
    
    for (const file of files) {
      const inputPath = path.join(folderPath, file);
      await optimizeImage(inputPath, folderPath, file);
    }
  }
  
  console.log('\n✅ Image optimization complete!');
}

main().catch(console.error);
