/**
 * @file contacts_template.js
 * This file is used to store the HTML templates for the contacts page.
 * 
 */

export let add_new_conatct_btnTemplate = `
<div class="add_new_conatct_btn_container">
    <div class="add_new_contact_btn hover-color" onclick="addContact()">
        <span>Add new contact</span>
        <img src="img/person_add.svg">
    </div>
</div>`;

export let editContactTemplate = `
<div id="bluebar">
    <img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
    <div class="bluebar_titel">Edit contact</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>`;

export let addContactTemplate = `
<div id="bluebar">
<img class="bluebar_joinlogo" src="img/join_logo.svg"></img>
<div class="bluebar_titel">Add contact</div>
<div class="bluebar_text">Tasks are better with a team!</div>
    <div class="bluebar_line">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
</div>
<div class="avatar_container">
    <div class="avatar_contactModal">
        <img class="avatar_contactModal" src="img/avatar_newcontact.svg"></img>
    </div>
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
            <input type="email" class="textfield_newcontact" id="email" name="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$" title="Bitte eine gültige E-Mail-Adresse eingeben." required>
            <img src="img/mail.svg" class="textfield_image">
        </div>
        <div class="input_container">
            <input type="text" class="textfield_newcontact" id="phone" name="phone" placeholder="Phone" pattern="^[+]?[0-9]*$" title="Bitte nur Zahlen und optional ein Pluszeichen am Anfang eingeben." required>
            <img src="img/call.svg" class="textfield_image">
        </div>
        <div class="button_container">
            <div class="close_button2" onclick="closeContactModal()">Close<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="close">
            <mask id="mask0_126532_4110" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect id="Bounding box" width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_126532_4110)">
            <path id="close_2" d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" fill="#2A3647"/>
            </g>
            </g>
            </svg></div>
            <div class="createcontact_button hover-color" onclick="saveContact()">Create contact<img src="img/check.svg"></img></div>
        </div>
    </form>
</div>`;
