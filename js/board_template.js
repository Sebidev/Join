
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

function getValue(selector) {
    let element = document.querySelector(selector);
    return element ? element.value : '';
}

debugger
function checkAndRenderSharedData() {
    let sharedDataString = localStorage.getItem('sharedData');

    if (sharedDataString) {
        let data = JSON.parse(sharedDataString);
        renderCard(data);
        localStorage.removeItem('sharedData');
    }
}
checkAndRenderSharedData();

function renderCard(data) {
    let containerDiv = document.getElementById('renderCard');

    if (!data || !data.id) {
        console.error("Fehler: Fehlende oder undefinierte id-Eigenschaft im Datenobjekt");
        return; // oder behandeln Sie den Fehler auf andere Weise
    }

    let renderCard = document.createElement('div');
    renderCard.id = data.id;

    let categoryClass = data.content.category === 'Technical task' ? 'technical-task' : 'user-story';
    let createdSubtasks = data.content.subtasks;
    let selectedPriority = localStorage.getItem('selectedPriority');

    renderCard.innerHTML = `
        <div onclick="" class="card-user-story">
                <p class="${categoryClass}">${data.content.category}</p>
            <div class="title-container">
                <p class="card-title">${data.content.title}</p>
                <p class="card-content">${data.content.description}</p>
            </div>
            <p style="display: none">${data.content.date}</p>
            <div class="progress">
                <div class="progress-bar"></div>
                <div class="subtasks">0/${createdSubtasks} Subtasks</div>
            </div>
            <div class="to-do-bottom">
                <div class="initial-container">
                <p >${data.content.assigned}</p>
                <div class="profile-badge">
                  <img src="./img/Ellipse5-3.svg" alt="">
              </div>
              <div class="profile-badge">
                  <img src="./img/Ellipse5-1.svg" alt="">
              </div>
              <div class="profile-badge">
                  <img src="./img/Ellipse5-2.svg" alt="">
              </div>
          </div>
                <div class="priority-symbol">
                  <img src="${getPriorityIcon(selectedPriority)}" alt="">
              </div >
        </div>
    `;

    containerDiv.appendChild(renderCard);
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return './img/Prio_up.svg';
        case 'medium':
            return './img/Prio_neutral.svg';
        case 'low':
            return './img/Prio_down.svg';
        default:
            return '';
    }
}