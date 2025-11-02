import {
    ref,
    onValue,

} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

export const DB = {

     // --- 4. ЛОГИКА БАЗЫ ДАННЫХ (Firebase RTDB) ---
    
        async initializeDataListeners() {
            if (!this.state.currentUserId) return;
            
            // Отключаем старые слушатели
            if (this.firebase.accountsListener) this.firebase.accountsListener();
            if (this.firebase.loansListener) this.firebase.loansListener();
            if (this.firebase.transactionsListener) this.firebase.transactionsListener();
            if (this.firebase.debtsListener) this.firebase.debtsListener(); // <-- НОВЫЙ
    
            // 1. Слушатель Счетов
            const accountsRef = ref(this.firebase.db, `users/${this.state.currentUserId}/accounts`);
            this.firebase.accountsListener = onValue(accountsRef, (snapshot) => {
                const data = snapshot.val() || {};
                this.state.allAccounts = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                this.state.allAccounts.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
                this.renderAccounts();
                this.updateBalances();
                this.populateAccountSelect();
            }, (error) => console.error("Ошибка загрузки счетов:", error));
    
            // 2. Слушатель Кредитов
            const loansRef = ref(this.firebase.db, `users/${this.state.currentUserId}/loans`);
            this.firebase.loansListener = onValue(loansRef, (snapshot) => {
                const data = snapshot.val() || {};
                this.state.allLoans = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                this.state.allLoans.sort((a, b) => a.paymentDate - b.paymentDate);
                this.renderLoans();
                this.renderClosedLoans(); // <-- НОВЫЙ ВЫЗОВ
                this.renderLoanStatus();
                this.updateTotalDebtSummary(); // <-- ИЗМЕНЕНИЕ
            }, (error) => console.error("Ошибка загрузки кредитов:", error));
    
            // 3. Слушатель Транзакций
            const transRef = ref(this.firebase.db, `users/${this.state.currentUserId}/transactions`);
            this.firebase.transactionsListener = onValue(transRef, (snapshot) => {
                const data = snapshot.val() || {};
                this.state.allTransactions = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                this.state.allTransactions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                
                this.renderHistory();
                this.renderAllHistory();
                this.updateBalances();
                this.renderBudgetModels();
                this.renderLoanStatus();
            }, (error) => console.error("Ошибка загрузки транзакций:", error));
            
            // 4. Слушатель Долгов (НОВЫЙ)
            const debtsRef = ref(this.firebase.db, `users/${this.state.currentUserId}/debts`);
            this.firebase.debtsListener = onValue(debtsRef, (snapshot) => {
                const data = snapshot.val() || {};
                this.state.allDebts = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                this.state.allDebts.sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());
                this.renderDebts();
                this.updateTotalDebtSummary();
            }, (error) => console.error("Ошибка загрузки долгов:", error));
        },
        
        clearAllLocalData() {
            if (this.firebase.accountsListener) this.firebase.accountsListener();
            if (this.firebase.loansListener) this.firebase.loansListener();
            if (this.firebase.transactionsListener) this.firebase.transactionsListener();
            if (this.firebase.debtsListener) this.firebase.debtsListener(); // <-- НОВЫЙ
            this.firebase.accountsListener = null;
            this.firebase.loansListener = null;
            this.firebase.transactionsListener = null;
            this.firebase.debtsListener = null; // <-- НОВЫЙ
    
            this.state.allTransactions = [];
            this.state.allAccounts = [];
            this.state.allLoans = [];
            this.state.allDebts = []; // <-- НОВЫЙ
            
            this.renderAccounts();
            this.renderLoans();
            this.renderClosedLoans(); // <-- НОВЫЙ ВЫЗОВ
            this.renderDebts(); // <-- НОВЫЙ
            this.renderHistory();
            this.renderAllHistory();
            this.updateBalances();
            this.renderBudgetModels();
            this.renderLoanStatus();
            this.updateTotalDebtSummary(); // <-- ИЗМЕНЕНИЕ
            
            this.elements.drawerModelDisplay.innerHTML = `<p class="text-gray-500 dark:text-gray-400">${this.getString('drawer.modelPlaceholder')}</p>`;
            this.elements.budgetModelSelect.value = 'none';
        },
};