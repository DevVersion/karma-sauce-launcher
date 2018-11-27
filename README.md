# karma-sauce-launcher
Rewrite of the official karma saucelabs launcher. The goal is a maintained, more simple and stable version.

What is different?

* Uses the official Selenium webdriver implementation ([see here](https://github.com/SeleniumHQ/selenium/tree/master/javascript/node/selenium-webdriver))
  * This is probably maintained more actively
  * Probably runs more stable
  * Doesn't have issues like: https://github.com/karma-runner/karma-sauce-launcher/issues/117
* No longer runs a heartbeat that could cause unexpected errors on Safari Mobile
  * Fixes https://github.com/karma-runner/karma-sauce-launcher/issues/42
  * Fixes https://github.com/karma-runner/karma-sauce-launcher/issues/136
  * Fixes https://github.com/karma-runner/karma-sauce-launcher/issues/91
  * **Note**: The heartbeat is not necessary because the `selenium-webdriver` times out automatically.
* No longer includes unnecessary logic (for our Angular projects) where the Saucelabs tunnel can be established from the Karma launcher. 
  * This does not have any stability effect. Just reduces the magic and makes the code more simple and readable.
  
In general, since the official Saucelabs launcher seems not to be maintained, and PRs are not being merged, this is a fork with the goal of:

* Being actively maintained (so that we can fix stuff quickly to match our needs) 
* Being simple & without magic logic that could cause flakiness
