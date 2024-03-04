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

//import { contacts } from './js/add-task.js';

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
        const searchValue = searchInput.value.toLowerCase();
        const tasks = isUserLoggedIn ? users[currentUser].tasks : JSON.parse(localStorage.getItem('tasks')) || [];

        const matchingTasks = tasks.filter(task =>
            task.content.title.toLowerCase().includes(searchValue) ||
            task.content.description.toLowerCase().includes(searchValue)
        );

        ['todo', 'progress', 'await', 'done'].forEach(columnId => {
            document.getElementById(`${columnId}-column`).innerHTML = '';
        });

        for (const task of matchingTasks) {
            await renderCard(task);
        }

        updatePlaceholderText();
    });
}

/** open add-task popup
 * 
 * @param {string} column current column id (''todo-column, progress-column, etc.)
 */
function addTask(column) {
    selectedInitialsArray = [];
    if (window.innerWidth <= 926) {
        window.location.href = "add-task.html";
    } else {
        let modalHTML = /*html*/`
            <div id="overlay"></div>
            <form id="taskModal" class="add-task-create-open">
                <div class="modal-headline">Add task</div>
                <div onclick="closeModal()">
                <img class="close-modal" src="./img/close_modal.svg" alt="">
                </div>
                <div class="Add-task-content">
                    <div class="Add-task-left-modal">
                        <div class="title-container">
                            <div class="title">Title</div>
                            <input id="taskTitleInput" type="text" class="title-input" placeholder="Enter a title" required>
                            <div class="required-info">This field is required</div>
                        </div>

                        <div class="description-container">
                            <div class="description">Description</div>
                            <input id="descriptionInput" type="text" class="description-input" placeholder="Enter a Description" required>
                            <div class="required-info">This field is required</div>
                        </div>

                        <div class="assigned-to-container">
                            <div class="assigned-to">Assigned to</div>
                            <div class="input-container">
                                <input id="assignedTo" type="text" class="assigned-dropdown" placeholder="Select contacts to assign">
                                <img id="arrow_img_contacts" onclick="toggleArrowContacts()" class="arrow_down" src="./img/arrow_down.svg" alt="">
                                <div id="contactDropdown" class="dropdown-content"></div>
                            </div>

                            <div id="selectedContactsContainer"></div>
                            <div class="input-container">
                            <div class="dropdown-content"></div>
                            <div class="arrow_down"></div>
                            </div>
                        </div>
                        <div class="required-legend-modal">This field is required</div>
                    </div>

                    <div class="divider">
                        <img src="./img/divider.svg" alt="">
                    </div>

                    <div class="Add-task-right-modal">
                        <div class="due-date-container">
                            <div class="due-date">Due date</div>
                            <input id="date" class="due-date-input" type="text" placeholder="dd/mm/yyyy" required />
                        </div>

                        <div class="prio-container">
                            <div class="prio">Prio</div>

                            <div class="prio-option-container">
                            <button
                                type="button"
                                onclick="choose('urgent')"
                                class="button urgent">
                                <h3>Urgent</h3>
                                <img src="./img/Prio_up.svg" alt="" />
                            </button>
                            <button
                                type="button"
                                onclick="choose('medium')"
                                class="button medium">
                                <h3>Medium</h3>
                                <img src="./img/Prio_neutral.svg" alt="" />
                            </button>
                            <button type="button" onclick="choose('low')" class="button low">
                                <h3>Low</h3>
                                <img src="./img/Prio_down.svg" alt="" />
                            </button>
                            </div>
                        </div>

                        <div class="category-container">
                            <div class="category">Category</div>
                            <div class="input-container">
                                <input id="category" class="category-dropdown" type="text" placeholder="Select task category">
                                <img id="arrow_img_category" class="arrow_down_category" src="./img/arrow_down.svg" onclick="toggleArrowCategory()" alt="" />
                                <div class="category-options" id="categoryOptions">
                                    <label onclick="updateSelectedCategory('Technical task')">
                                        Technical task
                                    </label>
                                    <label onclick="updateSelectedCategory('User Story')">
                                        User Story
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="subtasks-container">
                            <div class="subtasks-add-task">Subtasks</div>
                            <div class="input-container-subtask">
                                <input class="subtasks-input" type="text" id="newSubtaskInput" placeholder="Add new subtask" id="subtask">
                                <div id="iconContainer">
                                    <img class="add-icon" src="./img/Subtasks icons11.svg" alt="" />
                                </div>   
                            </div>
                            <div class="subtask-list" id="subtaskList"></div>
                        </div>

                        <div class="clear-and-create-section-modal">
                            <button onclick="clearFields()" class="cancel-button-modal">
                                <h3>Cancel</h3>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="iconoir:cancel">
                                    <path id="Vector" d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926 6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                </svg>
                            </button>

                            <button class="create-task-button-modal" onclick="addToBoardModal('${column}')">
                                <h3>Create Task</h3>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="check">
                                    <mask id="mask0_126260_6098" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                                    <rect id="Bounding box" x="0.248535" width="24" height="24" fill="#D9D9D9"/>
                                    </mask>
                                    <g mask="url(#mask0_126260_6098)">
                                    <path id="check_2" d="M9.79923 15.15L18.2742 6.675C18.4742 6.475 18.7117 6.375 18.9867 6.375C19.2617 6.375 19.4992 6.475 19.6992 6.675C19.8992 6.875 19.9992 7.1125 19.9992 7.3875C19.9992 7.6625 19.8992 7.9 19.6992 8.1L10.4992 17.3C10.2992 17.5 10.0659 17.6 9.79923 17.6C9.53256 17.6 9.29923 17.5 9.09923 17.3L4.79923 13C4.59923 12.8 4.5034 12.5625 4.51173 12.2875C4.52006 12.0125 4.62423 11.775 4.82423 11.575C5.02423 11.375 5.26173 11.275 5.53673 11.275C5.81173 11.275 6.04923 11.375 6.24923 11.575L9.79923 15.15Z" fill="white"/>
                                    </g>
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="overlay-feedback" id="overlayFeedack"></div>
            </form>
            <div class="animated-icon" id="animatedIcon">
                <img src="./img/added_to_board.svg" alt="Added to Board">
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        choose('medium');

        let overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
        let modal = document.getElementById('taskModal');
        modal.style.transform = "translate(0%, -50%) translateX(100%)";

        setTimeout(() => {
            modal.style.transform = "translate(-50%, -50%)";
        }, 100);
        setupDueDateInputAddTaskModal();
    }
}

/**
 * Adds a new task to the board based on the provided form inputs and column.
 * Redirects to the board page after successfully adding the task.
 * Closes the modal and resets form fields regardless of success.
 *
 * @param {string} column - The column on the board where the task should be added.
 */
async function addToBoardModal(column) {
    let form = document.getElementById('taskModal');
    let taskTitle = getFieldValueById('taskTitleInput');
    let category = getFieldValueById('category');

    if (window.location.pathname.includes("board.html") && form.checkValidity() && taskTitle && category) {

        let description = getFieldValueById('descriptionInput');
        let date = getFieldValueById('date');
        let subtasksList = document.getElementById('subtaskList').children;
        let selectedContacts = getSelectedContacts();
        let selectedPriority = getSelectedPriority();

        if (form.checkValidity()) {
            saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column);
            window.location.href = 'board.html';
        }
    }
    resetFormFields();
    closeModal();
}

/**
 * A function that clears all input and textarea fields in the 'Add-task' and 'Add-task-content' sections, 
 * resets the task priority to 'medium', clears the selected category, subtasks, modal, and selected contacts.
 */
function clearFields() {
    let clearInputFields = fields => fields.forEach(field => field.value = '');

    let inputFields = document.querySelectorAll('.Add-task input, .Add-task textarea');
    let allInputFields = document.querySelectorAll('.Add-task-content input, .Add-task-content textarea');

    clearInputFields(inputFields);
    clearInputFields(allInputFields);

    choose('medium');
    updateSelectedCategory('');

    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    closeModal();
    clearSelectedContacts();
}

/**
 * A function that closes the modal by moving it out of view and then removing it and the overlay after a delay.
 */
function closeModal() {
    let modal = document.getElementById('taskModal');
    let overlay = document.getElementById('overlay');

    modal.style.transform = "translate(0%, -50%) translateX(100%)";

    setTimeout(() => {
        modal.remove();
        overlay.remove();
    }, 200);
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
 * Creates contact images with initials for display in the board.html.
 *
 * @param {Array} selectedContacts - The list of selected contacts.
 * @returns {string} The HTML code for the created contact images.
 */
function createAvatarDivs(selectedContacts) {
    let maxVisibleContacts = 3;
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
        let remainingContacts = selectedContacts.length - maxVisibleContacts + 1;
        avatarDivsHTML += `
            <div class="initial-container">
                <div class="avatar" id="${selectedContacts[maxVisibleContacts - 1].id}">
                    <img src="${selectedContacts[maxVisibleContacts - 1].imagePath}">
                    <div class="avatar_initletter">+${remainingContacts}</div>
                </div>
            </div>`;
    }

    return avatarDivsHTML;
}

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
    return `
        <p class="${categoryClass}">${data.content.category}</p>
        <div class="title-container">
            <p class="card-title">${data.content.title}</p>
            <p class="card-content">${data.content.description}</p>
        </div>
        <p style="display: none">${data.content.date}</p>
        <div class="progress">
            <div class="progress-bar" id="progressBar_${data.id}">
                <div class="progress-fill" id="progressFill_${data.id}" style="width: ${progress}%;"></div>
            </div>
            <div class="subtasks" id="subtasks_${data.id}">${currentSubtasks}/${totalSubtasks} Subtasks</div>
        </div>
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
    const renderCard = document.createElement('div');
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
 * Updates the progress bar and subtasks info for the current task based on the number of checked subtasks.
 */
function updateProgressBar() {
    let taskId = currentTaskId;
    let progressFill = document.getElementById(`progressFill_${taskId}`);
    let subtasksInfo = document.querySelector(`#subtasks_${taskId}`);

    if (progressFill && subtasksInfo) {
        let totalSubtasks = document.querySelectorAll(`#cardModal_${taskId} .subtask-checkbox`).length;
        let checkedSubtasks = document.querySelectorAll(`#cardModal_${taskId} .subtask-checkbox:checked`).length;
        let percentage = totalSubtasks > 0 ? (checkedSubtasks / totalSubtasks) * 100 : 0;

        percentage = Math.round(percentage * 100) / 100;

        progressFill.style.width = `${percentage}%`;

        subtasksInfo.textContent = `${checkedSubtasks}/${totalSubtasks} Subtasks`;
    }

    saveCheckboxStatus(taskId);
}

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
 * Returns the path to the appropriate priority icon based on the given priority level.
 * @param {string} priority - The priority level.
 */
function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return './img/Prio_up.svg';
        case 'medium':
            return './img/Prio_neutral.svg';
        case 'low':
            return './img/Prio_down.svg';
        default:
            return '';
    }
}

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
 * clears the selectedContacts cache
 */

