/**
 * @file contacts-mobile.js
 * This file is used to handle the mobile view of the contacts page.
 *
 */

let isMobile = window.matchMedia("only screen and (max-width: 1370px)").matches;

let contactEntry = document.getElementById('contactentry');
let backButton = document.querySelector('.backArrow');

/**
 * @function handleMobileView
 * This function is used to handle the mobile view of the contacts page.
 * It adds event listeners to the contact entry and back button if the view is mobile.
 * It removes event listeners from the contact entry and back button if the view is not mobile.
 */
let handleMobileView = () => {
    let contactsContainer = document.querySelector('.contacts_container');
    let contactTitle = document.querySelector('.contact_title');
    let floatingContactContainer = document.querySelector('.floating_contact_container');

    if (isMobile) {
        contactEntry.addEventListener('click', mobileClickHandler);
        backButton.addEventListener('click', backButtonHandler);
    } else {
        contactEntry.removeEventListener('click', mobileClickHandler);
        backButton.removeEventListener('click', backButtonHandler);
        
        contactsContainer.style.display = '';
        contactTitle.style.display = '';
        floatingContactContainer.style.display = '';
    }
}

/**
 * @function mobileClickHandler
 * This function is used to handle the click event on the contact entry in the mobile view.
 * It hides the contacts container and shows the contact title and floating contact container.
 * It also removes the contact_selected class from the contact entry.
 */
let mobileClickHandler = (event) => {
    if (event.target.closest('.add_new_contact_btn')) {
        return;
    }

    let contactsContainer = document.querySelector('.contacts_container');
    contactsContainer.style.display = 'none';

    let contactTitle = document.querySelector('.contact_title');
    let floatingContactContainer = document.querySelector('.floating_contact_container');
    contactTitle.style.display = 'block';
    floatingContactContainer.style.display = 'block';
}

/**
 * @function backButtonHandler
 * This function is used to handle the click event on the back button in the mobile view.
 * It hides the contact title and floating contact container and shows the contacts container.
 * It also removes the contact_selected class from the contact entry.
 */
let backButtonHandler = (event) => {
    if (event && event.target && event.target.closest('.add_new_contact_btn')) {
        return;
    }

    let contactTitle = document.querySelector('.contact_title');
    let floatingContactContainer = document.querySelector('.floating_contact_container');
    contactTitle.style.display = 'none';
    floatingContactContainer.style.display = 'none';

    let contactentries = document.querySelectorAll('.contactentry');
    contactentries.forEach((contactentry) => {
        contactentry.classList.remove('contact_selected');
    });

    let contactsContainer = document.querySelector('.contacts_container');
    contactsContainer.style.display = 'flex';
}

window.backButtonHandler = backButtonHandler;
handleMobileView();

/**
 * @event resize
 * This event is used to handle the resize event.
 * It checks if the view is mobile and calls the handleMobileView function.
 * It also updates the isMobile variable.
 */
window.addEventListener('resize', () => {
    isMobile = window.matchMedia("only screen and (max-width: 1370px)").matches;
    handleMobileView();
});