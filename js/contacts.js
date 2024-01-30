var overlay;
var contactModal;

// Erstelle ein neues Div-Element für die blaue Leiste
var blueBar = `
<div id="bluebar">
    <img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
    <div class="bluebar_titel">Add contact</div>
    <div class="bluebar_text">Tasks are better with a team!</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>`;

let formHTML = `
<form id="contactForm" class="form_container">
    <div class="input_container">
        <input type="text" class="textfield_newcontact" id="name" name="name" placeholder="Name">
        <img src="img/person.svg" class="textfield_image">
    </div>
    <div class="input_container">
        <input type="text" class="textfield_newcontact" id="email" name="email" placeholder="Email">
        <img src="img/mail.svg" class="textfield_image">
    </div>
    <div class="input_container">
        <input type="text" class="textfield_newcontact" id="phone" name="phone" placeholder="Phone">
        <img src="img/call.svg" class="textfield_image">
    </div>
    <div class="button_container">
        <div class="close_button2" onclick="closeContactModal()">Close<img src="img/close.svg"></img></div>
        <div class="createcontact_button" onclick="saveContact()">Create contact<img src="img/check.svg"></img></div>
    </div>
</form>`;

function add_contact() {
    // Erstelle ein neues Div-Element für das Overlay
    overlay = document.createElement("div");
    // Setze die ID des Overlays auf "overlay"
    overlay.id = "overlay";
    // Füge das Overlay dem Body-Element hinzu
    document.body.appendChild(overlay);

    // Erstelle ein neues Div-Element für das Kontaktmodal
    contactModal = document.createElement("div");
    // Setze die ID des Kontaktmodals auf "contactModal"
    contactModal.id = "contactModal";
    // Füge das Kontaktmodal dem Body-Element hinzu
    document.body.appendChild(contactModal);
    // Füge die blaue Leiste zum Kontaktmodal hinzu
    contactModal.innerHTML += blueBar;

    // Erstellen Sie ein neues div-Element
    let avatarDiv = document.createElement("div");
    // Erstellen Sie einen String mit dem HTML-Code
    let avatarHTML = `<img class="avatar_contactModal" src="img/avatar_newcontact.svg"></img>`;

    // Fügen Sie den HTML-Code zum contactModal hinzu
    contactModal.innerHTML += avatarHTML;
    // Fügen Sie das neue div-Element zum contactModal hinzu
    contactModal.appendChild(avatarDiv);

    // Erstellen Sie ein neues div-Element
    let close_button1_DIV = document.createElement("div");
    // Erstellen Sie einen String mit dem HTML-Code
    let close_button1_DIV_HTML = `<img class="close_button1" onclick="closeContactModal()" src="img/close.svg"></img>`;

    // Fügen Sie den HTML-Code zum div-Element hinzu
    close_button1_DIV.innerHTML = close_button1_DIV_HTML;
    // Fügen Sie das neue div-Element zum contactModal hinzu
    contactModal.appendChild(close_button1_DIV);

    // Erstellen Sie ein neues div-Element
    let formDiv = document.createElement("div");

    // Fügen Sie den HTML-Code zum contactModal hinzu
    contactModal.innerHTML += formHTML;
    // Fügen Sie das neue div-Element zum contactModal hinzu
    contactModal.appendChild(formDiv);

    // Mache das Overlay und das Kontaktmodal sichtbar
    overlay.style.display = "block";
    contactModal.style.display = "block";
}

function closeContactModal() {
    // Zugriff auf das Overlay und das Modal
    var overlay = document.getElementById('overlay');
    var contactModal = document.getElementById('contactModal');

    // Überprüfen Sie, ob das Overlay und das Modal existieren
    if (overlay && contactModal) {
        // Entfernen Sie das Overlay und das Modal aus dem DOM
        overlay.parentNode.removeChild(overlay);
        contactModal.parentNode.removeChild(contactModal);
    }
}

function saveContact() {
    // Erhalte die Werte direkt aus den Eingabefeldern
    var name = document.querySelector('#contactForm input[name="name"]').value.trim();
    var email = document.querySelector('#contactForm input[name="email"]').value.trim();
    var phone = document.querySelector('#contactForm input[name="phone"]').value.trim();

    // Überprüfe, ob die Felder ausgefüllt sind
    if (!name || !email || !phone) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    // Erstelle ein Objekt mit den Werten
    var contact = {
        name: name,
        email: email,
        phone: phone
    };

    // Hole das Array von Kontakten aus dem LocalStorage
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Füge den neuen Kontakt zum Array hinzu
    contacts.push(contact);

    // Speichere das aktualisierte Array im LocalStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Setze das Formular zurück
    document.querySelector('#contactForm').reset();

    closeContactModal();
}

function loadContacts() {
    // Zuerst holen wir die Kontakte aus dem LocalStorage
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    // Dann erstellen wir eine Funktion, die einen Kontakt in HTML umwandelt
    function createContactHTML(contact) {
        return `
        <div class="initial_letter">${contact.name.charAt(0)}</div>
        <div class="line"><svg xmlns="http://www.w3.org/2000/svg" width="354" height="2" viewBox="0 0 354 2" fill="none"><path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/></svg></div>
        <div class="contactentry">
            <div class="avatar">
                <img src="img/Ellipse5-2.svg"></img>
                <div class="avatar_initletter">${contact.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
            <div class="contactentry_info">
                <div class="contactentry_name">${contact.name}</div>
                <div class="contactentry_email">${contact.email}</div>
            </div>
        </div>
    `;
    }

    // Nun durchlaufen wir alle Kontakte und fügen sie unserem HTML hinzu
    let contactsHTML = '';
    for (let contact of contacts) {
        contactsHTML += createContactHTML(contact);
    }

    // Schließlich fügen wir unser HTML in das Dokument ein
    document.querySelector('.contacts_container').innerHTML += contactsHTML;
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadContacts();
});