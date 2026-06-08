// scratch/generate_scene_assets.cjs
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const SCENES_DIR = path.join(__dirname, '../src/assets/scenes');

// PNG CRC Table and calculator
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Function to generate a grayscale PNG
function generateGrayscalePng(width, height, pixelFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk data
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeInt32BE(width, 0);
  ihdrData.writeInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 0; // Color type 0 (grayscale)
  ihdrData[10] = 0; // Compression method (deflate)
  ihdrData[11] = 0; // Filter method (standard)
  ihdrData[12] = 0; // No interlace

  const makeChunk = (typeStr, data) => {
    const typeBuf = Buffer.from(typeStr, 'ascii');
    const lengthBuf = Buffer.alloc(4);
    lengthBuf.writeInt32BE(data.length, 0);

    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeInt32BE(crcVal, 0);

    return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
  };

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT pixel data: each row must start with 0 filter byte
  const rawData = Buffer.alloc(height * (width + 1));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0
    for (let x = 0; x < width; x++) {
      rawData[offset++] = pixelFn(x, y);
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const sourceImages = {
  'portrait': 'scene_portrait_1780921188009.png',
  'landscape': 'scene_landscape_1780921206301.png',
  'sports': 'scene_sports_1780921223508.png',
  'wildlife': 'scene_wildlife_1780921240543.png',
  'street': 'scene_street_1780921258750.png',
  'night-city': 'scene_night_city_1780921277644.png',
  'cafe': 'scene_cafe_1780921297040.png',
  'golden-hour': 'scene_golden_hour_1780921323686.png',
};

const brainDir = '/Users/danishshaikh1423/.gemini/antigravity-ide/brain/8455d463-d077-435b-ab28-436f0f4b01bc';

// Dimensions of output
const W = 1280;
const H = 720;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate masks based on scene parameters
const maskGenerators = {
  portrait: {
    focus: (x, y) => {
      // Oval in the center (subject). Inside is in-focus (black), outside is blurred background (white).
      const cx = W / 2;
      const cy = H / 2;
      const rx = 280;
      const ry = 340;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.8) return 0; // Black (sharp subject)
      if (dist > 1.2) return 255; // White (blurred background)
      return Math.round((dist - 0.8) / 0.4 * 255); // Grayscale gradient
    },
    motion: (x, y) => 0 // All black (no motion)
  },
  landscape: {
    focus: (x, y) => 0, // Fully sharp (all black)
    motion: (x, y) => 0 // All black
  },
  sports: {
    focus: (x, y) => {
      // Athlete is in the center-right region.
      // Make runner area in focus (black), background track/crowd blurred (white)
      const cx = W * 0.55;
      const cy = H * 0.45;
      const rx = 350;
      const ry = 320;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.7) return 0;
      if (dist > 1.3) return 255;
      return Math.round((dist - 0.7) / 0.6 * 255);
    },
    motion: (x, y) => {
      // Runner is moving, so he is subject to motion blur (white). Background is static (black).
      const cx = W * 0.55;
      const cy = H * 0.45;
      const rx = 300;
      const ry = 300;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.8) return 255; // White (affected by motion blur)
      if (dist > 1.2) return 0; // Black (sharp/no motion blur)
      return Math.round((1 - (dist - 0.8) / 0.4) * 255);
    }
  },
  wildlife: {
    focus: (x, y) => {
      // Bird sits on branch in center-left.
      const cx = W * 0.35;
      const cy = H * 0.45;
      const rx = 240;
      const ry = 240;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.7) return 0;
      if (dist > 1.2) return 255;
      return Math.round((dist - 0.7) / 0.5 * 255);
    },
    motion: (x, y) => {
      // Bird wings and head might have motion. Let's make the bird's head and tail region slightly affected.
      const cx = W * 0.35;
      const cy = H * 0.45;
      const rx = 200;
      const ry = 200;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.6) return 255;
      if (dist > 1.0) return 0;
      return Math.round((1 - (dist - 0.6) / 0.4) * 255);
    }
  },
  street: {
    focus: (x, y) => {
      // Foreground people walking on street are sharp (black), distant buildings blurred (white).
      if (y > H * 0.5) {
        return 0; // bottom half is sharp
      } else {
        const factor = (H * 0.5 - y) / (H * 0.5);
        return Math.round(factor * 255); // gradients up to blurred sky/buildings
      }
    },
    motion: (x, y) => {
      // Cars and pedestrians crossing in the lower half are moving (white), static buildings at top are black.
      if (y > H * 0.45 && y < H * 0.85) {
        return 255; // Horizontal motion blurred strip
      }
      return 0;
    }
  },
  'night-city': {
    focus: (x, y) => 0, // Landscape at night, all in focus
    motion: (x, y) => {
      // The river flows and car light trails are on the roads (bottom-half is moving)
      if (y > H * 0.5) {
        return 255;
      }
      return 0;
    }
  },
  cafe: {
    focus: (x, y) => {
      // Cup of coffee in foreground center-bottom is sharp.
      const cx = W * 0.63;
      const cy = H * 0.72;
      const rx = 220;
      const ry = 180;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.8) return 0;
      if (dist > 1.3) return 255;
      return Math.round((dist - 0.8) / 0.5 * 255);
    },
    motion: (x, y) => 0 // cafe is still
  },
  'golden-hour': {
    focus: (x, y) => {
      // Tree on the left is sharp, distant hills are blurred
      const cx = W * 0.3;
      const cy = H * 0.45;
      const rx = 350;
      const ry = 400;
      const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
      if (dist < 0.7) return 0;
      if (dist > 1.4) return 255;
      return Math.round((dist - 0.7) / 0.7 * 255);
    },
    motion: (x, y) => 0 // static landscape
  }
};

// Execute assets conversion and creation
async function main() {
  console.log('Starting asset creation...');

  for (const [name, filename] of Object.entries(sourceImages)) {
    const sceneDir = path.join(SCENES_DIR, name);
    ensureDir(sceneDir);

    const sourcePath = path.join(brainDir, filename);
    const destJpgPath = path.join(sceneDir, 'scene.jpg');
    const destFocusMask = path.join(sceneDir, 'focus-mask.png');
    const destMotionMask = path.join(sceneDir, 'motion-mask.png');

    console.log(`Processing scene: ${name}...`);

    // Use sips to convert the PNG to JPG and resize to 1280x720
    try {
      execSync(`sips -s format jpeg -z 720 1280 "${sourcePath}" --out "${destJpgPath}"`);
      console.log(`  Created scene.jpg successfully.`);
    } catch (err) {
      console.error(`  Error converting scene image: ${err.message}`);
      // Fallback to copy
      fs.copyFileSync(sourcePath, destJpgPath);
    }

    // Generate focus-mask
    const focusPixelFn = maskGenerators[name].focus;
    const focusData = generateGrayscalePng(W, H, focusPixelFn);
    fs.writeFileSync(destFocusMask, focusData);
    console.log(`  Created focus-mask.png.`);

    // Generate motion-mask
    const motionPixelFn = maskGenerators[name].motion;
    const motionData = generateGrayscalePng(W, H, motionPixelFn);
    fs.writeFileSync(destMotionMask, motionData);
    console.log(`  Created motion-mask.png.`);
  }

  console.log('All scene assets generated successfully.');
}

main().catch(err => {
  console.error('Failed to generate assets:', err);
});
