let isPriorityOptionsOpen = false;
let globalData;
let isEditActive = false;
let currentTaskId;
//import { contacts } from './js/add-task.js';

async function initBoard() {
    addSearch();
    await generateDemoTasks();
}

function generateDemoTasksGuest() {
    return [
        {
            content: {
                title: 'Kochwelt Page & Recipe Recommender',
                description: 'Build start page with recipe recommendation...',
                date: '2024-12-31',
                category: 'User Story',
                subtasks: 2,
                subtasksData: [
                    { description: 'Implement Recipe Recommendation', checked: true },
                    { description: 'Start Page Layout', checked: false }
                ],
                selectedContacts: [
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "AM", name: "Anton Mayer" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "EM", name: "Emmanuel Mauer" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "MB", name: "Marcel Bauer" }
                ],
                priority: 'medium',
                boardColumn: 'progress-column',
            },
            id: 'task0',
        },
        {
            content: {
                title: 'HTML Base Template Creation',
                description: 'Create reusable HTML base templates...',
                date: '2024-12-31',
                category: 'Technical task',
                subtasks: 0,
                subtasksData: [],
                selectedContacts: [
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "DE", name: "David Eisenberg" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ", name: "Benedikt Ziegler" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS", name: "Anja Schulz" }
                ],
                priority: 'low',
                boardColumn: 'await-column',
            },
            id: 'task1',
        },
        {
            content: {
                title: 'Daily Kochwelt Recipe',
                description: 'Implement daily recipe and portion calculator....',
                date: '2024-08-05',
                category: 'User Story',
                subtasks: 0,
                subtasksData: [],
                selectedContacts: [
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "EF", name: "Eva Fischer" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS", name: "Anja Schulz" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "TW", name: "Tatjana Wolf" }
                ],
                priority: 'medium',
                boardColumn: 'await-column',
            },
            id: 'task2',
        },
        {
            content: {
                title: 'CSS Architecture Planning',
                description: 'Define CSS naming conventions and structure...',
                date: '2024-12-31',
                category: 'Technical task',
                subtasks: 2,
                subtasksData: [
                    { description: 'Establish CSS Methodology', checked: true },
                    { description: 'Setup Base Styles', checked: true }
                ],
                selectedContacts: [
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "AM", name: "Anton Mayer" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ", name: "Benedikt Ziegler" }
                ],
                priority: 'urgent',
                boardColumn: 'done-column',
            },
            id: 'task3',
        },
    ]
}

async function generateDemoTasks() {
    let isUserLoggedIn = users.some(user => user.isYou);
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // If there are already tasks, do not generate demo tasks
    if (tasks.length > 0) {
        return;
    }

    let demoTasks = generateDemoTasksGuest();

    if (!isUserLoggedIn) {
        // User is a guest, save the tasks to the local storage
        localStorage.setItem('tasks', JSON.stringify(demoTasks));
    }
}

/**
 * search functionality for the tasks in board.html
 */
function addSearch() {
    let searchInput = document.getElementById('input-search');

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

        matchingTasks.forEach(task => renderCard(task));
        updatePlaceholderText();
    });
};

/** open add-task popup
 * 
 * @param {string} column current column id (''todo-column, progress-column, etc.)
 */