function clearSelectedContacts() {
    localStorage.removeItem('selectedContacts');
}

/**
 * Save the selected task to local or remote storage and display the changes.
 */
async function saveEditedTask() {
    let taskId = document.querySelector('.card-modal-save-button').dataset.id;
    let taskTitle = document.querySelector('.title-container-add-task input').value;
    let description = document.querySelector('.description-container textarea').value;
    let date = document.querySelector('.due-date-input').value;
    let category = document.querySelector('.task-categorie p').textContent;
    let priorityElement = document.querySelector('.prio-option-container .button.active');
    let priority = priorityElement ? priorityElement.textContent.toLowerCase().trim() : '';

    let tasks;

    if (isUserLoggedIn) {
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        tasks = users[currentUser].tasks;
    } else {
        let tasksString = localStorage.getItem('tasks');
        tasks = tasksString ? JSON.parse(tasksString) : [];
    }

    let task = tasks.find(task => task.id === taskId);

    if (task) {
        task.content.title = taskTitle;
        task.content.description = description;
        task.content.date = date;
        task.content.category = category;
        task.content.priority = priority;

        let selectedContactsString = localStorage.getItem('selectedContacts');
        let newSelectedContacts = selectedContactsString ? JSON.parse(selectedContactsString) : [];

        task.content.selectedContacts = newSelectedContacts;

        let subtasksData = Array.from(document.querySelectorAll(`#cardModal_${taskId} .card-modal-subtask-maincontainer`)).map((subtaskContainer) => {
            let description = subtaskContainer.querySelector('.card-modal-subtask-description').textContent;
            let checkbox = subtaskContainer.querySelector('.subtask-checkbox');
            return {
                description: description,
                checked: checkbox.checked
            };
        });
        task.content.subtasksData = subtasksData;
        task.content.subtasks = subtasksData.length;

        data = task;

        if (isUserLoggedIn) {
            users[currentUser].tasks = tasks;
            await setItem('users', JSON.stringify(users));
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        let oldCard = document.getElementById(taskId);
        oldCard.parentNode.removeChild(oldCard);
        await renderCard(task);
    }

    let taskElement = document.getElementById(taskId);
    taskElement.querySelector('.card-title').textContent = taskTitle;
    taskElement.querySelector('.card-content').textContent = description;
    let dateElement = taskElement.querySelector('.due-date-card-modal');
    if (dateElement) {
        dateElement.textContent = `Due date: ${date}`;
    }

    let priorityIconElement = taskElement.querySelector('.priority-symbol img');
    let newPriorityIconSrc = getPriorityIcon(priority);
    priorityIconElement.src = newPriorityIconSrc;

    clearSelectedContacts();
    updateProgressBar();
    closeOpenCard();
    endEdit();
}

/**
 * This function capitalizes the first letter (for the priority)
 * @param {string} string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * This function opens the edit modal and fills it with the current task data
 * @param {object} data - The task data
 * @param {object} subtasksData - The subtasks data
 */
async function openCard(data, subtasksData) {
    let tasks;
    let taskId = data.id;
    currentTaskId = taskId;

    if (isUserLoggedIn) {
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        tasks = users[currentUser].tasks;
    } else {
        let tasksString = localStorage.getItem('tasks');
        tasks = tasksString ? JSON.parse(tasksString) : [];
    }

    let task = tasks.find(task => task.id === taskId);

    if (task) {
        data = task;
    }

    let selectedPriority = data.content.priority;
    let priorityIconSrc = getPriorityIcon(selectedPriority);
    let categoryClass = data.content.category === 'Technical task' ? 'card-modal-technical' : 'card-modal-userstory';
    let selectedContacts = data.content.selectedContacts || {};
    let priority = capitalizeFirstLetter(data.content.priority);

    let openCardHTML = /*html*/`
        <div id="card-overlay"></div>
        <div id="cardModal_${taskId}" class="card-modal">

            <div class="task-categorie">
                <p class=${categoryClass}>${data.content.category}</p>
                <div class="close-card-modal" onclick="closeOpenCard()">
                    <img src="./img/close_modal.svg" alt="">
                </div>
            </div>
            <div class="card-modal-cont">
            <div class="card-modal-title-container">
                <p class="card-modal-title">${data.content.title}</p>
            </div>
            <p class="card-modal-content">${data.content.description}</p>

            <div class="card-modal-date">
                <p class="due-date-card-modal">Due date: 
                    <p id="dueDateText">${data.content.date}</p>
                </p> 
            </div>

            <div class="card-modal-priority">
                <p class="priority-card-modal-text">Priority:</p> 
                <div class="card-modal-priority-container">
                    <span class="card-modal-priority-letter">${priority}</span>
                    <div class="card-modal-priority-symbol">
                        <img src="${priorityIconSrc}" alt="">
                    </div>
                </div>
            </div>

            <div class="card-modal-contacts">
                <p class="card-modal-assigned-to-headline">Assigned to:</p>
                <div class="card-modal-contacts-container">
                    <div id="selectedContactsContainerEdit" class="card-modal-initial-container">
                        ${(selectedContacts || []).map(contact => `
                            <div class="initial-container-open-card" data-id="${contact.id}">
                                <div class="avatar">
                                    <img src="${contact.imagePath}" alt="Avatar">
                                    <div class="avatar_initletter">${contact.initials}</div>
                                </div>
                                <div class="avatar-name">${contact.name || ''}</div>
                            </div>`).join('')}
                    </div>
                </div>
            </div>

            <div class="card-modal-subtasks-container">
                <p class="card-modal-subtasks-container-headline">Subtasks:</p>
                <div class="card-modal-subtasks" id="subtaskList">
                    ${(data.content.subtasksData || []).map((subtask, index) => `
                        <div class="card-modal-subtask-maincontainer">
                            <div class="card-modal-description-checkbox">
                                <div class="card-modal-subtask-checked"> 
                                    <input type="checkbox" class="subtask-checkbox" id="subtaskCheckbox_${data.id}_${index + 1}" ${subtask.checked ? 'checked' : ''}>                     
                                    <img src="./img/circle.svg" class="subtask-image" style="display: none;">
                                </div>
                                <div class="card-modal-subtask-description">${subtask.description}</div>
                            </div>
                            <div class="subtasks-edit-icons-container d-none">
                                <div class="subtasks-edit-icons-container-p">
                                    <p class="subtask-icon-edit">
                                    <img src="./img/edit.svg" alt="Edit Subtask">
                                    </p>
                                    <p class="subtask-icon-delete">
                                    <img src="./img/delete.svg" alt="Delete Subtask">
                                    </p>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>
            </div>

            <div class="card-modal-edit-and-delete-container">
                <button onclick="deleteTask()" data-id="${data.id}" class="card-modal-delete-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="delete"><mask id="mask0_130935_4270" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4270)"><path id="delete_2" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/></g></g></svg>
                    <p> Delete </p>
                </button>

                <div class="card-modal-devider">
                    <img src="img/Vector 3.svg">
                </div>

                <button onclick="edit()" class="card-modal-edit-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="edit"><mask id="mask0_130935_4276" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4276)"><path id="edit_2" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/></g></g></svg>
                    <p> Edit </p>
                </button>

                <button onclick="saveEditedTask()" data-id="${data.id}" class="card-modal-save-button hide-button">
                    <p> Ok </p>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="check"><mask id="mask0_126260_6098" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24"><rect id="Bounding box" x="0.248535" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_126260_6098)"><path id="check_2" d="M9.79923 15.15L18.2742 6.675C18.4742 6.475 18.7117 6.375 18.9867 6.375C19.2617 6.375 19.4992 6.475 19.6992 6.675C19.8992 6.875 19.9992 7.1125 19.9992 7.3875C19.9992 7.6625 19.8992 7.9 19.6992 8.1L10.4992 17.3C10.2992 17.5 10.0659 17.6 9.79923 17.6C9.53256 17.6 9.29923 17.5 9.09923 17.3L4.79923 13C4.59923 12.8 4.5034 12.5625 4.51173 12.2875C4.52006 12.0125 4.62423 11.775 4.82423 11.575C5.02423 11.375 5.26173 11.275 5.53673 11.275C5.81173 11.275 6.04923 11.375 6.24923 11.575L9.79923 15.15Z" fill="white"/></g></g></svg>
                </button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', openCardHTML);
    updateProgressBar(taskId);
    let cardOverlay = document.getElementById('card-overlay');
    cardOverlay.style.display = 'block';

    let cardEffect = document.getElementById(`cardModal_${taskId}`);
    cardEffect.style.transform = "translate(100%, -50%) translateX(100%)";

    setTimeout(() => {
        cardEffect.style.transform = "translate(-50%, -50%)";
    }, 100);
    currentEditData = data;
}

/**
 * Replaces the given element with an input field inside a container.
 * @param {HTMLElement} element - The element to replace.
 * @param {string} containerClass - The class for the container.
 * @param {string} inputType - The type of input field ('input' or 'textarea').
 */
const replaceElementWithInput = (element, containerClass, inputType) => {
    let titleElement = document.querySelector('.card-modal-title');
    let container = document.createElement('div');
    container.className = containerClass;
    
    let headline = document.createElement('div');
    headline.textContent = element === titleElement ? 'Title' : 'Description';
    
    let input = document.createElement(inputType);
    input.type = 'text';
    input.value = element.textContent;

    container.appendChild(headline);
    container.appendChild(input);
    element.replaceWith(container);
};

/**
 * Enables editing of the title and content in the card modal.
 * It makes the title and content elements editable, creates new containers with input fields,
 * populates the input fields with the current title and content, and replaces the original elements with the new containers.
 */
function enableContentEditing() {
    let titleElement = document.querySelector('.card-modal-title');
    let contentElement = document.querySelector('.card-modal-content');

    contentElement.contentEditable = true;
    titleElement.contentEditable = true;

    replaceElementWithInput(titleElement, 'title-container-add-task', 'input');
    replaceElementWithInput(contentElement, 'description-container', 'textarea');
}

/**
 * Sets up the due date input for the edit modal and fills it with the current task data.
 * 
 * @function
 * @name setupDueDateInput
 * @returns {void}
 */
function setupDueDateInput() {
    let dateElement = document.getElementById('dueDateText');

    let dateContainer = document.createElement('div');
    dateContainer.className = 'due-date-container';
    let dateHeadline = document.createElement('div');
    dateHeadline.textContent = 'Due Date';
    let dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.className = 'due-date-input';
    dateInput.required = true;

    let dateText = dateElement.textContent;
    let dateValue = dateText.replace('Due date: ', '');
    dateInput.value = dateValue;

    dateInput.style.backgroundImage = 'url("img/calendar.svg")';
    dateInput.style.backgroundRepeat = 'no-repeat';
    dateInput.style.backgroundPosition = 'right center';
    dateInput.style.backgroundSize = '24px';

    dateContainer.appendChild(dateHeadline);
    dateContainer.appendChild(dateInput);
    dateElement.replaceWith(dateContainer);

    $(dateInput).datepicker({
        dateFormat: 'yy-mm-dd',
        showButtonPanel: true,
    });
}

/**
 * Sets up the due date input for the add task modal and fills it with the current task data.
 * 
 * @function
 * @name setupDueDateInputAddTaskModal
 * @returns {void}
 */
function setupDueDateInputAddTaskModal() {
    let dateElement = document.getElementById('date');

    let dateContainer = document.createElement('div');
    dateContainer.className = 'due-date-container';
    let dateHeadline = document.createElement('div');
    let dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.id = 'date';
    dateInput.className = 'due-date-input';
    dateInput.placeholder = 'dd/mm/yyyy';
    dateInput.required = true;

    let dateText = dateElement.textContent;
    let dateValue = dateText.replace('Due date: ', '');
    dateInput.value = dateValue;

    dateInput.style.backgroundImage = 'url("img/calendar.svg")';
    dateInput.style.backgroundRepeat = 'no-repeat';
    dateInput.style.backgroundPosition = 'right center';
    dateInput.style.backgroundSize = '24px';

    dateContainer.appendChild(dateHeadline);
    dateContainer.appendChild(dateInput);
    dateElement.replaceWith(dateContainer);

    $(dateInput).datepicker({
        dateFormat: 'yy-mm-dd',
        showButtonPanel: true,
    });
}

/**
 * This function sets up the due date input for the edit modal and fills it with the current task data
 */
function initializeContactDropdownOpenCard() {
    createContactDropdown(() => {
        updateCheckboxState();
    });
}

/**
 * This function activates the edit mode for a card in the board, enabling various editing features and hiding non-editable elements.
 * If no data is available for editing, an error is logged.
 */
function edit() {
    if (!isEditActive) {
        enableContentEditing();
        setupDueDateInput();
        enablePriorityEditing();
        initializeContactDropdownOpenCard();
        $('.avatar-name').hide();
        $('#selectedContactsContainerEdit').css('display', 'flex');
        enableSubtasksEditing();
        isEditActive = true;

        $('.card-modal-delete-button').addClass('hide-button');
        $('.card-modal-edit-button').addClass('hide-button');
        $('.card-modal-contacts').addClass('height-contacts');
        $('.card-modal-save-button').removeClass('hide-button');
        $('.card-modal-devider').addClass('hide-button');
        $('.card-modal-technical').addClass('hide-button');
        $('.card-modal-userstory').addClass('hide-button');
        $('.due-date-card-modal').addClass('hide-button');
        $('.priority-card-modal-text').addClass('hide-button');
        $('.card-modal-priority-symbol').addClass('hide-button');
        $('.task-categorie ').addClass('justify-end');

        $('.card-modal-assigned-to-headline').addClass('card-modal-assigned-to-headline_edit_mobile'); // added class for mobile view
        $('.card-modal-subtasks-container-headline').addClass('card-modal-subtasks-container-headline_edit_mobile'); // added class for mobile view
        $('.subtask-checkbox').css('display', 'none');
        $('.subtask-image').css('display', 'block');

        if (currentEditData) {
            addContactsToSelectedContacts(currentEditData);
        } else {
            console.error('No data available for editing.');
        }
    }
    clearSelectedContacts();
}

/**
 * This function ends the edit mode for a card in the board, disabling various editing features and showing non-editable elements.
 */
function endEdit() {
    $('.avatar-name').show();
    $('#selectedContactsContainerEdit').css('display', 'block');
    isEditActive = false;

    $('.card-modal-delete-button').removeClass('hide-button');
    $('.card-modal-edit-button').removeClass('hide-button');
    $('.card-modal-save-button').addClass('hide-button');
}

/**
 * This function enables the priority editing mode for a card, replacing the current priority display with a set of buttons that allow the user to select 'Urgent', 'Medium', or 'Low' priority.
 * The currently selected priority is highlighted and its corresponding button is styled accordingly.
 */
function enablePriorityEditing() {
    let priorityElement = document.querySelector('.card-modal-priority-letter');
    let currentPriority = priorityElement.textContent.toLowerCase();
    let priorityContainer = createPriorityOptionsContainer();

    highlightCurrentPriority(priorityContainer, currentPriority);
    replacePriorityElement(priorityContainer, priorityElement);
}

/**
 * This function creates a container with priority options (Urgent, Medium, Low) for a card modal in a task board.
 */
function createPriorityOptionsContainer() {
    let priorityContainer = document.createElement('div');
    priorityContainer.className = 'prio-container';

    let priorityHeadline = document.createElement('div');
    priorityHeadline.className = 'prio';
    priorityHeadline.textContent = 'Priority';

    let optionContainer = document.createElement('div');
    optionContainer.className = 'prio-option-container';

    createPriorityButton(optionContainer, 'Urgent', 'urgent', './img/Prio_up.svg');
    createPriorityButton(optionContainer, 'Medium', 'medium', './img/Prio_neutral.svg');
    createPriorityButton(optionContainer, 'Low', 'low', './img/Prio_down.svg');

    priorityContainer.appendChild(priorityHeadline);
    priorityContainer.appendChild(optionContainer);

    return priorityContainer;
}

/**
 * Creates a priority button with the specified properties and appends it to the given container.
 *
 * @param {HTMLElement} container - The container to which the button will be appended.
 * @param {string} text - The text content of the button.
 * @param {string} priority - The priority level associated with the button ('low', 'medium', or 'urgent').
 * @param {string} imgSrc - The source URL for the button's image.
 * @returns {void}
 */
function createPriorityButton(container, text, priority, imgSrc) {
    let button = document.createElement('button');
    button.type = 'button';
    button.className = `button ${priority}`;
    button.innerHTML = `<h3>${text}</h3><img src="${imgSrc}" alt="" />`;
    button.onclick = () => chooseCardModal(priority);
    container.appendChild(button);
}

/**
 * Highlights the button corresponding to the current priority within the specified container.
 *
 * @param {HTMLElement} container - The container containing the priority buttons.
 * @param {string} currentPriority - The current priority level to be highlighted.
 * @returns {void}
 */
function highlightCurrentPriority(container, currentPriority) {
    let buttons = container.querySelectorAll('.button');
    
    buttons.forEach(button => {
        let imgElement = button.querySelector('img');

        if (button.classList.contains(currentPriority)) {
            button.classList.add('active');
            setButtonStyles(button, currentPriority);

            if (imgElement) {
                imgElement.style.filter = 'brightness(0) invert(1)';
            }
        }
    });
}

/**
 * Sets the visual styles (background color) for the specified button based on its priority level.
 *
 * @param {HTMLElement} button - The button for which styles will be set.
 * @param {string} priority - The priority level associated with the button.
 * @returns {void}
 */
function setButtonStyles(button, priority) {
    switch (priority) {
        case 'low':
            button.style.backgroundColor = 'rgb(122, 226, 41)';
            break;
        case 'medium':
            button.style.backgroundColor = 'rgb(255, 168, 0)';
            break;
        case 'urgent':
            button.style.backgroundColor = 'rgb(255, 61, 0)';
            break;
    }
}

/**
 * Replaces an old HTML element with a new one in the DOM.
 *
 * @param {HTMLElement} newElement - The new element to replace the old one.
 * @param {HTMLElement} oldElement - The old element to be replaced.
 * @returns {void}
 */
function replacePriorityElement(newElement, oldElement) {
    oldElement.replaceWith(newElement);
}

/**
 * Adds event listeners to all buttons within the provided priority options container.
 * When a button is clicked, the priority options container is removed and the flag indicating its open state is set to false.
 */
function addEventListenersToButtons(priorityOptionsContainer) {
    let buttons = priorityOptionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            priorityOptionsContainer.remove();
            isPriorityOptionsOpen = false;
        });
    });
}

