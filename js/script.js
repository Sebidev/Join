function hideScrollbar() {
    document.body.classList.add('hide-scroll');
}

function showScrollbar() {
    document.body.classList.remove('hide-scroll');
}

function createPopupContent() {
  return `
      <div id="popupMobileColumns">
          <div class="button-group">
              <img src="img/close.svg" id="closeButtonMobilePopup">
          </div>
          <div class="column-group">
              <div class="columnMobilePopup">Todo</div>
              <div class="columnMobilePopup">In Progress</div>
              <div class="columnMobilePopup">Await Feedback</div>
              <div class="columnMobilePopup">Done</div>
          </div>
      </div>
  `;
}

function createPopup(taskId) {
  let popupContent = createPopupContent();

  let popup = document.createElement('div');
  popup.innerHTML = popupContent;

  let closeButton = popup.querySelector('#closeButtonMobilePopup');
  closeButton.addEventListener('click', function() {
      document.body.removeChild(popup);
  });

  return popup;
}

async function handleColumnButtonClick(index, popup) {
  let tasks = isUserLoggedIn ? await getUserTasks() : getLocalStorageTasks();
  let currentTask;
  tasks.forEach(task => {
      if (task.id === currentTaskId) {
          currentTask = task;
          switch (index) {
              case 0:
                  task.content.boardColumn = 'todo-column';
                  break;
              case 1:
                  task.content.boardColumn = 'progress-column';
                  break;
              case 2:
                  task.content.boardColumn = 'await-column';
                  break;
              case 3:
                  task.content.boardColumn = 'done-column';
                  break;
          }
      }
  });

  if (isUserLoggedIn) {
      let users = JSON.parse(await getItem('users'));
      users[currentUser].tasks = tasks;
      await setItem('users', JSON.stringify(users));
  } else {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  let oldCard = document.getElementById(currentTaskId);
  oldCard.parentNode.removeChild(oldCard);
  let newColumn = document.getElementById(currentTask.content.boardColumn);
  await renderCard(currentTask);
  document.body.removeChild(popup);
  updatePlaceholderText();
}

function addColumnButtonListeners(popup) {
  let columnButtons = popup.querySelectorAll('.columnMobilePopup');
  columnButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
          handleColumnButtonClick(index, popup);
      });
  });
}

function popupMobile(event, taskId) {
  event.stopPropagation();
  currentTaskId = taskId;

  let popup = createPopup(taskId);
  addColumnButtonListeners(popup);

  document.body.appendChild(popup);
}

/**
 * delete users log in data from local storage
 */
function unrememberMe() {
  let emailSaved = localStorage.getItem('email');
  let passwordSaved = localStorage.getItem('password');

  if (emailSaved && passwordSaved) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
  }
}

/**
* log in data will be remembered for the next session if opt in
*/
function rememberMe() {
  let checkedIcon = document.getElementById('checked');
  let email = document.getElementById('email-login');
  let password = document.getElementById('password-login');

  if (checkedIcon) {
      if (email.value && password.value) {
          localStorage.setItem('email', email.value);
          localStorage.setItem('password', password.value);
      }
  }
}

/**
 * generate random color hex code for signed up user
 * @returns - string of color hex code
 */
function setUserColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/**
 * @file script.js
 * This file handle current date
 */

/** 
 * Gets the current date.
 * @returns {string} current date as 'YYYY-MM-DD'.
 */
function getCurrentDateAsString() {
    let dateToday = new Date();
    let month = (dateToday.getMonth() + 1).toString().padStart(2, '0');
    let day = dateToday.getDate().toString().padStart(2, '0');
    let year = dateToday.getFullYear();
  
    return `${year}-${month}-${day}`;
  }