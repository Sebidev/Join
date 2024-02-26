/**
 * 
 * @file header.js
 * This file is used to handle the header of the application
 * 
 * Setting Users array
 * 
 */
users = [];

/**
 * This function initializes and loads user contacts and Initials
 */
async function initHead() {
    await loadUsers();
    userInitials();
}

/**
 * This function loads all users
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading Users error: ', e);
    }
}

/**
* generate and show logout button
*/
function showLogout() {
    document.getElementById('header-logout').innerHTML = /*html*/ `
    <div class="popup-frame-logout" id="hide-btn" onclick="hideLogout()">
        <div onclick="doNotClose(event)">
            <div class="logout-btn">
                <a class="mobile-btn" href="legal_notice.html">Legal notice</a>
                <a class="mobile-btn" href="privacy_policy.html">Privacy Policy</a>
                <div class="logout-inner-btn" onclick="logout()">Log out</div>
            </div>
        </div>
    </div>
    `;
}


/**
* hide logout button
*/
function hideLogout() {
    document.getElementById('hide-btn').classList.add('d-none');
}


/**
* stop propagation event for the logout button
*/
function doNotClose(event) {
    event.stopPropagation();
}


/**
* clear active user status and send back to index.html - log in
*/
async function logout() {
    window.open("index.html", "_self");
}


/**
* Show users Initials
*/
function userInitials() {
    let isUserFound = false;
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user["isYou"]) {
            document.getElementById("userInitials").innerHTML = `${user["initials"]}`;
            isUserFound = true;
            break;
        }
    }
    if (!isUserFound) {
        document.getElementById("userInitials").innerHTML = "G";
    }
}