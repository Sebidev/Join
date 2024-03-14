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
        $('.card-modal-subtasks-container').css('display', 'unset');

        if (currentEditData) {
            addContactsToSelectedContacts(currentEditData);
        } else {
            console.error('No data available for editing.');
        }
    }
    clearSelectedContacts();
}

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
 * Replaces the given element with an input field inside a container.
 * @param {HTMLElement} element - The element to replace.
 * @param {string} containerClass - The class for the container.
 * @param {string} inputType - The type of input field ('input' or 'textarea').
 */
let replaceElementWithInput = (element, containerClass, inputType) => {
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

    dateContainer.appendChild(dateHeadline);
    dateContainer.appendChild(dateInput);
    dateElement.replaceWith(dateContainer);

    dateInputStyle(dateInput);
    setupDatepicker(dateInput);
    setupInputLengthValidation(dateInput);
    setupDateInputFormatting(dateInput);
}

/**
 * Applies styling to the date input.
 * 
 * @param {HTMLInputElement} dateInput - The date input element.
 * @returns {void}
 */
function dateInputStyle(dateInput) {
    dateInput.style.backgroundImage = 'url("img/calendar.svg")';
    dateInput.style.backgroundRepeat = 'no-repeat';
    dateInput.style.backgroundPosition = 'right center';
    dateInput.style.backgroundSize = '24px';
}

/**
 * Sets up the datepicker for the date input.
 * 
 * @param {HTMLInputElement} dateInput - The date input element.
 * @returns {void}
 */
function setupDatepicker(dateInput) {
    $(dateInput).datepicker({
        dateFormat: 'yy-mm-dd',
        showButtonPanel: true,
        minDate: new Date()
    });
}

/**
 * Sets up validation for the length of the date input.
 * 
 * @param {HTMLInputElement} dateInput - The date input element.
 * @returns {void}
 */
function setupInputLengthValidation(dateInput) {
    dateInput.addEventListener('input', function(event) {
        let inputValue = event.target.value;
        if (inputValue.length === 10) {
            event.target.blur();
        }
    });
}

/**
 * Sets up formatting for the date input.
 * 
 * @param {HTMLInputElement} dateInput - The date input element.
 * @returns {void}
 */
function setupDateInputFormatting(dateInput) {
    dateInput.addEventListener('input', function(event) {
        let inputValue = event.target.value;
        if (inputValue.length === 2 || inputValue.length === 5) {
            event.target.value += '/';
        }
    });

    dateInput.addEventListener('input', function(event) {
        let inputValue = event.target.value.replace(/\//g, '');
        let day = inputValue.slice(0, 2);
        let month = inputValue.slice(2, 4);
        let year = inputValue.slice(4, 8);

        let formattedValue = formatDateStringModal(day, month, year);

        if (formattedValue !== event.target.value) {
            event.target.value = formattedValue;
        }

        handleInvalidDayModal(event, day, month, year);
        handleInvalidMonthModal(event, day, month, year);
        handleInvalidYearModal(event, day, month, year);
    });
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
 * This function sets up the due date input for the edit modal and fills it with the current task data
 */
function initializeContactDropdownOpenCard() {
    createContactDropdown(() => {
        updateCheckboxState();
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

        let deleteIcon = subtaskContainer.querySelector('.subtask-icon-delete img');
        deleteIcon && deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteSubtask(subtaskContainer);
        });
    });
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
 * Creates the input container for adding new subtasks.
 *
 * @returns {HTMLDivElement} The created input container.
 */
function createSubtasksInputContainer() {
    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container-subtask';
    inputContainer.innerHTML = `
        <input class="subtasks-input" type="text" id="newSubtaskInputEdit" placeholder="Add new subtask" id="subtask">
        <div id="iconContainerEdit">
        <img class="add-icon" src="img/Subtasks icons11.svg" alt="" />
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
    let inputElement = document.getElementById('newSubtaskInputEdit');
    let subtasksContainer = document.querySelector('.card-modal-subtasks');
    let subtaskText = inputElement.value.trim();
    let taskId = currentTaskId;

    if (subtaskText !== '') {
        let subtaskContainer = createSubtaskContainer(taskId, subtasksContainer.children.length + 1, subtaskText);

        subtasksContainer.appendChild(subtaskContainer);

        subtaskContainer.addEventListener('mouseover', () => showSubtaskIcons(subtaskContainer));
        subtaskContainer.addEventListener('mouseout', () => hideSubtaskIcons(subtaskContainer));
        subtaskContainer.addEventListener('click', () => editSubtaskDescription(subtaskContainer));

        let deleteIcon = subtaskContainer.querySelector('.subtask-icon-delete img');
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
    let subtaskContainer = document.createElement('div');
    subtaskContainer.className = 'card-modal-subtask-maincontainer';

    let checkboxId = `subtaskCheckbox_${taskId}_${subtaskIndex}`;

    subtaskContainer.innerHTML = `
        <div class="card-modal-description-checkbox">
            <div class="card-modal-subtask-checked"> 
                <input type="checkbox" class="subtask-checkbox" id="${checkboxId}" style="display: none;"> 
                <img src="img/circle.svg" class="subtask-image">                   
            </div>
            <div class="card-modal-subtask-description">${subtaskText}</div>
        </div>
        <div class="subtasks-edit-icons-container d-none">
            <div class="subtasks-edit-icons-container-p">
                <p class="subtask-icon-edit"><img src="img/edit.svg" alt="Edit Subtask"></p>
                <p class="subtask-icon-delete"><img src="img/delete.svg" alt="Delete Subtask"></p>
            </div>
        </div>
    `;

    return subtaskContainer;
}

/**
 * Returns the path to the appropriate priority icon based on the given priority level.
 * @param {string} priority - The priority level.
 */
function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return 'img/Prio_up.svg';
        case 'medium':
            return 'img/Prio_neutral.svg';
        case 'low':
            return 'img/Prio_down.svg';
        default:
            return '';
    }
}