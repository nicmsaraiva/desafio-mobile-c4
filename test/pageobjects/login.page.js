import BasePage from './base.page.js'
import SELECTORS from '../selectors/selectors.js'

class LoginPage extends BasePage {

    // ─── Elements ─────────────────────────────────────
    get emailInput()    { return $('~input-email') }
    get passwordInput() { return $('~input-password') }
    get loginButton()   { return $('~button-LOGIN') }
    get signUpButton()  { return $('~button-sign-up-container') }
    get errorMessage()  { return $('~generic-error-message') }

    // ─── Modal ─────────────────────────────────────
    get successTitle()   { return $(SELECTORS.modal.title()) }
    get successMessage() { return $(SELECTORS.modal.message()) }
    get okButton()       { return $(SELECTORS.modal.buttonOk()) }

    // Validation errors (via centralized selectors)
    get errorEnterValidEmail()            { return $(SELECTORS.login.errorValidEmail()) }
    get errorEnterInvalidPasswordLength() { return $(SELECTORS.login.errorPasswordLength()) }

    // ─── Actions ──────────────────────────────────────
    async login(email, password) {
        await this.fill('~input-email', email)
        await this.fill('~input-password', password)
        await this.tap('~button-LOGIN')
    }

    async confirmSuccess() {
        await this.successTitle.waitForDisplayed({ timeout: 10000 })
        const title   = await this.successTitle.getText()
        const message = await this.successMessage.getText()
        await this.okButton.click()
        return { title, message }
    }

    async isErrorDisplayed() {
        return this.isDisplayed('~generic-error-message')
    }
}

export default new LoginPage()