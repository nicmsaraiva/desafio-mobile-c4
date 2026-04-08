import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

export const config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,

    specs: ['./test/specs/**/*.js'],
    exclude: [],

    maxInstances: 1,

    capabilities: [{
        platformName: 'Android',
        'bstack:options': {
            userName: process.env.BROWSERSTACK_USERNAME,
            accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
            appiumVersion: '2.3.0',
            deviceName: process.env.BS_DEVICE || 'Google Pixel 7',
            osVersion: process.env.BS_OS_VERSION || '13.0',
            app: process.env.BROWSERSTACK_APP,
            automationName: 'UiAutomator2',
            autoGrantPermissions: true,
            newCommandTimeout: 240,
            buildName: `wdio-build-${new Date().toISOString()}`,
            sessionName: 'wdio-test',
            debug: true,
            networkLogs: true,
            deviceLogs: true,
        }
    }],

    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['browserstack'],

    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}