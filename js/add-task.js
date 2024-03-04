/**
 * This file contains the JavaScript code for the 'Add Task' page.
 * @file add-task.js 
 */

let containerCount = 0;
let selectedInitialsArray = [];
let selectedPriority;
let isDropdownOpen = false;
let isCategoryDropdownOpen = false;

/**
 * Toggles the visibility of a dropdown menu for selecting contacts.
 * This function is specifically designed for handling the arrow icon toggle
 * and dropdown display for contact selection.
 *
 * @function
 * @name toggleArrowContacts
 *
 * @example
 * // HTML structure
 * // <img id="arrow_img_contacts" class="arrow_down" src="./img/arrow_down.svg" onclick="toggleArrowContacts()" alt="" />
 * // <div id="contactDropdown" class="dropdown-content"></div>
 *
 * // JavaScript usage
 * toggleArrowContacts();
 *
 * @returns {void}
 */
function toggleArrowContacts() {
    let arrowImg = document.getElementById('arrow_img_contacts');
    let dropdownContent = document.getElementById("contactDropdown");

    arrowImg.classList.toggle('arrow_up');
    arrowImg.src = arrowImg.classList.contains('arrow_up') ? 'img/arrow_up.svg' : 'img/arrow_down.svg';

    if (arrowImg.classList.contains('arrow_up')) {
        showDropdown();
    } else {
        dropdownContent.style.display = 'none';
        isDropdownOpen = false;
    }
}

/**
 * This function asynchronously displays a dropdown menu with contacts.
 * The function first clears the dropdown content, then fetches the contacts using the `getContacts` function.
 * For each contact, it checks if the contact is selected by comparing its ID with the IDs in the `selectedInitialsArray`.
 * It then creates a div for the contact using the `createContactDiv` function and appends it to the dropdown content.
 * Finally, it makes the dropdown content visible by setting its display style to 'block'.
 *
 * @returns {Promise<void>} A Promise that resolves when the dropdown has been displayed.
 */
async function showDropdown() {
    let dropdownContent = document.getElementById("contactDropdown");
    dropdownContent.innerHTML = "";

    let contacts = await getContacts();

    contacts.forEach(contact => {
        let isSelected = selectedInitialsArray.some(selectedContact => selectedContact.id === contact.id);
        let contactDiv = createContactDiv(contact, isSelected);
        dropdownContent.appendChild(contactDiv);
    });

    dropdownContent.style.display = 'block';
    isDropdownOpen = true;
}

/**
 * Event listener for click events on the document.
 * If the clicked element has the class 'arrow_down', the dropdown is shown by calling `showDropdown`.
 *
 * @param {Event} event - The click event.
 */

document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('contactDropdown');
    let arrowImg = document.getElementById('arrow_img_contacts');
    let assignedToInput = document.getElementById('assignedTo');

    if (dropdown) {
        let isArrowClick = event.target.matches('.arrow_down, .arrow_up');
        let isAssignedToClick = event.target.id === 'assignedTo';

        if ((!isArrowClick && !isAssignedToClick) || !event.target.closest('.assigned-to-container')) {
            dropdown.style.display = 'none';
            isDropdownOpen = false;
            arrowImg?.setAttribute('src', 'img/arrow_down.svg')?.classList.remove('arrow_up');
        }

        if (isAssignedToClick || (assignedToInput && event.target === assignedToInput)) {
            showDropdown();
            arrowImg?.setAttribute('src', 'img/arrow_up.svg')?.classList.add('arrow_up');
        }
    }
});

/**
 * This function asynchronously retrieves the contacts.
 * If the user is logged in, it retrieves the contacts using the `getUserContacts` function.
 * If the user is not logged in, it retrieves the contacts from the 'contacts' item in localStorage using the `getLocalStorageContacts` function.
 *
 * @returns {Promise<Array>} A Promise that resolves with an array of contacts.
 */
async function getContacts() {
    return isUserLoggedIn ? getUserContacts() : getLocalStorageContacts();
}

