let containerCount = 0;

async function addToBoard() {
    debugger
    let taskTitle = document.getElementById('taskTitleInput').value;
    let description = document.getElementById('descriptionInput').value;
    let assigned = document.getElementById('assignedTo').value;
    let date = document.getElementById('date').value;
    let category = document.getElementById('category').value;
    let subtasksList = document.getElementById('subtaskList').children;

    containerCount++;

   
    localStorage.setItem('selectedPriority', selectedPriority);
    localStorage.setItem('sharedData', JSON.stringify({
        content:
        {
            title: taskTitle,
            description: description,
            assigned: assigned,
            date: date,
            category: category,
            subtasks: subtasksList.length,
        }, id: 'containerDiv' + containerCount
    }));
    
    window.location.href = 'board.html';

    document.getElementById('taskTitleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('assignedTo').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
}

function choose(priority) {
    let colorMap = { 'urgent': '#FF3D00', 'medium': '#FFA800', 'low': '#7AE229' };
    let setStyles = (elements, styles) => elements.forEach(e => e && Object.assign(e.style, styles));

    setStyles(document.querySelectorAll('.button'), { backgroundColor: '#fff' });
    setStyles(document.querySelectorAll('.button img'), { filter: 'brightness(1) invert(0)' });

    let [priorityButton, priorityImg] = [document.querySelector(`.${priority}`), document.querySelector(`.${priority} img`)];

    if (priorityButton && priorityImg && colorMap[priority]) {
        setStyles([priorityButton], { backgroundColor: colorMap[priority] });
        setStyles([priorityImg], { filter: 'brightness(0) invert(1)' });

        selectedPriority = priority;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    choose('medium');
});

function toggleCategoryOptions(event) {
    event = event || window.event;
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);

    let categoryOptions = document.getElementById("categoryOptions");
    categoryOptions.style.display = (window.getComputedStyle(categoryOptions).display !== "none") ? "none" : "block";
}

function updateSelectedCategory(category) {
    let selectedCategoryInput = document.querySelector(".category-dropdown");
    let categoryOptions = document.getElementById("categoryOptions");

    if (selectedCategoryInput && categoryOptions) {
        selectedCategoryInput.value = selectedCategoryInput.value !== category ? category : "";

        categoryOptions.style.display = "none";
    }
}

function changeSubImg() {
    let subImgContainer = document.getElementById("subImgContainer");
    let subImg = subImgContainer.querySelector('img');

    if (!subImg) {
        subImgContainer.innerHTML = `
            <div class="subImgContainer">
                <div class="add-subtask-line"></div>
                <img onclick="revertSubImg()" src="./img/close_modal.svg" alt="">
            </div>
        `;

        document.addEventListener('click', handleOutsideClick);
    }
}

function closeSubImage() {
    revertSubImg();
}

function revertSubImg() {
    document.getElementById("subImgContainer").innerHTML = '';
    document.getElementById('newSubtaskInput').value = '';
    document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
    let subImgContainer = document.getElementById('subImgContainer');
    let inputField = document.querySelector('.subtasks-input');

    if (subImgContainer && !subImgContainer.contains(event.target) && inputField && !inputField.contains(event.target)) {
        revertSubImg();
    }
}

function addSubtask() {
    let inputElement = document.getElementById('newSubtaskInput');
    let subtaskList = document.getElementById('subtaskList');
    let subtaskText = inputElement.value.trim();

    if (subtaskText !== '') {
        let subtaskHTML = `
            <div class="subtask-item">
                <div class="subtask-text">${subtaskText}</div>
                <div class="delete-button" onclick="deleteSubtaskItem(this.parentNode)">
                    <img src="./img/iconoir_cancel.svg" alt="">
                </div>
            </div>
        `;
        subtaskList.innerHTML += subtaskHTML;
        inputElement.value = '';
    }
}

function deleteSubtaskItem(subtaskItem) {
    subtaskItem.remove();
}

function clearFields() {
    let inputFields = document.querySelectorAll('.Add-task input, .Add-task textarea');
    let AllInputFields = document.querySelectorAll('.Add-task-content input, .Add-task-content textarea');

    inputFields.forEach(field => {
        field.value = '';
    });

    AllInputFields.forEach(field => {
        field.value = '';
    });

    choose('medium');
    updateSelectedCategory('');

    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
}

