document.addEventListener('deviceready', function() {
    // Initialiser FCM
    window.FirebasePlugin.onMessageReceived(function(message) {
        // Notification reçue
        console.log('Message reçu:', message);
        // Traitement des notifications ici
    }, function(error) {
        console.error('Erreur de réception du message:', error);
    });

    // Gestion de la notification ouverte
    window.FirebasePlugin.onNotificationOpen(function(message) {
        console.log('Notification ouverte:', message);
        // Traitement des notifications ouvertes ici
    }, function(error) {
        console.error("Erreur d'ouverture de notification:", error);
    })
}, false);
