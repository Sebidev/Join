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
 * search functionality for the tasks in board.html
 * @param {HTMLElement} searchInput
 */
function addSearch(searchInput) {
    searchInput.addEventListener('input', async function () {
        let searchValue = searchInput.value.toLowerCase();
        let tasks;
        if (isUserLoggedIn) {
            tasks = users[currentUser].tasks;
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        }

        let matchingTasks = tasks.filter(task =>
            task.content.title.toLowerCase().includes(searchValue) ||
            task.content.description.toLowerCase().includes(searchValue)
        );

        document.getElementById('todo-column').innerHTML = '';
        document.getElementById('progress-column').innerHTML = '';
        document.getElementById('await-column').innerHTML = '';
        document.getElementById('done-column').innerHTML = '';

        for (let task of matchingTasks) {
            await renderCard(task);
        }

        updatePlaceholderText();
    });
};

/** open add-task popup
 * 
 * @param {string} column current column id (''todo-column, progress-column, etc.)
 */

function addTask(column) {
    if (window.innerWidth <= 800) {
        window.location.href = "add-task.html";
    } else {
        let modalHTML = /*html*/`
            <div id="overlay"></div>
            <div id="taskModal" class="add-task-create-open">
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
                                <img id="arrow_down" onclick="showDropdown()" class="arrow_down" src="./img/arrow_down.svg" alt="">
                                <div id="contactDropdown" class="dropdown-content"></div>
                            </div>

                            <div id="selectedContactsContainer"></div>
                            <div class="input-container">
                            <div class="dropdown-content"></div>
                            <div class="arrow_down"></div>
                            </div>

                            <div class="required-legend-modal">This field is required</div>
                        </div>
                    </div>

                    <div class="divider">
                        <img src="./img/divider.svg" alt="">
                    </div>

                    <div class="Add-task-right-modal">
                        <div class="due-date-container">
                            <div class="due-date">Due date</div>
                            <input class="due-date-input" id="date" type="date" placeholder="dd/mm/yyyy">
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
                                <img class="arrow_down" src="./img/arrow_down.svg" onclick="toggleCategoryOptions()" alt="">
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
                                <img class="add-icon" src="./img/Subtasks icons11.svg" alt="" onclick="addSubtask()">
                                <div class="subImgContainer">
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

                            <button class="create-task-button-modal" onclick="addToBoard('${column}')">
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
    }
}

function clearFields() {
    let inputFields = document.querySelectorAll('.Add-task input, .Add-task textarea');
    let AllInputFields = document.querySelectorAll('.Add-task-content input, .Add-task-content textarea');

    inputFields.forEach(field => {
        field.value = '';
    });

    AllInputFields.forEach(field => {
        field.value = '';
    });

    choose('medium');
    updateSelectedCategory('');

    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    closeModal();
}

function closeModal() {
    let modal = document.getElementById('taskModal');
    let overlay = document.getElementById('overlay');

    modal.style.transform = "translate(0%, -50%) translateX(100%)";

    setTimeout(() => {
        modal.remove();
        overlay.remove();
    }, 200);
}

function closeOpenCard() {
    let cardOverlay = document.getElementById('card-overlay');
    let taskId = currentTaskId;

    let cardEffect = document.getElementById(`cardModal_${taskId}`);
    cardEffect.style.transform = "translate(100%, -50%) translateX(100%)";

    setTimeout(() => {
        if (cardOverlay) {
            cardOverlay.remove();

            let cardModal = document.getElementById(`cardModal_${taskId}`);
            if (cardModal) {
                cardModal.remove();
                endEdit();
            }
        }

        $('.card-modal-delete-button').removeClass('hide-button');
        $('.card-modal-edit-button').removeClass('hide-button');
        $('.card-modal-save-button').addClass('hide-button');
        $('.card-modal-technical').removeClass('hide-button');
        $('.card-modal-userstory').removeClass('hide-button');
        $('.due-date-card-modal').removeClass('hide-button');
        $('.card-modal-priority-symbol').removeClass('hide-button');
        $('.priority-card-modal-text').removeClass('hide-button');
    }, 100);
}

function getValue(selector) {
    let element = document.querySelector(selector);
    return element ? element.value : '';
}

/** add the placeholder text depending on if there's a task on the board or not
 * 
 * @param {string} columnId 
 */

function addPlaceholderText(columnId) {
    let columnElement = document.getElementById(columnId);
    if (columnElement) {
        let placeholderDiv = document.createElement('div');
        placeholderDiv.id = columnId + '-placeholder';
        placeholderDiv.className = 'no-tasks-here';

        let placeholderText = document.createElement('p');

        switch (columnId) {
            case 'todo-column':
                placeholderText.textContent = 'No tasks to do';
                break;
            case 'progress-column':
                placeholderText.textContent = 'No tasks in progress';
                break;
            case 'await-column':
                placeholderText.textContent = 'No tasks await feedback';
                break;
            case 'done-column':
                placeholderText.textContent = 'No tasks done';
                break;
            default:
                placeholderText.textContent = 'Nothing here';
                break;
        }

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

async function checkAndRenderSharedData() {
    let tasks;

    if (isUserLoggedIn) {
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        tasks = users[currentUser].tasks;
    } else {
        let tasksString = localStorage.getItem('tasks');
        tasks = tasksString ? JSON.parse(tasksString) : [];
    }

    addPlaceholderText('todo-column');
    addPlaceholderText('progress-column');
    addPlaceholderText('await-column');
    addPlaceholderText('done-column');

    for (let task of tasks) {
        removePlaceholderText(task.content.boardColumn);

        renderCard(task);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initUser().then(checkAndRenderSharedData);
});

/** this function creates the contact images with intitials in our board.html
 * 
 * @param {string} selectedContacts 
 * @returns selected contacts
 */

function createAvatarDivs(selectedContacts) {
    let avatarDivsHTML = '';
    let maxVisibleContacts = 3;

    for (let i = 0; i < selectedContacts.length; i++) {
        let selectedContact = selectedContacts[i];

        if (i < maxVisibleContacts - 1 || selectedContacts.length <= maxVisibleContacts) {
            avatarDivsHTML += `
                <div class="initial-container">
                    <div class="avatar" id="${selectedContact.id}">
                        <img src="${selectedContact.imagePath}">
                        <div class="avatar_initletter">${selectedContact.initials}</div>
                    </div>
                </div>`;
        } else if (i === maxVisibleContacts - 1) {
            let remainingContacts = selectedContacts.length - maxVisibleContacts + 1;
            avatarDivsHTML += `
                <div class="initial-container">
                    <div class="avatar" id="${selectedContact.id}">
                        <img src="${selectedContact.imagePath}">
                        <div class="avatar_initletter">+${remainingContacts}</div>
                    </div>
                </div>`;
            break;
        }
    }

    return avatarDivsHTML;
}

async function renderCard(data) {

    if (data && data.content) {
        let containerDiv = document.getElementById(data.content.boardColumn);
        let categoryClass = data.content.category === 'Technical task' ? 'technical-task' : 'user-story';
        let subtasksData = data.content.subtasksData || [];
        let selectedPriority = data.content.priority;
        let selectedContacts = data.content.selectedContacts || [];
        let initialsHTML = createAvatarDivs(selectedContacts);
        let priorityIconSrc = getPriorityIcon(selectedPriority);
        let taskId = data.id;

        let renderCard = document.createElement('div');
        renderCard.id = taskId;
        renderCard.className = 'card-user-story';
        renderCard.onclick = () => openCard(data, subtasksData);

        renderCard.draggable = true;
        renderCard.ondragstart = (event) => startDragging(event);
        renderCard.ondragend = (event) => endDragging(event);
        renderCard.ondragover = (event) => preventDragOver(event);

        let currentSubtasks = await countSubtasks(taskId);
        let totalSubtasks = data.content.subtasksData.length;
        let progress = totalSubtasks > 0 ? (currentSubtasks / totalSubtasks) * 100 : 0;

        renderCard.innerHTML = `
            <p class="${categoryClass}">${data.content.category}</p>
            <div class="title-container">
                <p class="card-title">${data.content.title}</p>
                <p class="card-content">${data.content.description}</p>
            </div>
            <p style="display: none">${data.content.date}</p>
            <div class="progress">
                <div class="progress-bar" id="progressBar_${taskId}">
                    <div class="progress-fill" id="progressFill_${taskId}" style="width: ${progress}%;"></div>
                </div>
                <div class="subtasks" id="subtasks_${taskId}">${currentSubtasks}/${totalSubtasks} Subtasks</div>
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

        currentTaskId = taskId;
        containerDiv.appendChild(renderCard);
    }
}

