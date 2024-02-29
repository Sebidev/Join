/**
 * @file summary.js
 * This file is used to handle the summary page of the application
 * 
 */

let currentDate = new Date();
let currentTime = new Date().getHours();

/**
 * Counts tasks in various categories and updates the HTML document with these counts.
 *
 * This function retrieves tasks, counts the number of tasks in each column, counts the number of urgent tasks,
 * finds the earliest deadline among the tasks, and updates the HTML document with these counts and the formatted earliest deadline.
 *
 * @returns {Promise<void>} A Promise that resolves when the function has completed.
 */
async function countTasks() {
  let tasks = getTasks();
  let counts = countTaskColumns(tasks);
  let urgentCount = countUrgentTasks(tasks);
  let earliestDeadline = findEarliestDeadline(tasks);

  document.getElementById('summary-todo-number').innerHTML = counts.todoCount;
  document.getElementById('summary-done-number').innerHTML = counts.doneCount;
  document.getElementById('summary-progress-number').innerHTML = counts.progressCount;
  document.getElementById('summary-await-number').innerHTML = counts.awaitCount;
  document.getElementById('summary-onboard-number').innerHTML = counts.onboardCount;
  document.getElementById('summary-urgent-number').innerHTML = urgentCount;
  document.getElementById('summary-deadline').innerHTML = formatDate(earliestDeadline);
}

/**
 * Retrieves tasks based on whether a user is logged in or not.
 *
 * @returns {Array} An array of tasks. If a user is logged in, it returns the tasks of the logged-in user. 
 *                  If no user is logged in, it retrieves tasks from local storage. 
 *                  If no tasks are found in local storage, it returns an empty array.
 */
function getTasks() {
  let isUserLoggedIn = users.some(user => user.isYou);
  return isUserLoggedIn ? users.find(user => user.isYou).tasks : JSON.parse(localStorage.getItem('tasks')) || [];
}

/**
 * Counts the number of tasks in each column.
 *
 * @param {Array} tasks - An array of task objects, each with a 'content' property that includes a 'boardColumn' property.
 * @returns {Object} An object with the counts of tasks in each column.
 */
function countTaskColumns(tasks) {
  let counts = { todoCount: 0, doneCount: 0, progressCount: 0, awaitCount: 0, onboardCount: 0 };

  tasks.forEach(task => {
    counts.onboardCount++;
    if (task.content.boardColumn === 'todo-column') {
      counts.todoCount++;
    } else if (task.content.boardColumn === 'done-column') {
      counts.doneCount++;
    } else if (task.content.boardColumn === 'progress-column') {
      counts.progressCount++;
    } else if (task.content.boardColumn === 'await-column') {
      counts.awaitCount++;
    }
  });

  return counts;
}

/**
 * Counts the number of tasks with 'urgent' priority.
 *
 * @param {Array} tasks - An array of task objects.
 * @returns {number} The number of tasks with 'urgent' priority.
 */
function countUrgentTasks(tasks) {
  return tasks.filter(task => task.content.priority === 'urgent').length;
}

/**
 * Finds the earliest deadline among a list of tasks.
 *
 * @param {Array} tasks - An array of task objects, each with a 'content' property that includes a 'date' property.
 * @returns {Date|null} The earliest deadline as a Date object, or null if the tasks array is empty.
 */
function findEarliestDeadline(tasks) {
  return tasks.length > 0 ? tasks.reduce((earliest, task) => {
    let taskDate = new Date(task.content.date);
    return taskDate < earliest ? taskDate : earliest;
  }, new Date(tasks[0].content.date)) : null;
}

/**
 * Formats a date to a more readable format or returns a default string if no date is provided.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string, or 'No tasks' if no date is provided.
 */
function formatDate(date) {
  let options = { year: "numeric", month: "long", day: "numeric" };
  return date ? date.toLocaleDateString("en-US", options) : 'No tasks';
}

/**
 * get data from backend server and render the content
 */
async function initSummary() {
  await loadData();
  await countTasks();
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
 * @param {string} dateString - date string to be formatted
 */
function formatDate(dateString) {
  let options = { year: "numeric", month: "long", day: "numeric" };
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

/**
 * summary page only mobile animation play
 */
document.addEventListener('DOMContentLoaded', function () {
  // Überprüfen Sie, ob die Fensterbreite weniger als 600px beträgt
  if (window.innerWidth <= 600) {
    let rightTextbox = document.querySelector('.right_textbox');
    let summary = document.querySelector('.summary');

    // Stellen Sie sicher, dass rightTextbox zuerst sichtbar ist und summary versteckt ist
    if (rightTextbox) rightTextbox.classList.add('visible');
    if (summary) summary.classList.add('hidden');
    if (summary) summary.style.display = "none";

    // Nach 3 Sekunden, verstecken Sie rightTextbox
    setTimeout(function () {
      if (rightTextbox) rightTextbox.classList.remove('visible');
      if (rightTextbox) rightTextbox.style.display = "none";
      if (summary) summary.classList.remove('hidden');
      if (summary) summary.style.display = "flex";
    }, 3000);
  }
});