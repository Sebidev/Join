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
        modalHTML.innerHTML = addTaskModalHTML();

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
}

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
    let category = getFieldValueById('category');

    if (!taskTitle) {
        showRequiredInfo('taskTitleInput');
        return;
    }

    if (!category) {
        showRequiredInfo('category');
        return;
    }

    if (window.location.pathname.includes("board.html") && form.checkValidity() && taskTitle && category) {
        let description = getFieldValueById('descriptionInput');
        let date = getFieldValueById('date');
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
}