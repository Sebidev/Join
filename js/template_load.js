/**
 * @file template_load.js
 * @brief Load header and sideboard templates into the current page
 * 
 * This file contains the code to load the header and sideboard templates
 * into the current page. The header and sideboard templates are loaded
 * handling the selection of the current page in the sideboard menu
 */

document.addEventListener("DOMContentLoaded", function() {
    fetch('template/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#header').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch('template/sideboard.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('#sideboard').innerHTML = data;

            let menuItems = document.querySelectorAll('.sidemenu_element');
            let currentUrl = new URL(window.location.href.trim().toLowerCase());

            menuItems.forEach(function(menuItem) {
                let itemUrl = new URL(menuItem.getAttribute('href').trim().toLowerCase(), window.location.origin);

                if (currentUrl.href === itemUrl.href) {
                    menuItem.classList.add('selected');
                } else {
                    menuItem.classList.remove('selected');
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    let headercss = document.createElement('link');
    headercss.rel = 'stylesheet';
    headercss.href = 'template/header.css';
    document.head.appendChild(headercss);

    let sideboardcss = document.createElement('link');
    sideboardcss.rel = 'stylesheet';
    sideboardcss.href = 'template/sideboard.css';
    document.head.appendChild(sideboardcss);
});