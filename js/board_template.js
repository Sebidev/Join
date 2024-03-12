//import { contacts } from './js/add-task.js';

/**
 * Generates HTML for the Add Task modal.
 * @returns {string} - HTML code for the Add Task modal.
 */
function addTaskModalHTML(column) {
    return /*html*/ `
    <div id="overlay"></div>
    <form id="taskModal" class="add-task-create-open">
        <div class="modal-headline-add-task">Add task</div>
        <div onclick="closeModal()">
        <img class="close-modal" src="img/close_modal.svg" alt="">
        </div>
        <div class="Add-task-content">
            <div class="Add-task-left-modal">
                <div class="title-container-modal">
                    <div class="title">Title</div>
                    <input id="taskTitleInput" type="text" class="title-input-modal" placeholder="Enter a title" required>
                    <div class="required-info">This field is required</div>
                </div>

                <div class="description-container-modal">
                    <div class="description">Description</div>
                    <input id="descriptionInput" type="text" class="description-input-modal" placeholder="Enter a Description">
                    <div class="required-info">This field is required</div>
                </div>

                <div class="assigned-to-container-modal">
                    <div class="assigned-to">Assigned to</div>
                    <div class="input-container-modal-contacts">
                        <input id="assignedTo" type="text" class="assigned-dropdown-add-task-modal" placeholder="Select contacts to assign">
                        <img id="arrow_img_contacts" onclick="toggleArrowContacts()" class="arrow_down" src="img/arrow_down.svg" alt="">
                        <div id="contactDropdown" class="dropdown-content"></div>
                    </div>

                    <div id="selectedContactsContainer" class="selected-contacts-modal"></div>
                    <div class="input-container-modal">
                        <div class="dropdown-content"></div>
                    <div class="arrow_down"></div>
                    </div>
                </div>
                
            </div>

            <div class="divider-add-task-modal">
                <img src="img/divider.svg" alt="">
            </div>

            <div class="Add-task-right-modal">
                <div class="due-date-container-add-task-modal">
                    <div class="due-date">Due date</div>
                    <input id="dateAddTaskModal" class="due-date-input-add-task-modal" type="text" placeholder="dd/mm/yyyy" required />
                </div>

                <div class="prio-container-add-task-modal">
                    <div class="prio-add-task-modal">Prio</div>
                    <div class="prio-option-container-add-task-modal">
                    <button
                        type="button"
                        onclick="choose('urgent')"
                        class="button urgent">
                        <h3>Urgent</h3>
                        <img src="img/Prio_up.svg" alt="" />
                    </button>
                    <button
                        type="button"
                        onclick="choose('medium')"
                        class="button medium">
                        <h3>Medium</h3>
                        <img src="img/Prio_neutral.svg" alt="" />
                    </button>
                    <button type="button" onclick="choose('low')" class="button low">
                        <h3>Low</h3>
                        <img src="img/Prio_down.svg" alt="" />
                    </button>
                    </div>
                </div>

                <div class="category-container-add-task-modal">
                    <div class="category-add-task-modal">Category</div>
                    <div class="input-container-modal-category">
                        <input id="categoryAddTaskModal" class="category-dropdown-add-task-modal" type="text" placeholder="Select task category" required>
                        <img id="arrow_img_category_modal" class="arrow_down_category" src="img/arrow_down.svg" onclick="toggleArrowCategoryAddTaskModal()" alt="" />
                        <div class="category-options-add-task-modal" id="categoryOptionsAddTaskModal">
                            <label onclick="updateSelectedCategoryAddTaskModal('Technical task')">
                                Technical task
                            </label>
                            <label onclick="updateSelectedCategoryAddTaskModal('User Story')">
                                User Story
                            </label>
                        </div>
                    </div>
                </div>

                <div class="subtasks-container-add-task-modal">
                    <div class="subtasks-add-task">Subtasks</div>
                    <div class="input-container-subtask-add-task-modal">
                        <input class="subtasks-input-add-task-modal" type="text" id="newSubtaskInput" placeholder="Add new subtask" id="subtask">
                        <div id="iconContainer">
                            <img class="add-icon" src="img/Subtasks icons11.svg" alt="" />
                        </div>   
                    </div>
                    <div class="subtask-list" id="subtaskList"></div>
                </div>
            </div>
            <div class="required-legend-modal">This field is required</div>
            <div class="clear-and-create-section-modal">
                    <button onclick="clearFields()" class="cancel-button-modal">
                        <h3>Cancel</h3>
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="iconoir:cancel">
                            <path id="Vector" d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926 6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                        </svg>
                    </button>

                    <button class="create-task-button-modal" onclick="addToBoardModal('${column}')">
                        <h3>Create Task</h3>
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="check">
                            <mask id="mask0_126260_6098" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                            <rect id="Bounding box" x="0.248535" width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_126260_6098)">
                            <path id="check_2" d="M9.79923 15.15L18.2742 6.675C18.4742 6.475 18.7117 6.375 18.9867 6.375C19.2617 6.375 19.4992 6.475 19.6992 6.675C19.8992 6.875 19.9992 7.1125 19.9992 7.3875C19.9992 7.6625 19.8992 7.9 19.6992 8.1L10.4992 17.3C10.2992 17.5 10.0659 17.6 9.79923 17.6C9.53256 17.6 9.29923 17.5 9.09923 17.3L4.79923 13C4.59923 12.8 4.5034 12.5625 4.51173 12.2875C4.52006 12.0125 4.62423 11.775 4.82423 11.575C5.02423 11.375 5.26173 11.275 5.53673 11.275C5.81173 11.275 6.04923 11.375 6.24923 11.575L9.79923 15.15Z" fill="white"/>
                            </g>
                            </g>
                        </svg>
                    </button>
                </div>
        </div>
        
        <div class="overlay-feedback" id="overlayFeedack"></div>
    </form>
    <div class="animated-icon" id="animatedIcon">
        <img src="img/added_to_board.svg" alt="Added to Board">
    </div>
    `;
}

