const isAndroid = () =>
    typeof driver !== 'undefined' ? driver.isAndroid : true

const SELECTORS = {
    modal: {
        title: () =>
            isAndroid()
                ? 'id=com.wdiodemoapp:id/alert_title'
                : '-ios predicate string:name == "alert_title"',
        message: () =>
            isAndroid()
                ? 'id=android:id/message'
                : '-ios predicate string:type == "XCUIElementTypeStaticText"',
        buttonOk: () =>
            isAndroid()
                ? 'id=android:id/button1'
                : '-ios predicate string:name == "OK"',
        buttonCancel: () =>
            isAndroid()
                ? 'id=android:id/button2'
                : '-ios predicate string:name == "Cancel"',
        buttonLater: () =>
            isAndroid()
                ? 'id=android:id/button3'
                : '-ios predicate string:name == "Ask me later"',
    },

    forms: {
        dropdownOption: (text) =>
            isAndroid()
                ? `//android.widget.CheckedTextView[@text="${text}"]`
                : `-ios predicate string:label == "${text}"`,
        dropdownSelected: () =>
            isAndroid()
                ? '//android.widget.EditText[@resource-id="text_input"]'
                : '-ios predicate string:type == "XCUIElementTypeTextField"',
    },

    login: {
        errorValidEmail: () =>
            isAndroid()
                ? '//android.widget.TextView[@text="Please enter a valid email address"]'
                : '-ios predicate string:label == "Please enter a valid email address"',
        errorPasswordLength: () =>
            isAndroid()
                ? '//android.widget.TextView[@text="Please enter at least 8 characters"]'
                : '-ios predicate string:label == "Please enter at least 8 characters"',
    },
}

export default SELECTORS