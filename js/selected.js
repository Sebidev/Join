/**
 * @file selected.js
 * This script is used to highlight the current page in the side menu.
 */

window.addEventListener('load', function() {
    var menuItems = document.querySelectorAll('.sidemenu_element');
    var currentUrl = window.location.href;
  
    menuItems.forEach(function(item) {
        var itemUrl = item.href;
  
        if (currentUrl === itemUrl) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
});