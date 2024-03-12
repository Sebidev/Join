/**
 * Represents an array storing the selected initials for a task.
 *
 * @type {string[]}
 * @description This array holds the selected initials for a task on the 'Add Task' page.
 * It is used to store the initials of selected contacts for task assignment.
 * @name selectedInitialsArray
 * @global
 */
let selectedInitialsArray = [];

/**
 * Represents the state of the contact dropdown.
 *
 * @type {boolean}
 * @description This variable indicates whether the contact dropdown is open or closed on the 'Add Task' page.
 * It is used to manage the visibility of the contact dropdown for task assignment.
 * @name isDropdownOpen
 * @global
 */
let isDropdownOpen = false;

/**
 * Represents the state of the category dropdown.
 *
 * @type {boolean}
 * @description This variable indicates whether the category dropdown is open or closed on the 'Add Task' page.
 * It is used to manage the visibility of the category dropdown for task assignment.
 * @name isCategoryDropdownOpen
 * @global
 */
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
        checkboxImg.src = isSelected ? 'img/checked_white.svg' : 'img/unchecked.svg';
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
                    <img src="img/delete.svg">
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
    categoryArrowImg.src = `img/arrow_${categoryArrowImg.classList.contains('arrow_up') ? 'up' : 'down'}.svg`;

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
    categoryArrowImg.src = 'img/arrow_up.svg';

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