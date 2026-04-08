import BasePage from './base.page.js'
import SELECTORS from '../selectors/selectors.js'

class FormsPage extends BasePage {

    // ─── Elements ─────────────────────────────────────
    get inputField()       { return $('~text-input') }
    get inputResult()      { return $('~input-text-result') }
    get switchToggle()     { return $('~switch') }
    get dropdown()         { return $('~Dropdown') }
    get buttonActive()     { return $('~button-Active') }
    get buttonInactive()   { return $('~button-Inactive') }
    get dropdownSelected() { return $(SELECTORS.forms.dropdownSelected()) }

    // ─── Modal ───────────────────────────────────── 
    get submitModalTitle()   { return $(SELECTORS.modal.title()) }
    get submitModalMessage() { return $(SELECTORS.modal.message()) }
    get submitModalOk()      { return $(SELECTORS.modal.buttonOk()) }
    get submitModalCancel()  { return $(SELECTORS.modal.buttonCancel()) }
    get submitModalLater()   { return $(SELECTORS.modal.buttonLater()) }

    // ─── Actions ──────────────────────────────────────
    async fillInput(value) {
        await this.fill('~text-input', value)
    }

    async getInputResult() {
        return this.getText('~input-text-result')
    }

    async selectDropdownOption(text) {
        await this.tap('~Dropdown')
        const option = await $(SELECTORS.forms.dropdownOption(text))
        await option.waitForDisplayed({ timeout: 5000 })
        await option.click()
    }

    async submit() {
        await this.tap('~button-Active')
    }

    async getSubmitModalData() {
        await this.submitModalTitle.waitForDisplayed({ timeout: 10000 })
        return {
            title:   await this.submitModalTitle.getText(),
            message: await this.submitModalMessage.getText(),
        }
    }

    async dismissModal(action = 'ok') {
        const buttons = {
            ok:     this.submitModalOk,
            cancel: this.submitModalCancel,
            later:  this.submitModalLater,
        }
        const btn = buttons[action]
        if (!btn) throw new Error(`Ação de modal inválida: "${action}". Use: ok, cancel, later`)
        await btn.waitForDisplayed({ timeout: 5000 })
        await btn.click()
    }

    async toggleSwitch() {
        const toggle = await this.switchToggle
        const before = await toggle.getAttribute('checked')
        await toggle.click()
        const after = await toggle.getAttribute('checked')
        return { before, after }
    }
}

export default new FormsPage()