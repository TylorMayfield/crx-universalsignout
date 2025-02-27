// Test runner for Chrome Extension
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const extensionPath = resolve(__dirname, '../dist');

// Import test modules
import runBasicTests from './basic.js';
import runCookieTests from './cookie-tests.js';

console.log('Starting Universal Sign Out extension tests...');
console.log(`Using extension at path: ${extensionPath}`);

// Check if the extension is built
if (!fs.existsSync(extensionPath) || !fs.existsSync(`${extensionPath}/manifest.json`)) {
  console.error('Error: Extension not built. Please run "npm run build" first.');
  process.exit(1);
}

async function runTests() {
  try {
    // Launch a browser with the extension loaded
    const browser = await puppeteer.launch({
      headless: false, // Extensions require a head
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox'
      ],
      defaultViewport: { width: 1280, height: 800 },
      slowMo: 50 // Slow down Puppeteer operations by 50ms
    });

    // Open a new page to the extensions management page
    const page = await browser.newPage();
    await page.goto('chrome://extensions');
    
      // Find the first installed extension ID using the service worker
      const targets = await browser.targets();
      const extensionTarget = targets.find(target => 
        target.type() === 'service_worker' && target.url().startsWith('chrome-extension://')
      );

      if (!extensionTarget) {
        console.error('Could not find the extension service worker. Make sure the extension is loaded.');
        await browser.close();
        process.exit(1);
      }

      const extensionId = extensionTarget.url().split('/')[2];
      console.log(`Found extension with ID: ${extensionId}`);


    if (!extensionId) {
      console.error('Could not find the extension. Available targets:');
      const targets = await browser.targets();
      console.log(targets.map(t => ({ type: t.type(), url: t.url() })));
      throw new Error('Could not find the Universal Sign Out extension');
    }

    console.log(`Found extension with ID: ${extensionId}`);

    // Run test suites
    try {
      await runBasicTests(browser, extensionId);
      await runCookieTests(browser, extensionId);
      console.log('\n✅ All tests completed successfully!');
    } catch (error) {
      console.error('\nBasic tests failed:', error);
      process.exit(1);
    }

    await browser.close();
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runTests();
