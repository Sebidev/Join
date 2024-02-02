export const editContactTemplate = `
<div id="bluebar">
    <img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
    <div class="bluebar_titel">Edit contact</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>`;

export const addContactTemplate = `
<div id="bluebar">
<img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
<div class="bluebar_titel">Add contact</div>
<div class="bluebar_text">Tasks are better with a team!</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>
<div class="avatar_contactModal">
    <img class="avatar_contactModal" src="img/avatar_newcontact.svg"></img>
</div>
<div>
    <img class="close_button1" onclick="closeContactModal()" src="img/close.svg"></img>
</div>
<div>
    <form id="addcontactForm" class="form_container">
        <div class="input_container">
            <input type="text" class="textfield_newcontact" id="name" name="name" placeholder="Name" pattern="^[a-zA-Z0-9_-]*$" title="Bitte nur Buchstaben, Zahlen und die Sonderzeichen Bindestrich und Unterstrich eingeben." required>
            <img src="img/person.svg" class="textfield_image">
        </div>
        <div class="input_container">
            <input type="email" class="textfield_newcontact" id="email" name="email" placeholder="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Bitte eine gültige E-Mail-Adresse eingeben." required>
            <img src="img/mail.svg" class="textfield_image">
        </div>
        <div class="input_container">
            <input type="text" class="textfield_newcontact" id="phone" name="phone" placeholder="Phone" pattern="^[+]?[0-9]*$" title="Bitte nur Zahlen und optional ein Pluszeichen am Anfang eingeben." required>
            <img src="img/call.svg" class="textfield_image">
        </div>
        <div class="button_container">
            <div class="close_button2" onclick="closeContactModal()">Close<img src="img/close.svg"></img></div>
            <div class="createcontact_button" onclick="saveContact()">Create contact<img src="img/check.svg"></img></div>
        </div>
    </form>
</div>`;
