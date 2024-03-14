/**
 * @file board.js
 * This file contains the functionality for the board.html page, including the rendering of tasks, the search functionality, the add task modal, the edit task modal, and the delete task modal.
 */
let isPriorityOptionsOpen = false;
let globalData;
let isEditActive = false;
let currentTaskId;
let currentEditData;
let searchInputDesktop = document.getElementById('input-search');
let searchInputMobile = document.getElementById('input-search-mobile');

/**
 * initializes the board
 */
async function initBoard() {
    addSearch(searchInputDesktop);
    addSearch(searchInputMobile);
}

/**
 * Adds search functionality for the tasks in board.html.
 * @param {HTMLElement} searchInput - The input field for search.
 */
function addSearch(searchInput) {
    searchInput.addEventListener('input', async () => {
        let searchValue = searchInput.value.toLowerCase();
        let tasks = isUserLoggedIn ? users[currentUser].tasks : JSON.parse(localStorage.getItem('tasks')) || [];

        let matchingTasks = tasks.filter(task =>
            task.content.title.toLowerCase().includes(searchValue) ||
            task.content.description.toLowerCase().includes(searchValue)
        );

        ['todo', 'progress', 'await', 'done'].forEach(columnId => {
            document.getElementById(`${columnId}-column`).innerHTML = '';
        });

        for (let task of matchingTasks) {
            await renderCard(task);
        }

        updatePlaceholderText();
    });
}

/** remove the placeholder text
 * 
 * @param {string} columnId 
 */
function removePlaceholderText(columnId) {
    let placeholderText = document.getElementById(columnId + '-placeholder');
    if (placeholderText) {
        placeholderText.remove();
    }
}

/**
 * Fetches tasks based on user login status, adds placeholder text to columns, and renders each task as a card.
 * 
 * @returns {Promise<void>} A promise resolved after tasks are fetched and rendered.
 */
async function checkAndRenderSharedData() {
    let tasks = isUserLoggedIn
        ? (JSON.parse(await getItem('users'))[currentUser]?.tasks || [])
        : JSON.parse(localStorage.getItem('tasks')) || [];

    ['todo-column', 'progress-column', 'await-column', 'done-column'].forEach(columnId => addPlaceholderText(columnId));

    tasks.forEach(task => {
        removePlaceholderText(task.content.boardColumn);
        renderCard(task);
    });
}

// Initialize user and check/render shared data on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initUser().then(checkAndRenderSharedData);
});

/**
 * Creates HTML for the content section of the task card based on the provided data.
 *
 * @param {object} data - The data for rendering the task card content.
 * @param {number} progress - The progress value for the progress bar.
 * @param {number} currentSubtasks - The current number of subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @param {string} initialsHTML - The HTML code for the initials container.
 * @param {string} categoryClass - The category class for styling.
 * @param {string} priorityIconSrc - The source of the priority icon.
 * @returns {string} The HTML code for the content section of the task card.
 */
function createCardContentHTML(data, progress, currentSubtasks, totalSubtasks, initialsHTML, categoryClass, priorityIconSrc) {
    let progressHTML = '';
    if (totalSubtasks > 0) {
        progressHTML = `
            <div class="progress">
                <div class="progress-bar" id="progressBar_${data.id}">
                    <div class="progress-fill" id="progressFill_${data.id}" style="width: ${progress}%;"></div>
                </div>
                <div class="subtasks" id="subtasks_${data.id}">${currentSubtasks}/${totalSubtasks} Subtasks</div>
            </div>`;
    }
    return `
    <div class="top-mobile">
        <p class="${categoryClass}">${data.content.category}</p>
        <?xml version="1.0" ?><svg onclick="popupMobile(event, '${data.id}')" id="mobilePopupOpen_${data.id}" class="hide" fill="none" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M18.9641 7H10.9641V9H18.9641V7Z" fill="currentColor"/><path d="M6 8.82864V15.1714L9.9642 12L6 8.82864Z" fill="currentColor"/><path d="M18.9641 11H10.9641V13H18.9641V11Z" fill="currentColor"/><path d="M10.9641 15H18.9641V17H10.9641V15Z" fill="currentColor"/></svg>
    </div>
        <div class="title-container">
            <p class="card-title">${data.content.title}</p>
            <p class="card-content">${data.content.description}</p>
        </div>
        <p style="display: none">${data.content.date}</p>
        ${progressHTML}
        <div class="to-do-bottom">
            <div class="initials-cont">
                ${initialsHTML}
            </div>
            <div class="priority-symbol">
                <img src="${priorityIconSrc}" alt="">
            </div>
        </div>
    `;
}

