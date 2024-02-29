
/**
 * delete users log in data from local storage
 */
function unrememberMe() {
  let emailSaved = localStorage.getItem('email');
  let passwordSaved = localStorage.getItem('password');

  if (emailSaved && passwordSaved) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
  }
}

/**
* log in data will be remembered for the next session if opt in
*/
function rememberMe() {
  let checkedIcon = document.getElementById('checked');
  let email = document.getElementById('email-login');
  let password = document.getElementById('password-login');

  if (checkedIcon) {
      if (email.value && password.value) {
          localStorage.setItem('email', email.value);
          localStorage.setItem('password', password.value);
      }
  }
}

/**
 * generate random color hex code for signed up user
 * @returns - string of color hex code
 */
function setUserColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/**
 * @file script.js
 * This file handle current date
 */

/** 
 * Gets the current date.
 * @returns {string} current date as 'YYYY-MM-DD'.
 */
function getCurrentDateAsString() {
    let dateToday = new Date();
    let month = (dateToday.getMonth() + 1).toString().padStart(2, '0');
    let day = dateToday.getDate().toString().padStart(2, '0');
    let year = dateToday.getFullYear();
  
    return `${year}-${month}-${day}`;
  }