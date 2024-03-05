/**
 * Represents the selected priority for a task.
 *
 * @type {string | undefined}
 * @description This variable holds the priority ('low', 'medium', 'urgent') selected for a task.
 * It is used to keep track of the priority chosen by the user on the 'Add Task' page.
 * The value can be 'low', 'medium', 'urgent', or undefined if no priority is selected.
 * @name selectedPriority
 * @global
 */
let selectedPriority;

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