/**
 * This function Asynchronously retrieves the contacts of the current user.
 * It fetches the 'users' item from localStorage, parses it into a JavaScript object, and returns the 'contacts' property of the current user.
 * If the current user does not have any contacts, it returns an empty array.
 *
 * @returns {Promise<Array>} A Promise that resolves with an array of the current user's contacts.
 */
async function getUserContacts() {
    let users = await getItem('users');
    return JSON.parse(users)[currentUser]?.contacts || [];
}

/**
 * This function asynchronously fetches the contacts of the currently logged in user from the remote storage.
 * @returns {Array} An array of contacts from the local storage.
 */
function getLocalStorageContacts() {
    return JSON.parse(localStorage.getItem('contacts')) || [];
}

/**
 * This function initializes the contact dropdown by adding an event listener to the document.
 * @param {*} contact - The contact to be added to the selected contacts.
 * @param {*} isSelected - A boolean indicating whether the contact is selected.
 * @returns {HTMLDivElement} A div element representing the contact.
 */
function createContactDiv(contact, isSelected) {
    let contactDiv = document.createElement("div");
    contactDiv.innerHTML = `
    <label class="contacts ${isSelected ? 'checked' : ''}" onclick="toggleContactSelection(this, '${contact.id}')">
        <div class="avatar">
            <img src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
            <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
        </div>
        <div class="contact-dropdown">
            <div>${contact.name}</div>
        </div>
        <div class="custom-checkbox" data-contact-id="${contact.id}"></div>
        <img class="checkbox-img" src="${isSelected ? 'img/checked_white.svg' : 'img/unchecked.svg'}" alt="Checkbox">
    </label>
    `;
    contactDiv.addEventListener("mousedown", (event) => {
        event.preventDefault();
        updateSelectedContacts(contact, isSelected ? 'remove' : 'add');
        let checkboxImg = contactDiv.querySelector('.checkbox-img');
        isSelected = !isSelected;
        checkboxImg.src = isSelected ? 'img/checked_white.svg' : 'img/unchecked.svg';
    });
    return contactDiv;
}

/**
 * Toggles the selection state of a contact element.
 *
 * @param {HTMLElement} element - The HTML element representing the contact.
 * @param {string} contactId - The unique identifier of the contact.
 */
function toggleContactSelection(element, contactId) {
    let isSelected = element.classList.toggle('checked');

    let checkboxImg = element.querySelector('.checkbox-img');
    if (checkboxImg) {
        checkboxImg.src = isSelected ? '/img/checked_white.svg' : 'img/unchecked.svg';
    }

    updateSelectedContacts({ id: contactId }, isSelected ? 'add' : 'remove');
}

/**
 * This function updates the array of selected contacts based on the provided contact and action.
 * If the action is 'add' and the contact is not already in the array, it adds the contact to the array.
 * If the action is 'remove' and the contact is in the array, it removes the contact from the array.
 * After updating the array, it saves and displays the selected contacts using the `saveAndDisplaySelectedContacts` function.
 *
 * @param {Object} contact - The contact object.
 * @param {string} action - The action to perform ('add' or 'remove').
 */
function updateSelectedContacts(contact, action) {
    let index = selectedInitialsArray.findIndex(c => c.id === contact.id);

    if (action === 'add' && index === -1) {
        selectedInitialsArray.push(contact);
    } else if (action === 'remove' && index !== -1) {
        selectedInitialsArray.splice(index, 1);
    }

    saveAndDisplaySelectedContacts();
}

/**
 * This function saves and displays the selected contacts.
 * It first saves the selected contacts using the `saveSelectedContacts` function.
 * Then it displays the selected contacts using the `selectContact` function.
 */
function saveAndDisplaySelectedContacts() {
    saveSelectedContacts();
    selectContact();
}

/**
 * Creates a div element for a selected contact.
 * The div includes the contact's avatar, name, and a delete button.
 *
 * @param {Object} contact - The contact to create a div for.
 * @param {string} contact.avatarid - The ID of the contact's avatar.
 * @param {string} contact.id - The ID of the contact.
 * @param {string} contact.name - The name of the contact.
 * @returns {HTMLDivElement} The created div element for the selected contact.
 */
