/**
 * drag and drop functionality
 * @file drag_drop.js
 */

let currentDraggedElement;

/** add a class to highlight a column
 * 
 * @param {string} columnId - current column id
 */

function highlight(columnId) {
    let columnElement = document.getElementById(columnId);
    if (columnElement) {
        columnElement.classList.add('dragdrop-highlight');
    }
}

/** remove the highlight class from the column
 * 
 * @param {string} columnId - current column id
 */

function removeHighlight(columnId) {
    let columnElement = document.getElementById(columnId);
    if (columnElement) {
        columnElement.classList.remove('dragdrop-highlight');
    }
}

/** prevents that you can place a task on another task via drag and drop
 * 
 * @param {string} ev - event
 */

function preventDragOver(ev) {
    ev.preventDefault();
}

/** start dragging an element
 * 
 * @param {string} ev - event
 */

function startDragging(ev) {
    currentDraggedElement = ev.target.id;
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('tilted');
}

/** stop dragging an element
 * 
 * @param {string} ev - event
 */

function endDragging(ev) {
    currentDraggedElement = null;
    ev.target.classList.remove('tilted');
}

/** allows an element to be dropped
 * 
 * @param {string} ev - event
 */

function allowDrop(ev) {
    ev.preventDefault();
}

/** makes it possible to drop an element in a new column and update placeholder / column id
 * 
 * @param {string} ev - event
 */

async function drop(ev) {
    ev.preventDefault();
    let taskId = ev.dataTransfer.getData("text");
    let newColumnId = ev.target.closest('.board-column-content').id;

    document.getElementById(newColumnId).appendChild(document.getElementById(taskId));

    removeHighlight(newColumnId);
    await updateTaskColumn(taskId, newColumnId);
    updatePlaceholderText();
}

/**
 * update the placeholder text depending on the column
 */

function updatePlaceholderText() {
    let columnIds = ['todo-column', 'progress-column', 'await-column', 'done-column'];

    for (let columnId of columnIds) {
        let columnElement = document.getElementById(columnId);

        if (columnElement && columnElement.childElementCount === 0 && !document.getElementById(columnId + '-placeholder')) {
            addPlaceholderText(columnId);
        } else if (columnElement && columnElement.childElementCount === 1 && document.getElementById(columnId + '-placeholder')) {
            continue;
        } else if (columnElement && columnElement.childElementCount > 1) {
            removePlaceholderText(columnId);
        }
    }
}

/** update the task column in local or remote storage if dragged to another column
 * 
 * @param {string} taskId - current dragged task
 * @param {string} newColumnId - new column id
 */

async function updateTaskColumn(taskId, newColumnId) {
    let tasks;

    if (isUserLoggedIn) {
        // User is logged in, get the tasks from the remote storage
        let usersString = await getItem('users');
        let users = JSON.parse(usersString);
        tasks = users[currentUser].tasks;
    } else {
        // User is a guest, get the tasks from the local storage
        let tasksString = localStorage.getItem('tasks');
        tasks = tasksString ? JSON.parse(tasksString) : [];
    }

    // Find the task with the given id
    let task = tasks.find(task => task.id === taskId);

    if (task) {
        // Update the boardColumn property
        task.content.boardColumn = newColumnId;

        if (isUserLoggedIn) {
            // User is logged in, save the updated tasks to the remote storage
            users[currentUser].tasks = tasks;
            await setItem('users', JSON.stringify(users));
        } else {
            // User is a guest, save the updated tasks to the local storage
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
}