let containerCount = 0;
/* let contacts = [
    { name: 'Anton Mayer', email: 'antom@gmail.com', initial: 'AM', imagePath: 'img/Ellipse5-2.svg' },
    { name: 'Anja Schulz', email: 'schulz@hotmail.com', initial: 'AS', imagePath: 'img/Ellipse5-0.svg' },
    { name: 'Benedikt Ziegler', email: 'benedikt@gmail.com', initial: 'BZ', imagePath: 'img/Ellipse5-3.svg' },
    { name: 'David Eisenberg', email: 'davidberg@gmail.com', initial: 'DE', imagePath: 'img/Ellipse5-1.svg' },
    { name: 'Eva Fischer', email: 'eva@gmail.com', initial: 'EF', imagePath: 'img/Ellipse5-2.svg' },
    { name: 'Emmanuel Mauer', email: 'emmanuelma@gmail.com', initial: 'EM', imagePath: 'img/Ellipse5-4.svg' },
    { name: 'Marcel Bauer', email: 'bauer@gmail.com', initial: 'MB', imagePath: 'img/Ellipse5-4.svg' },
    { name: 'Tatjana Wolf', email: 'wolf@gmail.com', initial: 'TW', imagePath: 'img/Ellipse5-4.svg' },
]; */
// window.contacts = contacts;
let selectedInitialsArray = [];

if (window.location.pathname.endsWith("add-task.html")) {
    document.addEventListener('click', function (event) {
        let dropdown = document.getElementById('contactDropdown');
        if (!event.target.matches('.arrow_down') && !event.target.closest('.assigned-to-container')) {
            dropdown.style.display = 'none';
        }
    });
}

function showDropdown() {
    let dropdownContent = document.getElementById("contactDropdown");
    dropdownContent.innerHTML = "";

    // Zuerst holen wir die Kontakte aus dem LocalStorage
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    contacts.forEach(contact => {
        let isSelected = selectedInitialsArray.includes(contact.initial);

        let contactDiv = document.createElement("div");
        contactDiv.innerHTML = `
            <label class="contacts">
                <div class="contacts-img-initial">
                    <img src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
                    <div class="initials-overlay">${contact.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
                <div class="dropdown-checkbox">
                    <div style="margin-left: 5px;">${contact.name}</div>
                    <input type="checkbox" class="contact-checkbox" ${isSelected ? 'checked' : ''}>
                </div>
            </label>
        `;
        contactDiv.addEventListener("click", () => toggleContactSelection(contact));
        dropdownContent.appendChild(contactDiv);
    });

    dropdownContent.style.display = 'block';
}

function toggleContactSelection(contact) {
    let index = selectedInitialsArray.indexOf(contact.initial);

    if (index !== -1) {
        selectedInitialsArray.splice(index, 1);
    } else {
        selectedInitialsArray.push(contact.initial);
    }

    selectContact(contact);
}

function selectContact(contact) {
    console.log("Selected Contacts:", selectedInitialsArray);

    let selectedContactsContainer = document.getElementById("selectedContactsContainer");
    selectedContactsContainer.innerHTML = "";

    selectedInitialsArray.forEach(initial => {
        let selectedContact = contacts.find(c => c.initial === initial);
        if (selectedContact) {
            let selectedContactDiv = document.createElement("div");
            selectedContactDiv.innerHTML = `
                <div class="selected-contact">
                    <div class="contacts-img-initial">
                        <img src="${selectedContact.imagePath}" alt="${selectedContact.name}">
                        <div class="initials-overlay">${selectedContact.initial}</div>
                    </div>
                    <span>${selectedContact.name} (${initial})</span>
                </div>
            `;
            selectedContactsContainer.appendChild(selectedContactDiv);
        }
    });
}

async function addToBoard() {
    debugger;

    let taskTitle = document.getElementById('taskTitleInput').value;
    let description = document.getElementById('descriptionInput').value;
    let date = document.getElementById('date').value;
    let category = document.getElementById('category').value;
    let subtasksList = document.getElementById('subtaskList').children;

    let selectedContactsContainer = document.getElementById("selectedContactsContainer");
    let selectedContacts = [];

    selectedContactsContainer.childNodes.forEach(contactDiv => {
        if (contactDiv.nodeType === 1) {
            let imgElement = contactDiv.querySelector('img');
            let initials = imgElement.nextElementSibling.textContent.trim();

            selectedContacts.push({
                imagePath: imgElement.src,
                initials: initials
            });
        }
    });

    console.log('taskTitle:', taskTitle);
    console.log('description:', description);
    console.log('date:', date);
    console.log('category:', category);
    console.log('subtasksList:', subtasksList);

    containerCount++;

    localStorage.setItem('selectedPriority', selectedPriority);

    localStorage.setItem('sharedData', JSON.stringify({
        content: {
            title: taskTitle,
            description: description,
            date: date,
            category: category,
            subtasks: subtasksList.length,
            selectedContacts: selectedContacts
        },
        id: 'containerDiv' + containerCount
    }));

    // Zum Programmieren außer Kraft gesetzt
    //window.location.href = 'board.html';

    document.getElementById('taskTitleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('assignedTo').value = ''; // Beachten Sie, dass es kein Element mit ID 'assignedTo' gibt, bitte überprüfen Sie die ID
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