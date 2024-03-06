/**
 * Closes the currently open card by moving it out of view, removing it, clearing the selected contacts, and resetting visibility of various elements after a delay.
 */
function closeOpenCard() {
    let cardOverlay = document.getElementById('card-overlay');
    let taskId = currentTaskId;
    let cardEffect = document.getElementById(`cardModal_${taskId}`);

    if (cardEffect) {
        cardEffect.style.transform = "translate(100%, -50%) translateX(100%)";

        setTimeout(() => {
            if (cardOverlay) {
                cardOverlay.remove();
            }

            let cardModal = document.getElementById(`cardModal_${taskId}`);
            if (cardModal) {
                cardModal.remove();
                endEdit();
            }

            resetCardModalVisibility();
        }, 100);
    }

    clearSelectedContacts();
}

/**
 * Resets the visibility of various elements in the card modal.
 */
function resetCardModalVisibility() {
    let elementsToShow = [
        '.card-modal-delete-button',
        '.card-modal-edit-button',
        '.card-modal-save-button',
        '.card-modal-technical',
        '.card-modal-userstory',
        '.due-date-card-modal',
        '.card-modal-priority-symbol',
        '.priority-card-modal-text'
    ];

    elementsToShow.forEach(element => {
        $(element).removeClass('hide-button');
    });

    $('.subtask-checkbox').css('display', 'block');
    $('.subtask-image').css('display', 'none');
}

/**
 * Handles the click event on a subtask checkbox.
 * @param {HTMLImageElement} clickedCheckbox - The clicked checkbox.
 */
function handleCheckboxClick(clickedCheckbox) {
    let isCheckedNow = clickedCheckbox.classList.contains('checked');

    if (isCheckedNow) {
        clickedCheckbox.classList.remove('checked');
        clickedCheckbox.src = 'img/unchecked.svg';
    } else {
        clickedCheckbox.classList.add('checked');
        clickedCheckbox.src = 'img/checked.svg';
    }

    let taskId = clickedCheckbox.id.split('_')[1];
    updateProgressBar(taskId);
}

/**
 * Event listener that waits for the DOM content to be fully loaded before attaching click event handlers to subtask checkboxes.
 * When a subtask checkbox image is clicked, the handleCheckboxClick function is called to toggle the 'checked' status and update the progress bar.
 */
document.addEventListener('DOMContentLoaded', function () {
    let subtaskCheckboxes = document.querySelectorAll('.subtask-checkbox img');
    subtaskCheckboxes.forEach(checkboxImage => {
        checkboxImage.addEventListener('click', function () {
            handleCheckboxClick(checkboxImage);
        });
    });
});

/**
 * Saves the status of checkboxes (subtasks) for a given task ID, either in the user's tasks if logged in or in local storage.
 * @param {string} taskId - The ID of the task.
 */
async function saveCheckboxStatus(taskId) {
    let tasks = isUserLoggedIn ? JSON.parse(await getItem('users'))[currentUser]?.tasks : JSON.parse(localStorage.getItem('tasks')) || [];
    let task = tasks.find(task => task.id === taskId);

    if (task) {
        let subtasksData = Array.from(document.querySelectorAll(`#cardModal_${taskId} .subtask-checkbox`)).map((checkbox, index) => ({
            description: task.content.subtasksData[index].description,
            checked: checkbox.checked
        }));
        task.content.subtasksData = subtasksData;

        if (isUserLoggedIn) {
            let users = JSON.parse(await getItem('users'));
            users[currentUser].tasks = tasks;
            await setItem('users', JSON.stringify(users));
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
}

/**
 * Event listener for the 'change' event on the document.
 * If the event target is a checkbox and it has the class 'subtask-checkbox', the progress bar is updated.
 * The function `updateProgressBar` is called with `globalData` as its argument.
 */
document.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox' && event.target.classList.contains('subtask-checkbox')) {
        updateProgressBar(globalData);
    }
});

/**
 * Deletes a task from the board and storage.
 */
async function deleteTask() {
    let taskId = document.querySelector('.card-modal-delete-button').dataset.id;
    document.getElementById(taskId).remove();

    let tasks = isUserLoggedIn ? JSON.parse(await getItem('users'))[currentUser]?.tasks : JSON.parse(localStorage.getItem('tasks')) || [];
    let taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);

        if (isUserLoggedIn) {
            let users = JSON.parse(await getItem('users'));
            users[currentUser].tasks = tasks;
            await setItem('users', JSON.stringify(users));
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    clearSelectedContacts();
    updatePlaceholderText();
    closeOpenCard();
}

/**
 * Opens the card with the specified data.
 * @param {Object} data - Card data.
 * @param {Object} subtasksData - Subtasks data.
 */
async function openCard(data, subtasksData) {
    let taskId = data.id;
    currentTaskId = taskId;

    let tasks = isUserLoggedIn ? await getUserTasks() : await getLocalStorageTasks();
    let task = tasks.find(task => task.id === taskId) || data;

    let { categoryClass, priorityIconSrc, selectedContacts, priority } = getCardDetails(task);

    let openCardHTML = openTaskHTML(data, taskId, categoryClass, priority, priorityIconSrc, selectedContacts);

    document.body.insertAdjacentHTML('beforeend', openCardHTML);
    updateProgressBar(taskId);
    showCardOverlay(taskId);
    animateCardEffect(taskId);
    currentEditData = data;
}

/**
 * Retrieves the tasks of the logged-in user.
 * @returns {Array} - An array of tasks for the user.
 */
async function getUserTasks() {
    let users = JSON.parse(await getItem('users'));
    return users[currentUser]?.tasks || [];
}

/**
 * Retrieves tasks from local storage.
 * @returns {Array} - An array of tasks from local storage.
 */
function getLocalStorageTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

/**
 * Returns details for card representation.
 * @param {Object} data - Card data.
 * @returns {Object} - An object with details for card representation.
 */
function getCardDetails(data) {
    let categoryClass = data.content.category === 'Technical task' ? 'card-modal-technical' : 'card-modal-userstory';
    let selectedContacts = data.content.selectedContacts || {};
    let priority = capitalizeFirstLetter(data.content.priority);
    let priorityIconSrc = getPriorityIcon(data.content.priority);

    return { categoryClass, priorityIconSrc, selectedContacts, priority };
}

/**
 * Displays the overlay for the card.
 * @param {string} taskId - Task ID.
 */
function showCardOverlay(taskId) {
    let cardOverlay = document.getElementById('card-overlay');
    cardOverlay.style.display = 'block';
}

/**
 * Animates the card effect.
 * @param {string} taskId - Task ID.
 */
function animateCardEffect(taskId) {
    let cardEffect = document.getElementById(`cardModal_${taskId}`);
    cardEffect.style.transform = "translate(100%, -50%) translateX(100%)";

    setTimeout(() => {
        cardEffect.style.transform = "translate(-50%, -50%)";
    }, 100);
}