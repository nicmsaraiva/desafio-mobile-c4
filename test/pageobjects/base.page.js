export default class BasePage {

    async waitForDisplayed(selector, timeout = 15000) {
        const el = await $(selector)
        await el.waitForDisplayed({ timeout })
        return el
    }

    async tap(selector) {
        const el = await this.waitForDisplayed(selector)
        await el.click()
    }

    async fill(selector, value) {
        const el = await this.waitForDisplayed(selector)
        await el.clearValue()
        await el.setValue(value)
    }

    async getText(selector) {
        const el = await this.waitForDisplayed(selector)
        return el.getText()
    }

    async getAttribute(selector, attr) {
        const el = await this.waitForDisplayed(selector)
        return el.getAttribute(attr)
    }

    async isDisplayed(selector, timeout = 5000) {
        try {
            const el = await $(selector)
            await el.waitForDisplayed({ timeout })
            return true
        } catch {
            return false
        }
    }

    async dismissAlert(button) {
        await button.waitForDisplayed({ timeout: 5000 })
        await button.click()
    }
}