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
                        <input class="due-date-input" type="text" placeholder="dd/mm/yyyy">
                    </div>

                    <div class="prio-container">
                        <div class="prio">Prio</div>

                        <div class="prio-option-container">
                            <button class="button urgent">
                                <h3>Urgent</h3>
                                <img src="./img/Prio_up.svg" alt="">
                            </button>
                            <button class="button medium">
                                <h3>Medium</h3>
                                <img src="./img/Prio_neutral.svg" alt="">
                            </button>
                            <button class="button low">
                                <h3>Low</h3>
                                <img src="./img/Prio_down.svg" alt="">
                            </button>
                        </div>
                    </div>

                    <div class="category-container">
                        <div class="category">Category</div>
                        <div class="input-container">
                            <input class="category-dropdown" type="text" placeholder="Select contacts to assign">
                            <img class="arrow_down" src="./img/arrow_down.svg" alt="">
                        </div>
                    </div>


                    <div class="subtasks-container">
                        <div class="subtasks">Subtasks</div>
                        <div class="input-container">
                            <input class="subtasks-input" type="text" placeholder="Add  new subtask">
                            <img class="add-icon" src="./img/Subtasks icons11.svg" alt="">
                        </div>
                    </div>

                    <div class="clear-and-create-section-modal">
                        <button onclick="closeModal()" class="cancel-button-modal">
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

     const overlay = document.getElementById('overlay');
     overlay.style.display = 'block';
}
 
function closeModal() {
     const modal = document.getElementById('taskModal');
     const overlay = document.getElementById('overlay');
     
     modal.remove();
     overlay.remove();
}