function createSelectedContactDiv(contact) {
    let selectedContactDiv = document.createElement("div");
    selectedContactDiv.innerHTML = `
        <div class="selected-contact" data-avatarid="${contact.avatarid}" data-id="${contact.id}">
            <div class="avatar">
                <img id="${contact.id}" src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
                <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
            <div class="contact-delete-container">
                <div>
                    <span>${contact.name}</span>
                </div>
                <span class="remove-contact" onclick="removeContact(${contact.avatarid})">
                    <img src="./img/delete.svg">
                </span>
            </div>
        </div>
    `;
    return selectedContactDiv;
}

/**
 * Selects a contact and appends it to the selected contacts container.
 * It first clears the container, then for each contact in the `selectedInitialsArray`,
 * it creates a div for the contact using `createSelectedContactDiv` and appends it to the container.
 */
function selectContact() {
    let selectedContactsContainer = document.getElementById("selectedContactsContainer");
    selectedContactsContainer.innerHTML = "";

    selectedInitialsArray.forEach(contact => {
        let selectedContactDiv = createSelectedContactDiv(contact);
        selectedContactsContainer.appendChild(selectedContactDiv);
    });
}

/**
 * Saves the currently selected contacts to local storage.
 * The contacts are stored under the key 'selectedContacts'.
 * Before saving, the contacts array is converted to a JSON string.
 */
function saveSelectedContacts() {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedInitialsArray));
}

/**
 * Removes a contact from the selected contacts array and updates the selected contacts container.
 * It first finds the index of the contact with the given avatar ID in the `selectedInitialsArray`.
 * If such a contact is found, it is removed from the array, and the selected contacts container is updated.
 *
 * @param {string} contactavatarId - The avatar ID of the contact to remove.
 */
function removeContact(contactavatarId) {
    let index = selectedInitialsArray.findIndex(contact => contact.avatarid === contactavatarId);

    if (index !== -1) {
        selectedInitialsArray.splice(index, 1);
        selectContact();

        let selectedContactsContainer = document.getElementById("selectedContactsContainer");
        let contactToRemove = selectedContactsContainer.querySelector(`[data-avatarid="${contactavatarId}"]`);
    }
}

/**
 * Clears the selected contacts from local storage.
 * The contacts are removed from local storage by calling `localStorage.removeItem` with the key 'selectedContacts'.
 */
function clearSelectedContacts() {
    localStorage.removeItem('selectedContacts');
}

/**
 * Adds a new task to the specified column on the board.
 *
 * @param {string} column - The target column for the new task.
 * @returns {Promise<void>} A Promise that resolves after the task is added and redirected to the board.
 */
async function addToBoard(column) {
    event.preventDefault();
    let form = document.querySelector('form');
    let taskTitle = getFieldValueById('taskTitleInput');
    let category = getFieldValueById('category');
    let overlay = document.getElementById('overlayFeedack');
    let animatedIcon = document.getElementById('animatedIcon');

    if (form.checkValidity() && taskTitle && category) {
        overlay.style.display = 'block';
        animatedIcon.style.bottom = '500px';
    
        let description = getFieldValueById('descriptionInput');
        let date = getFieldValueById('date');
        let subtasksList = document.getElementById('subtaskList').children;
        let selectedContacts = getSelectedContacts();
        let selectedPriority = getSelectedPriority();
    
        if (form.checkValidity()) {
            saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column);
    
            setTimeout(() => {
                window.location.href = 'board.html';
            }, 1000);
        }
    }
    resetFormFields();
}

/**
 * Retrieves the value of a DOM element by its ID.
 *
 * @param {string} id - The ID of the DOM element to retrieve the value from.
 * @returns {string} The value of the DOM element.
 */
function getFieldValueById(id) {
    return document.getElementById(id).value;
}

