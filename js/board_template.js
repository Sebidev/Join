let isPriorityOptionsOpen = false;
//import { contacts } from './js/add-task.js';

function addTask() {
    let modalHTML = `
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
                            <button type="button" onclick="choose('urgent')" class="button urgent">
                                <h3>Urgent</h3>
                                <img src="./img/Prio_up.svg" alt="">
                            </button>
                            <button type="button" onclick="choose('medium')" class="button medium">
                                <h3>Medium</h3>
                                <img src="./img/Prio_neutral.svg" alt="">
                            </button>
                            <button type="button" onclick="choose('low')" class="button low">
                                <h3>Low</h3>
                            <img src="./img/Prio_down.svg" alt="">
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

                        <button class="create-task-button-modal" onclick="addToBoard()">
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
}

function getValue(selector) {
    let element = document.querySelector(selector);
    return element ? element.value : '';
}

async function checkAndRenderSharedData() {
    let tasks;

    if (isUserLoggedIn) {
        // User is logged in, get the tasks from the remote storage
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        tasks = users[currentUser].tasks;
    } else {
        // User is a guest, get the tasks from the local storage
        let tasksString = localStorage.getItem('tasks');
        tasks = tasksString ? JSON.parse(tasksString) : [];
    }

    for (let task of tasks) {
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
        let selectedPriority = data.content.priority;
        let selectedContacts = data.content.selectedContacts || [];
        let initialsHTML = createAvatarDivs(selectedContacts);
        let priorityIconSrc = getPriorityIcon(selectedPriority);

        let renderCard = document.createElement('div');
        renderCard.id = data.id;
        renderCard.className = 'card-user-story';
        renderCard.onclick = () => openCard(data);

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
                <div class="progress-bar"></div>
                <div class="subtasks">0/${createdSubtasks} Subtasks</div>
            </div>
            <div class="to-do-bottom">
                ${initialsHTML}
                <div class="priority-symbol">
                    <img src="${priorityIconSrc}" alt="">
                </div>
            </div>
        `;

        containerDiv.appendChild(renderCard);
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

function openCard(data) {
    let openCardHTML = /*html*/`
    <div id="card-overlay"></div>
    <div id="cardModal" class="card-modal">
            <div class="task-categorie">
                <p class="card-modal-task">${data.content.category}</p>
                <div class="close-card-modal" onclick="closeOpenCard()">
                    <img src="./img/close_modal.svg" alt="">
                </div>
            </div>

            <div class="card-modal-title-container">
                <p class="card-modal-title">${data.content.title}</p>
            </div>
            <p class="card-modal-content">${data.content.description}</p>

            <div class="card-modal-date">
                <p class="due-date-card-modal">${data.content.date}</p>
                <div class="card-modal-date-number">
                    <p id="datePicker">10/05/2023</p>
                </div>
            </div>

            <div class="card-modal-priority">
                <p class="card-modal-priority-letter">Priority:</p>
                <h3> Medium </h3>
                <div class="card-modal-priority-symbol">
                    <img src="./img/Prio_neutral.svg" alt="">
                </div>
            </div>

            <div class="card-modal-contacts">
                <p class="card-modal-assigned-to-headline">Assigned to:</p>
                <div class="card-modal-contacts-container">
                    <div id="cardModalInitialContainer" class="card-modal-initial-container">
                        <div class="card-modal-contact" data-contact-id="1">
                            <div class="card-modal-contact-and-image">
                                <img src="./img/Ellipse5-1.svg" alt="">
                                <p class="card-modal-name">Emmanuel Mauer</p>
                                <span class="remove-contact" onclick="removeContact(1)"></span>
                            </div>
                        </div>
                        <div class="card-modal-contact" data-contact-id="2">
                            <div class="card-modal-contact-and-image">
                                <img src="./img/Ellipse5-2.svg" alt="">
                                <p class="card-modal-name">Marcel Bauer</p>
                                <span class="remove-contact" onclick="removeContact(2)"></span>
                            </div>
                        </div>
                        <div class="card-modal-contact" data-contact-id="3">
                            <div class="card-modal-contact-and-image">
                                <img src="./img/Ellipse5-2.svg" alt="">
                                <p class="card-modal-name">Anton Meyer</p>
                                <span class="remove-contact" onclick="removeContact(3)"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-modal-subtasks-container">
                <p class="card-modal-subtasks-container-headline">Subtasks</p>
                <div class="card-modal-subtasks">
                    <div class="card-modal-subtask-maincontainer">
                        <div class="card-modal-subtask-checked">
                            <img src="./img/check_button_checked.svg">
                        </div>
                        <div class="card-modal-subtask-description">Implement Recipe Recommendation</div>
                    </div>

                    <div class="card-modal-subtask-maincontainer">
                        <div class="card-modal-subtask">
                            <img src="./img/check button.svg">
                        </div>
                        <div class="card-modal-subtask-description">Start Page Layout</div>
                    </div>  
                </div>
            </div>

            <div class="card-modal-edit-and-delete-container">
                <button onclick="delete()" class="card-modal-delete-button">
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

    let cardOverlay = document.getElementById('card-overlay');
    cardOverlay.style.display = 'block';
}

function edit() {
    let titleElement = document.querySelector('.card-modal-title');
    let contentElement = document.querySelector('.card-modal-content');
    let dateContainer = document.querySelector('.card-modal-date-number');
    let priorityContainer = document.querySelector('.card-modal-priority');

    titleElement.contentEditable = true;
    contentElement.contentEditable = true;

    titleElement.style.border = '1px solid #3498db';
    contentElement.style.border = '1px solid #3498db';

    let dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.classList.add('dateInput');
    dateInput.value = dateContainer.querySelector('p').textContent;
    dateContainer.innerHTML = '';
    dateContainer.appendChild(dateInput);

    priorityContainer.contentEditable = true;
    priorityContainer.style.border = '1px solid #3498db';
    priorityContainer.addEventListener('click', openPriorityOptions);

    let priorityImgElement = document.querySelector('.card-modal-priority-symbol img');
    let priorityh3Element = document.querySelector('.card-modal-priority h3');
    priorityImgElement.addEventListener('click', openPriorityOptions);
    priorityh3Element.addEventListener('click', openPriorityOptions);

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

    createContactDropdown(() => {
        updateCheckboxState();
    });
}

function openPriorityOptions(event) {
    if (isPriorityOptionsOpen) {
        return;
    }

    isPriorityOptionsOpen = true;

    let priorityOptionsContainer = document.createElement('div');
    priorityOptionsContainer.classList.add('card-modal-priority-options-container');

    priorityOptionsContainer.innerHTML = `
        <button onclick="chooseCardModal('urgent')" class="button urgent">
            <h3>Urgent</h3>
            <img src="./img/Prio_up.svg" alt="" />
        </button>
        <button onclick="choose('medium')" class="button medium">
            <h3>Medium</h3>
            <img src="./img/Prio_neutral.svg" alt="" />
        </button>
        <button onclick="choose('low')" class="button low">
            <h3>Low</h3>
            <img src="./img/Prio_down.svg" alt="" />
        </button>
    `;

    let prioritySymbolContainer = event.currentTarget;

    prioritySymbolContainer.style.position = 'relative';
    priorityOptionsContainer.style.position = 'absolute';
    priorityOptionsContainer.style.width = '100%';

    let buttons = priorityOptionsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            priorityOptionsContainer.remove();
            isPriorityOptionsOpen = false;
        });
    });

    prioritySymbolContainer.appendChild(priorityOptionsContainer);

    document.addEventListener('click', function closePriorityOptions(event) {
        if (!priorityOptionsContainer.contains(event.target) && event.target !== prioritySymbolContainer) {
            priorityOptionsContainer.remove();
            document.removeEventListener('click', closePriorityOptions);

            isPriorityOptionsOpen = false;
        }
    });
}

function chooseCardModal(priority) {
    let priorityTextElement = document.querySelector('.card-modal-priority h3');
    let prioritySymbolElement = document.querySelector('.card-modal-priority-symbol img');

    switch (priority) {
        case 'urgent':
            priorityTextElement.textContent = 'Urgent';
            prioritySymbolElement.src = './img/Prio_up.svg';
            break;
        case 'medium':
            priorityTextElement.textContent = 'Medium';
            prioritySymbolElement.src = './img/Prio_neutral.svg';
            break;
        case 'low':
            priorityTextElement.textContent = 'Low';
            prioritySymbolElement.src = './img/Prio_down.svg';
            break;
        default:
            break;
    }

    let priorityOptionsContainer = document.querySelector('.priority-options-container');
    if (priorityOptionsContainer) {
        priorityOptionsContainer.remove();
    }
}

function removeContact(contactId) {
    let contact = document.querySelector(`.card-modal-contact[data-contact-id="${contactId}"]`);
    if (contact) {
        contact.remove();
    }
}

function createContactDropdown(callback) {
    let assignedToContainer = document.querySelector('.card-modal-assigned-to-headline');
    let cardContactsContainer = document.querySelector('.card-modal-contacts');

    let dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('contact-dropdown-menu');
    dropdownMenu.id = 'openCardContactDropdown';
    dropdownMenu.style.width = `${cardContactsContainer.offsetWidth}px`;

    if (window.contacts) {
        contacts.forEach(contact => {
            let isSelected = selectedInitialsArray.includes(contact.initial);

            let contactCardModal = document.createElement("div");
            contactCardModal.innerHTML = `
                <label class="contacts">
                    <div class="contacts-img-initial">
                        <img src="${contact.imagePath}" alt="${contact.name}">
                        <div class="initials-overlay">${contact.initial}</div>
                    </div>
                    <div class="dropdown-checkbox">
                        <div style="margin-left: 5px;">${contact.name}</div>
                        <input type="checkbox" class="contact-checkbox" ${isSelected ? 'checked' : ''} data-contact-id="${contact.id}">
                    </div>
                </label>
            `;

            let labelElement = contactCardModal.querySelector('.contacts');
            let inputElement = contactCardModal.querySelector('.contact-checkbox');

            labelElement.addEventListener("click", (event) => {
                toggleContactSelectionCardModal(contact, inputElement);
            });

            inputElement.addEventListener("click", (event) => {
                toggleContactSelectionCardModal(contact, inputElement);
            });

            dropdownMenu.appendChild(contactCardModal);
        });
    }

    let arrowIcon = document.createElement('span');
    arrowIcon.classList.add('arrow-down-icon');
    arrowIcon.innerHTML = '&#9660';

    dropdownMenu.style.display = 'none';

    arrowIcon.addEventListener('click', function () {
        dropdownMenu.style.display = (dropdownMenu.style.display === 'none') ? 'block' : 'none';
    });

    assignedToContainer.appendChild(arrowIcon);
    assignedToContainer.appendChild(dropdownMenu);

    callback();
}

function assignContact(contact) {
    let assignedToContainer = document.querySelector('.card-modal-contacts-container');

    let contactDiv = document.createElement("div");
    contactDiv.classList.add('card-modal-contact');
    contactDiv.dataset.contactId = contact.id;

    contactDiv.innerHTML = `
        <div class="card-modal-contact-and-image">
            <img src="${contact.imagePath}" alt="${contact.name}">
            <p class="card-modal-name">${contact.name}</p>
        </div>
    `;

    assignedToContainer.appendChild(contactDiv);
}

function toggleContactSelectionCardModal(contact, checkbox) {
    let isSelected = checkbox.checked;

    if (isSelected && !selectedInitialsArray.includes(contact.initial)) {
        selectedInitialsArray.push(contact.initial);
    } else if (!isSelected) {
        let index = selectedInitialsArray.indexOf(contact.initial);
        if (index !== -1) {
            selectedInitialsArray.splice(index, 1);
        }
    }

    if (contact && contact.id) {
        updateDropdownCheckbox(contact.id);
    }

    selectContactCardModal(contact);
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

    console.log("Updating checkbox state...");
}

function selectContactCardModal(contact) {
    console.log("Selected Contacts:", selectedInitialsArray);

    let selectedContactsContainer = document.getElementById("cardModalInitialContainer");
    selectedContactsContainer.innerHTML = "";

    selectedInitialsArray.forEach(initial => {
        let selectedContact = contacts.find(c => c.initial === initial);
        if (selectedContact) {
            let selectedContactDiv = document.createElement("div");
            selectedContactDiv.innerHTML = `
            <div class="selected-contact">
                <div class="contacts-img-initial">
                    <img src="${selectedContact.imagePath}" alt="${selectedContact.name}">
                    <div class="initials-overlay">${selectedContact.initial}</div>
                </div>
                <span>${selectedContact.name} (${initial})</span>
                <button class="card-modal-delete-button-contact">
                    <img src="./img/delete.svg" alt="Delete">
                </button>
            </div>
            `;

            selectedContactDiv.querySelector(".card-modal-delete-button-contact").addEventListener("click", () => {
                removeContactArray(selectedContact);
            });

            selectedContactDiv.addEventListener("click", (event) => {
                if (!event.target.matches('.selected-contact, img, span, .initials-overlay')) {
                    toggleContactSelectionCardModal(selectedContact, event);
                }
            });
            selectedContactsContainer.appendChild(selectedContactDiv);
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