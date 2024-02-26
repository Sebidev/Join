/**
 * returns the html for the sign up
 * @file login_templates.js
 * @returns - string with html
 */
function registerHTML() {
    return /*html*/`
        <div class="register-card-container">
            <div class="register-card">
                <div class="arrow-container">
                    <img class="arrow-icon" src="img/arrow-left.svg" alt="arrow left" onclick="renderSection('login')">
                </div>
                <h1 class="register-heading">Sign Up</h1>
                <form class="register-form" onsubmit="signUp(); return false">
                    <div id="register-inputs">
                        <div class="register-input-container">
                            <div class="register-input-wrapper">
                                <input class="register-name-input" type="text" name="name" id="name-register" placeholder="Name" required
                                minlength="2" autocomplete="off">
                                <img class="person-icon" src="img/person.svg" alt="Person Icon">
                            </div>
                        </div>
                        <div class="register-input-container">
                            <div class="register-input-wrapper">
                                <input class="register-email-input" type="email" name="email" id="email-register" placeholder="Email" required
                                autocomplete="off">
                                <img class="email-icon" src="img/mail.svg" alt="Email Icon">
                            </div>
                        </div>
                        <div class="register-input-container">
                            <div class="register-input-wrapper" id="pw-wrapper">
                                <input class="register-pw-input" type="password" name="password-register" id="password-register" placeholder="Password"
                                minlength="8" required autocomplete="new-password" onclick="replaceLockIcon('register')">
                                <img class="lock-icon" id="lock-icon-register" src="img/lock.svg" alt="Password Icon">
                            </div>
                        </div>
                        <div class="register-input-container">
                            <div class="register-input-wrapper" id="pw-wrapper">
                                <input class="register-pw-input" type="password" name="password-confirm" id="password-confirm" placeholder="Confirm Password"
                                minlength="8" required autocomplete="new-password" onclick="replaceLockIcon('confirm')">
                                <img class="lock-icon" id="lock-icon-confirm" src="img/lock.svg" alt="Password Icon">
                            </div>
                        </div>
                    </div>
                    <div id="register-policy-container">
                        <div class="register-policy">
                            <img class="checkbox-icon" src="img/unchecked.svg" alt="Checkbox" id="unchecked" onclick="toggleCheckIcon()">
                            <span class="register-policy-text">I accept the <a href="privacy_policy.html" class="register-policy-text text-blue" target="_blank">Privacy Policy</a></span>
                        </div>
                    </div>
                    <div class="register-button-container">
                        <button type="submit" id="signup-button" class="main-button">Sign Up</button>
                    </div>
                </form>
            </div>
            <div class="signup-success-overlay" id="signup-success-overlay">
                <div class="signup-success">
                    <div class="signup-success-message" id="signup-success-message">You Signed Up successfully</div>
                </div>
            </div>
        </div>
    `;
}


/**
 * returns the html for the login
 * @returns - string with html
 */
function loginHTML() {
    return /*html*/ `
        <div class="login-card-container">
            <div class="login-card">
                <h1 class="login-heading">Log in</h1>
                <form class="login-form" onsubmit="login(); return false">
                    <div class="login-inputs" id="login-inputs">
                    <div class="login-input-container">
                        <div class="login-input-wrapper">
                            <div class="login-email-input">
                        <input  type="email" name="email-login" id="email-login" placeholder="Email"
                            required autocomplete="on" />
                            </div>
                            <div>
                        <img class="email-icon" src="img/mail.svg" alt="Email Icon" />
                            </div>
                        </div>
                    </div>
                    <div class="login-input-container">
                        <div class="login-input-wrapper" id="pw-wrapper">
                        <input class="login-pw-input" type="password" name="password-login" id="password-login"
                            placeholder="Password" required autocomplete="current-password"
                            onclick="replaceLockIcon('login')" />
                        <img class="lock-icon" id="lock-icon-login" src="img/lock.svg" alt="Password Icon" />
                        </div>
                    </div>
                    </div>
                    <div class="login-remember">
                    <img class="checkbox-icon" src="img/unchecked.svg" alt="Checkbox" id="unchecked"
                        onclick="toggleCheckIcon()" />
                    <span class="login-remember-text">Remember Me</span>
                    </div>
                    <div class="login-button-container">
                    <button type="submit" class="main-button">Log in</button>
                    <button type="button" class="main-button main-button-white" onclick="guestLogin()">
                        Guest Log in
                    </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}