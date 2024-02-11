let isPriorityOptionsOpen = false;
let globalData;
let isEditActive = false;
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
                subtasksData: ['Subtask 1', 'Subtask 2'],
                selectedContacts: [
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "AM" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "EM" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "MB" }
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
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "DE" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS" }
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
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "EF" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "TW" }
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
                subtasksData: ['Subtask 1', 'Subtask 2'],
                selectedContacts: [
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "SM" },
                    { imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ" }
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
                            <input id="category" class="category-dropdown" type="text" placeholder="Select contacts to assign">
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
                            <input class="subtasks-input" type="text" id="newSubtaskInput" placeholder="Add new subtask"id="subtask">
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

    modal.remove();
    overlay.remove();
}

function closeOpenCard() {
    let cardOverlay = document.getElementById('card-overlay');
    let cardModal = document.getElementById('cardModal');

    cardOverlay.remove();
    cardModal.remove();

    endEdit();
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

function renderCard(data) {
    if (data && data.content) {
        let containerDiv = document.getElementById(data.content.boardColumn);
        let categoryClass = data.content.category === 'Technical task' ? 'technical-task' : 'user-story';
        let createdSubtasks = data.content.subtasks;
        let subtasksData = data.content.subtasksData || [];
        let selectedPriority = data.content.priority;
        let selectedContacts = data.content.selectedContacts || [];
        let initialsHTML = createAvatarDivs(selectedContacts);
        let priorityIconSrc = getPriorityIcon(selectedPriority);

        let renderCard = document.createElement('div');
        renderCard.id = data.id;
        renderCard.className = 'card-user-story';
        renderCard.onclick = () => openCard(data, subtasksData);

        renderCard.draggable = true;
        renderCard.ondragstart = (event) => startDragging(event);
        renderCard.ondragend = (event) => endDragging(event);
        renderCard.ondragover = (event) => preventDragOver(event);

        renderCard.innerHTML = `
            <p class="${categoryClass}">${data.content.category}</p>
            <div class="title-container">
                <p class="card-title">${data.content.title}</p>
                <p class="card-content">${data.content.description}</p>
            </div>
            <p style="display: none">${data.content.date}</p>
            <div class="progress">
                <div class="progress-bar" id="progressBar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="subtasks">0/${createdSubtasks} Subtasks</div>
            </div>
            <div class="to-do-bottom">
                ${initialsHTML}
                <div class="priority-symbol">
                    <img src="${priorityIconSrc}" alt="">
                </div>
            </div>
        `;
        globalData = data;
        containerDiv.appendChild(renderCard);
    }
}

function updateProgressBar() {
    let totalSubtasks = document.querySelectorAll('.subtask-checkbox').length;
    let checkedSubtasks = document.querySelectorAll('.subtask-checkbox:checked').length;
    let progressFill = document.getElementById('progressFill');
    let percentage = (checkedSubtasks / totalSubtasks) * 100;

    progressFill.style.width = `${percentage}%`;

    saveCheckboxStatus();

    let subtasksInfo = document.querySelector('.subtasks');
    subtasksInfo.textContent = `${checkedSubtasks}/${totalSubtasks} Subtasks`;
}


function saveCheckboxStatus() {
    let checkboxStatus = {};
    document.querySelectorAll('.subtask-checkbox').forEach((checkbox, index) => {
        checkboxStatus[index] = checkbox.checked;
    });
    localStorage.setItem('checkboxStatus', JSON.stringify(checkboxStatus));
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

function openCard(data, subtasksData) {
    let selectedPriority = data.content.priority;
    let priorityIconSrc = getPriorityIcon(selectedPriority);
    let categoryClass = data.content.category === 'Technical task' ? 'card-modal-technical' : 'card-modal-userstory';

    let openCardHTML = /*html*/`
    <div id="card-overlay"></div>
    <div id="cardModal" class="card-modal">
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
                <p>Priority: <span class="card-modal-priority-letter">${data.content.priority}</span></p>
                <div class="card-modal-priority-symbol">
                    <img src="${priorityIconSrc}" alt="">
                </div>
            </div>

            <div class="card-modal-contacts">
                <p class="card-modal-assigned-to-headline">Assigned to:</p>
                <div class="card-modal-contacts-container">
                    <div id="selectedContactsContainer" class="card-modal-initial-container">
                        
                    </div>
                </div>
            </div>

            <div class="card-modal-subtasks-container">
                <p class="card-modal-subtasks-container-headline">Subtasks</p>
                <div class="card-modal-subtasks">
                ${(data.content.subtasksData || []).map(subtask => `
                <div class="card-modal-subtask-maincontainer">
                    <div class="card-modal-subtask-checked"> 
                    <input type="checkbox" class="subtask-checkbox">                    
                    </div>
                    <div class="card-modal-subtask-description">${subtask}</div>
                        <div class="subtasks-edit-icons-container">
                            <div class="subtasks-edit-icons-container-p">
                                <p class="subtask-icon-edit"><img src="./img/edit.svg" alt="Edit Subtask"></p>
                                <p class="subtask-icon-edit"><img src="./img/divider.svg" alt="Divider"></p>
                                <p class="subtask-icon-edit"><img src="./img/delete.svg" alt="Delete Subtask"></p>
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

            </div>
            
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', openCardHTML);

    updateProgressBar(globalData);
    let cardOverlay = document.getElementById('card-overlay');
    cardOverlay.style.display = 'block';

    restoreCheckboxStatus();
}

function restoreCheckboxStatus() {

    let checkboxStatus = JSON.parse(localStorage.getItem('checkboxStatus')) || {};

    document.querySelectorAll('.subtask-checkbox').forEach((checkbox, index) => {
        checkbox.checked = checkboxStatus[index] || false;
    });
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
        showButtonPanel: true
    });
}

