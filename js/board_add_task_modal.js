
/** open add-task popup
 * 
 * @param {string} column current column id (''todo-column, progress-column, etc.)
 */
function addTask(column) {
    selectedInitialsArray = [];
    let modalHTML = document.createElement('div');
    if (window.innerWidth <= 926) {
        window.location.href = "add-task.html";
    } else {
        modalHTML.innerHTML = addTaskModalHTML(column);

        document.body.insertAdjacentHTML('beforeend', modalHTML.innerHTML);

        choose('medium');

        let overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
        let modal = document.getElementById('taskModal');
        modal.style.transform = "translate(0%, -50%) translateX(100%)";

        setTimeout(() => {
            modal.style.transform = "translate(-50%, -50%)";
        }, 100);
        setupDueDateInputAddTaskModal();
    }
    hideScrollbar();
}

/**
 * Toggles the display of the category options.
 * If the category options are currently displayed, they are hidden, and vice versa.
 * The function also stops the propagation of the click event to prevent it from closing the options.
 *
 * @param {Event} event - The click event.
 */
function toggleArrowCategoryAddTaskModal() {
    let categoryArrowImg = document.getElementById('arrow_img_category_modal');
    let categoryDropdown = document.getElementById('categoryOptionsAddTaskModal');

    categoryArrowImg.classList.toggle('arrow_up');
    categoryArrowImg.src = `img/arrow_${categoryArrowImg.classList.contains('arrow_up') ? 'up' : 'down'}.svg`;

    if (categoryDropdown) {
        categoryDropdown.style.display = categoryArrowImg.classList.contains('arrow_up') ? 'block' : 'none';
        isCategoryDropdownOpen = categoryArrowImg.classList.contains('arrow_up');
    }
}

/**
 * Opens the category dropdown by adding the 'arrow_up' class to the category arrow image,
 * changing its source, displaying the category options, and updating the dropdown status.
 */
