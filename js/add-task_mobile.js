/**
 * @file add-task-mobile.js
 * @summary JavaScript file for the Add Task page on mobile devices.
 * This file contains the JavaScript code for the Add Task page on mobile devices.
 * It contains the code for rearranging the elements on the page when the screen size changes.
 */

let hasMovedElements = false;
let originalOrder = [];

function rearrangeElements() {
    try {
        if (window.innerWidth < 768 && !hasMovedElements) {
            let element = document.querySelector('.prio-container');
            let target = document.querySelector('.assigned-to-container');
            if (element && target && target.parentNode) {
                originalOrder.push({element: element, nextSibling: element.nextSibling, parent: element.parentNode});
                target.parentNode.insertBefore(element, target);
            }

            let element1 = document.querySelector('.due-date-container');
            let target1 = document.querySelector('.assigned-to-container');
            if (element1 && target1 && target1.parentNode) {
                originalOrder.push({element: element1, nextSibling: element1.nextSibling, parent: element1.parentNode});
                target1.parentNode.insertBefore(element1, target1);
            }

            let element2 = document.querySelector('.category-container');
            let target2 = document.querySelector('.assigned-to-container');
            if (element2 && target2 && target2.parentNode) {
                originalOrder.push({element: element2, nextSibling: element2.nextSibling, parent: element2.parentNode});
                target2.parentNode.insertBefore(element2, target2);
            }
            
            let element3 = document.querySelector('.assigned-to-container');
            let target3 = document.querySelector('.subtasks-container');
            if (element3 && target3 && target3.parentNode) {
                originalOrder.push({element: element3, nextSibling: element3.nextSibling, parent: element3.parentNode});
                target3.parentNode.insertBefore(element3, target3);
            }

            hasMovedElements = true;
        } else if (window.innerWidth >= 768 && hasMovedElements) {
            originalOrder.reverse().forEach(item => {
                if (item.nextSibling) {
                    item.parent.insertBefore(item.element, item.nextSibling);
                } else {
                    item.parent.appendChild(item.element);
                }
            });

            hasMovedElements = false;
            originalOrder = [];
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function addTaskMobile() {
    if ('onorientationchange' in window) {
        window.addEventListener('orientationchange', rearrangeElements);
    } else {
        window.addEventListener('resize', rearrangeElements);
    }
}

window.addEventListener('load', function() {
    addTaskMobile();
    rearrangeElements();
});