function addRemoveButtonsToContacts() {
    let contacts = document.querySelectorAll('.card-modal-contact');
    contacts.forEach(contact => {
        let removeButton = document.createElement('span');
        removeButton.classList.add('remove-contact');
        removeButton.textContent = 'X';
        removeButton.onclick = function () {
            removeContact(contact.dataset.contactId);
        };

        contact.querySelector('.card-modal-contact-and-image').appendChild(removeButton);
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
        addRemoveButtonsToContacts();
        initializeContactDropdownOpenCard();
        enableSubtasksEditing();
        isEditActive = true;
    }
}

function endEdit() {
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

async function createContactDropdown() {
    let assignedToContainer = document.querySelector('.card-modal-assigned-to-headline');
    let cardContactsContainer = document.querySelector('.card-modal-contacts');
    let contacts = await getContacts();

    let dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('contact-dropdown-menu');
    dropdownMenu.id = 'openCardContactDropdown';
    dropdownMenu.style.width = `${cardContactsContainer.offsetWidth}px`;

    contacts.forEach(contact => {
        let isSelected = selectedInitialsArray.includes(contact.initial);

        let contactDiv = createContactDiv(contact, isSelected);

        dropdownMenu.appendChild(contactDiv);
    });

    let arrowIcon = document.createElement('span');
    arrowIcon.classList.add('arrow-down-icon');
    arrowIcon.innerHTML = '&#9660';

    arrowIcon.addEventListener('click', function () {
        dropdownMenu.style.display = (dropdownMenu.style.display === 'none') ? 'block' : 'none';
    });

    document.addEventListener('click', function (event) {
        if (!dropdownMenu.contains(event.target) && event.target !== arrowIcon) {
            dropdownMenu.style.display = 'none';
        }
    });

    dropdownMenu.style.display = 'none';

    assignedToContainer.appendChild(arrowIcon);
    assignedToContainer.appendChild(dropdownMenu);
}

function updateDropdownCheckbox(contactId) {
    let checkbox = document.querySelector(`.contact-checkbox[data-contact-id="${contactId}"]`);
    if (checkbox) {
        checkbox.checked = selectedInitialsArray.includes(contactId);
    }
}

function updateCheckboxState() {
    contacts.forEach(contact => {
        let contactId = contact.id;
        let checkbox = document.querySelector(`.contact-checkbox[data-contact-id="${contactId}"]`);

        if (checkbox) {
            checkbox.checked = selectedInitialsArray.includes(contactId);
        }
    });
}

function removeContactArray(contact) {
    let index = selectedInitialsArray.indexOf(contact.initial);
    if (index !== -1) {
        selectedInitialsArray.splice(index, 1);
    }

    if (contact) {
        let checkbox = document.querySelector(`.contact-checkbox[data-contact-id="${contact.initial}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }

    removeContact(contact);
    selectContactCardModal();
    updateDropdownCheckbox(contact);
}

function enableSubtasksEditing() {
    let subtaskContainers = document.querySelectorAll('.card-modal-subtask-maincontainer');

    subtaskContainers.forEach(subtaskContainer => {
        subtaskContainer.addEventListener('mouseover', function () {
            showSubtaskIcons(subtaskContainer);
        });

        subtaskContainer.addEventListener('mouseout', function () {
            hideSubtaskIcons(subtaskContainer);
        });
    });
}

function showSubtaskIcons(subtaskContainer) {
    if (!subtaskContainer.querySelector('.subtask-icons-container')) {
        let iconsContainer = createSubtaskIconsContainer();
        subtaskContainer.appendChild(iconsContainer);
    }
}

function hideSubtaskIcons(subtaskContainer) {
    let iconsContainer = subtaskContainer.querySelector('.subtask-edit-icons-container');

    if (iconsContainer) {
        iconsContainer.remove();
    }
}

function createSubtaskIconsContainer() {
    let iconsContainer = document.createElement('div');
    iconsContainer.classList.add('subtask-edit-icons-container');

    iconsContainer.innerHTML = `
    <div class="subtasks-edit-icons-container">
        <p class="subtask-icon-edit"><img src="./img/edit.svg" alt="Edit Subtask"></p>
        <p class="subtask-icon-edit"><img src="./img/divider.svg" alt="Divider"></p>
        <p class="subtask-icon-edit"><img src="./img/delete.svg" alt="Delete Subtask"></p>
    </div>
    `;

    return iconsContainer;
}