import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = path.join(__dirname, '../../allure-results/screenshots')

function ensureScreenshotsDir() {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
        fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    }
}

function sanitize(str) {
    return str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80)
}

export async function afterTestHook(test, _context, { passed }) {
    if (!passed) {
        ensureScreenshotsDir()

        const timestamp    = new Date().toISOString().replace(/[:.]/g, '-')
        const testName     = sanitize(test.title)
        const filename     = `FAIL_${testName}_${timestamp}.png`
        const screenshotPath = path.join(SCREENSHOTS_DIR, filename)

        try {
            await browser.saveScreenshot(screenshotPath)
            const imgBuffer = fs.readFileSync(screenshotPath)
            await browser.addAttachment(`Screenshot — ${test.title}`, imgBuffer, 'image/png')
            console.log(`[Allure] Screenshot salvo: ${filename}`)
        } catch (err) {
            console.warn(`[Allure] Falha ao capturar screenshot: ${err.message}`)
        }
    }
}


export function writeEnvironmentProperties(capabilities, extra = {}) {
    const allureResultsDir = path.join(__dirname, '../../allure-results')
    if (!fs.existsSync(allureResultsDir)) {
        fs.mkdirSync(allureResultsDir, { recursive: true })
    }

    const cap = Array.isArray(capabilities) ? capabilities[0] : capabilities

    const lines = [
        `Platform=${cap?.platformName ?? 'Android'}`,
        `Device=${cap?.['appium:deviceName'] ?? 'N/A'}`,
        `OS_Version=${cap?.['appium:platformVersion'] ?? 'N/A'}`,
        `Automation=${cap?.['appium:automationName'] ?? 'UiAutomator2'}`,
        `App=${cap?.['appium:app'] ?? 'N/A'}`,
        `Node_Version=${process.version}`,
        `Execution_Date=${new Date().toLocaleString('pt-BR')}`,
        ...Object.entries(extra).map(([k, v]) => `${k}=${v}`),
    ]

    fs.writeFileSync(
        path.join(allureResultsDir, 'environment.properties'),
        lines.join('\n'),
    )

    console.log('[Allure] environment.properties gerado.')
}