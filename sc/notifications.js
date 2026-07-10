// --- BROWSER PUSH NOTIFICATIONS LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('pushBanner');
    
    // 1. Check if notifications are supported and if the user hasn't answered yet
    if ("Notification" in window && Notification.permission === "default") {
        // Show the top banner to prompt them
        if (banner) {
            banner.classList.remove('hidden');
        }
    }

    // 2. Listen for the click on the banner directly from JS
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
        // If granted or denied, hide the banner so it doesn't annoy them
        const banner = document.getElementById('pushBanner');
        if (banner && (permission === "granted" || permission === "denied")) {
            banner.classList.add('hidden');
        }
        if (permission === "granted") {
            console.log("Push notifications enabled!");
            // Send a welcome test notification
            triggerNotification('welcome'); 
        }
    });
}

// Fire a notification based on its key in the notificationData dictionary
function triggerNotification(eventId) {
    if ("Notification" in window && Notification.permission === "granted") {
        const data = notificationData[eventId];
        
        if (data) {
            // Service workers allow push notifications even when the tab is closed, 
            // but for immediate on-site interactions, we use the standard Notification constructor
            const notification = new Notification(data.title, {
                body: data.body,
                icon: data.icon || "https://sensationalx.com/icon.png", // Use your site's default icon
                vibrate: [200, 100, 200]
            });
            
            // If they click the notification popup
            notification.onclick = function(event) {
                event.preventDefault(); // prevent the browser from focusing the Notification's tab
                if (data.url) {
                    window.open(data.url, '_blank');
                }
                notification.close();
            };
        }
    }
}


// --- YOUR 100 CUSTOM NOTIFICATION POPUPS ---
// Edit the strings inside the quotes to customize the title, body text, and redirect URL!

const notificationData = {
    "welcome": { title: "Notifications Enabled!", body: "You'll now receive updates from SensationalX.", url: "https://sensationalx.com/" },
    
    "event_1": { title: "One Grand Band Songstats!", body: "Listen to the official song stats of grand band!", url: "songstats.com/search?q=one%20grand%20band" },
    "event_2": { title: "One Grand Band - Official website", body: "onegrandband.com - website official", url: "onegrandbabd.com" },

};