/**
 * Retrieves and prepares the necessary data for rendering the task card.
 *
 * @param {object} data - The data for rendering the task card.
 * @returns {object} An object containing the prepared data.
 */
function prepareCardData(data) {
    let containerDiv = document.getElementById(data.content.boardColumn);
    let categoryClass = data.content.category === 'Technical task' ? 'technical-task' : 'user-story';
    let subtasksData = data.content.subtasksData || [];
    let selectedPriority = data.content.priority;
    let selectedContacts = data.content.selectedContacts || [];
    let initialsHTML = createAvatarDivs(selectedContacts);
    let priorityIconSrc = getPriorityIcon(selectedPriority);
    let taskId = data.id;

    return {
        containerDiv,
        categoryClass,
        subtasksData,
        selectedPriority,
        selectedContacts,
        initialsHTML,
        priorityIconSrc,
        taskId,
    };
}

/**
 * An asynchronous function that creates and appends a draggable task card to the appropriate board column based on the provided data, 
 * with category, title, description, progress bar, subtasks count, selected contacts' avatars, and priority icon.
 * @param {object} data
 */
async function renderCard(data) {
    if (data && data.content) {
        let {
            containerDiv,
            subtasksData,
            taskId,
            categoryClass,
            initialsHTML,
            priorityIconSrc,
        } = prepareCardData(data);

        let renderCard = createCardElement(taskId, subtasksData);
        configureCardEvents(renderCard, data, subtasksData);
        let { currentSubtasks, totalSubtasks, progress } = await updateCardInformation(taskId, data);

        renderCard.innerHTML = createCardContentHTML(data, progress, currentSubtasks, totalSubtasks, initialsHTML, categoryClass, priorityIconSrc);

        currentTaskId = taskId;
        containerDiv.appendChild(renderCard);
    }
}

/**
 * Creates the task card element.
 *
 * @param {string} taskId - The ID of the task.
 * @param {array} subtasksData - The array of subtasks data.
 * @returns {HTMLElement} The task card element.
 */
function createCardElement(taskId, subtasksData) {
    let renderCard = document.createElement('div');
    renderCard.id = taskId;
    renderCard.className = 'card-user-story';
    renderCard.onclick = () => openCard(data, subtasksData);

    renderCard.draggable = true;
    renderCard.ondragstart = (event) => startDragging(event);
    renderCard.ondragend = (event) => endDragging(event);
    renderCard.ondragover = (event) => preventDragOver(event);

    return renderCard;
}

/**
 * Configures events for the task card.
 *
 * @param {HTMLElement} renderCard - The task card element.
 * @param {object} data - The data for rendering the task card.
 * @param {array} subtasksData - The array of subtasks data.
 */
function configureCardEvents(renderCard, data, subtasksData) {
    renderCard.onclick = () => openCard(data, subtasksData);
    renderCard.draggable = true;
    renderCard.ondragstart = (event) => startDragging(event);
    renderCard.ondragend = (event) => endDragging(event);
    renderCard.ondragover = (event) => preventDragOver(event);
}

/**
 * Updates information on the task card.
 *
 * @param {string} taskId - The ID of the task.
 * @param {object} data - The data for rendering the task card.
 * @returns {Promise<{currentSubtasks: number, totalSubtasks: number, progress: number}>} Information on the task card.
 */
async function updateCardInformation(taskId, data) {
    let currentSubtasks = await countSubtasks(taskId);
    let totalSubtasks = data.content.subtasksData.length;
    let progress = totalSubtasks > 0 ? (currentSubtasks / totalSubtasks) * 100 : 0;

    return { currentSubtasks, totalSubtasks, progress };
}

