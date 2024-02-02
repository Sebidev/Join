var overlay;
var contactModal;

// Regex-Ausdrücke für die Überprüfung der Eingabefelder
let nameRegex = /^[a-zA-Z0-9-_\s.öäüÖÄÜ]*$/;
let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
let phoneRegex = /^[+]?[0-9]*$/;

// Erstelle ein neues Div-Element für die blaue Leiste
var addcontact_blueBar = `
<div id="bluebar">
    <img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
    <div class="bluebar_titel">Add contact</div>
    <div class="bluebar_text">Tasks are better with a team!</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>`;

var editcontact_blueBar = `
<div id="bluebar">
    <img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
    <div class="bluebar_titel">Edit contact</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>`;

// Erstelle ein neues Div-Element für das Formular "Add new contact"
let addcontact_formHTML = `
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

function addContact() {
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
    contactModal.innerHTML += addcontact_blueBar;

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
    contactModal.innerHTML += addcontact_formHTML;
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

// Funktion zur Generierung einer zufälligen ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Funktion zum Mischen eines Arrays (Fisher-Yates-Algorithmus)
var numbers = [0, 1, 2, 3, 4];
var index = numbers.length;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funktion zum Würfeln einer Zahl
function rollDice() {
    if (index === numbers.length) {
        shuffleArray(numbers);
        index = 0;
    }

    return numbers[index++];
}

// Funktion zum Speichern eines Kontakts
function saveContact() {
    // Erhalte die Werte direkt aus den Eingabefeldern
    var name = document.querySelector('#contactForm input[name="name"]').value;
    var email = document.querySelector('#contactForm input[name="email"]').value;
    var phone = document.querySelector('#contactForm input[name="phone"]').value;

    // Überprüfe, ob die Felder ausgefüllt sind
    if (!name || !email || !phone) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    // Überprüfe, ob der Name nur Buchstaben, Zahlen und die Sonderzeichen Bindestrich und Unterstrich enthält
    if (!nameRegex.test(name)) {
        alert("Ungültiger Name. Bitte nur Buchstaben, Zahlen und die Sonderzeichen Bindestrich und Unterstrich eingeben.");
        return;
    }

    // Überprüfe, ob die E-Mail-Adresse gültig ist
    if (!emailRegex.test(email)) {
        alert("Ungültige E-Mail-Adresse. Bitte eine gültige E-Mail-Adresse eingeben.");
        return;
    }

    // Überprüfe, ob die Telefonnummer nur Zahlen enthält
    if (!phoneRegex.test(phone)) {
        alert("Ungültige Telefonnummer. Bitte nur Zahlen und optional ein Pluszeichen am Anfang eingeben.");
        return;
    }

    // Erstelle ein Objekt mit den Werten und einer eindeutigen ID
    var contact = {
        id: generateId(),
        avatarid: rollDice(),
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

    // Schließe das Modal
    closeContactModal();

    // Lade die Kontakte neu
    location.reload();
}

// Funktion zum Laden der Kontakte
function loadContacts() {
    // Zuerst holen wir die Kontakte aus dem LocalStorage
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    // Wenn keine Kontakte vorhanden sind, erstellen wir einen Demo-Kontakt
    if (!contacts || Object.keys(contacts).length === 0) {
        contacts = [{
            id: generateId(),
            avatarid: rollDice(),
            name: 'Demo Contact',
            email: 'demo@contact.com',
            phone: '0123456789'
        }];

        // Speichern Sie den Demo-Kontakt im LocalStorage
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // Dann erstellen wir eine Funktion, die einen Kontakt in HTML umwandelt
    function createContactHTML(contact) {
        return `
        <div class="initial_letter">${contact.name.charAt(0)}</div>
        <div class="line"><svg xmlns="http://www.w3.org/2000/svg" width="354" height="2" viewBox="0 0 354 2" fill="none"><path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/></svg></div>
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

    // Nun durchlaufen wir alle Kontakte und fügen sie unserem HTML hinzu
    let contactsHTML = '';
    for (let contact of contacts) {
        contactsHTML += createContactHTML(contact);
    }

    // Schließlich fügen wir unser HTML in das Dokument ein
    document.querySelector('.contacts_container').innerHTML += contactsHTML;

    // Fügen Sie einen EventListener für jeden Kontakt hinzu
    for (let contact of contacts) {
        let contactElement = document.getElementById(contact.id);
        contactElement.addEventListener('click', function() {
            // Entfernen Sie die 'selected'-Klasse von allen Kontakten
            let contactEntries = document.querySelectorAll('.contactentry');
            for (let entry of contactEntries) {
                entry.classList.remove('selected');
            }
            // Fügen Sie die 'selected'-Klasse zum angeklickten Kontakt hinzu
            contactElement.classList.add('selected');
            // Rufen Sie die Funktion auf, um den Kontakt anzuzeigen
            floatingContactRender(contact.id);
        });
    }
}


