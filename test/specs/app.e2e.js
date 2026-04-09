import { expect as wdioExpect } from '@wdio/globals'
import { expect } from 'chai'
import LoginPage from '../pageobjects/login.page.js'
import HomePage from '../pageobjects/home.page.js'
import FormsPage from '../pageobjects/forms.page.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const users = require('../data/users.json')

describe('WDIO Demo App — E2E Tests', () => {

    beforeEach(async () => {
        await HomePage.navigateTo('Home')
    })


    describe('Navigator', () => {

        it('CT01 - should display all navigation tabs on the home screen', async () => {
            await wdioExpect($('~Login')).toBeDisplayed()
            await wdioExpect($('~Forms')).toBeDisplayed()
            await wdioExpect($('~Swipe')).toBeDisplayed()
            await wdioExpect($('~Drag')).toBeDisplayed()
        })

        it('CT02 - should navigate to each tab and return to Home', async () => {
            for (const tab of ['Login', 'Forms', 'Swipe', 'Drag']) {
                await HomePage.navigateTo(tab)
                await wdioExpect($(`~${tab}`)).toBeDisplayed()
            }
            await HomePage.navigateTo('Home')
            await wdioExpect($('~Home')).toBeDisplayed()
        })
    })

    describe('Login', () => {

        beforeEach(async () => {
            await HomePage.navigateTo('Login')
        })

        it('CT03 - should display login screen fields', async () => {
            await wdioExpect($('~input-email')).toBeDisplayed()
            await wdioExpect($('~input-password')).toBeDisplayed()
            await wdioExpect($('~button-LOGIN')).toBeDisplayed()
            await wdioExpect($('~button-sign-up-container')).toBeDisplayed()
        })

        it('CT04 - should login with valid credentials and validate success message', async () => {
            await LoginPage.login(users.valid.standard.email, users.valid.standard.password)
            const { title, message } = await LoginPage.confirmSuccess()
            expect(title).to.equal('Success')
            expect(message).to.equal('You are logged in!')
        })

        it('CT05 - should still show success with incorrect password (app behavior)', async () => {
            await LoginPage.login(users.invalid.wrongPassword.email, users.invalid.wrongPassword.password)
            const { title, message } = await LoginPage.confirmSuccess()
            expect(title).to.equal('Success')
            expect(message).to.equal('You are logged in!')
        })

        it('CT06 - should display error with empty fields', async () => {
            await LoginPage.login(users.invalid.empty.email, users.invalid.empty.password)
            await wdioExpect(LoginPage.errorEnterValidEmail).toBeDisplayed()
            await wdioExpect(LoginPage.errorEnterInvalidPasswordLength).toBeDisplayed()
        })

        it('CT07 - should display error with invalid email format', async () => {
            await LoginPage.login(users.invalid.badEmailFormat.email, users.invalid.badEmailFormat.password)
            await wdioExpect(LoginPage.errorEnterValidEmail).toBeDisplayed()
        })
    })

    describe('Forms', () => {

        beforeEach(async () => {
            await HomePage.navigateTo('Forms')
        })

        it('CT08 - should display form screen elements', async () => {
            await wdioExpect($('~text-input')).toBeDisplayed()
            await wdioExpect($('~switch')).toBeDisplayed()
            await wdioExpect($('~button-Active')).toBeDisplayed()
            await wdioExpect($('~Dropdown')).toBeDisplayed()
        })

        it('CT09 - should fill input field and verify result', async () => {
            await FormsPage.fillInput('WebdriverIO Test')
            const result = await FormsPage.getInputResult()
            expect(result).to.equal('WebdriverIO Test')
        })

        it('CT10 - should clear input field and verify it is empty', async () => {
            await FormsPage.fillInput('Text to clear')
            await FormsPage.fillInput('')
            const result = await FormsPage.getInputResult()
            expect(result).to.equal('')
        })

        it('CT11 - should fill form with multiple values (data-driven)', async () => {
            const inputs = ['WebdriverIO', 'Appium', 'Mobile Test', 'QA Automation']
            for (const input of inputs) {
                await FormsPage.fillInput(input)
                const result = await FormsPage.getInputResult()
                expect(result).to.equal(input)
            }
        })

        it('CT12 - should toggle the switch on and off', async () => {
            const { before, after } = await FormsPage.toggleSwitch()
            expect(after).to.not.equal(before)
        })

        it('CT13 - should select "Appium is awesome" from dropdown', async () => {
            await FormsPage.selectDropdownOption('Appium is awesome')
            await wdioExpect(FormsPage.dropdownSelected).toHaveText('Appium is awesome')
        })

        it('CT14 - should select "This app is awesome" from dropdown', async () => {
            await FormsPage.selectDropdownOption('This app is awesome')
            await wdioExpect(FormsPage.dropdownSelected).toHaveText('This app is awesome')
        })

        it('CT15 - should submit form and validate modal (OK)', async () => {
            await FormsPage.fillInput('Submit Test')
            await FormsPage.submit()

            const { title, message } = await FormsPage.getSubmitModalData()
            expect(title).to.equal('This button is')
            expect(message).to.equal('This button is active')

            await FormsPage.dismissModal('ok')
            await wdioExpect($('~button-Active')).toBeDisplayed()
        })

        it('CT16 - should submit form and cancel modal', async () => {
            await FormsPage.fillInput('Cancel Test')
            await FormsPage.submit()

            const { title } = await FormsPage.getSubmitModalData()
            expect(title).to.equal('This button is')

            await FormsPage.dismissModal('cancel')
            await wdioExpect($('~button-Active')).toBeDisplayed()
        })

        it('CT17 - should submit form and click "Ask Me Later"', async () => {
            await FormsPage.fillInput('Ask Me Later Test')
            await FormsPage.submit()

            const { title } = await FormsPage.getSubmitModalData()
            expect(title).to.equal('This button is')

            await FormsPage.dismissModal('later')
            await wdioExpect($('~button-Active')).toBeDisplayed()
        })
    })
})