/**
 * Chooses the priority level for the card modal and updates the UI accordingly.
 *
 * @param {string} priority - The priority level ('low', 'medium', or 'urgent').
 * @returns {void}
 */
function chooseCardModal(priority) {
    let container = document.querySelector('.card-modal-priority-container');
    let letterElement = container.querySelector('.card-modal-priority-letter');
    let symbolElement = container.querySelector('.card-modal-priority-symbol img');
    let buttons = document.querySelectorAll('.prio-option-container .button');

    updateButtonsState(buttons, priority);
    updateSelectedPriorityStyles(buttons, priority);
    updatePriorityTextAndSymbol(letterElement, symbolElement, priority);

    const optionsContainer = document.querySelector('.card-modal-priority-options-container');
    optionsContainer && optionsContainer.remove();
}

/**
 * Updates the state (active/inactive) of the priority buttons.
 *
 * @param {NodeList} buttons - The NodeList of priority buttons.
 * @param {string} selectedPriority - The selected priority level.
 * @returns {void}
 */
function updateButtonsState(buttons, selectedPriority) {
    buttons.forEach(button => {
        let isActive = button.classList.contains(selectedPriority);
        button.classList.toggle('active', isActive);
    });
}

/**
 * Updates the visual styles of the selected priority button.
 *
 * @param {NodeList} buttons - The NodeList of priority buttons.
 * @param {string} selectedPriority - The selected priority level.
 * @returns {void}
 */
