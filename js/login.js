/**
 * @fiel login.js
 * This file is used to handle the login and register functions
 * 
 */

/**
 * @description This function generates a random id for a new contact.
 * @returns a random id
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

let numbers = [0, 1, 2, 3, 4];
let index = numbers.length;

/**
 * @description This function shuffles the elements of an array.
 * @param {*} array 
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * @description This function simulates the rolling of a dice. It returns a random number between 0 and 4.
 */
function rollDice() {
    if (index === numbers.length) {
        shuffleArray(numbers);
        index = 0;
    }
    return numbers[index++];
}

/**
 * add event listener for dom content loaded event to initialize functions
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    loadLoginData();
})


/**
 * fetch users array
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading Users error:', e);
    }
}

/**
 * set all users inside the user object to false if guest login, then forward to summary
 */
async function guestLogin() {
    localStorage.setItem('contacts', JSON.stringify(demoContacts));

    for (let user of users) {
        user.isYou = false;
    }
    await setItem('users', JSON.stringify(users));

    let demoTasks = generateDemoTasks();
    localStorage.setItem('tasks', JSON.stringify(demoTasks));

    window.open('summary.html', '_self');
}

/**
 * login after check if email and password exist in the user object of users array otherwise show error
 */
async function login() {
    let emailLogin = document.getElementById('email-login');
    let passwordLogin = document.getElementById('password-login');

    let user = users.find(user => user.email === emailLogin.value && user.password === passwordLogin.value);
    if (user) {
        await setUserToTrue(user);
        rememberMe();
        resetLoginForm();
        window.open('summary.html', '_self');
    } else {
        loginError();
    }
}

/**
 * loggedInUser to be set to true while all others users are set to false then update users
 * @param {object} loggedInUser - stands for the logged in user
 */
async function setUserToTrue(loggedInUser) {
    for (let user of users) {
        user.isYou = false;
    }
    loggedInUser.isYou = true;
    await setItem('users', JSON.stringify(users));
}

/**
 * empty login input fields and remove login error
 */
function resetLoginForm() {
    document.getElementById('email-login').value = '';
    document.getElementById('password-login').value = '';
    removeLoginError();
}

/**
 * check all sign up fields for validity and show error messages if invalid
 */
async function signUp() {
    let emailSignup = document.getElementById('email-register');
    let passwordSignup = document.getElementById('password-register');
    let passwordConfirm = document.getElementById('password-confirm');
    let checkedIcon = document.getElementById('checked');

    if (checkEmailExists(emailSignup.value)) {
        showEmailError();
    } else {
        removeEmailError();
    }

    if (!checkEmailExists(emailSignup.value) && passwordSignup.value === passwordConfirm.value && checkedIcon) {
        await addUserToArray(emailSignup, passwordSignup);
        resetSignupForm();
        successSignUp();
    } else if (passwordSignup.value !== passwordConfirm.value && !checkedIcon) {
        passwordInequal();
        errorCheckboxSignup();
    } else if (passwordSignup.value !== passwordConfirm.value && checkedIcon) {
        passwordInequal();
        removeCheckboxError();
    } else if (passwordSignup.value === passwordConfirm.value && !checkedIcon) {
        errorCheckboxSignup();
        removePasswordError();
    } else if (passwordSignup.value === passwordConfirm.value && checkedIcon) {
        removeCheckboxError();
        removePasswordError();
    }
}

/**
 * check if the email input value is already existent in dataset
 * @param {string} email - stands for the email input value
 * @returns - true/false
 */
function checkEmailExists(email) {
    for (let user of users) {
        if (user.email === email) {
            return true;
        }
    }
    return false;
}

/**
 * @description This function generates demo contacts for a user.
 * @param {*} firstName
 * @param {*} emailSignup
 * @returns demo contacts in a json
 * */
function generateDemoContacts(firstName, emailSignup) {
    demoContacts = demoContacts.concat({id: generateId(), avatarid: rollDice(), name: firstName, email: emailSignup, phone: '+49123456789'});
    demoContacts.sort((a, b) => a.name.localeCompare(b.name));
    return demoContacts;
}


/**
 * adding user data to array and then send post request
 * @param {element} emailSignup - stands for email input element
 * @param {element} passwordSignup - stands for password input element
 */
