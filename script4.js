import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    updateEmail, 
    updatePassword,
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserLocalPersistence,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8fedCmpIZtKWVvIVcBUlHof4zw78j5Tk",
    authDomain: "the-grand-band.firebaseapp.com",
    projectId: "the-grand-band",
    storageBucket: "the-grand-band.firebasestorage.app",
    messagingSenderId: "800164147306",
    appId: "1:800164147306:web:110cb30d1615cd910eda13",
    measurementId: "G-BQED0D01JZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence Engine Fault:", err));

window.currentUserContext = null;

onAuthStateChanged(auth, (user) => {
    const navBtn = document.getElementById('navAccountBtn');
    if (user) {
        window.currentUserContext = user;
        navBtn.innerHTML = `<i data-lucide="settings" class="w-4 h-4"></i> ${user.displayName || 'Settings'}`;
        document.getElementById('settingsUsername').value = user.displayName || '';
        document.getElementById('settingsEmail').value = user.email || '';
    } else {
        window.currentUserContext = null;
        navBtn.innerHTML = `<i data-lucide="user" class="w-4 h-4"></i> Account`;
    }
    if (window.lucide) lucide.createIcons();
});

getRedirectResult(auth).then((result) => {
    if (result && result.user) {
        alert(`Successfully signed in! Welcome, ${result.user.displayName || result.user.email}`);
        closeAuthModal();
    }
}).catch((error) => {
    console.error("Redirect Auth Error:", error);
    alert(`Social Auth Error: ${error.message}`);
});

window.handleSocialAuth = async (providerName) => {
    let provider = null;
    if (providerName === 'google') provider = new GoogleAuthProvider();
    else if (providerName === 'facebook') provider = new FacebookAuthProvider();
    else if (providerName === 'apple') provider = new OAuthProvider('apple.com');
    else if (providerName === 'microsoft') provider = new OAuthProvider('microsoft.com');
    else if (providerName === 'yahoo') provider = new OAuthProvider('yahoo.com');

    if (!provider) return;
    try {
        await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error(`Firebase Auth Error for ${providerName}:`, error);
        alert(`Social Auth Error: ${error.message}`);
    }
};

window.firebaseAuthAction = async (mode, email, password, username, optionalPayload) => {
    try {
        if (mode === 'signup') {
            try {
                const credentials = await createUserWithEmailAndPassword(auth, email, password);
                if (username) {
                    await updateProfile(credentials.user, { displayName: username });
                }

                if (optionalPayload.passkey || optionalPayload.authenticator || optionalPayload.passcode) {
                    localStorage.setItem('sec_keys_' + email.toLowerCase(), JSON.stringify(optionalPayload));
                }

                await signOut(auth);
                alert("Account created successfully! For security, you must now type your details inside Sign In to log in permanently.");
                toggleAuthMode();
            } catch (signUpErr) {
                if (signUpErr.code === 'auth/email-already-in-use') {
                    alert("Security Halt: User already created an account with this identity block context.");
                } else {
                    throw signUpErr;
                }
            }
        } else if (mode === 'signin') {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Authenticated successfully. Persistent operational state active.");
            closeAuthModal();
        } else if (mode === 'reset') {
            const op1 = document.getElementById('authOldPassword1').value;
            const op2 = document.getElementById('authOldPassword2').value;
            const np1 = document.getElementById('authNewPassword1').value;
            const np2 = document.getElementById('authNewPassword2').value;
            
            if (op1 !== op2) {
                alert("Security Error: The old password double-check mapping does not match.");
                return;
            }
            if (np1 !== np2) {
                alert("Security Error: The new password double-check mapping does not match.");
                return;
            }

            const savedKeysRaw = localStorage.getItem('sec_keys_' + email.toLowerCase());
            if (savedKeysRaw) {
                const savedKeys = JSON.parse(savedKeysRaw);
                if (savedKeys.passkey || savedKeys.authenticator || savedKeys.passcode) {
                    const securityInput = prompt("Advanced Security Detected 🔒\n\nPlease enter your Passkey, Authenticator code, or Backup Passcode to authorize this password reset.\n\nIf you don't remember it, please reach out to us at contact@onegrandband.com to help recover your account.");
                    if (securityInput !== savedKeys.passkey && 
                        securityInput !== savedKeys.authenticator && 
                        securityInput !== savedKeys.passcode) {
                        alert("Security Verification Failed.\n\nSince the backup keys didn't match, the reset was blocked. Please contact contact@onegrandband.com for recovery assistance.");
                        return;
                    }
                }
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, op1);
            await updatePassword(userCredential.user, np1);
            alert("Password rewritten successfully forever! Session logged out. Please sign in with your brand new credentials.");
            await signOut(auth);
            
            document.getElementById('resetFieldsBlock').classList.add('hidden');
            document.getElementById('socialAuthBlock').classList.remove('hidden');
            
            const emailInput = document.getElementById('authEmail');
            emailInput.disabled = false;
            emailInput.classList.remove('opacity-50', 'cursor-not-allowed');

            window.internalAuthMode = 'signin';
            toggleAuthMode();
        }
    } catch (error) {
        alert(`Security Routing Error: ${error.message}`);
    }
};

window.firebaseUpdateAccount = async (newUsername, newEmail) => {
    if (!window.currentUserContext) return;
    try {
        if (newUsername && newUsername !== window.currentUserContext.displayName) {
            await updateProfile(window.currentUserContext, { displayName: newUsername });
        }
        if (newEmail && newEmail !== window.currentUserContext.email) {
            await updateEmail(window.currentUserContext, newEmail);
        }
        alert("Profile credentials securely updated within network schema database records.");
        closeSettingsModal();
    } catch (err) {
        alert(`Profile Revision Fault: ${err.message}`);
    }
};

window.triggerSignOut = async () => {
    await signOut(auth);
    alert("Disconnected session state.");
    closeSettingsModal();
};
