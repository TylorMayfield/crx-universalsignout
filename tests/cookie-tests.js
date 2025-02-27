const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

async function runCookieTests(browser, extensionId) {
  console.log('\nRunning cookie and site data tests...');
  
  try {
    // Test 1: Set up a test site with cookies
    console.log('Test: Setting up test site with cookies');
    const testPage = await browser.newPage();
    
    // Navigate to a test site
    await testPage.goto('https://httpbin.org/cookies/set?testcookie=testvalue', {
      waitUntil: 'networkidle0'
    });
    
    // Verify cookie is set
    const cookies = await testPage.cookies();
    const testCookie = cookies.find(c => c.name === 'testcookie');
    
    assert(testCookie, 'Test cookie was not set properly');
    assert(testCookie.value === 'testvalue', `Expected cookie value 'testvalue', got '${testCookie.value}'`);
    console.log('✅ Test cookie set successfully');
    
    // Get current URL to use in the sign-out process
    const currentUrl = await testPage.url();
    const domain = new URL(currentUrl).hostname;
    
    // Test 2: Open extension popup in a new tab
    const popupPage = await browser.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/index.html`);
    
    // Simulate clicking the Sign Out button
    console.log('Test: Simulating sign out action');
    
    // Execute script to override chrome API calls for testing
    await popupPage.evaluate((testDomain) => {
      window.chrome = {
        tabs: {
          query: (obj, callback) => {
            callback([{
              id: 1,
              url: `https://${testDomain}/cookies`
            }]);
          },
          reload: () => {}
        },
        browsingData: {
          remove: (filter, dataTypes, callback) => {
            console.log('Removing data for:', filter.origins[0]);
            callback();
          }
        }
      };
      
      window.getNotifications = () => {
        const notifications = document.querySelectorAll('.mantine-Notification-root');
        return Array.from(notifications).map(n => ({
          title: n.querySelector('.mantine-Notification-title')?.textContent,
          message: n.querySelector('.mantine-Notification-description')?.textContent
        }));
      };
    }, domain);
    
    // Wait for the button and simulate a click
    await popupPage.waitForFunction(() => {
      return [...document.querySelectorAll('button')].some(btn => btn.textContent.includes('Sign Out'));
    }, { timeout: 5000 });    

    await popupPage.waitForFunction(() => {
      const button = [...document.querySelectorAll('button')].find(btn => btn.textContent.includes('Sign Out'));
      if (button) {
        button.click();
        return true; // indicates that the button was clicked
      }
      return false; // indicates that the button was not found
    }, { timeout: 5000 });
    console.log('✅ Sign Out button clicked');

    
    // Clean up
    await testPage.close();
    await popupPage.close();
    
    console.log('Cookie tests completed successfully');
    return true;
  } catch (error) {
    console.error('Cookie tests failed:', error);
    throw error;
  }
}

export default runCookieTests;
