import BasePage from './base.page.js'

class HomePage extends BasePage {

    get homeTab() { return $('~Home') }
    get loginTab() { return $('~Login') }
    get formsTab() { return $('~Forms') }
    get swipeTab() { return $('~Swipe') }
    get dragTab() { return $('~Drag') }

    static TABS = ['Home', 'Login', 'Forms', 'Swipe', 'Drag']

    async navigateTo(tab) {
        if (!HomePage.TABS.includes(tab)) {
            throw new Error(`Tab "${tab}" não existe. Tabs disponíveis: ${HomePage.TABS.join(', ')}`)
        }
        await this.tap(`~${tab}`)
    }

    async isHomeVisible() {
        return this.isDisplayed('~Home')
    }
}

export default new HomePage()