/**
 * Generates HTML code for the opened task card modal.
 * @param {Object} data - Task data.
 * @param {string} taskId - Task ID.
 * @param {string} categoryClass - CSS class for the task category.
 * @param {string} priority - Task priority.
 * @param {string} priorityIconSrc - Source path for the priority icon.
 * @param {Object} selectedContacts - Selected contacts for the task.
 * @returns {string} - HTML code for the opened task card modal.
 */
function openTaskHTML(data, taskId, categoryClass, priority, priorityIconSrc, selectedContacts, isSelected) {
    return  /*html*/`
    <div id="card-overlay"></div>
    <div id="cardModal_${taskId}" class="card-modal">

        <div class="task-categorie">
            <p class=${categoryClass}>${data.content.category}</p>
            <div class="close-card-modal" onclick="closeOpenCard()">
                <img src="img/close_modal.svg" alt="">
            </div>
        </div>
        <div class="card-modal-cont">
        <div class="card-modal-title-container">
            <p class="card-modal-title">${data.content.title}</p>
        </div>
        <p class="card-modal-content">${data.content.description}</p>

        <div class="card-modal-date">
            <p class="due-date-card-modal">Due date: 
                <p id="dueDateText">${data.content.date}</p>
            </p> 
        </div>

        <div class="card-modal-priority">
            <p class="priority-card-modal-text">Priority:</p> 
            <div class="card-modal-priority-container">
                <span class="card-modal-priority-letter">${priority}</span>
                <div class="card-modal-priority-symbol">
                    <img src="${priorityIconSrc}" alt="">
                </div>
            </div>
        </div>

        <div class="card-modal-contacts">
            <p class="card-modal-assigned-to-headline">Assigned to:</p>
            <div class="card-modal-contacts-container">
                <div id="selectedContactsContainerEdit" class="card-modal-initial-container">
                    ${(selectedContacts || []).map(contact => `
                        <div class="initial-container-open-card" data-id="${contact.id}">
                            <div class="avatar">
                                <img src="${contact.imagePath}" alt="Avatar">
                                <div class="avatar_initletter">${contact.initials}</div>
                            </div>
                            <div class="avatar-name">${contact.name || ''}</div>
                        </div>`).join('')}
                </div>
            </div>
        </div>

        <div class="card-modal-subtasks-container">
        <p class="card-modal-subtasks-container-headline">Subtasks:</p>
        <div class="card-modal-subtasks">
            ${(data.content.subtasksData || []).map((subtask, index) => `
                <div class="card-modal-subtask-maincontainer">
                    <div class="card-modal-description-checkbox">
                        <div class="card-modal-subtask-checked"> 
                            <img src="${subtask.checked ? 'img/checked.svg' : 'img/unchecked.svg'}" 
                                 class="subtask-checkbox" 
                                 id="subtaskCheckbox_${data.id}_${index + 1}" 
                                 onclick="handleCheckboxClick(this)" 
                                 ${subtask.checked ? 'checked' : ''}>
                            <img src="img/circle.svg" class="subtask-image" style="display: none;">
                        </div>
                        <div class="card-modal-subtask-description">${subtask.description}</div>
                    </div>
                    <div class="subtasks-edit-icons-container d-none">
                        <div class="subtasks-edit-icons-container-p">
                            <p class="subtask-icon-edit">
                                <img src="img/edit.svg" alt="Edit Subtask">
                            </p>
                            <p class="subtask-icon-delete">
                                <img src="img/delete.svg" alt="Delete Subtask">
                            </p>
                        </div>
                    </div>
                </div>`).join('')}
        </div>
    </div>

        <div class="card-modal-edit-and-delete-container">
            <button onclick="deleteTask()" data-id="${data.id}" class="card-modal-delete-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="delete"><mask id="mask0_130935_4270" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4270)"><path id="delete_2" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/></g></g></svg>
                <p> Delete </p>
            </button>

            <div class="card-modal-devider">
                <img src="img/Vector 3.svg">
            </div>

            <button onclick="edit()" class="card-modal-edit-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="edit"><mask id="mask0_130935_4276" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4276)"><path id="edit_2" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/></g></g></svg>
                <p> Edit </p>
            </button>

            <button onclick="saveEditedTask()" data-id="${data.id}" class="card-modal-save-button hide-button">
                <p> Ok </p>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="check"><mask id="mask0_126260_6098" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24"><rect id="Bounding box" x="0.248535" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_126260_6098)"><path id="check_2" d="M9.79923 15.15L18.2742 6.675C18.4742 6.475 18.7117 6.375 18.9867 6.375C19.2617 6.375 19.4992 6.475 19.6992 6.675C19.8992 6.875 19.9992 7.1125 19.9992 7.3875C19.9992 7.6625 19.8992 7.9 19.6992 8.1L10.4992 17.3C10.2992 17.5 10.0659 17.6 9.79923 17.6C9.53256 17.6 9.29923 17.5 9.09923 17.3L4.79923 13C4.59923 12.8 4.5034 12.5625 4.51173 12.2875C4.52006 12.0125 4.62423 11.775 4.82423 11.575C5.02423 11.375 5.26173 11.275 5.53673 11.275C5.81173 11.275 6.04923 11.375 6.24923 11.575L9.79923 15.15Z" fill="white"/></g></g></svg>
            </button>
        </div>
    </div>
    </div>
    `;
}