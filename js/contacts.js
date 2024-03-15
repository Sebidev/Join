/**
 * @file contacts.js
 * This file contains the JavaScript code for the contacts.html page.
 */

import { editContactTemplate, addContactTemplate, add_new_conatct_btnTemplate } from './contacts_template.js';

let editcontact_innerHTML = editContactTemplate;
let addcontact_innerHTML = addContactTemplate;
let add_new_conatct_btn_innerHTML = add_new_conatct_btnTemplate;
let isMobile = window.innerWidth <= 1370;

let overlay;
let contactModal;
let showMoreMenuButton;

/**
 * This function is called when the user clicks on the "Add Contact" button. It creates a modal window with a form to add a new contact.
 */
function addContact() {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
    
    contactModal = document.createElement("div");
    contactModal.id = "contactModal";
    document.body.appendChild(contactModal);
    
    let formDiv = document.createElement("div");
    contactModal.innerHTML += addcontact_innerHTML;
    contactModal.appendChild(formDiv);

    overlay.style.display = "block";
    contactModal.style.display = "block";

    setTimeout(() => {
        contactModal.classList.add('show');
    }, 0);
}

window.addContact = addContact;
window.closeContactModal = closeContactModal;

/**
 * This function is called when the user clicks on the "Close" button in the modal window. It removes the modal window from the DOM.
 */
function closeContactModal() {
    let overlay = document.getElementById('overlay');
    let contactModal = document.getElementById('contactModal');

    if (overlay && contactModal) {
        contactModal.classList.remove('show');
        setTimeout(() => {
            overlay.parentNode.removeChild(overlay);
            contactModal.parentNode.removeChild(contactModal);
        }, 200);
    }
}

/**
 * This function generates a random id for a new contact.
 * @returns a random id
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

let numbers = [0, 1, 2, 3, 4];
let index = numbers.length;

/**
 * This function shuffles the elements of an array.
 * @param {*} array 
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * This function simulates the rolling of a dice. It returns a random number between 0 and 4.
 */
function rollDice() {
    if (index === numbers.length) {
        shuffleArray(numbers);
        index = 0;
    }

    return numbers[index++];
}

window.saveContact = saveContact;

/**
 * This function is called when the user clicks on the "Save" button in the modal window. It saves the new contact to the local storage.
 */
async function saveContact() {
    let form = document.getElementById('addcontactForm');

    if (form.checkValidity()) {
        let name = document.querySelector('#addcontactForm input[name="name"]').value;
        let email = document.querySelector('#addcontactForm input[name="email"]').value;
        let phone = document.querySelector('#addcontactForm input[name="phone"]').value;

        let contact = {
            id: generateId(),
            avatarid: rollDice(),
            name: name,
            email: email,
            phone: phone
        };

        let contacts;
        if (isUserLoggedIn) {
            let users = JSON.parse(await getItem('users'));
            if (users[currentUser]) {
                contacts = users[currentUser].contacts || [];
            } else {
                console.error('User not found:', currentUser);
            }
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        }

        contacts.push(contact);
        contacts.sort((a, b) => a.name.localeCompare(b.name));

        if (isUserLoggedIn) {
            users[currentUser].contacts = contacts;
            await setItem('users', JSON.stringify(users));
        } else {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        }

        document.querySelector('#addcontactForm').reset();

        successMsg();
        closeContactModal();
    } else {
        form.reportValidity();
    }
}

/**
 * This function displays a success message when a new contact has been added.
 */
async function successMsg() {
    let successMessage = document.getElementById('newcontact-message');
    let successOverlay = document.getElementById('newcontact-overlay');
    successOverlay.classList.add('visible');
    successMessage.classList.add('success-message-visible');

    await new Promise(resolve => setTimeout(() => {
        resolve();
        reloadContacts();
        successOverlay.classList.remove('visible');
        successMessage.classList.remove('success-message-visible');
    }, 800));
}


window.loadContacts = loadContacts;

/**
 * This function loads the contacts from the local storage and displays them on the contacts.html page.
 */
