function choose(priority) {
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = '#fff';
    });

    document.querySelectorAll('.button img').forEach(img => {
        img.style.filter = 'brightness(1) invert(0)';
    });

    if (priority === 'urgent') {
        document.querySelector('.urgent').style.backgroundColor = '#FF3D00';
    } else if (priority === 'medium') {
        document.querySelector('.medium').style.backgroundColor = '#FFA800';
    } else if (priority === 'low') {
        document.querySelector('.low').style.backgroundColor = '#7AE229';
    }
    document.querySelector(`.${priority} img`).style.filter = 'brightness(0) invert(1)';
}

function changeSubImg() {
    const subImgContainer = document.getElementById("subImgContainer");
    const subImg = subImgContainer.querySelector('img');

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
    document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
    const subImgContainer = document.getElementById('subImgContainer');
    const inputField = document.querySelector('.subtasks-input');

    if (subImgContainer && !subImgContainer.contains(event.target) && inputField && !inputField.contains(event.target)) {
        revertSubImg();
    }
}

function addSubtask() {
    let inputElement = document.getElementById('newSubtaskInput');
    let subtaskList = document.getElementById('subtaskList');
    let subtaskText = inputElement.value.trim();

    if (subtaskText !== '') {
        const subtaskItem = document.createElement('div');
        subtaskItem.classList.add('subtask-item');
        subtaskItem.textContent = subtaskText;

        // X (Löschen-Symbol) erstellen
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            // Funktion zum Löschen des Subtask-Elements aufrufen
            subtaskItem.remove();
        });

        // Das "X" dem Subtask-Element hinzufügen
        subtaskItem.appendChild(deleteButton);

        // Das Subtask-Element der Liste hinzufügen
        subtaskList.appendChild(subtaskItem);

        // Eingabefeld leeren
        inputElement.value = '';
    }
}