function editContact(id){
    // Kontakte aus dem LocalStorage laden
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    // Finden Sie den Kontakt mit der angegebenen ID
    let contact = contacts.find(contact => contact.id === id);

    if (contact) {
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
        contactModal.innerHTML += editcontact_blueBar;

        // Erstellen Sie ein neues div-Element
        let avatarDiv = document.createElement("div");
        // Erstellen Sie einen String mit dem HTML-Code
        let avatarHTML = `
        <img class="avatar_contactModal" src="img/Ellipse5-${contact.avatarid}.svg"></img>
        <div class="avatar_contactModal_initletter">${contact.name.charAt(0)}</div>
        `;

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

        let editcontact_formHTML = `
        <form id="editcontact_Form" class="form_container">
            <div class="input_container">
                <input type="text" class="textfield_newcontact" id="name" name="name" placeholder="Name" value="${contact.name}" pattern="^[a-zA-Z0-9-_]*$" title="Bitte nur Buchstaben, Zahlen und die Sonderzeichen Bindestrich und Unterstrich eingeben.">
                <img src="img/person.svg" class="textfield_image">
            </div>
            <div class="input_container">
                <input type="email" class="textfield_newcontact" id="email" name="email" placeholder="Email" value="${contact.email}" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Bitte eine gültige E-Mail-Adresse eingeben.">
                <img src="img/mail.svg" class="textfield_image">
            </div>
            <div class="input_container">
                <input type="text" class="textfield_newcontact" id="phone" name="phone" placeholder="Phone" value="${contact.phone}" pattern="^[+]?[0-9]*$" title="Bitte nur Zahlen und optional ein Pluszeichen am Anfang eingeben.">
                <img src="img/phone.svg" class="textfield_image">
            </div>
            <div class="button_container">
                <div class="close_button2" onclick="delContact('${contact.id}')">Delete</img></div>
                <div class="createcontact_button" onclick="saveEditedContact('${contact.id}')">Save<img src="img/check.svg"></img></div>
            </div>
        </form>`;

        // Fügen Sie den HTML-Code zum contactModal hinzu
        contactModal.innerHTML += editcontact_formHTML;
        // Fügen Sie das neue div-Element zum contactModal hinzu
        contactModal.appendChild(formDiv);

        // Mache das Overlay und das Kontaktmodal sichtbar
        overlay.style.display = "block";
        contactModal.style.display = "block";
    }
    else {
        console.log(`Kein Kontakt mit der ID ${id} gefunden.`);
    }
}

function saveEditedContact(id) {
    // Kontakte aus dem LocalStorage laden
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    // Finden Sie den Kontakt mit der angegebenen ID
    let contact = contacts.find(contact => contact.id === id);

    if (contact) {
        // Überprüfen Sie die neuen Werte aus dem Formular
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;

        if (!nameRegex.test(name)) {
            alert("Ungültiger Name. Bitte nur Buchstaben, Zahlen und die Sonderzeichen Bindestrich und Unterstrich eingeben.");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Ungültige E-Mail-Adresse. Bitte eine gültige E-Mail-Adresse eingeben.");
            return;
        }

        if (!phoneRegex.test(phone)) {
            alert("Ungültige Telefonnummer. Bitte nur Zahlen und optional ein Pluszeichen am Anfang eingeben.");
            return;
        }

        // Aktualisieren Sie die Kontaktinformationen mit den neuen Werten
        contact.name = name;
        contact.email = email;
        contact.phone = phone;

        // Speichern Sie die aktualisierten Kontakte zurück in den LocalStorage
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Schließen Sie das Kontaktmodal
        closeContactModal();

        // Lade die Kontakte neu
        location.reload();
    }
    else {
        console.log(`Kein Kontakt mit der ID ${id} gefunden.`);
    }
}

function delContact(id){
    // Kontakte aus dem LocalStorage laden
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    // Filtern Sie das Array, um nur Kontakte mit einer anderen ID zu behalten
    contacts = contacts.filter(contact => contact.id !== id);

    // Speichern Sie das aktualisierte Array im LocalStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Lade die Kontakte neu
    location.reload();
}

function floatingContactRender(id){
    // Kontakte aus dem LocalStorage laden
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    // Finden Sie den Kontakt mit der angegebenen ID
    let contact = contacts.find(contact => contact.id === id);

    // Überprüfen Sie, ob ein Kontakt gefunden wurde
    if (contact) {
        // Definieren Sie Ihre HTML-Inhalte als String
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

        // Finden Sie das Element mit der ID "floating_contact"
        var floating_contactElement = document.getElementById("floating_contact");

        // Entfernen Sie das vorhandene floating_contactDiv, falls vorhanden
        while (floating_contactElement.firstChild) {
            floating_contactElement.removeChild(floating_contactElement.firstChild);
        }

        // Erstellen Sie ein neues DIV-Element
        var floating_contactDiv = document.createElement("div");

        // Fügen Sie Ihren HTML-Inhalt in das neue DIV-Element ein
        floating_contactDiv.innerHTML = floating_contactHTML;

        // Fügen Sie das neue DIV-Element als Kind des Ziel-Elements ein
        floating_contactElement.appendChild(floating_contactDiv);
    } else {
        console.log(`Kein Kontakt mit der ID ${id} gefunden.`);
    }
}

// Warten Sie, bis das Dokument vollständig geladen ist, bevor Sie die Kontakte laden
document.addEventListener('DOMContentLoaded', (event) => {
    loadContacts();
});