/**
 * Retrieves the selected contacts from the selected contacts container.
 * It iterates over the child nodes of the container, and for each div element,
 * it retrieves the contact's image path, initials, name, and ID from the img element and its siblings,
 * and adds an object with these properties to the `selectedContacts` array.
 *
 * @returns {Array} An array of objects representing the selected contacts. Each object has properties for the contact's image path, initials, name, and ID.
 */
function getSelectedContacts() {
    let selectedContactsContainer = document.getElementById("selectedContactsContainer");
    let selectedContacts = [];

    selectedContactsContainer.childNodes.forEach(contactDiv => {
        if (contactDiv.nodeType === 1) {
            let imgElement = contactDiv.querySelector('img');
            let initials = imgElement.nextElementSibling.textContent.trim();
            let datasetName = imgElement.dataset.name;
            let name = datasetName || imgElement.alt;
            let id = imgElement.id;

            selectedContacts.push({
                imagePath: imgElement.src,
                initials: initials,
                name: name,
                id: id
            });
        }
    });

    return selectedContacts;
}

/**
 * Saves a task to local storage or remote storage based on user login status.
 *
 * @param {string} taskTitle - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The date of the task.
 * @param {string} category - The category of the task.
 * @param {Array} subtasksList - The list of subtasks of the task.
 * @param {Array} selectedContacts - The list of selected contacts for the task.
 * @param {string} selectedPriority - The selected priority of the task.
 * @param {string} column - The column of the task on the board.
 * @returns {Promise<void>} A promise indicating the completion of the task saving process.
 */
async function saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column) {
    let subtasksData = Array.from(subtasksList).map(subtask => ({ description: subtask.firstElementChild.innerText, checked: false }));

    let task = {
        content: { title: taskTitle, description, date, category, subtasks: subtasksList.length, subtasksData, selectedContacts, priority: selectedPriority, boardColumn: column },
        id: `task${isUserLoggedIn ? users[currentUser].tasks.length : (JSON.parse(localStorage.getItem('tasks')) || []).length}`,
    };

    task.content.selectedContacts.forEach(contact => {
        let matchingContact = contacts.find(existingContact => existingContact.id === contact.id);
        if (matchingContact) contact.name = matchingContact.name;
    });

    if (isUserLoggedIn) {
        users[currentUser].tasks.push(task);
        await setItem('users', JSON.stringify(users));
    } else {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
    }
}

/**
 * Resets the values of the form fields.
 * The IDs of the form fields are stored in an array, and for each ID, the value of the corresponding form field is set to an empty string.
 */
function resetFormFields() {
    ['taskTitleInput', 'descriptionInput', 'assignedTo', 'date', 'category']
        .forEach(id => document.getElementById(id).value = '');
}

/**
 * Sets the priority of a task and changes the color of the priority button accordingly.
 * The function first resets the styles of all priority buttons, then sets the styles of the selected priority button.
 * The selected priority is also saved to local storage.
 *
 * @param {string} priority - The selected priority. Should be 'urgent', 'medium', or 'low'.
 * @returns {string|null} The selected priority if it is valid, otherwise null.
 */
function choose(priority) {
    let colorMap = { 'urgent': '#FF3D00', 'medium': '#FFA800', 'low': '#7AE229' };
    let setStyles = (elements, styles) => elements.forEach(e => e && Object.assign(e.style, styles));

    setStyles(document.querySelectorAll('.button'), { backgroundColor: '#fff' });
    setStyles(document.querySelectorAll('.button img'), { filter: 'brightness(1) invert(0)' });

    let [priorityButton, priorityImg] = [document.querySelector(`.${priority}`), document.querySelector(`.${priority} img`)];

    if (priorityButton && priorityImg && colorMap[priority]) {
        setStyles([priorityButton], { backgroundColor: colorMap[priority] });
        setStyles([priorityImg], { filter: 'brightness(0) invert(1)' });

        localStorage.setItem('selectedPriority', priority);
        return priority;
    }
    return null;
}

