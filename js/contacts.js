/**
 * @file contacts.js
 * @description This file contains the JavaScript code for the contacts.html page.
 */

import { editContactTemplate, addContactTemplate } from './contacts_template.js';

let editcontact_innerHTML = editContactTemplate;
let addcontact_innerHTML = addContactTemplate;

var overlay;
var contactModal;

/**
 * @description This function is called when the user clicks on the "Add Contact" button. It creates a modal window with a form to add a new contact.
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
}

window.addContact = addContact;
window.closeContactModal = closeContactModal;

/**
 * @description This function is called when the user clicks on the "Close" button in the modal window. It removes the modal window from the DOM.
 */
function closeContactModal() {
    var overlay = document.getElementById('overlay');
    var contactModal = document.getElementById('contactModal');

    if (overlay && contactModal) {
        overlay.parentNode.removeChild(overlay);
        contactModal.parentNode.removeChild(contactModal);
    }
}

/**
 * @description This function generates a random id for a new contact.
 * @returns a random id
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

var numbers = [0, 1, 2, 3, 4];
var index = numbers.length;

/**
 * @description This function shuffles the elements of an array.
 * @param {*} array 
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * @description This function simulates the rolling of a dice. It returns a random number between 0 and 4.
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
 * @description This function is called when the user clicks on the "Save" button in the modal window. It saves the new contact to the local storage.
 */