async function loadContacts() {
    let contacts;

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('User not found:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    let lastInitial;

    function createContactHTML(contact) {
        let initialLetterHTML = '';
        let currentInitial = contact.name.charAt(0).toUpperCase();
        if (currentInitial !== lastInitial) {
            initialLetterHTML = `<div class="initial_letter">${currentInitial}</div>
            <div class="line"><svg xmlns="http://www.w3.org/2000/svg" width="354" height="2" viewBox="0 0 354 2" fill="none"><path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/></svg></div>`;
            lastInitial = currentInitial;
        }

        if (currentUser !== undefined && users[currentUser] && users[currentUser].firstName) {
            if (contact.name === users[currentUser].firstName) {
                contact.name += " (You)";
            }
        }

        return `
            ${initialLetterHTML}
            <div class="contactentry" id=${contact.id}>
                <div class="avatar">
                    <img src="img/Ellipse5-${contact.avatarid}.svg"></img>
                    <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0].toUpperCase()).join('')}</div>
                </div>
                <div class="contactentry_info">
                    <div class="contactentry_name">${contact.name}</div>
                    <div class="contactentry_email">${contact.email}</div>
                </div>
            </div>
        `;
    }

    let contactsHTML = '';

    for (let contact of contacts) {
        contactsHTML += createContactHTML(contact);
    }

    document.querySelector('.contacts_container').innerHTML += contactsHTML;

    for (let contact of contacts) {
        let contactElement = document.getElementById(contact.id);

        contactElement.addEventListener('click', function() {
            let contactEntries = document.querySelectorAll('.contactentry');
            for (let entry of contactEntries) {
                entry.classList.remove('contact_selected');
            }

            contactElement.classList.add('contact_selected');
            floatingContactRender(contact.id);
        });
    }
}

window.editContact = editContact;

/**
 * This function is called when the user clicks on the "Edit" button in the contacts.html page. 
 * It creates a modal window with a form to edit a contact.
 * @param {*} contactid
 */
async function editContact(contactid){
    let contacts;

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('User not found:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    let contact = contacts.find(contact => contact.id === contactid);

    if (contact) {
        overlay = document.createElement("div");
        overlay.id = "overlay";
        document.body.appendChild(overlay);
        contactModal = document.createElement("div");
        contactModal.id = "contactModal";
        document.body.appendChild(contactModal);
        contactModal.innerHTML += editcontact_innerHTML;

        let avatarContainerDiv = document.createElement("div");
        avatarContainerDiv.classList.add("avatar_container");
        
        let avatarDiv = document.createElement("div");
        avatarDiv.classList.add("avatar_contactModal");
        
        let avatarHTML = `
        <img class="avatar_contactModal" src="img/Ellipse5-${contact.avatarid}.svg"></img>
        <div class="avatar_contactModal_initletter">${contact.name.charAt(0).toUpperCase()}</div>
        `;
        
        avatarDiv.innerHTML += avatarHTML;
        avatarContainerDiv.appendChild(avatarDiv);
        contactModal.appendChild(avatarContainerDiv);

        let close_button1_DIV = document.createElement("div");
        let close_button1_DIV_HTML = `<img class="close_button1" onclick="closeContactModal()" src="img/close.svg"></img>`;

        close_button1_DIV.innerHTML = close_button1_DIV_HTML;
        contactModal.appendChild(close_button1_DIV);

        let formDiv = document.createElement("div");

        let editcontact_formHTML = `
        <form id="editcontact_form" class="form_container">
            <div class="input_container">
                <input type="text" class="textfield_newcontact" id="name" name="name" placeholder="Name" value="${contact.name}" pattern="^[a-zA-Z0-9_-]*$" title="Bitte nur Buchstaben, Zahlen und die Sonderzeichen Bindestrich und Unterstrich eingeben." required>
                <img src="img/person.svg" class="textfield_image">
            </div>
            <div class="input_container">
                <input type="email" class="textfield_newcontact" id="email" name="email" placeholder="Email" value="${contact.email}" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Bitte eine gültige E-Mail-Adresse eingeben." required>
                <img src="img/mail.svg" class="textfield_image">
            </div>
            <div class="input_container">
                <input type="text" class="textfield_newcontact" id="phone" name="phone" placeholder="Phone" value="${contact.phone}" pattern="^[+]?[0-9]*$" title="Bitte nur Zahlen und optional ein Pluszeichen am Anfang eingeben." required>
                <img src="img/call.svg" class="textfield_image">
            </div>
            <div class="button_container">
                <div class="delete_button" onclick="delContact('${contact.id}')">Delete<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="close"><mask id="mask0_126532_4110" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_126532_4110)"><path id="close_2" d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" fill="#2A3647"/></g></g>
                </svg></div>
                <div class="createcontact_button hover-color" onclick="saveEditedContact('${contact.id}')">Save<img src="img/check.svg"></img></div>
            </div>
        </form>`;

        contactModal.innerHTML += editcontact_formHTML;
        contactModal.appendChild(formDiv);
        overlay.style.display = "block";
        contactModal.style.display = "block";
        setTimeout(() => {
            contactModal.classList.add('show');
        }, 0);
    }
    else {
        console.log(`No contact found with ID ${contactid}.`);
    }
}

window.saveEditedContact = saveEditedContact;

/**
 * This function is called when the user clicks on the "Save" button in the modal window. It saves the edited contact to the local storage.
 * @param {*} contactid
 */
async function saveEditedContact(contactid) {
    let form = document.getElementById('editcontact_form');

    if (form.checkValidity()) {
        let contacts;

        if (isUserLoggedIn) {
            let users = JSON.parse(await getItem('users'));
            if (users[currentUser]) {
                contacts = users[currentUser].contacts;
            } else {
                console.error(`No contact found with ID ${contactid}.`);
            }
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        }

        let contact = contacts.find(contact => contact.id === contactid);

        if (contact) {
            let name = document.getElementById('name').value;
            let email = document.getElementById('email').value;
            let phone = document.getElementById('phone').value;

            contact.name = name;
            contact.email = email;
            contact.phone = phone;
            
            contacts.sort((a, b) => a.name.localeCompare(b.name));
            if (isUserLoggedIn) {
                let users = JSON.parse(await getItem('users'));
                users[currentUser].contacts = contacts;
                await setItem('users', JSON.stringify(users));
            } else {
                localStorage.setItem('contacts', JSON.stringify(contacts));
            }

            closeContactModal();

            reloadContacts();
            floatingContactRender(contactid);
        }
        else {
            console.log(`No contact found with ID ${contactid}.`);
        }
    } else {
        form.reportValidity();
    }
}

window.delContact = delContact;

/**
 * This function is called when the user clicks on the "Delete" button in the modal window. It deletes the contact from the local storage.
 * @param {*} contactid 
 */
async function delContact(contactId) {
    let contacts;

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('User not found:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    contacts = contacts.filter(contact => contact.id !== contactId);

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        users[currentUser].contacts = contacts;
        await setItem('users', JSON.stringify(users));
    } else {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    reloadContacts();
    clearFloatingContact();

    if (isMobile) {
        backButtonHandler();
    }
}


window.showMoreMenu = showMoreMenu;

/**
 * This function is called when the user clicks on the "More" button in the contacts.html page.
 * It shows or hides the edit menu for the contact.
 * only for mobile visible
 * @param {*} event 
 */
function showMoreMenu(event) {
    let elements = document.querySelectorAll(".contact-editmenu_entriy_mobile, .contact-editmenu_mobile");

    elements.forEach(function(element) {
        let currentDisplay = window.getComputedStyle(element).display;
        if (currentDisplay === "none") {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });

    if (window.getComputedStyle(elements[0]).display !== "none") {
        showMoreMenuButton = event.target;
        document.addEventListener('click', hideMenuOnClickOutside);
    }
}

/**
 * This function hides the edit menu when the user clicks outside of the menu.
 * @param {*} event 
 */
function hideMenuOnClickOutside(event) {
    let elements = document.querySelectorAll(".contact-editmenu_entriy_mobile, .contact-editmenu_mobile");

    if (event.target === showMoreMenuButton) {
        return;
    }

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        if (element.contains(event.target)) {
            return;
        }
    }

    elements.forEach(function(element) {
        element.style.display = "none";
    });

    document.removeEventListener('click', hideMenuOnClickOutside);
}


function reloadContacts() {
    let contactsContainer = document.getElementById('contactentry');
    contactsContainer.innerHTML = add_new_conatct_btn_innerHTML;
    loadContacts();
}

function clearFloatingContact() {
    let floating_contactElement = document.getElementById("floating_contact");

    while (floating_contactElement.firstChild) {
        floating_contactElement.removeChild(floating_contactElement.firstChild);
    }
}

/**
 * This function renders the floating contact window with the contact information.
 * @param {*} contactid
 */
async function floatingContactRender(contactid){
    let contacts;

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('User not found:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    let contact = contacts.find(contact => contact.id === contactid);

    if (contact) {
        if (currentUser !== undefined && users[currentUser] && users[currentUser].firstName) {
            if (contact.name === users[currentUser].firstName) {
                contact.name += " (You)";
            }
        }

        let floating_contactHTML = `
        <div class="floating_contact">
            <div class="floating_contact_avatar">
                <img src="img/Ellipse5-${contact.avatarid}.svg"></img>
                    <div class="floating_contact_initletter">${contact.name.charAt(0).toUpperCase()}</div>
                </img>
            </div>
            <div class="column">
            <div class="floating_contact_name">${contact.name}</div>
            <div class="row">
                <div class="floating_contact_buttons" onclick="editContact('${contact.id}')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="edit"><mask id="mask0_130935_4276" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4276)"><path id="edit_2" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/></g></g>
                </svg>
                    Edit
                </div>
                <div class="floating_contact_buttons" onclick="delContact('${contact.id}')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="delete"><mask id="mask0_130935_4270" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4270)"><path id="delete_2" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/></g></g>
                </svg>
                    Delete
                </div>
            </div>
            </div>
        </div>
        <br>
        <div class="floating_contact_info">Contact Information</div>
        <br>
        <div class="floating_contact_email">
            <div class="floating_contact_emailtext">Email</div>
            <div class="floating_contact_emailadresse">${contact.email}</div>
        </div>
        <br>
        <div class="floating_contact_phone">
            <div class="floating_contact_phonetext">Phone</div>
            <div class="floating_contact_phonenumber">${contact.phone}</div>
        </div>
        <div class="more_button_mobile" onclick='showMoreMenu(event)'><img src="img/more.svg"></img></div>
        <div class="contact-editmenu_mobile">
            <div class="contact-editmenu_entriy_mobile" onclick="editContact('${contact.id}')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="edit"><mask id="mask0_130935_4276" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4276)"><path id="edit_2" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/></g></g>
            </svg>
                Edit
            </div>
            <div class="contact-editmenu_entriy_mobile" onclick="delContact('${contact.id}')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="delete"><mask id="mask0_130935_4270" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_130935_4270)"><path id="delete_2" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/></g></g>
            </svg>
                Delete
            </div>
        </div>
        `;

        let floating_contactElement = document.getElementById("floating_contact");

        while (floating_contactElement.firstChild) {
            floating_contactElement.removeChild(floating_contactElement.firstChild);
        }

        let floating_contactDiv = document.createElement("div");
        floating_contactDiv.innerHTML = floating_contactHTML;
        floating_contactElement.appendChild(floating_contactDiv);
    } else {
        console.log(`No contact found with ID ${contactid}.`);
    }
} 

/**
 * This function is called when the contacts page is loaded. 
 * It loads the contacts from the local storage and displays them on the contacts.html page.
 */
document.addEventListener('DOMContentLoaded', async (event) => {
    await initUser();
    loadContacts();
});

/**
 * This function is called when the user clicks on the "Back" button in the contacts.html page.
 * It hides the floating contact window.
 * only for mobile visible
 */
window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 1370;
});