/**
 * Retrieves the selected priority from local storage.
 * The priority is stored under the key 'selectedPriority'.
 *
 * @returns {string|null} The selected priority if it exists, otherwise null.
 */
function getSelectedPriority() {
    return localStorage.getItem('selectedPriority');
}

/**
 * Event listener for the DOMContentLoaded event on the document.
 * When the DOM is fully loaded, it sets the default task priority to 'medium' by calling `choose('medium')`.
 */
document.addEventListener('DOMContentLoaded', function () {
    choose('medium');
});

/**
 * Toggles the display of the category options.
 * If the category options are currently displayed, they are hidden, and vice versa.
 * The function also stops the propagation of the click event to prevent it from closing the options.
 *
 * @param {Event} event - The click event.
 */
function toggleArrowCategory() {
    let categoryArrowImg = document.getElementById('arrow_img_category');
    let categoryDropdown = document.getElementById('categoryOptions');

    categoryArrowImg.classList.toggle('arrow_up');
    categoryArrowImg.src = `./img/arrow_${categoryArrowImg.classList.contains('arrow_up') ? 'up' : 'down'}.svg`;

    if (categoryDropdown) {
        categoryDropdown.style.display = categoryArrowImg.classList.contains('arrow_up') ? 'block' : 'none';
        isCategoryDropdownOpen = categoryArrowImg.classList.contains('arrow_up');
    }
}

/**
 * Handles the click event on the document. If the clicked element is the category input or its container,
 * it opens the category dropdown. If the clicked element is outside the category dropdown or its related elements,
 * it closes the category dropdown.
 *
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
    let categoryArrowImg = document.querySelector('.arrow_down_category');
    let categoryInput = document.getElementById('category');
    let categoryDropdown = document.getElementById('categoryOptions');

    if (categoryInput && (event.target === categoryInput || event.target.closest('.input-container') === categoryInput)) {
        openCategoryDropdown();
    }

    if (categoryDropdown && !event.target.matches('.arrow_down_category, .arrow_up') && !event.target.closest('.category-container')) {
        closeCategoryDropdown(categoryArrowImg);
    }
});

/**
 * Opens the category dropdown by adding the 'arrow_up' class to the category arrow image,
 * changing its source, displaying the category options, and updating the dropdown status.
 */
function openCategoryDropdown() {
    let categoryArrowImg = document.getElementById('arrow_img_category');
    categoryArrowImg.classList.add('arrow_up');
    categoryArrowImg.src = './img/arrow_up.svg';

    let categoryDropdown = document.getElementById('categoryOptions');
    if (categoryDropdown) {
        categoryDropdown.style.display = 'block';
        isCategoryDropdownOpen = true;
    }
}

/**
 * Closes the category dropdown by hiding it, updating the dropdown status,
 * and resetting the category arrow image to its default state.
 *
 * @param {HTMLElement} categoryArrowImg - The category arrow image element.
 */
function closeCategoryDropdown(categoryArrowImg) {
    let categoryDropdown = document.getElementById('categoryOptions');
    if (categoryDropdown) {
        categoryDropdown.style.display = 'none';
        isCategoryDropdownOpen = false;

        if (categoryArrowImg) {
            categoryArrowImg.src = 'img/arrow_down.svg';
            categoryArrowImg.classList.remove('arrow_up');
        }
    }
}

/**
 * Updates the selected category in the category dropdown.
 * If the selected category is not the same as the given category, the selected category is updated to the given category.
 * Otherwise, the selected category is cleared.
 * The category options are also hidden.
 *
 * @param {string} category - The category to select.
 */
function updateSelectedCategory(category) {
    let selectedCategoryInput = document.querySelector(".category-dropdown");
    let categoryOptions = document.getElementById("categoryOptions");

    if (selectedCategoryInput && categoryOptions) {
        selectedCategoryInput.value = selectedCategoryInput.value !== category ? category : "";

        categoryOptions.style.display = "none";
    }
}