/**
 * Counts the number of checked subtasks for a given task ID.
 *
 * @async
 * @function countSubtasks
 * @param {string} taskId - The ID of the task.
 * @returns {Promise<number>} The number of checked subtasks.
 */
async function countSubtasks(taskId) {
    let tasks = await getTasksData();
    let task = tasks.find(task => task.id === taskId);
    let subtasksData = task.content.subtasksData || [];
    return subtasksData.filter(subtask => subtask.checked).length;
}

/**
 * Retrieves tasks data based on the user login status.
 *
 * @async
 * @function getTasksData
 * @returns {Promise<Array>} An array of tasks data.
 */
async function getTasksData() {
    if (isUserLoggedIn) {
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        return users[currentUser].tasks;
    } else {
        let tasksString = localStorage.getItem('tasks');
        return tasksString ? JSON.parse(tasksString) : [];
    }
}

/**
 * Creates contact images with initials for display in the board.html.
 *
 * @param {Array} selectedContacts - The list of selected contacts.
 * @returns {string} The HTML code for the created contact images.
 */
function createAvatarDivs(selectedContacts) {
    let maxVisibleContacts = selectedContacts.length === 3 ? 3 : 2;
    let avatarDivsHTML = '';

    for (let i = 0; i < Math.min(maxVisibleContacts, selectedContacts.length); i++) {
        let selectedContact = selectedContacts[i];
        avatarDivsHTML += `
            <div class="initial-container">
                <div class="avatar" id="${selectedContact.id}">
                    <img src="${selectedContact.imagePath}">
                    <div class="avatar_initletter">${selectedContact.initials}</div>
                </div>
            </div>`;
    }

    if (selectedContacts.length > maxVisibleContacts) {
        let remainingContacts = selectedContacts.length - maxVisibleContacts;
        avatarDivsHTML += `
            <div class="initial-container">
                <div class="avatar" id="${selectedContacts[maxVisibleContacts].id}">
                    <img src="${selectedContacts[maxVisibleContacts].imagePath}">
                    <div class="avatar_initletter">+${remainingContacts}</div>
                </div>
            </div>`;
    }

    return avatarDivsHTML;
}

/**
 * Updates the progress bar and subtasks info for the current task based on the number of checked subtasks.
 * @param {string} taskId - The ID of the task.
 */
function updateProgressBar(taskId) {
    let progressFill = document.getElementById(`progressFill_${taskId}`);
    let subtasksInfo = document.querySelector(`#subtasks_${taskId}`);

    if (progressFill && subtasksInfo) {
        let totalSubtasks = document.querySelectorAll(`#cardModal_${taskId} .subtask-checkbox`).length;
        let checkedSubtasks = document.querySelectorAll(`#cardModal_${taskId} .subtask-checkbox.checked`).length;

        let percentage = totalSubtasks > 0 ? (checkedSubtasks / totalSubtasks) * 100 : 0;

        percentage = Math.round(percentage * 100) / 100;

        progressFill.style.width = `${percentage}%`;

        subtasksInfo.textContent = `${checkedSubtasks}/${totalSubtasks} Subtasks`;

        saveCheckboxStatus(taskId);
    }
}

/**
 * This function capitalizes the first letter (for the priority)
 * @param {string} string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * A function that returns the value of a specified DOM element, or an empty string if the element does not exist.
 */
function getValue(selector) {
    let element = document.querySelector(selector);
    return element ? element.value : '';
}

/**
 * Adds placeholder text to a column based on its ID.
 *
 * @param {string} columnId - The ID of the column.
 */
function addPlaceholderText(columnId) {
    let texts = {
        'todo-column': 'No tasks to do',
        'progress-column': 'No tasks in progress',
        'await-column': 'No tasks await feedback',
        'done-column': 'No tasks done',
        'default': 'Nothing here',
    };

    let columnElement = document.getElementById(columnId);

    if (columnElement) {
        let placeholderDiv = document.createElement('div');
        placeholderDiv.id = columnId + '-placeholder';
        placeholderDiv.className = 'no-tasks-here';

        let placeholderText = document.createElement('p');
        placeholderText.textContent = texts[columnId] || texts['default'];

        placeholderDiv.appendChild(placeholderText);
        columnElement.appendChild(placeholderDiv);
    }
}