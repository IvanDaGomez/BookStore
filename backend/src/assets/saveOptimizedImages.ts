import path from "node:path";
import sharp from "sharp";
import { __dirname } from "./config.js";
function optimizeImage(path: string, widthSize: number, quality: number, outputPath: string) {
  
  sharp(path)
    .resize(widthSize)
    .webp( { quality })
    .toFile(outputPath, (err, info) => {
      if (err) {
        throw new Error(`Error al optimizar la imagen: ${err.message}`);
      }
      })
}

export default async function saveOptimizedImages(imagePaths: string[]): Promise<void> {
  const outputPathDir = path.join(__dirname, 'optimized');
  const fullImagePaths = imagePaths.map(image => path.join(__dirname, 'uploads', image));
  // Ensure the output directory exists (optional)
  // You could use fs to check and create the directory if needed
  
  await Promise.all(
    fullImagePaths.map(async (image) => {
      const baseName = path.basename(image, path.extname(image)); // Get the base name of the image (without extension)
      
      // Construct the paths for each image size
      const outputPathLow = path.join(outputPathDir, `${baseName}_low.webp`);
      const outputPathMed = path.join(outputPathDir, `${baseName}_med.webp`);
      const outputPathHigh = path.join(outputPathDir, `${baseName}_high.webp`);
      
      try {
        //imagesPaths are req.files.path

        await Promise.all([
          optimizeImage(image, 800, 80, outputPathLow),
          optimizeImage(image, 1200, 90, outputPathMed),
          optimizeImage(image, 1600, 100, outputPathHigh)
        ]);

        // You can return additional info if needed, e.g., paths of the processed images
        // console.log(`Optimized images saved: ${outputPathLow}, ${outputPathMed}, ${outputPathHigh}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error optimizing image ${image}:`, error.message);
        } else {
          console.error(`Error optimizing image ${image}:`, error);
        }
      }
    })
  );
}