/**
 * Represents the count of containers on the 'Add Task' page.
 *
 * @type {number}
 * @description This variable keeps track of the number of containers on the page used for adding tasks.
 * It is primarily utilized to assign unique identifiers to the task containers dynamically.
 * @name containerCount
 * @global
 */
let containerCount = 0;

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
 * Saves the currently selected contacts to local storage.
 * The contacts are stored under the key 'selectedContacts'.
 * Before saving, the contacts array is converted to a JSON string.
 */
function saveSelectedContacts() {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedInitialsArray));
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
 * @returns {void} - Returns nothing.
 */
function addToBoard(column) {
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

        saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column);

        setTimeout(() => {
            window.location.href = 'board.html';
        }, 1000);
    } else {
        form.reportValidity();
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
function handleNewSubtaskInputClick(containerId) {
    let addIcon = document.querySelector('.add-icon');
    if (addIcon) {
        addIcon.remove();
    }

    let iconContainer = document.getElementById(containerId);

    if (iconContainer && !document.querySelector(`#${containerId} img`)) {
        createAndAppendIcons(iconContainer, containerId);
    }
}

/**
 * Creates and appends close and submit icons to the specified container.
 * @param {HTMLElement} container - The container element to which icons will be appended.
 */
function createAndAppendIcons(container) {
    let imgClose = createIcon('img/close.svg', deactivateInputField);
    let imgSubmit = createIcon('img/submit.svg', function () {
        let actionContainer = (container.id === 'iconContainer') ? 'iconContainer' : 'iconContainerEdit';
        if (actionContainer === 'iconContainerEdit') {
            addSubtaskOpenCard();
        } else {
            addSubtask(actionContainer);
        }
    });

    let newSubtaskInput = document.getElementById('newSubtaskInput');

    if (newSubtaskInput) {
        newSubtaskInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addSubtask('iconContainer');
            }
        });
    }

    let newSubtaskInputEdit = document.getElementById('newSubtaskInputEdit');

    if (newSubtaskInputEdit) {
        newSubtaskInputEdit.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addSubtaskOpenCard();
            }
        });
    }

    container.appendChild(imgClose);
    container.appendChild(imgSubmit);
}

/**
 * Creates an image element with the specified source and click handler.
 * @param {string} src - The source URL of the image.
 * @param {Function} clickHandler - The click handler function for the image.
 * @returns {HTMLImageElement} - The created image element.
 */
function createIcon(src, clickHandler) {
    let img = document.createElement('img');
    img.src = src;
    img.onclick = clickHandler;
    return img;
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
                    <img src="img/edit.svg" alt="Edit Subtask">
                </p>
                <p class="delete-button" onclick="deleteSubtaskItem(this.parentNode)">
                    <img src="img/delete.svg" alt="">
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
    selectedInitialsArray = [];

    saveAndDisplaySelectedContacts();
}