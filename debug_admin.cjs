const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    console.log('Navigating to http://localhost:3001');
    await page.goto('http://localhost:3001');

    console.log('Clicking on Admin tab...');
    await page.click('text=Admin');

    await page.waitForTimeout(2000);

    const content = await page.content();
    console.log('Page body length after clicking Admin:', content.length);
    const mainText = await page.locator('main').innerText();
    console.log('Main content text:', mainText.substring(0, 100));

    await browser.close();
})();