function updateSelectedPriorityStyles(buttons, selectedPriority) {
    buttons.forEach(button => {
        let imgElement = button.querySelector('img');
        let isActive = button.classList.contains(selectedPriority);

        button.style.backgroundColor = isActive ? getPriorityColor(selectedPriority) : '';
        
        if (imgElement) {
            imgElement.style.filter = isActive ? 'brightness(0) invert(1)' : 'brightness(1) invert(0)';
        }
    });
}

/**
 * Updates the priority text and symbol elements.
 *
 * @param {HTMLElement} letterElement - The element displaying the priority letter.
 * @param {HTMLElement} symbolElement - The element displaying the priority symbol.
 * @param {string} selectedPriority - The selected priority level.
 * @returns {void}
 */
function updatePriorityTextAndSymbol(letterElement, symbolElement, selectedPriority) {
    let priorityMappings = {
        'urgent': { text: 'Urgent', symbolSrc: './img/Prio_up.svg' },
        'medium': { text: 'Medium', symbolSrc: './img/Prio_neutral.svg' },
        'low': { text: 'Low', symbolSrc: './img/Prio_down.svg' }
    };

    let selectedPriorityInfo = priorityMappings[selectedPriority] || {};

    if (letterElement && symbolElement) {
        letterElement.textContent = (selectedPriorityInfo.text || '').toUpperCase();
        symbolElement.src = selectedPriorityInfo.symbolSrc || '';
    }
}

