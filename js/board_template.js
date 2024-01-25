function addTask() {
    const modalHTML = `
        <div id="overlay"></div>
        
        <div id="taskModal" class="add-task-create-open">
            <div class="modal-headline">Add task</div>
            <div onclick="closeModal()">
            <img class="close-modal" src="./img/close_modal.svg" alt="">
            </div>
            <div class="Add-task-content">
                <div class="Add-task-left-modal">
                    <div class="title-container">
                        <div class="title">Title</div>
                        <input type="text" class="title-input" placeholder="Enter a title" required>
                        <div class="required-info">This field is required</div>
                    </div>

                    <div class="description-container">
                        <div class="description">Description</div>
                        <input type="text" class="description-input" placeholder="Enter a Description" required>
                        <div class="required-info">This field is required</div>
                    </div>

                    <div class="assigned-to-container">
                        <div class="assigned-to">Assigned to</div>
                        <div class="input-container">
                            <input type="text" class="assigned-dropdown" placeholder="Select contacts to assign">
                            <img class="arrow_down" src="./img/arrow_down.svg" alt="">
                        </div>
                        <div class="required-legend-modal">This field is required</div>
                    </div>
                </div>


                <div class="divider">
                    <img src="./img/divider.svg" alt="">
                </div>

                <div class="Add-task-right-modal">
                    <div class="due-date-container">
                        <div class="due-date">Due date</div>
                        <input class="due-date-input" type="date" placeholder="dd/mm/yyyy">
                    </div>

                    <div class="prio-container">
                        <div class="prio">Prio</div>

                        <div class="prio-option-container">
                            <button onclick="choose('urgent')" class="button urgent">
                                <h3>Urgent</h3>
                                <img src="./img/Prio_up.svg" alt="">
                            </button>
                            <button onclick="choose('medium')" class="button medium">
                                <h3>Medium</h3>
                                <img src="./img/Prio_neutral.svg" alt="">
                            </button>
                            <button onclick="choose('low')" class="button low">
                                <h3>Low</h3>
                            <img src="./img/Prio_down.svg" alt="">
                            </button>
                        </div>
                    </div>

                    <div class="category-container">
                        <div class="category">Category</div>
                        <div class="input-container">
                            <input class="category-dropdown" type="text" placeholder="Select contacts to assign">
                            <img class="arrow_down" src="./img/arrow_down.svg" onclick="toggleCategoryOptions()" alt="">
                            <div class="category-options" id="categoryOptions">
                                <label onclick="updateSelectedCategory('Technical task')">
                                    Technical task
                                </label>
                                <label onclick="updateSelectedCategory('User Story')">
                                    User Story
                                </label>
                            </div>
                        </div>
                    </div>


                    <div class="subtasks-container">
                        <div class="subtasks-add-task">Subtasks</div>
                        <div class="input-container-subtask">
                            <input class="subtasks-input" type="text" id="newSubtaskInput" placeholder="Add new subtask" onclick="changeSubImg()" id="subtask">
                            <img class="add-icon" src="./img/Subtasks icons11.svg" alt="" onclick="addSubtask()">
                            <div class="subImgContainer" id="subImgContainer">
                            </div>   
                        </div>
                        <div class="subtask-list" id="subtaskList"></div>
                    </div>

                    <div class="clear-and-create-section-modal">
                        <button onclick="clearFields()" class="cancel-button-modal">
                            <h3>Cancel</h3>
                            <img src="./img/iconoir_cancel.svg" alt="">
                        </button>

                        <button class="create-task-button-modal">
                            <h3>Create Task</h3>
                            <img src="./img/check.svg" alt="">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    choose('medium');

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('taskModal');
    const overlay = document.getElementById('overlay');

    modal.remove();
    overlay.remove();
}

document.addEventListener('DOMContentLoaded', function () {
    let titles = JSON.parse(localStorage.getItem('titles')) || [];
    let descriptions = JSON.parse(localStorage.getItem('descriptions')) || [];
    let assignedTos = JSON.parse(localStorage.getItem('assignedTos')) || [];
    let dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];
    let selectedPrios = JSON.parse(localStorage.getItem('selectedPrios')) || [];
    let selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
    let subTasks = JSON.parse(localStorage.getItem('subTasks')) || [];

    renderCard();

    localStorage.clear();

    function getValue(selector) {
        let element = document.querySelector(selector);
        return element ? element.value : '';
    }

    function renderCard() {
        let renderCardContainer = document.getElementById('renderCard');
        if (renderCardContainer) {
            let title = titles.join(', ');
            let description = descriptions.join(', ');
            let assignedTo = assignedTos.join(', ');
            let dueDate = dueDates.join(', ');
            let selectedPrio = selectedPrios.join(', ');
            let selectedCategory = selectedCategories.join(', ');
            let subTask = subTasks.join(', ');

            renderCardContainer.innerHTML = `
                <div class="card-user-story">
                <p class="user-story">${selectedCategory}</p>
                    <div class="title-container">
                        <p class="card-title">${title}</p>
                        <p class="card-content">${description}</p>
                    </div>
                    <p style="display: none">${dueDate}</p>
                    <div>
                        <div class="progress-bar"></div>
                        <p>${subTask}</p>
                    </div>
                    <div class="to-do-bottom">
                        <div class="initial-container">
                            <p >${assignedTo}</p>
                            <div class="profile-badge">
                                <img src="./img/Ellipse 5.svg" alt="">
                            </div>
                            <div class="profile-badge">
                                <img src="./img/Ellipse 5 (1).svg" alt="">
                            </div>
                            <div class="profile-badge">
                                <img src="./img/Ellipse 5 (2).svg" alt="">
                            </div>
                        </div>
                        <div class="priority-symbol">
                        <img src="${getPriorityIcon(selectedPrio)}" alt="">
                        </div>
                </div>
            `;
        }
    }
});

function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return './img/Prio_up.svg';
        case 'medium':
            return './img/Prio_neutral.svg';
        case 'low':
            return './img/Prio_down.svg';
        default:
            return '';  // Hier können Sie einen Standardwert festlegen oder leer lassen, wenn keine Übereinstimmung gefunden wurde
    }
}