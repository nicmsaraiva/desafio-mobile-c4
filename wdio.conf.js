import { config as dotenvConfig } from 'dotenv'
import { afterTestHook, writeEnvironmentProperties } from './test/helpers/hooks.js'

dotenvConfig()

export const config = {
    runner: 'local',
    port: 4723,

    specs: ['./test/specs/**/*.js'],
    exclude: [],

    maxInstances: 1,

    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
        'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '17',
        'appium:automationName': 'UiAutomator2',
        'appium:app': process.env.ANDROID_APP_PATH || './apps/android.wdio.native.app.v2.2.0.apk',
        'appium:appPackage': 'com.wdiodemoapp',
        'appium:appActivity': 'com.wdiodemoapp.MainActivity',
        'appium:noReset': false,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
    }],

    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: [
        ['appium', {
            args: {
                relaxedSecurity: true,
                log: './appium.log',
            },
        }],
    ],

    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    onPrepare(_config, capabilities) {
        writeEnvironmentProperties(capabilities, {
            Environment: 'Local',
            Appium_Service: 'local:4723',
        })
    },

    afterTest: afterTestHook,
}