/**
 * Gets the background color for a given priority level.
 *
 * @param {string} priority - The priority level.
 * @returns {string} - The background color for the priority level.
 */
function getPriorityColor(priority) {
    let colorMap = {
        'low': 'rgb(122, 226, 41)',
        'medium': 'rgb(255, 168, 0)',
        'urgent': 'rgb(255, 61, 0)'
    };
    return colorMap[priority] || '';
}

/**
 * This function creates a dropdown for the contacts in the edit modal
 */
function createContactDropdown(taskId) {
    let contactDropdownEdit = document.querySelector('.card-modal-assigned-to-headline');

    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    inputContainer.innerHTML = `
        <input id="assignedToEdit" type="text" class="assigned-dropdown" placeholder="Select contacts to assign">
            <img id="arrow_down_edit" onclick="showDropdownEdit('${currentTaskId}')" class="arrow_down_edit" src="./img/arrow_down.svg" alt="">
        <div id="contactDropdownEdit_${currentTaskId}" class="dropdown-content-edit" data-task-id="${currentTaskId}"></div>
    `;

    contactDropdownEdit.appendChild(inputContainer);
    document.getElementById('arrow_down_edit').addEventListener('click', function () {
        showDropdownEdit(taskId);
    });
}

/**
 * Retrieves a task by its ID from the tasks stored in local storage.
 *
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Object} The task object if found, otherwise undefined.
 */
