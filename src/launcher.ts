import {Builder} from 'selenium-webdriver';
import {processConfig} from "./process-config";

const SAUCELABS_SERVER_URL = 'ondemand.saucelabs.com:80/wd/hub';

export function SaucelabsLauncher(args,
                                sauceConnect,
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

  // Setup Browser name that will be printed out by Karma.
  this.name = browserName + ' on SauceLabs';

  // See the following link for public API of the selenium server.
  // https://wiki.saucelabs.com/display/DOCS/Instant+Selenium+Node.js+Tests
  const driver = new Builder()
    .withCapabilities(seleniumCapabilities)
    .usingServer(`http://${username}:${accessKey}@${SAUCELABS_SERVER_URL}`)
    .build();


  // Listen for the start event from Karma. I know, the API is a bit different to how you
  // would expect, but we need to follow this approach unless we want to spend more work
  // improving type safety.
  this.on('start', async (pageUrl: string) => {
    try {
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

  this.on('kill', (doneFn: () => void) => {
    driver.quit().then(() => doneFn(), error => {
      log.error('Could not kill the driver instance.');
      log.error(error);
    });
  })
};
