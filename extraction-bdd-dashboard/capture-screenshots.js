// Simple Playwright screenshot capture script
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  const modes = ['option_a', 'option_b', 'option_hybrid'];

  for (const mode of modes) {
    console.log(`Capturing ${mode}...`);
    await page.goto(`http://localhost:3002/bdd-progress?mode=${mode}`);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Capture screenshot
    await page.screenshot({
      path: `../specs/mockups/${mode}_screenshot.png`,
      fullPage: true
    });

    console.log(`✓ Saved ${mode}_screenshot.png`);
  }

  await browser.close();
  console.log('All screenshots captured!');
})();
