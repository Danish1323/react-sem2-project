// scratch/capture_screenshots.cjs
const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
  console.log('Launching Puppeteer headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Set viewport to match standard MacBook viewports
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to Manual Photography Simulator on localhost:5173...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  // 1. Capture boot screen (after 1s)
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, '../src/assets/screenshot_boot.png') });
  console.log('✓ Captured boot screen.');

  // 2. Wait for boot to finish (2.5s total boot time + 1s buffer)
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(__dirname, '../src/assets/screenshot_main.png') });
  console.log('✓ Captured main viewfinder screen.');

  // 3. Open Menu (press 'm')
  await page.keyboard.press('m');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../src/assets/screenshot_menu.png') });
  console.log('✓ Captured menu screen.');

  // 4. Close Menu (press 'm') and open Playback (press 'p')
  await page.keyboard.press('m');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.press('p');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../src/assets/screenshot_playback.png') });
  console.log('✓ Captured playback gallery.');

  // 5. Close Playback (press 'p') and open Challenge mode
  // We can open challenge mode by clicking the challenge sidebar button or trigger it.
  // Let's close playback first
  await page.keyboard.press('p');
  await new Promise(r => setTimeout(r, 300));
  
  // Open Menu and click "Challenge Mode"
  await page.keyboard.press('m');
  await new Promise(r => setTimeout(r, 500));
  
  // Click Challenge Mode tab in sidebar
  // We will find the button by its text content "Challenge Mode"
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Challenge Mode')) {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, '../src/assets/screenshot_challenge.png') });
  console.log('✓ Captured challenge overlay.');

  await browser.close();
  console.log('All screenshots captured successfully.');
}

main().catch(err => {
  console.error('Failed to capture screenshots:', err);
  process.exit(1);
});
