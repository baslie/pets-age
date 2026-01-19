import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Read the SVG files
const iconSvgPath = join(publicDir, 'icon.svg');
const iconSvgBuffer = readFileSync(iconSvgPath);

const ogSvgPath = join(publicDir, 'og-image.svg');
const ogSvgBuffer = readFileSync(ogSvgPath);

async function generateIcons() {
  // Generate PNG icons at different sizes
  const sizes = [192, 512];

  for (const size of sizes) {
    const outputPath = join(publicDir, `icon-${size}.png`);
    await sharp(iconSvgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}.png`);
  }

  // Also generate favicon
  await sharp(iconSvgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.png'));
  console.log('Generated: favicon.png');

  // Generate Apple touch icon
  await sharp(iconSvgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated: apple-touch-icon.png');

  // Generate OG image (1200x630)
  await sharp(ogSvgBuffer)
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, 'og-image.png'));
  console.log('Generated: og-image.png');

  console.log('All icons and images generated successfully!');
}

generateIcons().catch(console.error);