function addTask(column) {
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
                            <img src="./img/iconoir_cancel.svg" alt="">
                        </button>

                        <button class="create-task-button-modal" onclick="addToBoard('${column}')">
                            <h3>Create Task</h3>
                            <img src="./img/check.svg" alt="">
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

/*
function choose(priority) {
    let colorMap = { 'urgent': '#FF3D00', 'medium': '#FFA800', 'low': '#7AE229' };
    let setStyles = (elements, styles) => elements.forEach(e => e && Object.assign(e.style, styles));

    setStyles(document.querySelectorAll('.button'), { backgroundColor: '#fff' });
    setStyles(document.querySelectorAll('.button img'), { filter: 'brightness(1) invert(0)' });

    let [priorityButton, priorityImg] = [document.querySelector(`.${priority}`), document.querySelector(`.${priority} img`)];

    if (priorityButton && priorityImg && colorMap[priority]) {
        setStyles([priorityButton], { backgroundColor: colorMap[priority] });
        setStyles([priorityImg], { filter: 'brightness(0) invert(1)' });

        selectedPriority = priority;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    choose('medium');
});
*/

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

    if (cardOverlay) {
        cardOverlay.remove();

        let cardModal = document.getElementById(`cardModal_${taskId}`);
        if (cardModal) {
            cardModal.remove();
            endEdit();
        }
    }
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

function createAvatarDivs(selectedContacts) {
    let avatarDivsHTML = '';

    for (let i = 0; i < selectedContacts.length; i++) {
        let selectedContact = selectedContacts[i];

        avatarDivsHTML += `
            <div class="initial-container">
                <div class="avatar">
                    <img src="${selectedContact.imagePath}">
                    <div class="avatar_initletter">${selectedContact.initials}</div>
                </div>
            </div>`;
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
                ${initialsHTML}
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
    let taskTitle = document.querySelector('.card-modal-title').textContent;
    let description = document.querySelector('.card-modal-content').textContent;
    let date = document.querySelector('.dateInput').value;
    let category = document.querySelector('.task-categorie p').textContent;
    let priority = document.querySelector('.card-modal-priority-letter').textContent.toLowerCase();

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
                            <div class="initial-container-open-card">
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
                <p class="card-modal-subtasks-container-headline">Subtasks</p>
                <div class="card-modal-subtasks">
                    ${(data.content.subtasksData || []).map((subtask, index) => `
                        <div class="card-modal-subtask-maincontainer">
                            <div class="card-modal-subtask-checked"> 
                                <input type="checkbox" class="subtask-checkbox" id="subtaskCheckbox_${data.id}_${index + 1}" ${subtask.checked ? 'checked' : ''}>                     
                            </div>
                            <div class="card-modal-subtask-description">${subtask.description}</div>
                            <div class="subtasks-edit-icons-container d-none">
                                <div class="subtasks-edit-icons-container-p">
                                    <p class="subtask-icon-edit"><img src="./img/edit.svg" alt="Edit Subtask"></p>
                                    <p class="subtask-icon-edit"><img src="./img/divider.svg" alt="Divider"></p>
                                    <p class="subtask-icon-delete"><img src="./img/delete.svg" alt="Delete Subtask"></p>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>

            <div class="card-modal-edit-and-delete-container">
                <button onclick="deleteTask()" data-id="${data.id}" class="card-modal-delete-button">
                    <img src="./img/delete.svg">
                    <p> Delete </p>
                </button>

                <div class="card-modal-devider">
                    <img src="img/Vector 3.svg">
                </div>

                <button onclick="edit()" class="card-modal-edit-button">
                    <img src="./img/edit.svg">
                    <p> Edit </p>
                </button>

                <button onclick="saveEditedTask()" data-id="${data.id}" class="card-modal-save-button">
                    <p> OK </p>
                </button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', openCardHTML);
    updateProgressBar(taskId);
    let cardOverlay = document.getElementById('card-overlay');
    cardOverlay.style.display = 'block';
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

    titleElement.contentEditable = true;
    contentElement.contentEditable = true;

    titleElement.style.border = '1px solid #3498db';
    contentElement.style.border = '1px solid #3498db';
}

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
    }
}

function endEdit() {
    $('.avatar-name').show();
    $('#selectedContactsContainerEdit').css('display', 'block');
    isEditActive = false;
}

function enablePriorityEditing() {
    let priorityContainer = document.querySelector('.card-modal-priority');

    priorityContainer.contentEditable = true;
    priorityContainer.style.border = '1px solid #3498db';
    priorityContainer.addEventListener('click', openPriorityOptions);

    let priorityLetterElement = priorityContainer.querySelector('.card-modal-priority-letter');
    let priorityImgElement = priorityContainer.querySelector('.card-modal-priority-symbol img');
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
    let priorityTextElement = document.querySelector('.card-modal-priority .card-modal-priority-letter');
    let prioritySymbolElement = document.querySelector('.card-modal-priority-symbol img');

    let priorityMappings = {
        'urgent': { text: 'Urgent', symbolSrc: './img/Prio_up.svg' },
        'medium': { text: 'Medium', symbolSrc: './img/Prio_neutral.svg' },
        'low': { text: 'Low', symbolSrc: './img/Prio_down.svg' }
    };

    let selectedPriority = priorityMappings[priority] || {};

    priorityTextElement.textContent = (selectedPriority.text || '').toUpperCase();
    prioritySymbolElement.src = selectedPriority.symbolSrc || '';

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
        <img id="arrow_down" onclick="showDropdownEdit()" class="arrow_down" src="./img/arrow_down.svg" alt="">
        <div id="contactDropdown" class="dropdown-content"></div>
        `;

    contactDropdownEdit.appendChild(inputContainer);
    document.getElementById('arrow_down').addEventListener('click', showDropdownEdit);
}

async function showDropdownEdit() {
    let dropdownContent = document.getElementById("contactDropdown");
    dropdownContent.innerHTML = "";

    let contacts = await getContacts();

    contacts.forEach(contact => {
        let isSelected = selectedInitialsArray.some(selectedContact => selectedContact.id === contact.id);
        let contactDiv = createContactDivEdit(contact, isSelected);
        dropdownContent.appendChild(contactDiv);
    });

        updateCheckboxState();

    dropdownContent.style.display = 'block';
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

function selectContactEdit() {
    let selectedContactsContainer = document.getElementById("selectedContactsContainerEdit");

    selectedContactsContainer.innerHTML = "";

    selectedInitialsArray.forEach(contact => {
        if (!document.querySelector(`#selectedContactsContainerEdit [data-avatarid="${contact.avatarid}"]`)) {
            let selectedContactDiv = createSelectedContactDivEdit(contact);
            selectedContactsContainer.appendChild(selectedContactDiv);
        }
    });
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