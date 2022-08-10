const config = require('./lib/config.json');
const cookies = require('./lib/cookies.json');
const fs = require('fs');
var num_time = 1;

var CronJob = require('cron').CronJob;
var job = new CronJob({
  // runs every hour
  cronTime: '0 */10 * * * *',
  onTick: function () {
    const puppeteer = require('puppeteer-extra');
    const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');

    puppeteer.use(
      RecaptchaPlugin({
        provider: {
          id: '2captcha',
          token: config.apiKey,
        },
        visualFeedback: true,
      })
    );

    puppeteer.use(StealthPlugin());

    (async () => {


      console.log('>>> ' + num_time++);

      // Log start time
      var start_now = new Date();
      var start_time = start_now.toLocaleTimeString();
      console.log('Status: Bot Started at ' + start_time)


      let browser = await puppeteer.launch({
        headless: config.settings.headless,
        defaultViewport: null,
        slowMo: 10,
      });

      const context = browser.defaultBrowserContext();

      context.overridePermissions("https://freebitco.in", []);

      // Creates a new page on the default browser context
      let page = await browser.newPage();

      // set user agents
      // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 \ (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 TEST_ID/<nfibufg38f843f3bfbugefg3>');

      // set navigation timeout
      page.setDefaultNavigationTimeout(100000);

      // set device size to stick to only desktop view
      await page.setViewport({
        width: 1050,
        height: 600,
        isMobile: false,
      });


      if (!Object.keys(cookies).length) {
        // open a URL
        await page.goto("https://freebitco.in/?op=signup_page", {
          waitUntil: "networkidle2",
        });

        // Fill in a default value for the hidden email field
        // await page.evaluate((a) => {
        //   document.querySelector('input[name="email"]').value = a;
        // }, config.user.address);
        // console.log('Status: email input filled');

        // target and click the login button
        await page.waitForSelector('li.login_menu_button > a');
        await page.click('li.login_menu_button > a');

        // Delay 2seconds before typing
        await page.waitForTimeout(5000);

        try {

          await page.waitForSelector('div.pushpad_deny_button');
          await page.click('div.pushpad_deny_button');
          console.log('Status: Initalizing after denying notifications...');

        } catch (error) {
          console.log('Status: Initalizing...');
        }

        // wait for the username input to have finished loading on the page
        await page.waitForSelector('input[id="login_form_btc_address"]');
        // Delay 2seconds before typing
        await page.waitForTimeout(2000);
        // target the username input and type into the field with a little delay so you can see whats going on
        await page.type('input[id="login_form_btc_address"]', config.user.address, {
          delay: 200,
        });
        console.log('Status: Username input filled');

        // wait for the password input to have finished loading on the page
        await page.waitForSelector('input[id="login_form_password"]');
        // Delay 2seconds before typing
        await page.waitForTimeout(2000);
        // target the password input and type into the field with a little delay so you can see whats going on
        await page.type('input[id="login_form_password"]', config.user.password, {
          delay: 200,
        });
        console.log('Status: Password input filled');

        // target and click the login button
        await page.click('button[id="login_button"]');
        console.log('Status: Logging in user...');

        await page.waitForNavigation({
          waitUntil: "networkidle0"
        });

        // Delay 15 seconds
        await page.waitForTimeout(15000);

        try {

          // wait 5 seconds
          await page.waitForTimeout(5000);

          // // wait for the roll input to have finished loading on the page
          // await page.waitForSelector('input[id="free_play_form_button"]');
          // // Delay 15 seconds
          // await page.waitForTimeout(15000);
          // // target the username input and type into the field with a little delay so you can see whats going on
          // await page.click('input[id="free_play_form_button"]', config.user.address, {
          //   delay: 200,
          // });
          // console.log('Status: Captcha clicked');

          // // wait 15 seconds
          // await page.waitForTimeout(15000);

          // // wait for the roll input to have finished loading on the page
          // await page.waitForSelector('input[id="free_play_form_button"]');
          // // Delay 15seconds before typing
          // await page.waitForTimeout(15000);
          // // click the roll button
          // await page.click('input[id="free_play_form_button"]');
          // console.log('Status: Roll button clicked');

          // // wait 1 minute
          // await page.waitForTimeout(60000);

          // wait for the logout link to have finished loading on the page
          await page.waitForSelector('a.logout_link ');
          console.log('Status: User logged in');

          // wait 15 seconds
          await page.waitForTimeout(5000);

          // set page cookie to be used next time
          let currentCookies = await page.cookies();
          fs.writeFileSync('./lib/cookies.json', JSON.stringify(currentCookies));
          console.log('Status: Page cookies created');

          try {

            await page.waitForSelector('#time_remaining');
            await page.click('#time_remaining');
            console.log('Status: Not yet time to roll');

          } catch {

            // await page.waitForSelector('button[id="play_without_captchas_button"]');

            // await page.waitForSelector('input[id="free_play_form_button"]');

            console.log('Status: Time to roll');

            // solve reCAPTCHAs and roll if captcha settings are enabled
            if (config.settings.captcha.enabled) {

              if (config.settings.rolling.enabled) {

                console.log("Status: Solving captcha...");

                // wait 5 seconds
                await page.waitForTimeout(5000);

                // solve reCAPTCHAs
                await page.solveRecaptchas();
                console.log("Status: Captcha solved");

                // wait 15 seconds
                await page.waitForTimeout(15000);

                // target and click the row button
                await page.click('input[id="free_play_form_button"]');
                console.log('Status: Rolling...');

              }

            } else {

              if (config.settings.rolling.enabled) {

                console.log("Status: Rolling without captcha...");

                // wait 5 seconds
                await page.waitForTimeout(5000);

                // roll without reCAPTCHAs
                await page.click('button[id="play_without_captchas_button"]');

                // wait 15 seconds
                await page.waitForTimeout(15000);

                // target and click the row button
                await page.click('input[id="free_play_form_button"]');
                console.log('Status: Rolling...');

              }


            }

            // wait 15 seconds
            await page.waitForTimeout(15000);

            console.log('Status: Already rolled');
          }

          // wait 30 seconds
          await page.waitForTimeout(30000);

          // target and click the logout button
          console.log('Status: Logging out user...');

          // wait 5 seconds
          await page.waitForTimeout(5000);

          await page.click('a.logout_link');
          console.log('Status: User logged out');

        } catch (err) {

          console.log("Status: Failed to login user");
          process.exit(0);

        }

      } else {

        // Check if user Already Logged In with cookies
        let pageCookies = fs.readFileSync('./lib/cookies.json', 'utf8');
        let deserializedPageCookies = JSON.parse(pageCookies);

        console.log("Status: Page cookies set");

        await page.setCookie(...deserializedPageCookies);

        console.log("Status: Redirecting to home page...");

        // wait 5 seconds
        await page.waitForTimeout(5000);

        // Goto home page
        await page.goto("https://freebitco.in/?op=home", {
          waitUntil: "networkidle2"
        });

        // wait 15 seconds
        await page.waitForTimeout(15000);

        // wait for the logout link to have finished loading on the page
        await page.waitForSelector('a.logout_link ');

        console.log("Status: Redirected to home page");

        try {

          await page.waitForSelector('div.pushpad_deny_button');
          await page.click('div.pushpad_deny_button');
          console.log('Status: Initalizing after denying notifications...');

        } catch (error) {
          console.log('Status: Initalizing...');
        }

        try {

          await page.waitForSelector('#time_remaining');
          await page.click('#time_remaining');
          console.log('Status: Not yet time to roll');

        } catch {

          // await page.waitForSelector('button[id="play_without_captchas_button"]');

          // await page.waitForSelector('input[id="free_play_form_button"]');

          console.log('Status: Time to roll');

          // solve reCAPTCHAs and roll if captcha settings are enabled
          if (config.settings.captcha.enabled) {

            if (config.settings.rolling.enabled) {

              console.log("Status: Solving captcha...");

              // wait 5 seconds
              await page.waitForTimeout(5000);

              // solve reCAPTCHAs
              await page.solveRecaptchas();
              console.log("Status: Captcha solved");

              // wait 15 seconds
              await page.waitForTimeout(15000);

              // target and click the row button
              await page.click('input[id="free_play_form_button"]');
              console.log('Status: Rolling...');

            }

          } else {

            if (config.settings.rolling.enabled) {

              console.log("Status: Rolling without captcha...");

              // wait 5 seconds
              await page.waitForTimeout(5000);

              // roll without reCAPTCHAs
              await page.click('button[id="play_without_captchas_button"]');

              // wait 15 seconds
              await page.waitForTimeout(15000);

              // target and click the row button
              await page.click('input[id="free_play_form_button"]');
              console.log('Status: Rolling...');

            }


          }

          // wait 15 seconds
          await page.waitForTimeout(15000);

          console.log('Status: Already rolled');
        }

        // wait 30 seconds
        await page.waitForTimeout(30000);

        // target and click the logout button
        console.log('Status: Logging out user...');

        // wait 5 seconds
        await page.waitForTimeout(5000);

        await page.click('a.logout_link');
        console.log('Status: User logged out');

      }

      // wait 5 seconds
      await page.waitForTimeout(5000);

      // Close browser
      await browser.close();

      // Log end time
      var end_now = new Date();
      var end_time = end_now.toLocaleTimeString();
      console.log('Status: Bot Ended at ' + end_time)
    })();
  },
  start: false,
  timeZone: config.settings.timeZone,
  runOnInit: true
});
job.start();