/**
 * Handles the DOMContentLoaded event and sets up a click event listener on the document body.
 * It deactivates the input field if the clicked element is not related to the new subtask input.
 * If the new subtask input is clicked, it toggles the visibility of icons (close and submit).
 */
document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (event) {
        if (event.target.id !== 'newSubtaskInput' && !event.target.closest('#newSubtaskInput') &&
            event.target.id !== 'newSubtaskInputEdit' && !event.target.closest('#newSubtaskInputEdit')) {
            deactivateInputField();
        }

        if (event.target.id === 'newSubtaskInput') {
            handleNewSubtaskInputClick('iconContainer');
        }

        if (event.target.id === 'newSubtaskInputEdit') {
            handleNewSubtaskInputClick('iconContainerEdit');
        }
    });
});

/**
 * Toggles the visibility of icons (close and submit) in the icon container associated with the new subtask input.
 * It removes the existing add-icon and creates and appends close and submit icons if not present.
 */
function handleNewSubtaskInputClick() {
    let addIcon = document.querySelector('.add-icon');
    if (addIcon) {
        addIcon.remove();
    }

    let iconContainer = document.getElementById('iconContainer');
    let iconContainerEdit = document.getElementById('iconContainerEdit');

    if (iconContainer && !document.querySelector('#iconContainer img')) {
        createAndAppendIcons(iconContainer);
    }

    if (iconContainerEdit && !document.querySelector('#iconContainerEdit img')) {
        createAndAppendIcons(iconContainerEdit);
    }
}

/**
 * Creates and appends close and submit icons to the specified container.
 * @param {HTMLElement} container - The container element to which icons will be appended.
 */
function createAndAppendIcons(container) {
    let imgClose = document.createElement('img');
    imgClose.src = 'img/close.svg';
    imgClose.onclick = function () {
        deactivateInputField();
    };

    let imgSubmit = document.createElement('img');
    imgSubmit.src = 'img/submit.svg';
    imgSubmit.onclick = function () {
        if (container.id === 'iconContainer') {
            addSubtask();
        } else if (container.id === 'iconContainerEdit') {
            addSubtaskOpenCard();
        }
        deactivateInputField();
    };

    container.appendChild(imgClose);
    container.appendChild(imgSubmit);
}

/**
 * Deactivates the new subtask input field by clearing its value and resetting the icon container.
 * It sets the icon container to display the default add icon.
 */
function deactivateInputField() {
    let newSubtaskInput = document.getElementById('newSubtaskInput');
    let newSubtaskInputEdit = document.getElementById('newSubtaskInputEdit');
    if (newSubtaskInput) {
        newSubtaskInput.value = '';
    }
    if (newSubtaskInputEdit) {
        newSubtaskInputEdit.value = '';
    }

    let iconContainer = document.getElementById('iconContainer');
    let iconContainerEdit = document.getElementById('iconContainerEdit');
    if (iconContainer) {
        resetIconContainer(iconContainer);
    }
    if (iconContainerEdit) {
        resetIconContainer(iconContainerEdit);
    }
}

/**
 * Resets the icon container to display the default add icon.
 * @param {HTMLElement} container - The container element to be reset.
 */
function resetIconContainer(container) {
    container.innerHTML = '';
    let addIcon = document.createElement('img');
    addIcon.src = 'img/Subtasks icons11.svg';
    addIcon.classList.add('add-icon');
    addIcon.alt = 'Add';
    container.appendChild(addIcon);
}

/**
 * Adds a new subtask to the subtask list.
 * The function first retrieves the input element and the subtask list from the DOM.
 * Then it gets the text of the new subtask from the input element.
 * If the text is not empty, it creates a new subtask item with the text and adds it to the subtask list.
 * Finally, it clears the input element.
 */
