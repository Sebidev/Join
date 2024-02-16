const STORAGE_TOKEN = 'ZJJPQ710DH6OYTO2XPNQOFS8GGEI04PVTR2IPBNR';
// kev token: ZJJPQ710DH6OYTO2XPNQOFS8GGEI04PVTR2IPBNR
// CV9T56UB0XWKWYY7O74HW7GUV23ZA6Q9R73XAZIX
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let users = [];
let contacts = [];
let tasks = [];
let categories = [];
let subtasks = [];

/**
 * Uploads data into the backend.
 * @param {key} key - data name (key)
 * @param {array} value - data array to upload
 * @returns - promise
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
}


/**
 * Fetches data from the backend.
 * @param {key} key - key name to fetch
 * @returns - promise + JSON
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => res.data.value);
}