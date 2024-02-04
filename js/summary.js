users = [];
let isUserLoggedIn = false;

let currentDate = new Date();
let currentTime = new Date().getHours();

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
    greetingTimed();
}

/**
 * Formating the date
 */
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }
  
  /**
   * Change greeting at summary depending on the time of day
   */
  function greetingTimed() {
    let greeting;
  
    if (currentTime >= 5 && currentTime < 12) {
      greeting = "Good morning,";
    } else if (currentTime >= 12 && currentTime < 18) {
      greeting = "Good afternoon,";
    } else if (currentTime >= 18 && currentTime < 22) {
      greeting = "Good evening,";
    } else {
      greeting = "Good night,";
    }
  
    document.getElementById("greetingTimed").innerHTML = greeting;
  }