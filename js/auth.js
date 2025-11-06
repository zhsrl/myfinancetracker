import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { DB } from './db.js';
import { App } from './app.js';


export const Auth = {

    setupAuthListener() {
        onAuthStateChanged(this.firebase.auth, async (user) => {
            if (user) {
                this.state.currentUserId = user.uid;
                this.elements.userEmailDisplay.textContent = user.email;
                this.elements.userIdDisplay.textContent = user.uid;
                
                
                // Логика отображения
                this.elements.authContainer.classList.add('hidden');
                this.elements.mainAppContainer.classList.remove('hidden');
                
                await this.initializeDataListeners();
            } else {
                this.state.currentUserId = null;
                
                // Логика отображения
                this.elements.authContainer.classList.remove('hidden');
                this.elements.mainAppContainer.classList.add('hidden');
                
                DB.clearAllLocalData();
                
            }
            
            // ИЗМЕНЕНИЕ: Вызываем applyLanguage() здесь,
            // после того как решено, какой контейнер показывать.
            this.applyLanguage();
            
            // Скрываем спиннер ПОСЛЕ принятия решения
            this.elements.loadingSpinner.classList.add('hidden');
        });
    },

    async handleLogin(e) {
        e.preventDefault();
        this.elements.authError.textContent = '';
        const email = document.getElementById('login-email').value; // Эти ID используются только здесь, можно не кэшировать
        const password = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(this.firebase.auth, email, password);
        } catch (error) {
            console.error("Ошибка входа:", error.code);
            this.elements.authError.textContent = Auth.getAuthErrorMessage(error.code);
        }
    },
    
    async handleRegister(e) {
        e.preventDefault();
        this.elements.authError.textContent = '';
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
            await createUserWithEmailAndPassword(this.firebase.auth, email, password);
        } catch (error) {
            console.error("Ошибка регистрации:", error.code);
            this.elements.authError.textContent = getAuthErrorMessage(error.code);
        }
    },
    
    async handleLogout() {
        try {
            await signOut(this.firebase.auth);
            this.toggleDrawer(false); 
        } catch (error) {
            console.error("Ошибка выхода:", error);
            this.showToast('Ошибка при выходе.', true);
        }
    },
    
    getAuthErrorMessage(code) {
        switch (code) {
            case 'auth/invalid-email': return App.getString('auth.error.invalidEmail');
            case 'auth/user-not-found': return App.getString('auth.error.userNotFound');
            case 'auth/wrong-password': return App.getString('auth.error.wrongPassword');
            case 'auth/email-already-in-use':  App.getString('auth.error.emailInUse');
            case 'auth/weak-password': return App.getString('auth.error.weakPassword');
            case 'auth/invalid-credential': return App.getString('auth.error.invalidCredential');
            default: return App.getString('auth.error.default');
        }
    },

};