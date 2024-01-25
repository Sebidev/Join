function choose(priority) {
    let colorMap = { 'urgent': '#FF3D00', 'medium': '#FFA800', 'low': '#7AE229' };
    let setStyles = (elements, styles) => elements.forEach(e => e && Object.assign(e.style, styles));

    setStyles(document.querySelectorAll('.button'), { backgroundColor: '#fff' });
    setStyles(document.querySelectorAll('.button img'), { filter: 'brightness(1) invert(0)' });

    let [priorityButton, priorityImg] = [document.querySelector(`.${priority}`), document.querySelector(`.${priority} img`)];

    if (priorityButton && priorityImg && colorMap[priority]) {
        setStyles([priorityButton], { backgroundColor: colorMap[priority] });
        setStyles([priorityImg], { filter: 'brightness(0) invert(1)' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
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
            <div class="delete-button" onclick="deleteSubtaskItem(this.parentNode)"><img src="./img/iconoir_cancel.svg" alt=""></div>
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