let currentDraggedElement;

function preventDragOver(ev) {
    ev.stopPropagation();
}

function startDragging(ev) {
    currentDraggedElement = ev.target.id;
    ev.dataTransfer.setData("text", ev.target.id);
}

function endDragging(ev) {
    currentDraggedElement = null;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function drop(ev) {
    ev.preventDefault();
    var taskId = ev.dataTransfer.getData("text");
    var newColumnId = ev.target.id;

    // Move the task element
    ev.target.appendChild(document.getElementById(taskId));

    // Update the task data in the storage
    await updateTaskColumn(taskId, newColumnId);
}

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