async function addUserToArray(emailSignup, passwordSignup) {
    signupButton('disable');

    let demoTasks = generateDemoTasks();
    let demoContacts = generateDemoContacts(setName('first'), emailSignup.value);

    users.push({
        firstName: setName('first'),
        lastName: setName('last'),
        initials: setInitials(),
        userColor: setUserColor(),
        email: emailSignup.value,
        phone: null,
        password: passwordSignup.value,
        isYou: false,
        userID: users.length,
        contacts: demoContacts,
        tasks: demoTasks
    });

    await setItem('users', JSON.stringify(users));
    signupButton('enable');
}

/**
 * disabling the signup button while users get saved and enabling after fetching is finished
 * @param {string} action - stands for either 'disable' or 'enable'
 */
function signupButton(action) {
    let signupBtn = document.getElementById('signup-button');

    if (action === 'disable') {
        signupBtn.disabled = true;
        signupBtn.classList.add('main-button-disabled');
    } else if (action === 'enable') {
        signupBtn.disabled = false;
        signupBtn.classList.remove('main-button-disabled');
    }
}

/**
 * empty all input fields and remove existing error messages
 */
function resetSignupForm() {
    document.getElementById('name-register').value = '';
    document.getElementById('email-register').value = '';
    document.getElementById('password-register').value = '';
    document.getElementById('password-confirm').value = '';

    removePasswordError();
    removeCheckboxError();
    toggleCheckIcon();
}

/**
 * show success Message after signing up successfully
 */
async function successSignUp() {
    let successMessage = document.getElementById('signup-success-message');
    let successOverlay = document.getElementById('signup-success-overlay');
    successOverlay.classList.add('visible');
    successMessage.classList.add('success-message-visible');
    await new Promise(resolve => setTimeout(() => {
        renderSection('login');
        resolve();
    }, 1500));
}

/**
 * get name input value and split to first and last name, else return only first name
 * @param {string} name - stands for either 'first' or 'last'
 * @returns - string with either first and last name, first name or null
 */
function setName(name) {
    let nameSignup = document.getElementById('name-register');
    let nameTrim = nameSignup.value.trim();

    if (nameTrim.includes(' ')) {
        let nameArray = nameTrim.split(' ');
        if (name === 'first') {
            return nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1);
        } else if (name === 'last') {
            return nameArray[1].charAt(0).toUpperCase() + nameArray[1].slice(1);
        }
    } else {
        if (name === 'first') {
            return nameTrim.charAt(0).toUpperCase() + nameTrim.slice(1);
        } else if (name === 'last') {
            return null;
        }
    }
}

/**
 * check if 2 names are typed in and set initials otherwise return first 2 characters if only 1 name
 * @returns - string with initials of first and last name or first 2 characters
 */
function setInitials() {
    let nameSignup = document.getElementById('name-register');
    let nameTrim = nameSignup.value.trim();

    if (nameTrim.includes(' ')) {
        let nameArray = nameTrim.split(' ');
        let initials = nameArray[0].charAt(0) + nameArray[1].charAt(0);
        return initials.toUpperCase();
    } else {
        let initialsFirstName = nameTrim.charAt(0) + nameTrim.charAt(1);
        return initialsFirstName.toUpperCase();
    }
}

/**
 * if user checked remember me his log in data will be inserted onload
 */
function loadLoginData() {
    let email = document.getElementById('email-login');
    let password = document.getElementById('password-login');
    let emailSaved = localStorage.getItem('email');
    let passwordSaved = localStorage.getItem('password');

    if (emailSaved && passwordSaved) {
        email.value = emailSaved;
        password.value = passwordSaved;
    }
}

/**
 * when password input field looses focus, blur event triggers and the input turns back to its default state
 * @param {string} id - adds the the varying id
 */
function checkPassword(id) {
    let visibilityIcon = document.getElementById(`visibility-icon-${id}`);
    let passwordField = document.getElementById(`password-${id}`);

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
    let passwordField = document.getElementById(`password-${id}`);
    let visibilityIcon = document.getElementById(`visibility-icon-${id}`);

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
    let uncheckedIcon = document.getElementById('unchecked');
    let checkedIcon = document.getElementById('checked');

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
    let lockIcon = document.getElementById(`lock-icon-${id}`);

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
    let container = document.getElementById('container');
    let loginSignup = document.getElementById('login-signup');

    if (site === 'register') {
        loginSignup.classList.add('d-none');
        container.innerHTML = registerHTML();
    } else if (site === 'login') {
        loginSignup.classList.remove('d-none');
        container.innerHTML = loginHTML();
    }
}