function addSubtask() {
    let inputElement = document.getElementById('newSubtaskInput');
    let subtaskList = document.getElementById('subtaskList');
    let subtaskText = inputElement.value.trim();

    if (subtaskText !== '') {
        let subtaskHTML = `
            <div class="subtask-item">
                <div class="subtask-text" contentEditable="false">${subtaskText}</div>
                <p class="subtask-icon-edit" onclick="editSubtaskItem(this.parentNode)">
                    <img src="./img/edit.svg" alt="Edit Subtask">
                </p>
                <p class="delete-button" onclick="deleteSubtaskItem(this.parentNode)">
                    <img src="./img/delete.svg" alt="">
                </p>
            </div>
        `;
        subtaskList.innerHTML += subtaskHTML;
        inputElement.value = '';
    }
}

/**
 * Deletes a subtask item from the subtask list.
 * The function removes the given subtask item from the DOM.
 *
 * @param {HTMLElement} subtaskItem - The subtask item to delete.
 */
function deleteSubtaskItem(subtaskItem) {
    subtaskItem.remove();
}

/**
 * Toggles the contentEditable attribute of a subtask item's text element to enable or disable editing.
 * If the element is not currently editable, it sets it to editable and focuses on it.
 * If it is editable, it sets it to non-editable.
 * @param {HTMLElement} subtaskItem - The subtask item element containing the text to be edited.
 */
function editSubtaskItem(subtaskItem) {
    let subtaskTextElement = subtaskItem.querySelector('.subtask-text');
    let isContentEditable = subtaskTextElement.getAttribute('contentEditable') === 'true';

    if (!isContentEditable) {
        subtaskTextElement.contentEditable = 'true';
        subtaskTextElement.focus();
    } else {
        subtaskTextElement.contentEditable = 'false';
    }
}

/**
 * Clears all input and textarea fields in the 'Add-task' and 'Add-task-content' sections.
 * It also resets the task priority to 'medium', clears the selected category, clears the subtask list, and clears the selected contacts.
 */
function clearFields() {
    let inputFields = document.querySelectorAll('.Add-task input, .Add-task textarea');
    let allInputFields = document.querySelectorAll('.Add-task-content input, .Add-task-content textarea');

    inputFields.forEach(field => field.value = '');
    allInputFields.forEach(field => field.value = '');

    choose('medium');
    updateSelectedCategory('');

    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';

    let selectedContactsContainer = document.getElementById('selectedContactsContainer');
    if (selectedContactsContainer) {
        selectedContactsContainer.innerHTML = '';
    }

    clearSelectedContacts();
}

/**
 * Sets up the due date input by replacing it with a datepicker on the "Add Task" page.
 */
function setupDueDateInputAddTask() {
    if (window.location.pathname.includes("add-task.html")) {
        let dateElement = document.getElementById('date');

        if (dateElement) {
            let dateInput = createAndConfigureDateInput(dateElement);

            // Replace the existing date input with the new container
            dateElement.replaceWith(createDateContainer(dateInput));

            // Initialize the datepicker
            $(dateInput).datepicker({
                dateFormat: 'yy-mm-dd',
                showButtonPanel: true,
            });
        }
    }
}
setupDueDateInputAddTask();

/**
 * Creates a new date input container and configures the date input element.
 * @param {HTMLElement} dateElement - The existing date input element.
 * @returns {HTMLElement} The configured date input element.
 */
function createAndConfigureDateInput(dateElement) {
    let dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.id = 'date';
    dateInput.className = 'due-date-input';
    dateInput.placeholder = 'dd/mm/yyyy';
    dateInput.required = true;
    dateInput.value = dateElement.value;
    dateInput.style.backgroundImage = 'url("img/calendar.svg")';
    dateInput.style.backgroundRepeat = 'no-repeat';
    dateInput.style.backgroundPosition = 'right center';
    dateInput.style.backgroundSize = '24px';
    dateInput.classList.add('calendar-hover');
    return dateInput;
}

/**
 * Creates a new date input container.
 * @param {HTMLElement} dateInput - The configured date input element.
 * @returns {HTMLDivElement} The date input container.
 */
function createDateContainer(dateInput) {
    let dateContainer = document.createElement('div');
    dateContainer.className = 'due-date-container-2';
    dateContainer.appendChild(dateInput);
    return dateContainer;
}
