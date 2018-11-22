import {Builder, WebDriver} from 'selenium-webdriver';
import {processConfig} from "./process-config";

const SAUCELABS_SERVER_URL = 'ondemand.saucelabs.com:80/wd/hub';

export function SaucelabsLauncher(args,
                                /* config.sauceLabs */ config,
                                logger,
                                baseLauncherDecorator,
                                captureTimeoutLauncherDecorator,
                                retryLauncherDecorator) {

  // Apply base class mixins. This would be nice to have typed, but this is a low-priority now.
  baseLauncherDecorator(this);
  captureTimeoutLauncherDecorator(this);
  retryLauncherDecorator(this);

  const log = logger.create('SaucelabsLauncher');
  const {seleniumCapabilities, browserName, username, accessKey} = processConfig(config, args);

  // Array of connected drivers. This is useful for quitting all connected drivers on kill.
  let connectedDrivers: WebDriver[] = [];

  // Setup Browser name that will be printed out by Karma.
  this.name = browserName + ' on SauceLabs';

  // Listen for the start event from Karma. I know, the API is a bit different to how you
  // would expect, but we need to follow this approach unless we want to spend more work
  // improving type safety.
  this.on('start', async (pageUrl: string) => {
    try {
      // See the following link for public API of the selenium server.
      // https://wiki.saucelabs.com/display/DOCS/Instant+Selenium+Node.js+Tests
      const driver = await new Builder()
        .withCapabilities(seleniumCapabilities)
        .usingServer(`http://${username}:${accessKey}@${SAUCELABS_SERVER_URL}`)
        .build();

      // Keep track of all connected drivers because it's possible that there are multiple
      // driver instances (e.g. when running with concurrency)
      connectedDrivers.push(driver);

      const session = await driver.getSession();

      log.info('%s session at https://saucelabs.com/tests/%s', browserName, session.getId());
      log.info('Opening "%s" on the selenium client', pageUrl);

      await driver.get(pageUrl);
    } catch (e) {
      log.error(e);

      // Notify karma about the failure.
      this._done('failure');
    }
  });

  this.on('kill', async (doneFn: () => void) => {
    await Promise.all(connectedDrivers.map(driver => driver.quit));

    // Reset connected drivers in case the launcher will be reused.
    connectedDrivers = [];

    doneFn();
  })
}