function openCategoryDropdownAddTaskModal() {
    let categoryArrowImg = document.getElementById('arrow_img_category_modal');
    categoryArrowImg.classList.add('arrow_up');
    categoryArrowImg.src = 'img/arrow_up.svg';

    let categoryDropdown = document.getElementById('categoryOptionsAddTaskModal');
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
function closeCategoryDropdownAddTaskModal() {
    let categoryArrowImg = document.getElementById('arrow_img_category_modal');
    let categoryDropdown = document.getElementById('categoryOptionsAddTaskModal');

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
function updateSelectedCategoryAddTaskModal(category) {
    let selectedCategoryInput = document.getElementById('categoryAddTaskModal');
    let categoryOptions = document.getElementById('categoryOptionsAddTaskModal');

    if (selectedCategoryInput && categoryOptions) {
        selectedCategoryInput.value = selectedCategoryInput.value !== category ? category : "";

        categoryOptions.style.display = "none";
    }
}

/**
 * Event listener for handling clicks on the document.
 *
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
    let categoryArrowImg = document.getElementById('arrow_img_category_modal');
    let categoryInput = document.getElementById('categoryAddTaskModal');
    let categoryDropdown = document.getElementById('categoryOptionsAddTaskModal');

    if (categoryDropdown) {
        let isArrowClick = event.target.matches('.arrow_down, .arrow_up');
        let isCategoryClickes = event.target.id === 'categoryAddTaskModal';

        if ((!isArrowClick && !isCategoryClickes)) {
            categoryDropdown.style.display = 'none';
            isDropdownOpen = false;
            categoryArrowImg?.setAttribute('src', 'img/arrow_down.svg')?.classList.remove('arrow_up');
        }

        if (isCategoryClickes) {
            openCategoryDropdownAddTaskModal();
            categoryArrowImg?.setAttribute('src', 'img/arrow_up.svg')?.classList.add('arrow_up');
        }
    }
});

/**
 * Adds a new task to the board based on the provided form inputs and column.
 * Redirects to the board page after successfully adding the task.
 * Closes the modal and resets form fields regardless of success.
 *
 * @param {string} column - The column on the board where the task should be added.
 */
async function addToBoardModal(column) {
    let form = document.getElementById('taskModal');
    let taskTitle = getFieldValueById('taskTitleInput');
    let category = getFieldValueById('categoryAddTaskModal');
/*
    if (!taskTitle) {
        showRequiredInfo('taskTitleInput');
        return;
    }
    if (!category) {
        showRequiredInfo('categoryAddTaskModal');
        return;
    }
  */  
    if (window.location.pathname.includes("board.html") && form.checkValidity() && taskTitle && category) {
        
        let description = getFieldValueById('descriptionInput');
        let date = getFieldValueById('dateAddTaskModal');
        let subtasksList = document.getElementById('subtaskList').children;
        let selectedContacts = getSelectedContacts();
        let selectedPriority = getSelectedPriority();

        if (form.checkValidity()) {
            saveToLocalStorage(taskTitle, description, date, category, subtasksList, selectedContacts, selectedPriority, column);
            window.location.href = 'board.html';
        }
    }

    resetFormFields();
    closeModal();
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
 * Displays required information for a specific form field.
 *
 * @param {string} fieldId - The ID of the form field for which the required information should be displayed.
 * @returns {void}
 *
 * @example
 * // Displays the required information for the form field with the ID 'taskTitleInput'.
 * showRequiredInfo('taskTitleInput');
 */
function showRequiredInfo(fieldId) {
    let requiredInfoElement = document.querySelector(`#${fieldId} + .required-info`);
    requiredInfoElement.style.display = 'block';
}

/**
 * A function that clears all input and textarea fields in the 'Add-task' and 'Add-task-content' sections, 
 * resets the task priority to 'medium', clears the selected category, subtasks, modal, and selected contacts.
 */
function clearFields() {
    let clearInputFields = fields => fields.forEach(field => field.value = '');

    let inputFields = document.querySelectorAll('.Add-task input, .Add-task textarea');
    let allInputFields = document.querySelectorAll('.Add-task-content input, .Add-task-content textarea');

    clearInputFields(inputFields);
    clearInputFields(allInputFields);

    choose('medium');
    updateSelectedCategory('');

    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    closeModal();
    clearSelectedContacts();
}

/**
 * clears the selectedContacts cache
 */

function clearSelectedContacts() {
    localStorage.removeItem('selectedContacts');
}

/**
 * A function that closes the modal by moving it out of view and then removing it and the overlay after a delay.
 */
function closeModal() {
    let modal = document.getElementById('taskModal');
    let overlay = document.getElementById('overlay');

    modal.style.transform = "translate(0%, -50%) translateX(100%)";

    setTimeout(() => {
        modal.remove();
        overlay.remove();
    }, 200);
    showScrollbar();
}

/**
 * Sets up the due date input by replacing it with a datepicker on the "Add Task" modal.
 */
function setupDueDateInputAddTaskModal() {
    if (window.location.pathname.includes("board.html")) {
        let dateElement = document.getElementById('dateAddTaskModal');

        if (dateElement) {
            let dateInput = createAndConfigureDateInputModal(dateElement);
            dateElement.replaceWith(createDateContainerModal(dateInput));

            $(dateInput).datepicker({
                dateFormat: 'yy-mm-dd',
                showButtonPanel: true,
                minDate: new Date()
            });
        }
    }
}
setupDueDateInputAddTaskModal();

/**
 * Creates and configures a date input element for the modal.
 * @param {HTMLElement} dateElement - The existing date input element.
 * @returns {HTMLElement} The configured date input element.
 */
function createAndConfigureDateInputModal(dateElement) {
    let dateInput = createDateInputModal(dateElement);
    configureDateInputModal(dateInput);
    return dateInput;
}

/**
 * Creates a date input element for the modal.
 * @param {HTMLElement} dateElement - The existing date input element.
 * @returns {HTMLElement} The created date input element.
 */
function createDateInputModal(dateElement) {
    let dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.id = 'date';
    dateInput.className = 'due-date-input-add-task-modal';
    dateInput.placeholder = 'dd/mm/yyyy';
    dateInput.required = true;
    dateInput.value = dateElement.value;
    return dateInput;
}

/**
 * Configures the date input element for the modal.
 * @param {HTMLElement} dateInput - The date input element to be configured.
 */
function configureDateInputModal(dateInput) {
    dateInput.style.cssText = 'background-image: url("img/calendar.svg"); background-repeat: no-repeat; background-position: right center; background-size: 24px;';
    dateInput.classList.add('calendar-hover');
    dateInput.addEventListener('input', handleDateInputModal);
    dateInput.addEventListener('keypress', handleKeyPressModal);
}

/**
 * Handles input event for the date input element in the modal.
 * @param {Event} event - The input event object.
 */
function handleDateInputModal(event) {
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
    handleDateValidity(event, day, month, year);
}

/**
 * Formats the date string for the modal.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 * @returns {string} The formatted date string.
 */
function formatDateStringModal(day, month, year) {
    return day + (day.length === 2 ? '/' : '') + month + (month.length === 2 ? '/' : '') + year;
}

/**
 * Handles invalid day entry for the modal.
 * @param {Event} event - The input event object.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 */
function handleInvalidDayModal(event, day, month, year) {
    if (day.length === 2 && (parseInt(day) < 1 || parseInt(day) > 31)) {
        day = '31';
        event.target.value = day + '/' + month + '' + year;
    }
}

/**
 * Handles invalid month entry for the modal.
 * @param {Event} event - The input event object.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 */
function handleInvalidMonthModal(event, day, month, year) {
    if (month.length === 2 && (parseInt(month) < 1 || parseInt(month) > 12)) {
        month = '12';
        event.target.value = day + '/' + month + '/' + year;
    }
}

/**
 * Handles invalid year entry for the modal.
 * @param {Event} event - The input event object.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 */
function handleInvalidYearModal(event, day, month, year) {
    if (year.length === 4 && (parseInt(year) < 1 || parseInt(year) > 2100)) {
        year = '2100';
        event.target.value = day + '/' + month + '/' + year;
    }
}

/**
 * Handles key press event for the date input element in the modal.
 * @param {Event} event - The key press event object.
 */
function handleKeyPressModal(event) {
    if (!/[0-9\b]/.test(event.key)) {
        event.preventDefault();
    }
    if (event.target.value.length >= 10 && event.key !== 'Backspace') {
        event.preventDefault();
    }
}

/**
 * Creates a new date input container for the modal.
 * @param {HTMLElement} dateInput - The configured date input element.
 * @returns {HTMLDivElement} The date input container.
 */
function createDateContainerModal(dateInput) {
    let dateContainer = document.createElement('div');
    dateContainer.className = 'due-date-container-add-task-modal';
    dateContainer.appendChild(dateInput);
    return dateContainer;
}