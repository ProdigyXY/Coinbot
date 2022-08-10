# Coinbot
This is a simple bitcoin faucet mining bot for Freebitco.in

## Dependencies
* [Cron](https://www.npmjs.com/package/cron)
* [Puppeteer](https://www.npmjs.com/package/puppeteer)
* [Puppeteer-Extra](https://www.npmjs.com/package/puppeteer-extra)
* [Puppeteer-Extra-Plugin-Recaptcha](https://www.npmjs.com/package/puppeteer-extra-plugin-recaptcha)
* [Puppeteer-Extra-Plugin-Stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)
* [Freebitco](https://freebitco.in/)


## Configuration
Please note that you are to only edit the ./lib/config.json file for configuration

* Change the ``<YOUR_2CAPTCHA_API_KEY_HERE>`` value with ur own 2captcha API Key. 
- NOTE: Your @captcha account must have been funded else the bot won't solve the captcha there by
  compromising ur freebitco account or even possible blockage.

* Change the ``<YOUR_ADDRESS_HERE>`` value with ur own freebitco login address.

* Change the ``<YOUR_PASSWORD_HERE>`` value with ur own freebitco login password.


## Installation
- ``install node`` to run this bot you must install node and npm on your PC
- ``cd coinbot`` to navigate into the project directory with CMD
- ``npm install`` to install the required node packages
- ``node start`` to execute the bot
- ``node stop`` to stop the entire bot process



That's it enjoy mining!!!

