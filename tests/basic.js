// Basic tests for Universal Sign Out extension
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

async function runBasicTests(browser, extensionId) {
  console.log('\nRunning basic tests...');
  const page = await browser.newPage();

  try {
    // Test 1: Open extension popup
    console.log('Test: Opening extension popup');
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    
    await page.waitForFunction(() => {
      return [...document.querySelectorAll('button')].some(btn => btn.textContent.includes('Sign Out'));
    }, { timeout: 5000 });
    
    // Check if the button exists and has the correct text
    const buttonText = await page.evaluate(() => {
      const button = document.querySelector('button');
      return button ? button.textContent.trim() : null;
    });
    
    assert(buttonText === 'Sign Out', `Expected button text to be 'Sign Out', got '${buttonText}'`);
    console.log('✅ Extension popup loads correctly with Sign Out button');
 
    // Close the page
    await page.close();
    
    console.log('Basic tests completed successfully');
    return true;
  } catch (error) {
    console.error('Basic tests failed:', error);
    await page.close();
    throw error;
  }
}

export default runBasicTests;
