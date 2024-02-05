let currentUser;
let isUserLoggedIn = false;

async function initUser() {
    await loadData();
    initUserID();
}

/**
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
        else {
          currentUser = 'Guest';
          isUserLoggedIn = false;
        }
    }
}

async function loadData() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading Data error:', e);
    }
}