function getTaskById(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.find(task => task.id === taskId);
}

/**
 * This function adds contacts to the selected contacts list stored in the local storage.
 * It first fetches all contacts, then gets the selected contacts from local storage.
 * It then iterates over the contacts in the task's content, and if a contact is not already in the selected contacts,
 * it finds the full contact information from the fetched contacts and adds it to the selected contacts.
 * Finally, it updates the selected contacts in the local storage.
 * @param {Object} task - The task object.
 * @param {Object} task.content - The content of the task.
 * @param {Array} task.content.selectedContacts - The array of selected contacts in the task's content.
 * @returns {Promise<void>} A Promise that resolves when the function has completed.
 */
async function addContactsToSelectedContacts(task) {
    let contacts = await getContacts();
    let selectedContacts = JSON.parse(localStorage.getItem('selectedContacts')) || [];

    task.content.selectedContacts.forEach(contact => {
        if (!selectedContacts.some(selectedContact => selectedContact.id === contact.id)) {
            let fullContact = contacts.find(c => c.id === contact.id);
            if (fullContact) {
                selectedContacts.push(fullContact);
            }
        }
    });

    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
}

/**
 * Displays the dropdown for editing contacts.
 * It first clears the dropdown, then fetches all contacts and the selected contacts from local storage.
 * It adds the existing contacts in the task to the selected contacts if they are not already there.
 * Then it creates a div for each contact and appends it to the dropdown.
 * Finally, it updates the state of the checkboxes and displays the dropdown.
 *
 * @returns {Promise<void>} A Promise that resolves when the function has completed.
 */
async function showDropdownEdit() {
    let dropdownContent = document.getElementById(`contactDropdownEdit_${currentTaskId}`);
    dropdownContent.innerHTML = "";
    let contacts = await getContacts();
    let selectedContacts = JSON.parse(localStorage.getItem('selectedContacts')) || [];

    contacts.forEach(contact => {
        let isInContainer = isContactInContainer(contact.id);
        let isContactSelected = selectedContacts.some(selectedContact => selectedContact.id === contact.id);

        let isSelected = false;

        if (isInContainer || isContactSelected) {
            isSelected = true;
        }

        let contactDiv = createContactDivEdit(contact, isSelected);
        dropdownContent.appendChild(contactDiv);
    });

    updateCheckboxState();
    dropdownContent.style.display = 'block';
}

/**
 * Checks if a contact is in the container and is checked.
 *
 * @param {string} contactId - The ID of the contact to check.
 * @returns {boolean} True if the contact is in the container and is checked, otherwise false.
 */
function isContactInContainer(contactId) {
    let containerContacts = document.querySelectorAll('.initial-container-open-card .contact-checkbox');
    return Array.from(containerContacts).some(checkbox => checkbox.dataset.contactId === contactId && checkbox.checked);
}

/**
 * Initializes the contact dropdown for the edit mode.
 * It adds a click event listener to the document that handles the display of the dropdown.
 * If the click is outside the dropdown, the assignedToEdit element, or the arrowDownEdit element, the dropdown is hidden.
 * If the click is on the assignedToEdit element or the arrowDownEdit element, the dropdown is shown.
 */
