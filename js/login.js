/**
 * when password input field looses focus, blur event triggers and the input turns back to its default state
 * @param {string} id - adds the the varying id
 */
function checkPassword(id) {
    const visibilityIcon = document.getElementById(`visibility-icon-${id}`);
    const passwordField = document.getElementById(`password-${id}`);

    if (!passwordField.value) {
        if (visibilityIcon) {
            visibilityIcon.src = 'img/lock.svg';
            visibilityIcon.className = 'lock-icon';
            visibilityIcon.id = `lock-icon-${id}`;
        }
        if (passwordField.type === 'text') {
            passwordField.type = 'password';
        }
    }
}

/**
 * toggle between visibility off / on icon and change input type to make password visible
 * @param {string} id - adds the the varying id
 */
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(`password-${id}`);
    const visibilityIcon = document.getElementById(`visibility-icon-${id}`);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        visibilityIcon.src = 'img/visibility_on.svg';
    } else {
        passwordField.type = 'password';
        visibilityIcon.src = 'img/visibility_off.svg';
    }
}

/**
 * toggle between checked and unchecked checkbox icon
 */
function toggleCheckIcon() {
    const uncheckedIcon = document.getElementById('unchecked');
    const checkedIcon = document.getElementById('checked');

    if (uncheckedIcon) {
        uncheckedIcon.src = 'img/checked.svg';
        uncheckedIcon.id = 'checked';
    } else if (checkedIcon) {
        checkedIcon.src = 'img/unchecked.svg';
        checkedIcon.id = 'unchecked';
    }
}

/**
 * replace lock icon with visibility off icon for password field and trigger blur event
 * @param {string} id - adds the the varying id
 */
function replaceLockIcon(id) {
    const lockIcon = document.getElementById(`lock-icon-${id}`);

    if (lockIcon) {
        lockIcon.src = 'img/visibility_off.svg';
        lockIcon.className = 'visibility-icon';
        lockIcon.setAttribute('onclick', `togglePasswordVisibility('${id}')`);
        lockIcon.id = `visibility-icon-${id}`;
    }
    document.getElementById(`password-${id}`).addEventListener('blur', () => { // blur triggers when password looses focus, e.g. when clicking elsewhere
        checkPassword(id)
    });
}

/**
 * render the html for the login / signup
 * @param {string} site - either 'register' or 'login'
 */
function renderSection(site) {
    const container = document.getElementById('container');
    const loginSignup = document.getElementById('login-signup');

    if (site === 'register') {
        loginSignup.classList.add('d-none');
        container.innerHTML = registerHTML();
    } else if (site === 'login') {
        loginSignup.classList.remove('d-none');
        container.innerHTML = loginHTML();
    }
}