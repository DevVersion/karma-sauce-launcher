export function processConfig (config: any = {}, args: any = {}) {
  const username = config.username || process.env.SAUCE_USERNAME;
  const accessKey = config.accessKey || process.env.SAUCE_ACCESS_KEY;
  const tunnelIdentifier = config.tunnelIdentifier;

  // Browser name that will be printed out by Karma.
  const browserName = args.browserName +
    (args.version ? ' ' + args.version : '') +
    (args.platform ? ' (' + args.platform + ')' : '');

  const capabilitiesFromConfig = {
    build: config.build,
    commandTimeout: config.commandTimeout || 300,
    customData: config.customData || {},
    idleTimeout: config.idleTimeout || 90,
    maxDuration: config.maxDuration || 1800,
    name: config.testName || 'Saucelabs Launcher Tests',
    parentTunnel: config.parentTunnel,
    public: config.public || 'public',
    recordScreenshots: config.recordScreenshots,
    recordVideo: config.recordVideo,
    tags: config.tags || [],
    tunnelIdentifier: tunnelIdentifier,
    'custom-data': config.customData,
  };

  const seleniumCapabilities = {
    ...capabilitiesFromConfig,
    ...config.options,
    ...args,
  };

  return {
    seleniumCapabilities,
    browserName,
    username,
    accessKey,
  }
}
