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