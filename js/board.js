let currentDraggedElement;

function createTask() {
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


/**
 * id of the dragged task will be stored in currentDraggedElement
 * 
 * @param {number} id - id of selected task
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * drop a dragged task in the desired section
 * 
 * @param {object} ev - event object
 */
function allowDrop(ev) {
    ev.preventDefault();
}