function initializeContactDropdownEdit() {
    if (window.location.pathname.endsWith("add-task.html") || window.location.pathname.endsWith("board.html")) {
        document.addEventListener('click', function (event) {
            let dropdown = document.getElementById(`contactDropdownEdit_${currentTaskId}`);
            let assignedToEdit = document.getElementById('assignedToEdit');
            let arrowDownEdit = document.getElementById('arrow_down_edit');

            if (dropdown && dropdown.style.display !== 'none' && !dropdown.contains(event.target) && !assignedToEdit.contains(event.target) && !arrowDownEdit.contains(event.target)) {
                dropdown.style.display = 'none';
            }

            if ((event.target === assignedToEdit || event.target === arrowDownEdit) && dropdown) {
                showDropdownEdit();
            }
        });
    }
}
initializeContactDropdownEdit();

/**
 * Creates a div element for a contact in the edit mode.
 *
 * @param {Object} contact - The contact object.
 * @param {boolean} isSelected - Indicates whether the contact is selected.
 * @returns {HTMLDivElement} The created div element for the contact.
 */
function createContactDivEdit(contact, isSelected) {
    let contactDiv = document.createElement("div");
    contactDiv.innerHTML = generateContactHTMLEdit(contact, isSelected);
    
    contactDiv.addEventListener("mousedown", (event) => {
        event.preventDefault();
        updateSelectedContactsEdit(contact, isSelected ? 'remove' : 'add');
        let checkboxImg = contactDiv.querySelector('.checkbox-img');
        isSelected = !isSelected;
        checkboxImg.src = isSelected ? 'img/checked_white.svg' : 'img/unchecked.svg';
    });

    return contactDiv;
}

/**
 * Generates the HTML content for a contact in edit mode.
 *
 * @param {Object} contact - The contact object.
 * @param {boolean} isSelected - Indicates whether the contact is selected.
 * @returns {string} The HTML content for the contact.
 */
function generateContactHTMLEdit(contact, isSelected) {
    return `
        <label class="contacts-edit ${isSelected ? 'checked' : ''}" onclick="toggleContactSelectionEdit(this, '${contact.id}')">
            <div class="avatar">
                <img src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
                <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
            <div class="contact-dropdown-edit">
                <div>${contact.name}</div>
            </div>
            <div class="custom-checkbox" data-contact-id="${contact.id}"></div>
            <img class="checkbox-img" src="${isSelected ? 'img/checked_white.svg' : 'img/unchecked.svg'}" alt="Checkbox">
        </label>
    `;
}

/**
 * Toggles the selection of a contact in the edit mode.
 * Updates the class, image, and local storage based on the selection.
 *
 * @param {HTMLElement} element - The clicked element.
 * @param {string} contactId - The ID of the contact to toggle.
 */
function toggleContactSelectionEdit(element, contactId) {
    let isSelected = element.classList.toggle('checked');
    let checkboxImg = element.querySelector('.checkbox-img');
    checkboxImg && (checkboxImg.src = isSelected ? '/img/checked_white.svg' : 'img/unchecked.svg');

    let selectedContacts = JSON.parse(localStorage.getItem('selectedContacts')) || [];
    let index = selectedContacts.findIndex(c => c.id === contactId);

    if ((isSelected && index === -1) || (!isSelected && index !== -1)) {
        isSelected ? selectedContacts.push({ id: contactId }) : selectedContacts.splice(index, 1);
        localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
    }
}

/**
 * Updates the selected contacts in the edit mode based on the action.
 * It adds the contact to the selected contacts if the action is 'add' and the contact is not already selected.
 * It removes the contact from the selected contacts if the action is 'remove' and the contact is selected.
 *
 * @param {Object} contact - The contact object.
 * @param {string} action - The action to perform. It can be 'add' or 'remove'.
 */
function updateSelectedContactsEdit(contact, action) {
    if (currentEditData.content && currentEditData.content.selectedContacts) {
        let index = currentEditData.content.selectedContacts.findIndex(c => c.id === contact.id);

        if (action === 'add' && index === -1) {
            currentEditData.content.selectedContacts.push(contact);
        } else if (action === 'remove' && index !== -1) {
            currentEditData.content.selectedContacts.splice(index, 1);
            removeSelectedContactFromContainerEdit(contact);
        }
    }

    let indexInitialsArray = selectedInitialsArray.findIndex(c => c.id === contact.id);
    if (action === 'add' && indexInitialsArray === -1) {
        selectedInitialsArray.push(contact);
    } else if (action === 'remove' && indexInitialsArray !== -1) {
        selectedInitialsArray.splice(indexInitialsArray, 1);
        removeSelectedContactFromContainerEdit(contact);
    }

    selectContactEdit();

    saveSelectedContacts();
}

/**
 * Removes a selected contact from the container in the edit mode.
 *
 * @param {Object} contact - The contact object to remove.
 */
function removeSelectedContactFromContainerEdit(contact) {
    let selectedContactsContainer = document.getElementById("selectedContactsContainerEdit");
    let selectedContactDiv = selectedContactsContainer.querySelector(`.selected-contact[data-id="${contact.id}"]`);

    if (selectedContactDiv) {
        selectedContactDiv.remove();
    }
}

/**
 * Saves the selected contacts to the local storage and displays them in the edit mode.
 */
function saveAndDisplaySelectedContactsEdit() {
    saveSelectedContacts();
    selectContactEdit();
}

/**
 * Creates a div element for a selected contact in the edit mode.
 *
 * @param {Object} contact - The contact object.
 * @returns {HTMLDivElement} The created div element for the selected contact.
 */
function createSelectedContactDivEdit(contact) {
    let selectedContactDiv = document.createElement("div");
    selectedContactDiv.classList.add("initial-container-open-card");
    selectedContactDiv.dataset.id = contact.id;
    selectedContactDiv.id = "selectedContactEdit";

    selectedContactDiv.innerHTML = `
        <div data-avatarid="${contact.id}">
            <div class="avatar">
                <img src="${contact.imagePath}" alt="Avatar">
                <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
        </div>
    `;

    return selectedContactDiv;
}