async function countSubtasks(taskId) {
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
    let subtasksData = task.content.subtasksData || [];
    let checkedSubtasks = subtasksData.filter(subtask => subtask.checked).length;

    return checkedSubtasks;
}

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

async function saveCheckboxStatus(taskId) {
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
        let subtasksData = Array.from(document.querySelectorAll(`#cardModal_${taskId} .subtask-checkbox`)).map((checkbox, index) => {
            return {
                description: task.content.subtasksData[index].description,
                checked: checkbox.checked
            };
        });
        task.content.subtasksData = subtasksData;

        if (isUserLoggedIn) {
            users[currentUser].tasks = tasks;
            await setItem('users', JSON.stringify(users));
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
}

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
 * This function deletes a task completely from our board aswell as remote or local storage
 */

async function deleteTask() {
    let taskId = document.querySelector('.card-modal-delete-button').dataset.id;

    document.getElementById(taskId).remove();

    let tasks;

    if (isUserLoggedIn) {
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        tasks = users[currentUser].tasks;
    } else {
        let tasksString = localStorage.getItem('tasks');
        tasks = tasksString ? JSON.parse(tasksString) : [];
    }

    let taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);

        if (isUserLoggedIn) {
            users[currentUser].tasks = tasks;
            await setItem('users', JSON.stringify(users));
        } else {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    updatePlaceholderText();
    closeOpenCard();
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

    updateProgressBar();
    closeOpenCard();
    endEdit();
}

/**
 * This function capitalizes the first letter (for the priority)
 */

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
                <div class="card-modal-date-number">
                    <p id="datePicker"></p>
                </div>
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
                <div class="card-modal-subtasks">
                    ${(data.content.subtasksData || []).map((subtask, index) => `
                        <div class="card-modal-subtask-maincontainer">
                            <div class="card-modal-description-checkbox">
                                <div class="card-modal-subtask-checked"> 
                                    <input type="checkbox" class="subtask-checkbox" id="subtaskCheckbox_${data.id}_${index + 1}" ${subtask.checked ? 'checked' : ''}>                     
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
    //console.log('Task Data:', JSON.stringify(data));
}

async function restoreCheckboxStatus(taskId) {
    let checkboxStatus;

    if (isUserLoggedIn) {
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        let tasks = users[currentUser].tasks;
        let task = tasks.find(task => task.id === taskId);

        if (task && task.content.checkboxStatus) {
            checkboxStatus = task.content.checkboxStatus;
        }
    } else {
        let tasksString = localStorage.getItem('tasks');
        let tasks = tasksString ? JSON.parse(tasksString) : [];
        let task = tasks.find(task => task.id === taskId);

        if (task && task.content.checkboxStatus) {
            checkboxStatus = task.content.checkboxStatus;
        }
    }

    if (checkboxStatus) {
        Object.entries(checkboxStatus).forEach(([index, checked]) => {
            let checkbox = document.querySelector(`#cardModal_${taskId} .subtask-checkbox:nth-child(${parseInt(index) + 1})`);
            if (checkbox) {
                checkbox.checked = checked;
            }
        });
    }
}

