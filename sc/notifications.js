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
    
    "event_1": { title: "Notification 1", body: "Fill me in :3", url: "/" },
    "event_2": { title: "Notification 2", body: "Fill me in :3", url: "/" },
    "event_3": { title: "Notification 3", body: "Fill me in :3", url: "/" },
    "event_4": { title: "Notification 4", body: "Fill me in :3", url: "/" },
    "event_5": { title: "Notification 5", body: "Fill me in :3", url: "/" },
    "event_6": { title: "Notification 6", body: "Fill me in :3", url: "/" },
    "event_7": { title: "Notification 7", body: "Fill me in :3", url: "/" },
    "event_8": { title: "Notification 8", body: "Fill me in :3", url: "/" },
    "event_9": { title: "Notification 9", body: "Fill me in :3", url: "/" },
    "event_10": { title: "Notification 10", body: "Fill me in :3", url: "/" },
    
    "event_11": { title: "Notification 11", body: "Fill me in :3", url: "/" },
    "event_12": { title: "Notification 12", body: "Fill me in :3", url: "/" },
    "event_13": { title: "Notification 13", body: "Fill me in :3", url: "/" },
    "event_14": { title: "Notification 14", body: "Fill me in :3", url: "/" },
    "event_15": { title: "Notification 15", body: "Fill me in :3", url: "/" },
    "event_16": { title: "Notification 16", body: "Fill me in :3", url: "/" },
    "event_17": { title: "Notification 17", body: "Fill me in :3", url: "/" },
    "event_18": { title: "Notification 18", body: "Fill me in :3", url: "/" },
    "event_19": { title: "Notification 19", body: "Fill me in :3", url: "/" },
    "event_20": { title: "Notification 20", body: "Fill me in :3", url: "/" },
    
    "event_21": { title: "Notification 21", body: "Fill me in :3", url: "/" },
    "event_22": { title: "Notification 22", body: "Fill me in :3", url: "/" },
    "event_23": { title: "Notification 23", body: "Fill me in :3", url: "/" },
    "event_24": { title: "Notification 24", body: "Fill me in :3", url: "/" },
    "event_25": { title: "Notification 25", body: "Fill me in :3", url: "/" },
    "event_26": { title: "Notification 26", body: "Fill me in :3", url: "/" },
    "event_27": { title: "Notification 27", body: "Fill me in :3", url: "/" },
    "event_28": { title: "Notification 28", body: "Fill me in :3", url: "/" },
    "event_29": { title: "Notification 29", body: "Fill me in :3", url: "/" },
    "event_30": { title: "Notification 30", body: "Fill me in :3", url: "/" },
    
    "event_31": { title: "Notification 31", body: "Fill me in :3", url: "/" },
    "event_32": { title: "Notification 32", body: "Fill me in :3", url: "/" },
    "event_33": { title: "Notification 33", body: "Fill me in :3", url: "/" },
    "event_34": { title: "Notification 34", body: "Fill me in :3", url: "/" },
    "event_35": { title: "Notification 35", body: "Fill me in :3", url: "/" },
    "event_36": { title: "Notification 36", body: "Fill me in :3", url: "/" },
    "event_37": { title: "Notification 37", body: "Fill me in :3", url: "/" },
    "event_38": { title: "Notification 38", body: "Fill me in :3", url: "/" },
    "event_39": { title: "Notification 39", body: "Fill me in :3", url: "/" },
    "event_40": { title: "Notification 40", body: "Fill me in :3", url: "/" },
    
    "event_41": { title: "Notification 41", body: "Fill me in :3", url: "/" },
    "event_42": { title: "Notification 42", body: "Fill me in :3", url: "/" },
    "event_43": { title: "Notification 43", body: "Fill me in :3", url: "/" },
    "event_44": { title: "Notification 44", body: "Fill me in :3", url: "/" },
    "event_45": { title: "Notification 45", body: "Fill me in :3", url: "/" },
    "event_46": { title: "Notification 46", body: "Fill me in :3", url: "/" },
    "event_47": { title: "Notification 47", body: "Fill me in :3", url: "/" },
    "event_48": { title: "Notification 48", body: "Fill me in :3", url: "/" },
    "event_49": { title: "Notification 49", body: "Fill me in :3", url: "/" },
    "event_50": { title: "Notification 50", body: "Fill me in :3", url: "/" },
    
    "event_51": { title: "Notification 51", body: "Fill me in :3", url: "/" },
    "event_52": { title: "Notification 52", body: "Fill me in :3", url: "/" },
    "event_53": { title: "Notification 53", body: "Fill me in :3", url: "/" },
    "event_54": { title: "Notification 54", body: "Fill me in :3", url: "/" },
    "event_55": { title: "Notification 55", body: "Fill me in :3", url: "/" },
    "event_56": { title: "Notification 56", body: "Fill me in :3", url: "/" },
    "event_57": { title: "Notification 57", body: "Fill me in :3", url: "/" },
    "event_58": { title: "Notification 58", body: "Fill me in :3", url: "/" },
    "event_59": { title: "Notification 59", body: "Fill me in :3", url: "/" },
    "event_60": { title: "Notification 60", body: "Fill me in :3", url: "/" },
    
    "event_61": { title: "Notification 61", body: "Fill me in :3", url: "/" },
    "event_62": { title: "Notification 62", body: "Fill me in :3", url: "/" },
    "event_63": { title: "Notification 63", body: "Fill me in :3", url: "/" },
    "event_64": { title: "Notification 64", body: "Fill me in :3", url: "/" },
    "event_65": { title: "Notification 65", body: "Fill me in :3", url: "/" },
    "event_66": { title: "Notification 66", body: "Fill me in :3", url: "/" },
    "event_67": { title: "Notification 67", body: "Fill me in :3", url: "/" },
    "event_68": { title: "Notification 68", body: "Fill me in :3", url: "/" },
    "event_69": { title: "Notification 69", body: "Fill me in :3", url: "/" },
    "event_70": { title: "Notification 70", body: "Fill me in :3", url: "/" },
    
    "event_71": { title: "Notification 71", body: "Fill me in :3", url: "/" },
    "event_72": { title: "Notification 72", body: "Fill me in :3", url: "/" },
    "event_73": { title: "Notification 73", body: "Fill me in :3", url: "/" },
    "event_74": { title: "Notification 74", body: "Fill me in :3", url: "/" },
    "event_75": { title: "Notification 75", body: "Fill me in :3", url: "/" },
    "event_76": { title: "Notification 76", body: "Fill me in :3", url: "/" },
    "event_77": { title: "Notification 77", body: "Fill me in :3", url: "/" },
    "event_78": { title: "Notification 78", body: "Fill me in :3", url: "/" },
    "event_79": { title: "Notification 79", body: "Fill me in :3", url: "/" },
    "event_80": { title: "Notification 80", body: "Fill me in :3", url: "/" },
    
    "event_81": { title: "Notification 81", body: "Fill me in :3", url: "/" },
    "event_82": { title: "Notification 82", body: "Fill me in :3", url: "/" },
    "event_83": { title: "Notification 83", body: "Fill me in :3", url: "/" },
    "event_84": { title: "Notification 84", body: "Fill me in :3", url: "/" },
    "event_85": { title: "Notification 85", body: "Fill me in :3", url: "/" },
    "event_86": { title: "Notification 86", body: "Fill me in :3", url: "/" },
    "event_87": { title: "Notification 87", body: "Fill me in :3", url: "/" },
    "event_88": { title: "Notification 88", body: "Fill me in :3", url: "/" },
    "event_89": { title: "Notification 89", body: "Fill me in :3", url: "/" },
    "event_90": { title: "Notification 90", body: "Fill me in :3", url: "/" },
    
    "event_91": { title: "Notification 91", body: "Fill me in :3", url: "/" },
    "event_92": { title: "Notification 92", body: "Fill me in :3", url: "/" },
    "event_93": { title: "Notification 93", body: "Fill me in :3", url: "/" },
    "event_94": { title: "Notification 94", body: "Fill me in :3", url: "/" },
    "event_95": { title: "Notification 95", body: "Fill me in :3", url: "/" },
    "event_96": { title: "Notification 96", body: "Fill me in :3", url: "/" },
    "event_97": { title: "Notification 97", body: "Fill me in :3", url: "/" },
    "event_98": { title: "Notification 98", body: "Fill me in :3", url: "/" },
    "event_99": { title: "Notification 99", body: "Fill me in :3", url: "/" },
    "event_100": { title: "Notification 100", body: "Fill me in :3", url: "/" },
};
