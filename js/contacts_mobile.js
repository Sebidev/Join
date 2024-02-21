/**
 * @file contacts-mobile.js
 * This file is used to handle the mobile view of the contacts page.
 *
 */

const isMobile = window.matchMedia("only screen and (max-width: 926px)").matches;

if (isMobile) {
    const contactEntry = document.getElementById('contactentry');
    contactEntry.addEventListener('click', () => {
        const contactsContainer = document.querySelector('.contacts_container');
        contactsContainer.style.display = 'none';

        const contactTitle = document.querySelector('.contact_title');
        const floatingContactContainer = document.querySelector('.floating_contact_container');
        contactTitle.style.display = 'block';
        floatingContactContainer.style.display = 'block';
    });

    const backButton = document.querySelector('.backArrow');
    backButton.addEventListener('click', () => {
        const contactTitle = document.querySelector('.contact_title');
        const floatingContactContainer = document.querySelector('.floating_contact_container');
        contactTitle.style.display = 'none';
        floatingContactContainer.style.display = 'none';

        const contactentries = document.querySelectorAll('.contactentry');
        contactentries.forEach((contactentry) => {
            contactentry.classList.remove('contact_selected');
        });

        const contactsContainer = document.querySelector('.contacts_container');
        contactsContainer.style.display = 'block';
    });
}