/**
 * Displays the selected contacts in the edit mode.
 * It first clears the selected contacts container, then creates a div for each selected contact and appends it to the container.
 */
function selectContactEdit() {
    let selectedContactsContainer = document.getElementById("selectedContactsContainerEdit");
    selectedContactsContainer.innerHTML = "";

    currentEditData.content.selectedContacts.forEach(contact => {
        let selectedContactDiv = createSelectedContactDivEdit(contact);
        selectedContactsContainer.appendChild(selectedContactDiv);
    });
}

/**
 * Updates the state of the checkboxes for each contact based on the selected contacts in the local storage.
 * It checks if each contact is in the selected contacts and updates the checkbox accordingly.
 * If the contact is in the selected contacts, the checkbox is checked. Otherwise, it is unchecked.
 */
function updateCheckboxState() {
    selectedInitialsArray = JSON.parse(localStorage.getItem('selectedContacts')) || [];

    contacts.forEach(contact => {
        let isSelected = selectedInitialsArray.some(selectedContact => selectedContact.id === contact.id);
        let checkbox = document.querySelector(`.contact-checkbox[data-contact-id="${contact.id}"]`);
        if (checkbox) {
            checkbox.checked = isSelected;
        }
    });
}

/**
 * Enables editing of subtasks in the card modal.
 * Adds an input field for adding new subtasks and event listeners to existing subtask containers.
 * Handles mouseover, mouseout, and click events to show/hide subtask icons and allow editing.
 * Additionally, adds a click event listener to handle subtask deletion if a delete icon is present.
 */
function enableSubtasksEditing() {
    let subtasksContainer = document.querySelector('.card-modal-subtasks-container-headline');
    let inputContainer = createSubtasksInputContainer();
    subtasksContainer.appendChild(inputContainer);

    document.querySelectorAll('.card-modal-subtask-maincontainer').forEach(subtaskContainer => {
        subtaskContainer.addEventListener('mouseover', () => showSubtaskIcons(subtaskContainer));
        subtaskContainer.addEventListener('mouseout', () => hideSubtaskIcons(subtaskContainer));
        subtaskContainer.addEventListener('click', () => editSubtaskDescription(subtaskContainer));

        const deleteIcon = subtaskContainer.querySelector('.subtask-icon-delete img');
        deleteIcon && deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteSubtask(subtaskContainer);
        });
    });
}

/**
 * Creates the input container for adding new subtasks.
 *
 * @returns {HTMLDivElement} The created input container.
 */
function createSubtasksInputContainer() {
    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container-subtask';
    inputContainer.innerHTML = `
        <input class="subtasks-input" type="text" id="newSubtaskInput" placeholder="Add new subtask" id="subtask">
        <div id="iconContainer">
            <img class="add-icon" src="./img/Subtasks icons11.svg" alt="" />
        </div>
    `;
    return inputContainer;
}

/**
 * This function shows the subtask icons
 * @param {*} subtaskContainer 
 */
function showSubtaskIcons(subtaskContainer) {
    let iconsContainer = subtaskContainer.querySelector('.subtasks-edit-icons-container');

    if (iconsContainer) {
        iconsContainer.classList.remove('d-none');
    }
}

/**
 * This function hides the subtask icons
 * @param {*} subtaskContainer 
 */
function hideSubtaskIcons(subtaskContainer) {
    let iconsContainer = subtaskContainer.querySelector('.subtasks-edit-icons-container');

    if (iconsContainer) {
        iconsContainer.classList.add('d-none');
    }
}

/**
 * This function edits the subtask description
 * @param {*} element 
 */
function editSubtaskDescription(element) {
    let subtaskContainer = element.closest('.card-modal-subtask-maincontainer');
    let descriptionElement = subtaskContainer.querySelector('.card-modal-subtask-description');

    descriptionElement.contentEditable = true;
    descriptionElement.focus();
}

/**
 * This function deletes the subtask
 * @param {*} subtaskContainer 
 */
function deleteSubtask(subtaskContainer) {
    subtaskContainer.remove();
}

/**
 * Adds a subtask in the open card.
 */
function addSubtaskOpenCard() {
    const inputElement = document.getElementById('newSubtaskInput');
    const subtasksContainer = document.querySelector('.card-modal-subtasks');
    const subtaskText = inputElement.value.trim();
    const taskId = currentTaskId;

    if (subtaskText !== '') {
        const subtaskContainer = createSubtaskContainer(taskId, subtasksContainer.children.length + 1, subtaskText);

        subtasksContainer.appendChild(subtaskContainer);

        subtaskContainer.addEventListener('mouseover', () => showSubtaskIcons(subtaskContainer));
        subtaskContainer.addEventListener('mouseout', () => hideSubtaskIcons(subtaskContainer));
        subtaskContainer.addEventListener('click', () => editSubtaskDescription(subtaskContainer));

        const deleteIcon = subtaskContainer.querySelector('.subtask-icon-delete img');
        deleteIcon && deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteSubtask(subtaskContainer);
        });

        inputElement.value = '';
    }
}

/**
 * Creates a subtask container with the specified properties.
 *
 * @param {string} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 * @param {string} subtaskText - The text of the subtask.
 * @returns {HTMLDivElement} The created subtask container.
 */
function createSubtaskContainer(taskId, subtaskIndex, subtaskText) {
    const subtaskContainer = document.createElement('div');
    subtaskContainer.className = 'card-modal-subtask-maincontainer';

    const checkboxId = `subtaskCheckbox_${taskId}_${subtaskIndex}`;

    subtaskContainer.innerHTML = `
        <div class="card-modal-description-checkbox">
            <div class="card-modal-subtask-checked"> 
                <input type="checkbox" class="subtask-checkbox" id="${checkboxId}" style="display: none;"> 
                <img src="./img/circle.svg" class="subtask-image">                   
            </div>
            <div class="card-modal-subtask-description">${subtaskText}</div>
        </div>
        <div class="subtasks-edit-icons-container d-none">
            <div class="subtasks-edit-icons-container-p">
                <p class="subtask-icon-edit"><img src="./img/edit.svg" alt="Edit Subtask"></p>
                <p class="subtask-icon-delete"><img src="./img/delete.svg" alt="Delete Subtask"></p>
            </div>
        </div>
    `;

    return subtaskContainer;
}