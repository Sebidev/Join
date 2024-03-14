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

            dateElement.replaceWith(createDateContainer(dateInput));

            $(dateInput).datepicker({
                dateFormat: 'dd/mm/yy',
                showButtonPanel: true,
                minDate: new Date()
            });
        }
    }
}
setupDueDateInputAddTask();

/**
 * Creates and configures a date input element.
 * @param {HTMLElement} dateElement - The existing date input element.
 * @returns {HTMLElement} The configured date input element.
 */
function createAndConfigureDateInput(dateElement) {
    let dateInput = createDateInput(dateElement);
    configureDateInput(dateInput);
    return dateInput;
}

/**
 * Creates a date input element.
 * @param {HTMLElement} dateElement - The existing date input element.
 * @returns {HTMLElement} The created date input element.
 */
function createDateInput(dateElement) {
    let dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.id = 'date';
    dateInput.className = 'due-date-input';
    dateInput.placeholder = 'dd/mm/yyyy';
    dateInput.required = true;
    dateInput.value = dateElement.value;
    return dateInput;
}

/**
 * Configures the date input element.
 * @param {HTMLElement} dateInput - The date input element to be configured.
 */
function configureDateInput(dateInput) {
    dateInput.style.cssText = 'background-image: url("img/calendar.svg"); background-repeat: no-repeat; background-position: right center; background-size: 24px;';
    dateInput.classList.add('calendar-hover');
    dateInput.addEventListener('input', handleDateInput);
    dateInput.addEventListener('keypress', handleKeyPress);
}

/**
 * Handles input event for the date input element.
 * @param {Event} event - The input event object.
 */
function handleDateInput(event) {
    let inputValue = event.target.value.replace(/\//g, '');
    let day = inputValue.slice(0, 2);
    let month = inputValue.slice(2, 4);
    let year = inputValue.slice(4, 8);

    let formattedValue = formatDateString(day, month, year);

    if (formattedValue !== event.target.value) {
        event.target.value = formattedValue;
    }

    handleInvalidDay(event, day, month, year);
    handleInvalidMonth(event, day, month, year);
    handleInvalidYear(event, day, month, year);
    handleDateValidity(event, day, month, year);
}

/**
 * Formats the date string.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 * @returns {string} The formatted date string.
 */
function formatDateString(day, month, year) {
    return day + (day.length === 2 ? '/' : '') + month + (month.length === 2 ? '/' : '') + year;
}

/**
 * Handles invalid day entry.
 * @param {Event} event - The input event object.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 */
function handleInvalidDay(event, day, month, year) {
    if (day.length === 2 && (parseInt(day) < 1 || parseInt(day) > 31)) {
        day = '31';
        event.target.value = day + '/' + month + '' + year;
    }
}

/**
 * Handles invalid month entry.
 * @param {Event} event - The input event object.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 */
function handleInvalidMonth(event, day, month, year) {
    if (month.length === 2 && (parseInt(month) < 1 || parseInt(month) > 12)) {
        month = '12';
        event.target.value = day + '/' + month + '/' + year;
    }
}

/**
 * Handles invalid year entry.
 * @param {Event} event - The input event object.
 * @param {string} day - The day part of the date.
 * @param {string} month - The month part of the date.
 * @param {string} year - The year part of the date.
 */
function handleInvalidYear(event, day, month, year) {
    if (year.length === 4 && (parseInt(year) < 1 || parseInt(year) > 2100)) {
        year = '2100';
        event.target.value = day + '/' + month + '/' + year;
    }
}

/**
 * Handles key press event for the date input element.
 * @param {Event} event - The key press event object.
 */
function handleKeyPress(event) {
    if (!/[0-9\b]/.test(event.key)) {
        event.preventDefault();
    }
    if (event.target.value.length >= 10 && event.key !== 'Backspace') {
        event.preventDefault();
    }
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