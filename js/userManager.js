/**
 * This file is responsible for managing the user data and the current user
 * @file userManager.js
 */

let currentUser;
let isUserLoggedIn = false;

/**
 * load user data and initialize user id
 */

async function initUser() {
    await loadData();
    initUserID();
}

/** initialize the current user id
 * 
 * @returns the current user ID of the logged in user. If not logged in, currentUser is "Guest"
 */

function initUserID() {
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user["isYou"]) {
            currentUser = user["userID"];
          isUserLoggedIn = true;
          return;
        }
        if (!isUserLoggedIn) {
          currentUser = 'Guest';
        }
    }
}

/**
 * loads the users from our storage
 */

async function loadData() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading Data error:', e);
    }
}