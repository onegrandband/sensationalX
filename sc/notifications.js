document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('pushBanner');
    
    if ("Notification" in window && Notification.permission === "default") {
        if (banner) {
            banner.classList.remove('hidden');
        }
    }
    
    if (banner) {
        banner.addEventListener('click', () => {
            requestNotificationPermission();
        });
    }
});

function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
        return;
    }
    
    Notification.requestPermission().then((permission) => {
        const banner = document.getElementById('pushBanner');
        
        if (banner && (permission === "granted" || permission === "denied")) {
            banner.classList.add('hidden');
        }
        
        if (permission === "granted") {
            console.log("Push notifications enabled!");
            triggerNotification('welcome');
        }
    });
}

function triggerNotification(eventId) {
    if ("Notification" in window && Notification.permission === "granted") {
        const data = notificationData[eventId];
        
        if (data) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(data.title, {
                        body: data.body,
                        icon: data.icon || "https://sensationalx.com/icon.png",
                        vibrate:,
                        data: { url: data.url }
                    });
                });
            } else {
                const notification = new Notification(data.title, {
                    body: data.body,
                    icon: data.icon || "https://sensationalx.com/icon.png",
                    vibrate: [200, 100, 200]
                });
                
                notification.onclick = function(event) {
                    event.preventDefault();
                    if (data.url) {
                        window.open(data.url, '_blank');
                    }
                    notification.close();
                };
            }
        }
    }
}

const notificationData = {
    "welcome": {
        title: "Notifications Enabled!",
        body: "You'll now receive updates from SensationalX.",
        url: "https://sensationalx.com/notification-success"
    },
    "event_1": {
        title: "One Grand Band Songstats!",
        body: "Listen to the official song stats of grand band!",
        url: "https://songstats.com/search?q=one%20grand%20band"
    },
    "event_2": {
        title: "One Grand Band - Official website",
        body: "onegrandband.com - website official",
        url: "https://onegrandband.com"
    }
};
