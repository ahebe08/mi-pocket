//var serv = "http://localhost/www/api_mi_pocket/";
const serv = "https://kacepdom.alwaysdata.net/gcli_php/";
const pullToRefresh = document.getElementById('pull-to-refresh');
let startY = null;
const threshold = window.innerHeight * 0.15; // 15% de la hauteur de l'écran

// Fonction pour obtenir la date actuelle en GMT
function getCurrentDateGMT() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchMessages();
});

function fetchMessages() {
    fetch(serv + 'get_messages.php')
        .then(response => response.json())
        .then(data => {
            displayMessages(data);
            pullToRefresh.style.display = 'none'; // Masquer après le rafraîchissement
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            pullToRefresh.style.display = 'none'; // Masquer même en cas d'erreur
        });
}

function displayMessages(messages) {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear existing messages

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.setAttribute('data-content', message.content_mess);
        messageDiv.setAttribute('data-ref', message.ref_mess);
        messageDiv.setAttribute('data-author', message.prenoms_nom);

        const messageContent = document.createElement('p');
        messageContent.textContent = message.content_mess.substring(0, 50) + '...'; // Preview of content

        // Indicateur de nouveau message
        const newMessageIndicator = document.createElement('span');
        newMessageIndicator.classList.add('new-message');
        const messageDate = new Date(message.timestamp);
        const formattedMessageDate = `${messageDate.getUTCFullYear()}-${String(messageDate.getUTCMonth() + 1).padStart(2, '0')}-${String(messageDate.getUTCDate()).padStart(2, '0')}`;

        messageDiv.appendChild(messageContent);
        if (formattedMessageDate === getCurrentDateGMT()) {
            messageDiv.appendChild(newMessageIndicator); // Ajouter l'indicateur de nouveau message
        }

        messageDiv.addEventListener('click', function () {
            openPopup(message);
        });

        main.appendChild(messageDiv);
    });
}

function openPopup(message) {
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const popupRef = document.getElementById('popup-ref');
    const popupAuthor = document.getElementById('popup-author');

    popupText.textContent = message.content_mess;
    if (message.ref_mess) {
        popupRef.innerHTML = `<strong>Inspiré de:</strong> ${message.ref_mess}`;
    } else {
        popupRef.innerHTML = '';
    }
    popupAuthor.textContent = message.prenoms_nom;

    popup.style.display = 'flex'; /* Afficher le popup */

    document.getElementById('close-popup').addEventListener('click', function () {
        popup.style.display = 'none'; /* Masquer le popup */
    });
}

document.addEventListener('touchstart', function (e) {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', function (e) {
    if (startY === null) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > threshold) {
        pullToRefresh.style.display = 'flex';
    }
});

document.addEventListener('touchend', function (e) {
    if (pullToRefresh.style.display === 'flex') {
        fetchMessages();
    } else {
        pullToRefresh.style.display = 'none';
    }
    startY = null;
});