/////////////////////// Backup der Funktionen welche grundsächlich funktionieren /////////////////////////////////////////////

//let titles = JSON.parse(localStorage.getItem('titles')) || [];
//let descriptions = JSON.parse(localStorage.getItem('descriptions')) || [];
//let assignedTos = JSON.parse(localStorage.getItem('assignedTos')) || [];
//let dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];
//let selectedPrios = JSON.parse(localStorage.getItem('selectedPrios')) || [];
//let selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
//let subTasks = JSON.parse(localStorage.getItem('subTasks')) || [];

//function addToBoard() {
//    let form = document.getElementById('taskForm');
//    let title = document.querySelector('.title-input').value;
//    let description = document.querySelector('.description-input').value;
//    let assignedTo = document.querySelector('.assigned-dropdown').value;
//    let dueDate = document.querySelector('.due-date-input').value;
//    let selectedPrio = selectedPriority;
//    let selectedCategory = document.querySelector('.category-dropdown').value;
//    let subTaskElements = document.querySelectorAll('.subtask-item .subtask-text');
//    let subTasks = Array.from(subTaskElements).map(subtask => subtask.textContent);
//    
//    // Zum programmieren außer Kraft gesetzt
//    //if (!title || !description || !dueDate || !selectedCategory) {
//    //    return;
//    //}
//
//    titles.push(title);
//    descriptions.push(description);
//    assignedTos.push(assignedTo);
//    dueDates.push(dueDate);
//    selectedPrios.push(selectedPrio);
//    selectedCategories.push(selectedCategory);
//    
//    localStorage.setItem('titles', JSON.stringify(titles));
//    localStorage.setItem('descriptions', JSON.stringify(descriptions));
//    localStorage.setItem('assignedTos', JSON.stringify(assignedTos));
//    localStorage.setItem('dueDates', JSON.stringify(dueDates));
//    localStorage.setItem('selectedPrios', JSON.stringify(selectedPrios));
//    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
//    localStorage.setItem('subTasks', JSON.stringify(subTasks));
//
//    renderCard();
//    clearFields();
//    window.location.href = 'board.html';
//}

//function renderCard() {
//    let renderCardContainer = document.getElementById('renderCard');
//    console.log(renderCardContainer);
//    if (renderCardContainer) {
//        let title = titles.join(', ');
//        let description = descriptions.join(', ');
//        let assignedTo = assignedTos.join(', ');
//        let dueDate = dueDates.join(', ');
//        let selectedPrio = selectedPrios.join(', ');
//        let selectedCategory = selectedCategories.join(', ');
//        let subTask = subTasks.join(', ');
//        let createdSubtasks = subTasks.length;
//        let categoryClass = selectedCategory === 'Technical task' ? 'technical-task' : 'user-story';
//
//        let cardContent = `
//                <div class="card-user-story">
//                <p class="${categoryClass}">${selectedCategory}</p>
//                    <div class="title-container">
//                        <p class="card-title">${title}</p>
//                        <p class="card-content">${description}</p>
//                    </div>
//                    <p style="display: none">${dueDate}</p>
//                    <div class="progress">
//                        <div class="progress-bar"></div>
//                        <div class="subtasks">0/${createdSubtasks} Subtasks</div>
//                </div>
//                    <div class="to-do-bottom">
//                        <div class="initial-container">
//                            <p >${assignedTo}</p>
//                            <div class="profile-badge">
//                                <img src="./img/Ellipse 5.svg" alt="">
//                            </div>
//                            <div class="profile-badge">
//                                <img src="./img/Ellipse 5 (1).svg" alt="">
//                            </div>
//                            <div class="profile-badge">
//                                <img src="./img/Ellipse 5 (2).svg" alt="">
//                            </div>
//                        </div>
//                        <div class="priority-symbol">
//                        <img src="${getPriorityIcon(selectedPrio)}" alt="">
//                        </div>
//                </div>
//            `;
//        renderCardContainer.innerHTML = cardContent;
//    }
//}