document.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox' && event.target.classList.contains('subtask-checkbox')) {
        updateProgressBar(globalData);
    }
});

function enableContentEditing() {
    let titleElement = document.querySelector('.card-modal-title');
    let contentElement = document.querySelector('.card-modal-content');

    contentElement.contentEditable = true;
    titleElement.contentEditable = true;

    let titleContainer = document.createElement('div');
    titleContainer.className = 'title-container-add-task';
    let titleHeadline = document.createElement('div');
    titleHeadline.textContent = 'Title';
    let titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = titleElement.textContent;
    titleContainer.appendChild(titleHeadline);
    titleContainer.appendChild(titleInput);
    titleElement.replaceWith(titleContainer);

    let contentContainer = document.createElement('div');
    contentContainer.className = 'description-container';
    let contentHeadline = document.createElement('div');
    contentHeadline.textContent = 'Description';
    let contentInput = document.createElement('textarea');
    contentInput.type = 'text';
    contentInput.value = contentElement.textContent;
    contentContainer.appendChild(contentHeadline);
    contentContainer.appendChild(contentInput);
    contentElement.replaceWith(contentContainer);

}
/*
function setupDueDateInput() {
    let dueDateText = document.getElementById('dueDateText');
    let dateContainer = document.querySelector('.card-modal-date-number');

    let dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.classList.add('dateInput');

    let existingDate = dueDateText.textContent.replace('Due date: ', '');
    dateInput.value = existingDate;

    dueDateText.innerHTML = '';
    dateContainer.appendChild(dateInput);

    $(dateInput).datepicker({
        dateFormat: 'yy-mm-dd',
        showButtonPanel: true,
    });
}
*/

