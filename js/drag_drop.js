let currentDraggedElement;

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
