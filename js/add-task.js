let containerCount = 0;
let selectedInitialsArray = [];


if (window.location.pathname.endsWith("add-task.html")) {
    document.addEventListener('click', function (event) {
        let dropdown = document.getElementById('contactDropdown');
        if (!event.target.matches('.arrow_down') && !event.target.closest('.assigned-to-container')) {
            dropdown.style.display = 'none';
        }
    });
}

async function showDropdown() {
    let dropdownContent = document.getElementById("contactDropdown");
    dropdownContent.innerHTML = "";

    let contacts = getContacts();

    contacts.forEach(contact => {
        let isSelected = selectedInitialsArray.some(selectedContact => selectedContact.id === contact.id);

        let contactDiv = createContactDiv(contact, isSelected);
        dropdownContent.appendChild(contactDiv);
    });

    dropdownContent.style.display = 'block';
}

function getContacts() {
    return isUserLoggedIn ? getUserContacts() : getLocalStorageContacts();
}

function getUserContacts() {
    let users = JSON.parse(getItem('users'));
    return users[currentUser]?.contacts || [];
}

function getLocalStorageContacts() {
    return JSON.parse(localStorage.getItem('contacts')) || [];
}

function createContactDiv(contact, isSelected) {
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
    contactDiv.addEventListener("mousedown", (event) => {
        event.preventDefault();
        updateSelectedContacts(contact, isSelected ? 'remove' : 'add');
    });
    return contactDiv;
}

function updateSelectedContacts(contact, action) {
    let index = selectedInitialsArray.findIndex(c => c.id === contact.id);

    if (action === 'add' && index === -1) {
        selectedInitialsArray.push(contact);
    } else if (action === 'remove' && index !== -1) {
        selectedInitialsArray.splice(index, 1);
    }

    saveAndDisplaySelectedContacts();
}

function saveAndDisplaySelectedContacts() {
    saveSelectedContacts();
    selectContact();
}

function createSelectedContactDiv(contact) {
    let selectedContactDiv = document.createElement("div");
    selectedContactDiv.innerHTML = `
        <div class="selected-contact" data-avatarid="${contact.avatarid}">
            <div class="contacts-img-initial">
                <img src="img/Ellipse5-${contact.avatarid}.svg" alt="${contact.name}">
                <div class="initials-overlay">${contact.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
            <div class="contact-delete-container">
                <div>
                    <span>${contact.name}</span>
                </div>
                <span class="remove-contact" onclick="removeContact(${contact.avatarid})">
                    <img src="./img/delete.svg">
                </span>
            </div>
        </div>
    `;
    return selectedContactDiv;
}

function selectContact() {
    let selectedContactsContainer = document.getElementById("selectedContactsContainer");
    selectedContactsContainer.innerHTML = "";

    selectedInitialsArray.forEach(contact => {
        let selectedContactDiv = createSelectedContactDiv(contact);
        selectedContactsContainer.appendChild(selectedContactDiv);
    });
}

function saveSelectedContacts() {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedInitialsArray));
}

document.addEventListener('click', function (event) {
    if (event.target.matches('.arrow_down')) {
        showDropdown();
    }
});


function removeContact(contactavatarId) {
    let index = selectedInitialsArray.findIndex(contact => contact.avatarid === contactavatarId);

    if (index !== -1) {
        selectedInitialsArray.splice(index, 1);
        selectContact();

        let selectedContactsContainer = document.getElementById("selectedContactsContainer");
        let contactToRemove = selectedContactsContainer.querySelector(`[data-avatarid="${contactavatarId}"]`);

        if (contactToRemove) {
            selectedContactsContainer.removeChild(contactToRemove);
        }
    }
}



// --- addToBoard remote Storage attempt --- //
/*
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

    containerCount++;

    let task = {
    content: {
        title: taskTitle,
        description: description,
        date: date,
        prio: 0, 
        category: { name: category, color: 0 }, 
        assignedTo: selectedContacts, 
        subtasks: subtasksList.length, 
        boardColumn: 'todo-column', 
    },
        id: 'containerDiv' + containerCount
    };

    // Check if user is logged in
    if (isUserLoggedIn) {
        // Get the current user
        let users = JSON.parse(await getItem('users'));
        let currentUserObject = users.find(user => user.userID === currentUser);

        // Add the task to the user's tasks array
        currentUserObject.tasks.push(task);
        // Update the users array
        users = users.map(user => user.userID === currentUser ? currentUserObject : user);
        // Save the updated users array to storage
        await setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('selectedPriority', selectedPriority);
    localStorage.setItem('sharedData', JSON.stringify(task));

    // Zum Programmieren außer Kraft gesetzt
    //window.location.href = 'board.html';

    document.getElementById('taskTitleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('assignedTo').value = ''; // Beachten Sie, dass es kein Element mit ID 'assignedTo' gibt, bitte überprüfen Sie die ID
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
}
*/

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
    document.getElementById('assignedTo').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
}


function choose(priority) {
    debugger
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