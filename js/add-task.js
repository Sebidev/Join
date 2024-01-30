let containerCount = 0;
let contacts = [
    { name: 'Anton Mayer', email: 'antom@gmail.com', initial: 'AM' },
    { name: 'Anja Schulz', email: 'schulz@hotmail.com', initial: 'AS' },
    { name: 'Benedikt Ziegler', email: 'benedikt@gmail.com', initial: 'BZ' },
    { name: 'David Eisenberg', email: 'davidberg@gmail.com', initial: 'DE' },
    { name: 'Eva Fischer', email: 'eva@gmail.com', initial: 'EF' },
    { name: 'Emmanuel Mauer', email: 'emmanuelma@gmail.com', initial: 'EM' },
];
let selectedInitialsArray = [];

function showDropdown() {
    let dropdownContent = document.getElementById('contactDropdown');
    dropdownContent.innerHTML = '';

    // Hier wird das Array vor jedem Öffnen des Dropdowns zurückgesetzt
    selectedInitialsArray = [];

    contacts.forEach(function (contact) {
        let entry = document.createElement('label');
        entry.className = 'contacts';
        entry.innerHTML = `
            <form class="avatar">
                <img src="img/Ellipse5.svg">
                <div onclick="handleAddToBoard('${contact.initial}')" class="avatar_initletter">${contact.initial}</div>
            </form>
            <div class="contactentry_info">
                <div class="contactentry_name">${contact.name}</div>
            </div>
        `;

        entry.addEventListener('click', function () {
            let assignedToInput = document.getElementById('assignedTo');
            assignedToInput.value = `${contact.name} (${contact.initial})`;
            assignedToInput.dataset.initials = contact.initial;

            // Hier fügen wir die ausgewählten Initialen zum Array hinzu
            selectedInitialsArray.push(contact.initial);

            // Hier setzen wir die Initialen im localStorage
            localStorage.setItem('selectedInitialsArray', JSON.stringify(selectedInitialsArray));

            console.log('Assigned:', assignedToInput.value);
            console.log('Initials:', assignedToInput.dataset.initials);

            // Hier wird das Dropdown-Menü geschlossen
            dropdownContent.style.display = 'none';
        });

        dropdownContent.appendChild(entry);
    });

    // Hier wird das Dropdown-Menü geöffnet
    dropdownContent.style.display = 'block';
}

document.querySelector('.arrow_down').addEventListener('click', showDropdown);

document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('contactDropdown');
    if (!event.target.matches('.arrow_down') && !event.target.closest('.assigned-to-container')) {
        dropdown.style.display = 'none';
    }
});

async function addToBoard() {
    // Hier greifen wir auf das Array mit den ausgewählten Initialen zu
    let selectedInitialsArray = localStorage.getItem('selectedInitialsArray');
    let selectedInitials = selectedInitialsArray ? JSON.parse(selectedInitialsArray) : [];

    console.log('Selected Initials:', selectedInitials);

    if (selectedInitials.length > 0) {
        let assigned = selectedInitials.map(initial => {
            let matchingContact = contacts.find(contact => contact.initial === initial);
            return matchingContact ? `${matchingContact.name} (${initial})` : '';
        }).join(', ');

        let taskTitle = document.getElementById('taskTitleInput').value;
        let description = document.getElementById('descriptionInput').value;
        let date = document.getElementById('date').value;
        let category = document.getElementById('category').value;
        let subtasksList = document.getElementById('subtaskList').children;

        containerCount++;

        localStorage.setItem('selectedPriority', selectedPriority);
        localStorage.setItem('sharedData', JSON.stringify({
            content: {
                title: taskTitle,
                description: description,
                assigned: assigned,
                initials: selectedInitials,
                date: date,
                category: category,
                subtasks: subtasksList.length,
            },
            id: 'containerDiv' + containerCount
        }));

        // Zum Programmieren außer Kraft gesetzt
        window.location.href = 'board.html';

        document.getElementById('taskTitleInput').value = '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('assignedTo').value = '';
        document.getElementById('date').value = '';
        document.getElementById('category').value = '';

        console.log('After setting data in localStorage:', localStorage.getItem('sharedData'));
    } else {
        console.error('No selected initials available.');
    }
}

function handleAddToBoard() {
    // Hier wählen wir den ersten Kontakt aus dem Array aus und rufen addToBoard auf
    let selectedContact = [contacts[0]];
    addToBoard(selectedContact);
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