/**
 * Closes the currently open card by moving it out of view, removing it, clearing the selected contacts, and resetting visibility of various elements after a delay.
 */
async function closeOpenCard() {
    let cardOverlay = document.getElementById('card-overlay');
    let taskId = currentTaskId;
    let cardEffect = document.getElementById(`cardModal_${taskId}`);

    if (cardEffect) {
        cardEffect.style.transform = "translate(100%, -50%) translateX(100%)";

        setTimeout(async () => {
            if (cardOverlay) {
                cardOverlay.remove();
            }

            let cardModal = document.getElementById(`cardModal_${taskId}`);
            if (cardModal) {
                cardModal.remove();
                endEdit();
            }

            resetCardModalVisibility();

            let tasks = isUserLoggedIn ? await getUserTasks() : await getLocalStorageTasks();
            if (isUserLoggedIn) {
                let users = JSON.parse(await getItem('users'));
                users[currentUser].tasks = tasks;
                await setItem('users', JSON.stringify(users));
            } else {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

        }, 100);
    }
    showScrollbar();
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
async function handleCheckboxClick(clickedCheckbox) {
    let taskId = clickedCheckbox.id.split('_')[1];
    let subtaskIndex = parseInt(clickedCheckbox.id.split('_')[2]) - 1;

    let isCheckedNow = clickedCheckbox.classList.contains('checked');

    if (isCheckedNow) {
        clickedCheckbox.classList.remove('checked');
        clickedCheckbox.src = 'img/unchecked.svg';
    } else {
        clickedCheckbox.classList.add('checked');
        clickedCheckbox.src = 'img/checked.svg';
    }
    
    updateProgressBar(taskId, subtaskIndex);

    if (typeof subtaskIndex !== 'undefined') {
        try {
            await saveCheckboxStatus(taskId, subtaskIndex, !isCheckedNow);
            updateSubtaskCount(taskId);
        } catch (error) {
        }
    } else {
    }
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
async function saveCheckboxStatus(taskId, subtaskIndex, isChecked) {
    try {
        let tasks = isUserLoggedIn ? await getUserTasks() : await getLocalStorageTasks();

        let task = tasks.find(task => task.id === taskId);

        if (task && task.content && task.content.subtasksData && subtaskIndex < task.content.subtasksData.length) {
            task.content.subtasksData[subtaskIndex].checked = isChecked;

            if (isUserLoggedIn) {
                let users = JSON.parse(await getItem('users'));
                users[currentUser].tasks = tasks;
                await setItem('users', JSON.stringify(users));
            } else {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        }
        
        let checkbox = document.getElementById(`subtaskCheckbox_${taskId}_${subtaskIndex}`);
        if (isChecked) {
            checkbox.classList.add('checked');
        } else {
            checkbox.classList.remove('checked');
        }
    } catch (error) {
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

async function getUpdatedTask(taskId) {
    let tasks = isUserLoggedIn ? await getUserTasks() : await getLocalStorageTasks();
    return tasks.find(task => task.id === taskId);
}

/**
 * Opens the card with the specified data.
 * @param {Object} data - Card data.
 * @param {Object} subtasksData - Subtasks data.
 */
async function openCard(data, subtasksData) {

    let taskId = data.id;
    currentTaskId = taskId;
    let tasks = await getTasks();
    let task = tasks.find(task => task.id === taskId) || data;

    let cardDetails = getCardDetails(task);
    let openCardHTML = generateOpenCardHTML(data, taskId, cardDetails);

    document.body.insertAdjacentHTML('beforeend', openCardHTML);
    animateCardEffect(taskId);
    await updateSubtaskCheckboxes(taskId);
    await updateCardProgressAndSubtasks(taskId, task);

    showCardOverlay(taskId);
    hideScrollbar();
    currentEditData = data;

    let subtasksContainer = document.querySelector(`#cardModal_${taskId} .card-modal-subtasks-container`);
    if (subtasksContainer) {
        if (subtasksData.length === 0) {
            subtasksContainer.style.display = 'none';
        } else {
            subtasksContainer.style.display = 'flex';
        }
    }
}

/**
 * Fetches tasks based on the user's login status.
 * If the user is logged in, it fetches the user's tasks.
 * Otherwise, it fetches the tasks from local storage.
 * 
 * @returns {Promise<Array>} The tasks.
 */
async function getTasks() {
    return isUserLoggedIn ? await getUserTasks() : await getLocalStorageTasks();
}

/**
 * Generates the HTML for the open card.
 * 
 * @param {Object} data - The task data.
 * @param {string} taskId - The ID of the task.
 * @param {Object} details - The details of the card.
 * @param {string} details.categoryClass - The category class of the card.
 * @param {string} details.priorityIconSrc - The source of the priority icon.
 * @param {Array} details.selectedContacts - The selected contacts.
 * @param {string} details.priority - The priority of the card.
 * @returns {string} The HTML for the open card.
 */
function generateOpenCardHTML(data, taskId, { categoryClass, priorityIconSrc, selectedContacts, priority }) {
    return openTaskHTML(data, taskId, categoryClass, priority, priorityIconSrc, selectedContacts);
}

/**
 * Updates the checkboxes for the subtasks of a task.
 * 
 * @param {string} taskId - The ID of the task.
 */
async function updateSubtaskCheckboxes(taskId) {
    let updatedTask = await getUpdatedTask(taskId);

    updatedTask.content.subtasksData.forEach((subtask, index) => {
        let checkbox = document.getElementById(`subtaskCheckbox_${taskId}_${index + 1}`);
        if (checkbox) {
            checkbox.checked = subtask.checked;
            checkbox.src = subtask.checked ? 'img/checked.svg' : 'img/unchecked.svg';
            if (subtask.checked) {
                checkbox.classList.add('checked');
            } else {
                checkbox.classList.remove('checked');
            }
        }
    });
}

/**
 * Updates the progress bar and subtasks counter for a card.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {Object} task - The task data.
 */
async function updateCardProgressAndSubtasks(taskId, task) {
    let { currentSubtasks, totalSubtasks, progress } = await updateCardInformation(taskId, task);
    let progressFill = document.getElementById(`progressFill_${taskId}`);
    let subtasksInfo = document.querySelector(`#subtasks_${taskId}`);

    if (progressFill && subtasksInfo) {
        progressFill.style.width = `${progress}%`;
        subtasksInfo.textContent = `${currentSubtasks}/${totalSubtasks} Subtasks`;

        let progressContainer = document.querySelector(`#progressBar_${taskId}`);
        let subtasksContainer = document.querySelector(`#subtasks_${taskId}`);

        if (totalSubtasks === 0) {
            progressContainer.style.display = 'none';
            subtasksContainer.style.display = 'none';
        } else {
            progressContainer.style.display = 'block'; 
            subtasksContainer.style.display = 'block';
        }
    }
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