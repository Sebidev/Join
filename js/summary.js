users = [];

/**
 * get data from backend server and render the content
 */
async function initSummary() {
    await loadData();
    renderContent();
}

/**
 * fetch users data from backend server to global variables
 */
async function loadData() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading Data error:', e);
    }
}

/**
 * change the greeting text to the current users first & second name or add "Guest" if not logged in
 */

function greetUser() {
    let isUserLoggedIn = false;

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user["isYou"]) {
            let fullName = user["firstName"];
            if (user["lastName"]) {
                fullName += ` ${user["lastName"]}`;
            }
            document.getElementById("loggedinUser").innerHTML = fullName;
            isUserLoggedIn = true;
            break;
        }
    }

    if (!isUserLoggedIn) {
        document.getElementById("loggedinUser").innerHTML = "Guest";
    }
}

/**
 * initialize the greetUser() function
 */

function renderContent() {
    greetUser();
}