function setupDueDateInput() {
    let dateElement = document.getElementById('dueDateText');

    let dateContainer = document.createElement('div');
    dateContainer.className = 'due-date-container';
    let dateHeadline = document.createElement('div');
    dateHeadline.textContent = 'Due Date';
    let dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'due-date-input';
    dateInput.required = true;

    // Extract the date from the date element's text content
    let dateText = dateElement.textContent;
    let dateValue = dateText.replace('Due date: ', '');
    dateInput.value = dateValue;

    dateContainer.appendChild(dateHeadline);
    dateContainer.appendChild(dateInput);
    dateElement.replaceWith(dateContainer);

    $(dateInput).datepicker({
        dateFormat: 'yy-mm-dd',
        showButtonPanel: true,
    });
}


function initializeContactDropdownOpenCard() {
    createContactDropdown(() => {
        updateCheckboxState();
    });
}

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

        if (currentEditData) {
            //console.log('Task Data in Edit:', JSON.stringify(currentEditData));
        } else {
            console.error('No data available for editing.');
        }
    }
}

function endEdit() {
    $('.avatar-name').show();
    $('#selectedContactsContainerEdit').css('display', 'block');
    isEditActive = false;

    $('.card-modal-delete-button').removeClass('hide-button');
    $('.card-modal-edit-button').removeClass('hide-button');
    $('.card-modal-save-button').addClass('hide-button');
}

function enablePriorityEditing() {
    let priorityElement = document.querySelector('.card-modal-priority-letter');
    let currentPriority = priorityElement.textContent.toLowerCase();
    let priorityContainer = document.createElement('div');
    priorityContainer.className = 'prio-container';

    let priorityHeadline = document.createElement('div');
    priorityHeadline.className = 'prio';
    priorityHeadline.textContent = 'Priority';
    priorityContainer.appendChild(priorityHeadline);

    let optionContainer = document.createElement('div');
    optionContainer.className = 'prio-option-container';

    let urgentButton = document.createElement('button');
    urgentButton.type = 'button';
    urgentButton.className = 'button urgent';
    urgentButton.innerHTML = '<h3>Urgent</h3><img src="./img/Prio_up.svg" alt="" />';
    urgentButton.onclick = function() { chooseCardModal('urgent'); };

    let mediumButton = document.createElement('button');
    mediumButton.type = 'button';
    mediumButton.className = 'button medium';
    mediumButton.innerHTML = '<h3>Medium</h3><img src="./img/Prio_neutral.svg" alt="" />';
    mediumButton.onclick = function() { chooseCardModal('medium'); };

    let lowButton = document.createElement('button');
    lowButton.type = 'button';
    lowButton.className = 'button low';
    lowButton.innerHTML = '<h3>Low</h3><img src="./img/Prio_down.svg" alt="" />';
    lowButton.onclick = function() { chooseCardModal('low'); };

    optionContainer.appendChild(urgentButton);
    optionContainer.appendChild(mediumButton);
    optionContainer.appendChild(lowButton);

    priorityContainer.appendChild(optionContainer);
    priorityElement.replaceWith(priorityContainer);

    let buttons = priorityContainer.querySelectorAll('.button');
    buttons.forEach(button => {
        if (button.classList.contains(currentPriority)) {
            button.classList.add('active');
            let imgElement = button.querySelector('img');
            switch(currentPriority) {
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
            if (imgElement) {
                imgElement.style.filter = 'brightness(0) invert(1)';
            }
        }
    });

    priorityElement.replaceWith(priorityContainer);
}

function createPriorityOptionsContainer() {
    let priorityOptionsContainer = document.createElement('div');
    priorityOptionsContainer.classList.add('card-modal-priority-options-container');

    priorityOptionsContainer.innerHTML = `
        <button onclick="chooseCardModal('urgent')" class="button urgent">
            <h3>Urgent</h3>
            <img src="./img/Prio_up.svg" alt="" />
        </button>
        <button onclick="chooseCardModal('medium')" class="button medium">
            <h3>Medium</h3>
            <img src="./img/Prio_neutral.svg" alt="" />
        </button>
        <button onclick="chooseCardModal('low')" class="button low">
            <h3>Low</h3>
            <img src="./img/Prio_down.svg" alt="" />
        </button>
    `;

    return priorityOptionsContainer;
}

function addEventListenersToButtons(priorityOptionsContainer) {
    let buttons = priorityOptionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            priorityOptionsContainer.remove();
            isPriorityOptionsOpen = false;
        });
    });
}

