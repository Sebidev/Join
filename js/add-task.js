/**
 * This file contains the JavaScript code for the 'Add Task' page.
 * @file add-task.js 
 */

let containerCount = 0;
let selectedInitialsArray = [];
let selectedPriority;
let isDropdownOpen = false;
let isCategoryDropdownOpen = false;

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

    if (dropdown) {
        if (!event.target.matches('.arrow_down') && !event.target.matches('.arrow_up') && !event.target.closest('.assigned-to-container')) {
            dropdown.style.display = 'none';
            isDropdownOpen = false;

            if (arrowImg) {
                arrowImg.src = 'img/arrow_down.svg';
                arrowImg.classList.remove('arrow_up');
            }
        }

        if (event.target.id === 'assignedTo') {
            showDropdown();
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
 */
function initializeContactDropdown() {
    if (window.location.pathname.endsWith("add-task.html") || window.location.pathname.endsWith("board.html")) {
        document.addEventListener('click', function (event) {
            let dropdown = document.getElementById('contactDropdown');

            if (dropdown) {
                let arrowImg = document.getElementById('arrow_img');

                if (!event.target.matches('.arrow_down') && !event.target.matches('.arrow_up') && !event.target.closest('.assigned-to-container')) {
                    dropdown.style.display = 'none';
                    isDropdownOpen = false;

                    if (arrowImg) {
                        arrowImg.src = 'img/arrow_down.svg';
                        arrowImg.classList.remove('arrow_up');
                    }
                }

                if (event.target.id === 'assignedTo') {
                    showDropdown();
                }
            }
        });
    }
}
initializeContactDropdown();

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

function toggleContactSelection(element, contactId) {
    let isSelected = element.classList.toggle('checked');

    const checkboxImg = element.querySelector('.checkbox-img');
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
            <div class="contacts-img-initial">
                <img id="${contact.id}" src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
                <div class="initials-overlay">${contact.name.split(' ').map(n => n[0]).join('')}</div>
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

async function addToBoard(column) {
    let taskTitle = getFieldValueById('taskTitleInput');
    let category = getFieldValueById('category');

    if (!taskTitle || !category) {
        alert('Please fill out the title and the category');
        return;
    }

    let description = getFieldValueById('descriptionInput');
    let date = getFieldValueById('date');
    let subtasksList = document.getElementById('subtaskList').children;
    let selectedContacts = getSelectedContacts();
    console.log('Selected Contacts:', selectedContacts);
    let selectedPriority = getSelectedPriority();

    saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column);

    clearSelectedContacts();
    resetFormFields();

    window.location.href = 'board.html';
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
 * Saves a task to local storage or remote storage depending on whether the user is logged in.
 * The task is first created with the given parameters, then the contacts in the task are processed,
 * and finally the task is saved to the appropriate storage.
 *
 * @param {string} taskTitle - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The date of the task.
 * @param {string} category - The category of the task.
 * @param {Array} subtasksList - The list of subtasks of the task.
 * @param {Array} selectedContacts - The list of selected contacts for the task.
 * @param {string} selectedPriority - The selected priority of the task.
 * @param {string} column - The column of the task on the board.
 */
async function saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column) {
    let subtasksData = Array.from(subtasksList).map(subtask => {
        return {
            description: subtask.firstElementChild.innerText,
            checked: false
        };
    });

    let task = {
        content: {
            title: taskTitle,
            description: description,
            date: date,
            category: category,
            subtasks: subtasksList.length,
            subtasksData: subtasksData,
            selectedContacts: selectedContacts,
            priority: selectedPriority,
            boardColumn: column,
        },
        id: 'task' + (isUserLoggedIn ? users[currentUser].tasks.length : (JSON.parse(localStorage.getItem('tasks')) || []).length),
        //dataId: selectedContacts[0].id
    };

    //console.log('Task before processing contacts:', task);

    task.content.selectedContacts.forEach(contact => {
        let matchingContact = contacts.find(existingContact => existingContact.id === contact.id);
        if (matchingContact) {
            contact.name = matchingContact.name;
        }
    });

    //console.log('Task after processing contacts:', task);

    if (isUserLoggedIn) {
        // User is logged in, save the task to the remote storage
        users[currentUser].tasks.push(task);
        await setItem('users', JSON.stringify(users));
    } else {
        // User is a guest, save the task to the local storage
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
    let categoryDropdown = document.getElementById('categoryOptions');
    let categoryArrowImg = document.getElementById('arrow_img_category');

    categoryArrowImg.classList.toggle('arrow_up');
    categoryArrowImg.src = categoryArrowImg.classList.contains('arrow_up') ? './img/arrow_up.svg' : './img/arrow_down.svg';

    if (categoryDropdown) {
        categoryDropdown.style.display = categoryArrowImg.classList.contains('arrow_up') ? 'block' : 'none';
        isCategoryDropdownOpen = categoryArrowImg.classList.contains('arrow_up');
    }
}

document.addEventListener('click', function (event) {
    let categoryDropdown = document.getElementById('categoryOptions');
    let categoryArrowImg = document.querySelector('.arrow_down_category');

    if (categoryDropdown && !event.target.matches('.arrow_down_category') && !event.target.matches('.arrow_up') && !event.target.closest('.category-container')) {
        categoryDropdown.style.display = 'none';
        isCategoryDropdownOpen = false;

        if (categoryArrowImg) {
            categoryArrowImg.src = 'img/arrow_down.svg';
            categoryArrowImg.classList.remove('arrow_up');
        }
    }
});

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
 * Handles a click event outside of the sub-image container and the subtasks input field.
 * If the click event's target is not within the sub-image container or the subtasks input field,
 * the function calls `revertSubImg` to revert the sub-image.
 *
 * @param {Event} event - The click event.
 */
/*
function handleOutsideClick(event) {
    let subImgContainer = document.getElementById('subImgContainer');
    let inputField = document.querySelector('.subtasks-input');

    if (subImgContainer && !subImgContainer.contains(event.target) && inputField && !inputField.contains(event.target)) {
        revertSubImg();
    }
}*/

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
                        <div class="subtask-text">${subtaskText}</div>
                        <div class="delete-button" onclick="deleteSubtaskItem(this.parentNode)">
                            <img src="./img/iconoir_cancel.svg" alt="">
                        </div>
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
 * Clears all input and textarea fields in the 'Add-task' and 'Add-task-content' sections.
 * It also resets the task priority to 'medium', clears the selected category, clears the subtask list, and clears the selected contacts.
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
    clearSelectedContacts();
}