async function saveContact() {
    let form = document.getElementById('addcontactForm');

    if (form.checkValidity()) {
        var name = document.querySelector('#addcontactForm input[name="name"]').value;
        var email = document.querySelector('#addcontactForm input[name="email"]').value;
        var phone = document.querySelector('#addcontactForm input[name="phone"]').value;
        var contact = {
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
                console.error('Aktueller Benutzer nicht gefunden:', currentUser);
            }
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        }

        contacts.push(contact);

        // Sortieren Sie die Kontakte alphabetisch nach Namen
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
 * @description This function displays a success message when a new contact has been added.
 */
async function successMsg() {
    const successMessage = document.getElementById('newcontact-message');
    const successOverlay = document.getElementById('newcontact-overlay');
    successOverlay.classList.add('visible');
    successMessage.classList.add('success-message-visible');

    await new Promise(resolve => setTimeout(() => {
        resolve();
        location.reload();
    }, 800));
}


window.loadContacts = loadContacts;

/**
 * @description This function loads the contacts from the local storage and displays them on the contacts.html page.
 */
async function loadContacts() {
    let contacts;

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('Aktueller Benutzer nicht gefunden:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    if (!contacts || Object.keys(contacts).length === 0) {
        contacts = [
        { id: generateId(), avatarid: rollDice(), name: 'Anton Mayer', email: 'antom@gmail.com', phone: '+49123456789'},
        { id: generateId(), avatarid: rollDice(), name: 'Anja Schulz', email: 'schulz@hotmail.com', phone: '+49123456789'},
        { id: generateId(), avatarid: rollDice(), name: 'Benedikt Ziegler', email: 'benedikt@gmail.com', phone: '+49123456789'},
        { id: generateId(), avatarid: rollDice(), name: 'David Eisenberg', email: 'davidberg@gmail.com', phone: '+49123456789'},
        { id: generateId(), avatarid: rollDice(), name: 'Eva Fischer', email: 'eva@gmail.com', phone: '+49123456789'},
        { id: generateId(), avatarid: rollDice(), name: 'Emmanuel Mauer', email: 'emmanuelma@gmail.com', phone: '+49123456789'},
        { id: generateId(), avatarid: rollDice(), name: 'Marcel Bauer', email: 'bauer@gmail.com', phone: '+49123456789' },
        { id: generateId(), avatarid: rollDice(), name: 'Tatjana Wolf', email: 'wolf@gmail.com', phone: '+49123456789' },];
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    let lastInitial;

    function createContactHTML(contact) {
        let initialLetterHTML = '';
        const currentInitial = contact.name.charAt(0).toUpperCase();
        if (currentInitial !== lastInitial) {
            initialLetterHTML = `<div class="initial_letter">${currentInitial}</div>
            <div class="line"><svg xmlns="http://www.w3.org/2000/svg" width="354" height="2" viewBox="0 0 354 2" fill="none"><path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/></svg></div>`;
            lastInitial = currentInitial;
        }

        return `
            ${initialLetterHTML}
            <div class="contactentry" id=${contact.id}>
                <div class="avatar">
                    <img src="img/Ellipse5-${contact.avatarid}.svg"></img>
                    <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
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
                entry.classList.remove('selected');
            }

            contactElement.classList.add('selected');
            floatingContactRender(contact.id);
        });
    }
}

window.editContact = editContact;

/**
 * @description This function is called when the user clicks on the "Edit" button in the contacts.html page. 
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
            console.error('Aktueller Benutzer nicht gefunden:', currentUser);
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

        let avatarDiv = document.createElement("div");
        let avatarHTML = `
        <img class="avatar_contactModal" src="img/Ellipse5-${contact.avatarid}.svg"></img>
        <div class="avatar_contactModal_initletter">${contact.name.charAt(0)}</div>
        `;
        contactModal.innerHTML += avatarHTML;
        contactModal.appendChild(avatarDiv);

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
                <div class="close_button2" onclick="delContact('${contact.id}')">Delete<img src="img/close.svg"></img></div>
                <div class="createcontact_button" onclick="saveEditedContact('${contact.id}')">Save<img src="img/check.svg"></img></div>
            </div>
        </form>`;

        contactModal.innerHTML += editcontact_formHTML;
        contactModal.appendChild(formDiv);
        overlay.style.display = "block";
        contactModal.style.display = "block";
    }
    else {
        console.log(`Kein Kontakt mit der ID ${id} gefunden.`);
    }
}

window.saveEditedContact = saveEditedContact;

/**
 * @description This function is called when the user clicks on the "Save" button in the modal window. It saves the edited contact to the local storage.
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
                console.error('Aktueller Benutzer nicht gefunden:', currentUser);
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

            if (isUserLoggedIn) {
                let users = JSON.parse(await getItem('users'));
                users[currentUser].contacts = contacts;
                await setItem('users', JSON.stringify(users));
            } else {
                localStorage.setItem('contacts', JSON.stringify(contacts));
            }

            closeContactModal();
            location.reload();
        }
        else {
            console.log(`Kein Kontakt mit der ID ${contactid} gefunden.`);
        }
    } else {
        form.reportValidity();
    }
}

window.delContact = delContact;

/**
 * @description This function is called when the user clicks on the "Delete" button in the modal window. It deletes the contact from the local storage.
 * @param {*} contactid 
 */
async function delContact(contactId) {
    let contacts;
    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('Aktueller Benutzer nicht gefunden:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    contacts = contacts.filter(contact => contact.id !== contactId);

    if (isUserLoggedIn) {
        // Aktualisieren Sie die Kontakte des aktuellen Benutzers
        let users = JSON.parse(await getItem('users'));
        users[currentUser].contacts = contacts;
        await setItem('users', JSON.stringify(users));
    } else {
        // Aktualisieren Sie die Kontakte im localStorage
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    location.reload();
}

/**
 * @description This function renders the floating contact window with the contact information.
 * @param {*} contactid
 */
async function floatingContactRender(contactid){
    let contacts;

    if (isUserLoggedIn) {
        let users = JSON.parse(await getItem('users'));
        if (users[currentUser]) {
            contacts = users[currentUser].contacts;
        } else {
            console.error('Aktueller Benutzer nicht gefunden:', currentUser);
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    let contact = contacts.find(contact => contact.id === contactid);

    if (contact) {
        var floating_contactHTML = `
        <div class="floating_contact">
            <div class="floating_contact_avatar">
                <img src="img/Ellipse5-${contact.avatarid}.svg"></img>
                    <div class="floating_contact_initletter">${contact.name.charAt(0)}</div>
                </img>
            </div>
            <div class="column">
            <div class="floating_contact_name">${contact.name}</div>
            <div class="row">
                <div class="floating_contact_buttons" onclick="editContact('${contact.id}')">
                    <img src="img/edit.svg"></img>
                    Edit
                </div>
                <div class="floating_contact_buttons" onclick="delContact('${contact.id}')">
                    <img src="img/delete.svg"></img>
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
        `;

        var floating_contactElement = document.getElementById("floating_contact");

        while (floating_contactElement.firstChild) {
            floating_contactElement.removeChild(floating_contactElement.firstChild);
        }

        var floating_contactDiv = document.createElement("div");
        floating_contactDiv.innerHTML = floating_contactHTML;
        floating_contactElement.appendChild(floating_contactDiv);
    } else {
        console.log(`Kein Kontakt mit der ID ${contactid} gefunden.`);
    }
}

/**
 * @description This function is called when the contacts page is loaded. 
 * It loads the contacts from the local storage and displays them on the contacts.html page.
 */
document.addEventListener('DOMContentLoaded', async (event) => {
    await initUser();
    loadContacts();
});