function openPriorityOptions(event) {
    if (isPriorityOptionsOpen) {
        return;
    }

    isPriorityOptionsOpen = true;

    let priorityOptionsContainer = createPriorityOptionsContainer();

    let prioritySymbolContainer = event.currentTarget;

    prioritySymbolContainer.style.position = 'relative';
    priorityOptionsContainer.style.position = 'absolute';
    priorityOptionsContainer.style.width = '100%';

    addEventListenersToButtons(priorityOptionsContainer);

    prioritySymbolContainer.appendChild(priorityOptionsContainer);

    function closePriorityOptions(event) {
        if (!priorityOptionsContainer.contains(event.target) && event.target !== prioritySymbolContainer) {
            priorityOptionsContainer.remove();
            document.removeEventListener('click', closePriorityOptions);

            isPriorityOptionsOpen = false;
        }
    }

    document.addEventListener('click', closePriorityOptions);
}

function chooseCardModal(priority) {
    let priorityTextElement = document.querySelector('.card-modal-priority-container .card-modal-priority-letter');
    let prioritySymbolElement = document.querySelector('.card-modal-priority-container .card-modal-priority-symbol img');
    let buttons = document.querySelectorAll('.prio-option-container .button');
    buttons.forEach(button => {
        let imgElement = button.querySelector('img');
        if (button.classList.contains(priority)) {
            button.classList.add('active');
            switch(priority) {
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
            if (imgElement) {
                imgElement.style.filter = 'brightness(0) invert(1)';
            }
        } else {
            button.classList.remove('active');
            button.style.backgroundColor = '';
            if (imgElement) {
                imgElement.style.filter = 'brightness(1) invert(0)';
            }
        }
    });

    let priorityMappings = {
        'urgent': { text: 'Urgent', symbolSrc: './img/Prio_up.svg' },
        'medium': { text: 'Medium', symbolSrc: './img/Prio_neutral.svg' },
        'low': { text: 'Low', symbolSrc: './img/Prio_down.svg' }
    };

    let selectedPriority = priorityMappings[priority] || {};

    if(priorityTextElement && prioritySymbolElement) {
        priorityTextElement.textContent = (selectedPriority.text || '').toUpperCase();
        prioritySymbolElement.src = selectedPriority.symbolSrc || '';
    }

    let priorityOptionsContainer = document.querySelector('.card-modal-priority-options-container');
    if (priorityOptionsContainer) {
        priorityOptionsContainer.remove();
    }
}

function createContactDropdown() {
    let contactDropdownEdit = document.querySelector('.card-modal-assigned-to-headline');

    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    inputContainer.innerHTML = `
        <input id="assignedTo" type="text" class="assigned-dropdown" placeholder="Select contacts to assign">
        <img id="arrow_down" onclick="showDropdownEdit(${currentTaskId})" class="arrow_down" src="./img/arrow_down.svg" alt="">
        <div id="contactDropdown" class="dropdown-content"></div>
        `;

    contactDropdownEdit.appendChild(inputContainer);
    document.getElementById('arrow_down').addEventListener('click', function () {
        showDropdownEdit(currentTaskId);
    });
}

function getTaskById(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.find(task => task.id === taskId);
}

async function showDropdownEdit(currentTaskId) {
    if (!currentTaskId) {
        console.error("currentTaskId is not defined");
        return;
    }

    let dropdownContent = document.getElementById("contactDropdown");
    dropdownContent.innerHTML = "";

    let currentEditData = getTaskById(currentTaskId);

    if (currentEditData && currentEditData.content && currentEditData.content.selectedContacts) {
        selectedInitialsArray = currentEditData.content.selectedContacts;

        let contacts = await getContacts();

        contacts.forEach(contact => {
            let isSelected = selectedInitialsArray.some(selectedContact => selectedContact.id === contact.id);
            let contactDiv = createContactDivEdit(contact, isSelected);
            dropdownContent.appendChild(contactDiv);
        });
        updateCheckboxState(currentTaskId);

        dropdownContent.style.display = 'block';
        console.log('currentTaskId', currentEditData);
    }
}

function createContactDivEdit(contact, isSelected) {
    let contactDiv = document.createElement("div");
    contactDiv.innerHTML = `
        <label class="contacts">
            <div class="contacts-img-initial">
                <img src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
                <div class="initials-overlay">${contact.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
            <div class="dropdown-checkbox">
                <div style="margin-left: 5px;">${contact.name}</div>
                <input type="checkbox" class="contact-checkbox" ${isSelected ? 'checked' : ''}>
            </div>
        </label>
    `;
    contactDiv.addEventListener("mousedown", (event) => {
        event.preventDefault();
        updateSelectedContacts(contact, isSelected ? 'remove' : 'add');
    });
    return contactDiv;
}

function updateSelectedContacts(contact, action) {
    let index = selectedInitialsArray.findIndex(c => c.id === contact.id);

    if (action === 'add' && index === -1) {
        selectedInitialsArray.push(contact);
    } else if (action === 'remove' && index !== -1) {
        selectedInitialsArray.splice(index, 1);
    }
    saveAndDisplaySelectedContactsEdit();
}

function saveAndDisplaySelectedContactsEdit() {
    saveSelectedContacts();
    selectContactEdit();
}

function createSelectedContactDivEdit(contact) {
    if (contact.avatarid !== undefined) {
        let selectedContactDiv = document.createElement("div");
        selectedContactDiv.classList.add("initial-container-open-card");
        selectedContactDiv.id = "selectedContactEdit";
        selectedContactDiv.innerHTML = `
            <div data-avatarid="${contact.avatarid}">
                <div class="avatar">
                    <img src="img/Ellipse5-${contact.avatarid}.svg" alt="Avatar">
                    <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
            </div>
        `;
        return selectedContactDiv;
    }
    return null;
}

function selectContactEdit() {
    let selectedContactsContainer = document.getElementById("selectedContactsContainerEdit");
    selectedContactsContainer.innerHTML = "";
    selectedInitialsArray.forEach(contact => {
        if (contact.avatarid !== undefined) {

            if (!isContactInContainer(contact)) {
                let selectedContactDiv = createSelectedContactDivEdit(contact);

                if (selectedContactDiv !== null) {
                    selectedContactsContainer.appendChild(selectedContactDiv);
                }
            }
        }
    });
}

// Hilfsfunktion zum Überprüfen, ob ein Kontakt bereits im Container vorhanden ist
function isContactInContainer(contact) {
    let selectedContactsContainer = document.getElementById("selectedContactsContainerEdit");
    return selectedContactsContainer.querySelector(`[data-avatarid="${contact.avatarid}"]`) !== null;
}

function updateCheckboxState() {
    selectedInitialsArray = JSON.parse(localStorage.getItem('selectedContacts')) || [];
    console.log('selectedInitialsArray:', selectedInitialsArray);

    contacts.forEach(contact => {
        let contactId = contact.id;
        let checkbox = document.querySelector(`.contact-checkbox[data-contact-id="${contactId}"]`);

        if (checkbox) {
            checkbox.checked = selectedInitialsArray.some(contact => contact.avatarid === contactId);
            console.log(`Contact ${contactId} checkbox state: ${checkbox.checked}`);
        }
    });
}

function removeContactArray(contact) {
    let index = selectedInitialsArray.findIndex(c => c.avatarid === contact.avatarid);
    if (index !== -1) {
        selectedInitialsArray.splice(index, 1);
    }
    let contactDiv = document.querySelector(`#selectedContactsContainerEdit [data-avatarid="${contact.avatarid}"]`);
    if (contactDiv) {
        contactDiv.remove();
    }
    if (contact) {
        let checkbox = document.querySelector(`.contact-checkbox[data-contact-id="${contact.avatarid}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }
    removeContact(contact);
    selectContactCardModal();
    updateDropdownCheckbox(contact.avatarid);
}

function enableSubtasksEditing() {
    let subtaskContainers = document.querySelectorAll('.card-modal-subtask-maincontainer');
    let subtasksContainer = document.querySelector('.card-modal-subtasks-container-headline');

    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container-subtask';
    inputContainer.innerHTML = `
        <input class="subtasks-input" type="text" id="newSubtaskInput" placeholder="Add new subtask" id="subtask">
        <img class="add-icon" src="./img/Subtasks icons11.svg" alt="" onclick="addSubtaskOpenCard()">
        <div class="subImgContainer">
        </div>
    `;

    subtasksContainer.appendChild(inputContainer);

    subtaskContainers.forEach(subtaskContainer => {
        subtaskContainer.addEventListener('mouseover', function () {
            showSubtaskIcons(subtaskContainer);
        });

        subtaskContainer.addEventListener('mouseout', function () {
            hideSubtaskIcons(subtaskContainer);
        });

        subtaskContainer.addEventListener('click', function () {
            editSubtaskDescription(subtaskContainer);
        });

        let deleteIcon = subtaskContainer.querySelector('.subtask-icon-delete img');
        if (deleteIcon) {
            deleteIcon.addEventListener('click', function (event) {
                event.stopPropagation();
                deleteSubtask(subtaskContainer);
            });
        }
    });
}

function showSubtaskIcons(subtaskContainer) {
    let iconsContainer = subtaskContainer.querySelector('.subtasks-edit-icons-container');

    if (iconsContainer) {
        iconsContainer.classList.remove('d-none');
    }
}

function hideSubtaskIcons(subtaskContainer) {
    let iconsContainer = subtaskContainer.querySelector('.subtasks-edit-icons-container');

    if (iconsContainer) {
        iconsContainer.classList.add('d-none');
    }
}

function editSubtaskDescription(element) {
    let subtaskContainer = element.closest('.card-modal-subtask-maincontainer');
    let descriptionElement = subtaskContainer.querySelector('.card-modal-subtask-description');

    descriptionElement.contentEditable = true;
    descriptionElement.focus();
}

function deleteSubtask(subtaskContainer) {
    subtaskContainer.remove();
}

function addSubtaskOpenCard() {
    let inputElement = document.getElementById('newSubtaskInput');
    let subtasksContainer = document.querySelector('.card-modal-subtasks');
    let subtaskText = inputElement.value.trim();
    let taskId = currentTaskId;

    if (subtaskText !== '') {
        let subtaskContainer = document.createElement('div');
        subtaskContainer.className = 'card-modal-subtask-maincontainer';

        let checkboxId = `subtaskCheckbox_${taskId}_${subtasksContainer.children.length + 1}`;

        subtaskContainer.innerHTML = `
            <div class="card-modal-subtask-checked"> 
                <input type="checkbox" class="subtask-checkbox" id="${checkboxId}">                    
            </div>
            <div class="card-modal-subtask-description">${subtaskText}</div>
            <div class="subtasks-edit-icons-container d-none">
                <div class="subtasks-edit-icons-container-p">
                    <p class="subtask-icon-edit"><img src="./img/edit.svg" alt="Edit Subtask"></p>
                    <p class="subtask-icon-edit"><img src="./img/divider.svg" alt="Divider"></p>
                    <p class="subtask-icon-delete"><img src="./img/delete.svg" alt="Delete Subtask"></p>
                </div>
            </div>
        `;

        subtasksContainer.appendChild(subtaskContainer);

        inputElement.value = '';
    }
}