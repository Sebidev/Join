/**
 * @file login_error.js
 * This file is used to handle the login and register error messages
 */

/**
 * show login error if the email or password is incorrect
 */
function loginError() {
    let inputsContainer = document.getElementById('login-inputs');
    let emailLogin = document.getElementById('email-login');
    let passwordLogin = document.getElementById('password-login');
    let loginError = document.createElement('div');

    loginError.textContent = 'Incorrect E-Mail or password';
    loginError.className = 'login-error-message';
    loginError.id = 'login-error-message';

    if (!document.getElementById('login-error-message')) {
        inputsContainer.appendChild(loginError);
        emailLogin.classList.add('outline-red');
        passwordLogin.classList.add('outline-red');
    }
}

/**
 * remove login error if existent
 */
function removeLoginError() {
    let loginError = document.getElementById('login-error-message');

    if (loginError) {
        loginError.remove();
        document.getElementById('email-login').classList.remove('outline-red');
        document.getElementById('password-login').classList.remove('outline-red');
    }
}

/**
 * show error message if email input value already exists in dataset
 */
function showEmailError() {
    let emailSignup = document.getElementById('email-register');
    let inputsContainer = document.getElementById('register-inputs');

    let errorEmail = document.createElement('div');
    errorEmail.className = 'register-email-error';
    errorEmail.id = 'register-email-error';
    errorEmail.textContent = 'This email address is already being used. Please choose another one.';

    if (!document.getElementById('register-email-error')) {
        emailSignup.classList.add('outline-red');
        inputsContainer.appendChild(errorEmail);
    }
}

/**
 * remove error message for existent email adress
 */
function removeEmailError() {
    let errorEmail = document.getElementById('register-email-error');
    let emailSignup = document.getElementById('email-register');

    if (errorEmail) {
        emailSignup.classList.remove('outline-red');
        errorEmail.remove();
    }
}

/**
 * show error message when inequal passwords
 */
function passwordInequal() {
    let inputsContainer = document.getElementById('register-inputs');
    passwordRedOutline();
    let errorPassword = document.createElement('div');
    errorPassword.className = 'register-password-error';
    errorPassword.id = 'register-password-error';
    errorPassword.textContent = 'Please make sure the passwords match';

    if (!document.getElementById('register-password-error')) {
        inputsContainer.appendChild(errorPassword);
    }
}

/**
 * if inequal passwords set outline color to red
 */
function passwordRedOutline() {
    let passwordSignup = document.getElementById('password-register');
    let passwordConfirm = document.getElementById('password-confirm');
    passwordSignup.classList.add('outline-red')
    passwordConfirm.classList.add('outline-red')
}

/**
 * show error message when checkbox not checked
 */
function errorCheckboxSignup() {
    let privacyPolicy = document.getElementById('register-policy-container');

    let errorCheckboxText = document.createElement('div');
    errorCheckboxText.className = 'register-checkbox-error';
    errorCheckboxText.id = 'register-checkbox-error';
    errorCheckboxText.textContent = 'Please confirm that you have read and understood the Privacy Policy';

    if (!document.getElementById('register-checkbox-error')) {
        privacyPolicy.appendChild(errorCheckboxText);
    }
}

/**
 * remove error message for inequal password
 */
function removePasswordError() {
    let errorPassword = document.getElementById('register-password-error');
    let passwordSignup = document.getElementById('password-register');
    let passwordConfirm = document.getElementById('password-confirm');

    if (errorPassword) {
        errorPassword.remove();
        passwordSignup.classList.remove('outline-red')
        passwordConfirm.classList.remove('outline-red')
    }
}

/**
 * remove error message for unchecked checkbox
 */
function removeCheckboxError() {
    let errorCheckbox = document.getElementById('register-checkbox-error');

    if (errorCheckbox) {
        errorCheckbox.remove();
    }
}