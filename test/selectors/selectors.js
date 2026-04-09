const SELECTORS = {
    modal: {
        title: 'id=com.wdiodemoapp:id/alert_title',
        message: 'id=android:id/message',
        buttonOk: 'id=android:id/button1',
        buttonCancel: 'id=android:id/button2',
        buttonLater: 'id=android:id/button3',
    },

    forms: {
        dropdownOption: (text) =>
            `//android.widget.CheckedTextView[@text="${text}"]`,
        dropdownSelected: '//android.widget.EditText[@resource-id="text_input"]',
    },

    login: {
        errorValidEmail:
            '//android.widget.TextView[@text="Please enter a valid email address"]',
        errorPasswordLength:
            '//android.widget.TextView[@text="Please enter at least 8 characters"]',
    },
}

export default SELECTORS