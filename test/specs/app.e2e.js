import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import HomePage from '../pageobjects/home.page.js'
import FormsPage from '../pageobjects/forms.page.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const users = require('../data/users.json')

describe('WDIO Demo App — Testes E2E', () => {

    beforeEach(async () => {
        await HomePage.navigateTo('Home')
    })

    // ═══════════════════════════════════════════════════
    //  Navigator
    // ═══════════════════════════════════════════════════

    describe('Navigator', () => {

        it('CT01 - deve exibir todas as tabs de navegação na tela inicial', async () => {
            await expect($('~Login')).toBeDisplayed()
            await expect($('~Forms')).toBeDisplayed()
            await expect($('~Swipe')).toBeDisplayed()
            await expect($('~Drag')).toBeDisplayed()
        })

        it('CT02 - deve navegar para cada tab e voltar para Home', async () => {
            for (const tab of ['Login', 'Forms', 'Swipe', 'Drag']) {
                await HomePage.navigateTo(tab)
                await expect($(`~${tab}`)).toBeDisplayed()
            }
            await HomePage.navigateTo('Home')
            await expect($('~Home')).toBeDisplayed()
        })
    })

    // ═══════════════════════════════════════════════════
    //  Login
    // ═══════════════════════════════════════════════════

    describe('Login', () => {

        beforeEach(async () => {
            await HomePage.navigateTo('Login')
        })

        it('CT03 - deve exibir os campos da tela de login', async () => {
            await expect($('~input-email')).toBeDisplayed()
            await expect($('~input-password')).toBeDisplayed()
            await expect($('~button-LOGIN')).toBeDisplayed()
            await expect($('~button-sign-up-container')).toBeDisplayed()
        })

        it('CT04 - deve fazer login com credenciais válidas e validar mensagem', async () => {
            await LoginPage.login(users.valid.standard.email, users.valid.standard.password)
            const { title, message } = await LoginPage.confirmSuccess()
            expect(title).toBe('Success')
            expect(message).toBe('You are logged in!')
        })

        it('CT05 - deve exibir sucesso mesmo com senha incorreta (comportamento do app)', async () => {
            await LoginPage.login(users.invalid.wrongPassword.email, users.invalid.wrongPassword.password)
            const { title, message } = await LoginPage.confirmSuccess()
            expect(title).toBe('Success')
            expect(message).toBe('You are logged in!')
        })

        it('CT06 - deve exibir erro com campos vazios', async () => {
            await LoginPage.login(users.invalid.empty.email, users.invalid.empty.password)
            await expect(LoginPage.errorEnterValidEmail).toBeDisplayed()
            await expect(LoginPage.errorEnterInvalidPasswordLength).toBeDisplayed()
        })

        it('CT07 - deve exibir erro com email em formato inválido', async () => {
            await LoginPage.login(users.invalid.badEmailFormat.email, users.invalid.badEmailFormat.password)
            await expect(LoginPage.errorEnterValidEmail).toBeDisplayed()
        })
    })

    // ═══════════════════════════════════════════════════
    //  Forms
    // ═══════════════════════════════════════════════════

    describe('Forms', () => {

        beforeEach(async () => {
            await HomePage.navigateTo('Forms')
        })

        it('CT08 - deve exibir os elementos da tela de formulário', async () => {
            await expect($('~text-input')).toBeDisplayed()
            await expect($('~switch')).toBeDisplayed()
            await expect($('~button-Active')).toBeDisplayed()
            await expect($('~Dropdown')).toBeDisplayed()
        })

        it('CT09 - deve preencher o campo de texto e verificar resultado', async () => {
            await FormsPage.fillInput('Teste WebdriverIO')
            const result = await FormsPage.getInputResult()
            expect(result).toBe('Teste WebdriverIO')
        })

        it('CT10 - deve limpar o campo de texto e verificar que está vazio', async () => {
            await FormsPage.fillInput('Texto para limpar')
            await FormsPage.fillInput('')
            const result = await FormsPage.getInputResult()
            expect(result).toBe('')
        })

        it('CT11 - deve preencher formulário com múltiplos valores (data-driven)', async () => {
            const inputs = ['WebdriverIO', 'Appium', 'Mobile Test', 'QA Automation']
            for (const input of inputs) {
                await FormsPage.fillInput(input)
                const result = await FormsPage.getInputResult()
                expect(result).toBe(input)
            }
        })

        it('CT12 - deve ativar e desativar o toggle switch', async () => {
            const { before, after } = await FormsPage.toggleSwitch()
            expect(after).not.toBe(before)
        })

        it('CT13 - deve selecionar opção "Appium is awesome" no dropdown', async () => {
            await FormsPage.selectDropdownOption('Appium is awesome')
            await expect(FormsPage.dropdownSelected).toHaveText('Appium is awesome')
        })

        it('CT14 - deve selecionar opção "This app is awesome" no dropdown', async () => {
            await FormsPage.selectDropdownOption('This app is awesome')
            await expect(FormsPage.dropdownSelected).toHaveText('This app is awesome')
        })

        it('CT15 - deve submeter o formulário e validar modal (OK)', async () => {
            await FormsPage.fillInput('Teste Submit')
            await FormsPage.submit()

            const { title, message } = await FormsPage.getSubmitModalData()
            expect(title).toBe('This button is')
            expect(message).toBe('This button is active')

            await FormsPage.dismissModal('ok')
            await expect($('~button-Active')).toBeDisplayed()
        })

        it('CT16 - deve submeter o formulário e cancelar o modal', async () => {
            await FormsPage.fillInput('Teste Cancel')
            await FormsPage.submit()

            const { title } = await FormsPage.getSubmitModalData()
            expect(title).toBe('This button is')

            await FormsPage.dismissModal('cancel')
            await expect($('~button-Active')).toBeDisplayed()
        })

        it('CT17 - deve submeter o formulário e clicar em Ask Me Later', async () => {
            await FormsPage.fillInput('Teste Ask Me Later')
            await FormsPage.submit()

            const { title } = await FormsPage.getSubmitModalData()
            expect(title).toBe('This button is')

            await FormsPage.dismissModal('later')
            await expect($('~button-Active')).toBeDisplayed()
        })
    })
})