const config = require('./lib/config.json');
const cookies = require('./lib/cookies.json');
const fs = require('fs');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

(async () => {

    let browser = await puppeteer.launch({
        headless: config.settings.headless,
        defaultViewport: null,
        slowMo: 10,
    });

    const context = browser.defaultBrowserContext();

    context.overridePermissions("https://freebitco.in", []);

    // Creates a new page on the default browser context
    let page = await browser.newPage();

    if (Object.keys(cookies).length) {

        // Check if user Already Logged In with cookies
        let pageCookies = fs.readFileSync('./lib/cookies.json', 'utf8');
        let deserializedPageCookies = JSON.parse(pageCookies);

        await page.deleteCookie(...deserializedPageCookies);

        console.log("Status: Cookies cleared");

    }

    // Close browser
    await browser.close();

    // Log processes end time
    var now = new Date();
    var time = now.toLocaleTimeString();
    console.log('Status: All coinbot processes ended at ' + time)
    process.kill(0);

})();