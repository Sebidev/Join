/**
 * @file script.js
 * This file handle current date
 */

/** 
 * Gets the current date.
 * @returns {string} current date as 'YYYY-MM-DD'.
 */
function getCurrentDateAsString() {
    const dateToday = new Date();
    const month = (dateToday.getMonth() + 1).toString().padStart(2, '0');
    const day = dateToday.getDate().toString().padStart(2, '0');
    const year = dateToday.getFullYear();
  
    return `${year}-${month}-${day}`;
  }