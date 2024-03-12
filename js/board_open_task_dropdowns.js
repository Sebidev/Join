/**
 * This function creates a dropdown for the contacts in the edit modal
 */
function createContactDropdown(taskId) {
    let contactDropdownEdit = document.querySelector('.card-modal-assigned-to-headline');

    let inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    inputContainer.innerHTML = `
        <input id="assignedToEdit" type="text" class="assigned-dropdown" placeholder="Select contacts to assign">
            <img id="arrow_down_edit" onclick="showDropdownEdit('${currentTaskId}')" class="arrow_down_edit" src="img/arrow_down.svg" alt="">
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
    checkboxImg && (checkboxImg.src = isSelected ? 'img/checked_white.svg' : 'img/unchecked.svg');

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
 * Sets up the due date input for the add task modal and fills it with the current task data.
 * 
 * @function
 * @name setupDueDateInputAddTaskModal
 * @returns {void}
 */
function setupDueDateInputEdit() {
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

    createPriorityButton(optionContainer, 'Urgent', 'urgent', 'img/Prio_up.svg');
    createPriorityButton(optionContainer, 'Medium', 'medium', 'img/Prio_neutral.svg');
    createPriorityButton(optionContainer, 'Low', 'low', 'img/Prio_down.svg');

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

    let optionsContainer = document.querySelector('.card-modal-priority-options-container');
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
        'urgent': { text: 'Urgent', symbolSrc: 'img/Prio_up.svg' },
        'medium': { text: 'Medium', symbolSrc: 'img/Prio_neutral.svg' },
        'low': { text: 'Low', symbolSrc: 'img/Prio_down.svg' }
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