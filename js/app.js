
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    onValue,
    set,
    push,
    remove,
    runTransaction,
    serverTimestamp,
    query as dbQuery,
    orderByChild,
    equalTo,
    get
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

import { Auth } from "./auth.js";
import { DB } from "./db.js";


const firebaseConfig = {
    apiKey: "AIzaSyDoYzo2ntwZ_nbnzh5f967tmR8f31Y-dPc",
    authDomain: "budgetapp-a5883.firebaseapp.com",
    databaseURL: "https://budgetapp-a5883-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "budgetapp-a5883",
    storageBucket: "budgetapp-a5883.firebasestorage.app",
    messagingSenderId: "839768191708",
    appId: "1:839768191708:web:3e901d3f4656f80faaba19",
    measurementId: "G-N2M6D4FMZ6"
};

// --- ОПТИМИЗАЦИЯ: Модуль приложения "App" ---
const App = {
    
    // Состояние приложения
    state: {
        currentUserId: null,
        allTransactions: [],
        allAccounts: [],
        allLoans: [],
        allDebts: [], // <-- НОВОЕ СОСТОЯНИЕ
        currentBudgetModel: 'none',
        currentLang: 'ru', // <-- НОВОЕ СОСТОЯНИЕ
    },

    // Сервисы Firebase
    firebase: {
        app: null,
        auth: null,
        db: null,
        accountsListener: null,
        loansListener: null,
        transactionsListener: null,
        debtsListener: null, // <-- НОВЫЙ
    },

    // Кэш DOM-элементов
    elements: {
        authContainer: null,
        mainAppContainer: null,
        authTabLogin: null,
        authTabRegister: null,
        authFormLogin: null,
        authFormRegister: null,
        authError: null,
        logoutButton: null,
        totalBalanceEl: null,
        savingsBalanceEl: null,
        totalLoansBalanceEl: null, 
        accountsSlider: null,
        loansSlider: null,
        historyList: null,
        noAccountsEl: null,
        noLoansEl: null,
        noHistoryEl: null,
        loanStatusWidget: null,
        budgetModelSelect: null,
        drawerModelDisplay: null,
        mainModelDisplay: null,
        navIncome: null,
        navExpense: null,
        transactionModal: null,
        closeTransactionModal: null,
        transactionModalTitle: null,
        transactionForm: null,
        transactionCategory: null,
        loanPaymentContainer: null,
        transactionLoanSelect: null,
        savingsTransferContainer: null,
        transactionSavingsSelect: null,
        submitTransactionBtn: null,
        transactionAccountSelect: null,
        transactionDescriptionInput: null,
        transactionAmountInput: null,
        accountModal: null,
        addAccountBtn: null,
        closeAccountModal: null,
        accountForm: null,
        accountTypeSelect: null,
        bankLogoContainer: null,
        bankLogoInputs: null,
        accountLogoUrlInput: null,
        accountNameInput: null,
        colorPicker: null,
        colorSwatches: null,
        accountColorInput: null,
        loanModal: null,
        addLoanBtn: null,
        closeLoanModal: null,
        loanForm: null,
        menuToggle: null,
        drawerBackdrop: null,
        drawerContent: null,
        toast: null,
        toastMessage: null,
        showAllHistoryBtn: null,
        historyModal: null,
        closeHistoryModal: null,
        allHistoryContent: null,
        userEmailDisplay: null,
        userIdDisplay: null,
        transactionTypeInput: null,
        
        // НОВЫЕ ЭЛЕМЕНТЫ (ДОЛГИ)
        debtsSlider: null,
        noDebtsEl: null,
        addDebtBtn: null,
        debtModal: null,
        closeDebtModal: null,
        debtForm: null,
        showDebtDetailsBtn: null,
        debtDetailsModal: null,
        closeDebtDetailsModal: null,
        detailsLoanDebt: null,
        detailsSimpleDebt: null,
        detailsTotalDebt: null,
        
        // НОВЫЕ ЭЛЕМЕНТЫ (ДЕТАЛИ СБЕРЕЖЕНИЙ)
        showSavingsDetailsBtn: null,
        savingsDetailsModal: null,
        closeSavingsDetailsModal: null,
        savingsBreakdownContainer: null, // <-- ИЗМЕНЕНИЕ
        detailsDeposit: null,
        detailsTotalSavings: null,
        
        // НОВЫЕ ЭЛЕМЕНТЫ (ОПЛАТА ДОЛГА)
        payDebtModal: null,
        closePayDebtModal: null,
        payDebtForm: null,
        payDebtInfo: null,
        payDebtAccountSelect: null,
        submitPayDebtBtn: null,
        payDebtIdInput: null,
        payDebtAmountInput: null,
        payDebtNameInput: null,

        // НОВЫЕ ЭЛЕМЕНТЫ (ЗАКРЫТЫЕ КРЕДИТЫ)
        showClosedLoansBtn: null,
        closedLoansModal: null,
        closeClosedLoansModal: null,
        closedLoansContent: null,

        // НОВЫЕ ЭЛЕМЕНТЫ ДЛЯ ЛОКАЛИЗАЦИИ
        langToggleRU: null,
        langToggleKK: null,
        appTitleHeader: null,
        totalBalanceLabel: null,
        savingsLabel: null,
        totalLoanLabel: null,
        mainModelPlaceholder: null,
        navIncomeLabel: null,
        navExpenseLabel: null,
        accountsTitle: null,
        loansTitle: null,
        historyTitle: null,
        showAllHistoryBtn: null,
        historyModalTitle: null,
        drawerTitle: null,
        drawerBudgetLabel: null,
        drawerModelOptionNone: null,
        drawerModelOption503020: null,
        drawerModelOption8020: null,
        drawerUserLabel: null,
        logoutButtonLabel: null,
    },
    
    // Форматтер валют (будет инициализирован в init)
    formatter: null,

    // --- 1. ИНИЦИАЛИЗАЦИЯ ---

    init() {
        try {
            // 1. Устанавливаем язык ПЕРЕД инициализацией
            const savedLang = localStorage.getItem('myFinLang') || 'ru';
            this.state.currentLang = savedLang;
            
            // 2. Инициализируем Firebase
            this.firebase.app = initializeApp(firebaseConfig);
            this.firebase.db = getDatabase(this.firebase.app);
            this.firebase.auth = getAuth(this.firebase.app);

            // 3. Инициализируем форматтер
            this.formatter = this.createFormatter(this.state.currentLang);

            // 4. Кэшируем DOM-элементы
            this.cacheDOMElements();
            
            // 5. Привязываем обработчики событий
            this.bindEventListeners();

            // 6. Запускаем главный слушатель Auth
            // this.setupAuthListener();
            Auth.setupAuthListener.call(this);
            
            
            // 7. Применяем язык
            // this.applyLanguage(); // <-- ИЗМЕНЕНИЕ: УДАЛЕНО ОТСЮДА
        } catch (error) {
            console.error("Ошибка инициализации Firebase:", error);
            if (this.elements.authError) {
                this.elements.authError.textContent = "Ошибка инициализации Firebase. Твой 'firebaseConfig' указан верно?";
            }
            if (this.elements.authContainer) {
                this.elements.authContainer.classList.remove('hidden');
            }
        }
    },

    // --- 2. УТИЛИТЫ (Helpers) ---
        cacheDOMElements() {
        this.elements.loadingSpinner = document.getElementById('loading-spinner-container'); // <-- НОВЫЙ ЭЛЕМЕНТ
        this.elements.authContainer = document.getElementById('auth-container');
        this.elements.mainAppContainer = document.getElementById('main-app');
        this.elements.authTabLogin = document.getElementById('auth-tab-login');
        this.elements.authTabRegister = document.getElementById('auth-tab-register');
        this.elements.authFormLogin = document.getElementById('auth-form-login');
        this.elements.authFormRegister = document.getElementById('auth-form-register');
        this.elements.authError = document.getElementById('auth-error');
        this.elements.logoutButton = document.getElementById('logout-button');
        this.elements.totalBalanceEl = document.getElementById('total-balance');
        this.elements.savingsBalanceEl = document.getElementById('savings-balance');
        this.elements.totalLoansBalanceEl = document.getElementById('total-loans-balance'); // <-- НОВЫЙ ЭЛЕМЕНТ
        this.elements.accountsSlider = document.getElementById('accounts-slider');
        this.elements.loansSlider = document.getElementById('loans-slider');
        this.elements.historyList = document.getElementById('history-list');
        this.elements.noAccountsEl = document.getElementById('no-accounts');
        this.elements.noLoansEl = document.getElementById('no-loans');
        this.elements.noHistoryEl = document.getElementById('no-history');
        this.elements.loanStatusWidget = document.getElementById('loan-status-widget');
        this.elements.budgetModelSelect = document.getElementById('budget-model-select');
        this.elements.drawerModelDisplay = document.getElementById('model-display');
        this.elements.mainModelDisplay = document.getElementById('main-model-display');
        this.elements.navIncome = document.getElementById('nav-income');
        this.elements.navExpense = document.getElementById('nav-expense');
        this.elements.transactionModal = document.getElementById('transaction-modal');
        this.elements.closeTransactionModal = document.getElementById('close-transaction-modal');
        this.elements.transactionModalTitle = document.getElementById('transaction-modal-title');
        this.elements.transactionForm = document.getElementById('transaction-form');
        this.elements.transactionCategory = document.getElementById('transaction-category');
        this.elements.loanPaymentContainer = document.getElementById('loan-payment-container');
        this.elements.transactionLoanSelect = document.getElementById('transaction-loan-select');
        this.elements.savingsTransferContainer = document.getElementById('savings-transfer-container');
        this.elements.transactionSavingsSelect = document.getElementById('transaction-savings-select');
        this.elements.submitTransactionBtn = document.getElementById('submit-transaction-btn');
        this.elements.transactionAccountSelect = document.getElementById('transaction-account');
        this.elements.transactionDescriptionInput = document.getElementById('transaction-description');
        this.elements.transactionAmountInput = document.getElementById('transaction-amount');
        this.elements.accountModal = document.getElementById('account-modal');
        this.elements.addAccountBtn = document.getElementById('add-account-btn');
        this.elements.closeAccountModal = document.getElementById('close-account-modal');
        this.elements.accountForm = document.getElementById('account-form');
        this.elements.accountTypeSelect = document.getElementById('account-type');
        this.elements.bankLogoContainer = document.getElementById('bank-logo-container');
        this.elements.bankLogoInputs = document.querySelectorAll('.bank-logo');
        this.elements.accountLogoUrlInput = document.getElementById('account-logo-url');
        this.elements.accountNameInput = document.getElementById('account-name');
        this.elements.colorPicker = document.getElementById('color-picker');
        this.elements.colorSwatches = document.querySelectorAll('.color-swatch');
        this.elements.accountColorInput = document.getElementById('account-color');
        this.elements.loanModal = document.getElementById('loan-modal');
        this.elements.addLoanBtn = document.getElementById('add-loan-btn');
        this.elements.closeLoanModal = document.getElementById('close-loan-modal');
        this.elements.loanForm = document.getElementById('loan-form');
        this.elements.menuToggle = document.getElementById('menu-toggle');
        this.elements.drawerBackdrop = document.getElementById('drawer-backdrop');
        this.elements.drawerContent = document.getElementById('drawer-content');
        this.elements.toast = document.getElementById('toast-notification');
        this.elements.toastMessage = document.getElementById('toast-message');
        this.elements.showAllHistoryBtn = document.getElementById('show-all-history-btn');
        this.elements.historyModal = document.getElementById('history-modal');
        this.elements.closeHistoryModal = document.getElementById('close-history-modal');
        this.elements.allHistoryContent = document.getElementById('all-history-content');
        this.elements.userEmailDisplay = document.getElementById('user-email-display');
        this.elements.userIdDisplay = document.getElementById('user-id-display');
        this.elements.transactionTypeInput = document.getElementById('transaction-type');

        // НОВЫЕ ЭЛЕМЕНТЫ (ДОЛГИ)
        this.elements.debtsSlider = document.getElementById('debts-slider');
        this.elements.noDebtsEl = document.getElementById('no-debts');
        this.elements.addDebtBtn = document.getElementById('add-debt-btn');
        this.elements.debtModal = document.getElementById('debt-modal');
        this.elements.closeDebtModal = document.getElementById('close-debt-modal');
        this.elements.debtForm = document.getElementById('debt-form');
        this.elements.showDebtDetailsBtn = document.getElementById('show-debt-details-btn');
        this.elements.debtDetailsModal = document.getElementById('debt-details-modal');
        this.elements.closeDebtDetailsModal = document.getElementById('close-debt-details-modal');
        this.elements.detailsLoanDebt = document.getElementById('details-loan-debt');
        this.elements.detailsSimpleDebt = document.getElementById('details-simple-debt');
        this.elements.detailsTotalDebt = document.getElementById('details-total-debt');

        // НОВЫЕ ЭЛЕМЕНТЫ (ДЕТАЛИ СБЕРЕЖЕНИЙ)
        this.elements.showSavingsDetailsBtn = document.getElementById('show-savings-details-btn');
        this.elements.savingsDetailsModal = document.getElementById('savings-details-modal');
        this.elements.closeSavingsDetailsModal = document.getElementById('close-savings-details-modal');
        this.elements.savingsBreakdownContainer = document.getElementById('savings-breakdown-container'); // <-- ИЗМЕНЕНИЕ
        this.elements.detailsDeposit = document.getElementById('details-deposit');
        this.elements.detailsTotalSavings = document.getElementById('details-total-savings');
        
        // НОВЫЕ ЭЛЕМЕНТЫ (ОПЛАТА ДОЛГА)
        this.elements.payDebtModal = document.getElementById('pay-debt-modal');
        this.elements.closePayDebtModal = document.getElementById('close-pay-debt-modal');
        this.elements.payDebtForm = document.getElementById('pay-debt-form');
        this.elements.payDebtInfo = document.getElementById('pay-debt-info');
        this.elements.payDebtAccountSelect = document.getElementById('pay-debt-account-select');
        this.elements.submitPayDebtBtn = document.getElementById('submit-pay-debt-btn');
        this.elements.payDebtIdInput = document.getElementById('pay-debt-id-input');
        this.elements.payDebtAmountInput = document.getElementById('pay-debt-amount-input');
        this.elements.payDebtNameInput = document.getElementById('pay-debt-name-input');
        
        // НОВЫЕ ЭЛЕМЕНТЫ (ЗАКРЫТЫЕ КРЕДИТЫ)
        this.elements.showClosedLoansBtn = document.getElementById('show-closed-loans-btn');
        this.elements.closedLoansModal = document.getElementById('closed-loans-modal');
        this.elements.closeClosedLoansModal = document.getElementById('close-closed-loans-modal');
        this.elements.closedLoansContent = document.getElementById('closed-loans-content');
        
        // НОВЫЕ ЭЛЕМЕНТЫ ДЛЯ ЛОКАЛИЗАЦИИ
        this.elements.langToggleRU = document.getElementById('lang-toggle-ru');
        this.elements.langToggleKK = document.getElementById('lang-toggle-kk');
        this.elements.appTitleHeader = document.getElementById('app-title-header');
        this.elements.totalBalanceLabel = document.querySelector('#total-balance').previousElementSibling;
        this.elements.savingsLabel = document.getElementById('savings-label');
        this.elements.totalLoanLabel = document.getElementById('total-loan-label');
        this.elements.mainModelPlaceholder = document.getElementById('main-model-placeholder');
        this.elements.navIncomeLabel = document.getElementById('nav-income-label');
        this.elements.navExpenseLabel = document.getElementById('nav-expense-label');
        this.elements.accountsTitle = document.getElementById('accounts-title');
        this.elements.loansTitle = document.getElementById('loans-title');
        this.elements.historyTitle = document.getElementById('history-title');
        this.elements.showAllHistoryBtn = document.getElementById('show-all-history-btn');
        this.elements.historyModalTitle = document.querySelector('#history-modal h2');
        this.elements.drawerTitle = document.querySelector('#drawer-content h2');
        this.elements.drawerBudgetLabel = document.querySelector('label[for="budget-model-select"]');
        this.elements.drawerModelOptionNone = document.querySelector('#budget-model-select option[value="none"]');
        this.elements.drawerModelOption503020 = document.querySelector('#budget-model-select option[value="50-30-20"]');
        this.elements.drawerModelOption8020 = document.querySelector('#budget-model-select option[value="80-20"]');
        this.elements.drawerUserLabel = document.querySelector('#drawer-content .text-xs');
        this.elements.logoutButtonLabel = document.querySelector('#logout-button span');
    },

    bindEventListeners() {
        this.elements.authTabLogin.addEventListener('click', () => this.toggleAuthTabs(true));
        this.elements.authTabRegister.addEventListener('click', () => this.toggleAuthTabs(false));
        this.elements.authFormLogin.addEventListener('submit', (e) => Auth.handleLogin.call(this, e));
        this.elements.authFormRegister.addEventListener('submit', (e) => Auth.handleRegister.call(this, e));
        this.elements.logoutButton.addEventListener('click', () => Auth.handleLogout.call(this));

        this.elements.menuToggle.addEventListener('click', () => this.toggleDrawer(true));
        this.elements.drawerBackdrop.addEventListener('click', () => this.toggleDrawer(false));
        
        this.elements.navIncome.addEventListener('click', () => this.openTransactionModal('income'));
        this.elements.navExpense.addEventListener('click', () => this.openTransactionModal('expense'));
        
        this.elements.addAccountBtn.addEventListener('click', () => this.toggleModal('account-modal', true));
        this.elements.closeAccountModal.addEventListener('click', () => this.toggleModal('account-modal', false));
        this.elements.accountForm.addEventListener('submit', (e) => this.handleAccountSubmit(e));
        
        this.elements.addLoanBtn.addEventListener('click', () => this.toggleModal('loan-modal', true));
        this.elements.closeLoanModal.addEventListener('click', () => this.toggleModal('loan-modal', false));
        this.elements.loanForm.addEventListener('submit', (e) => this.handleLoanSubmit(e));
        
        this.elements.closeTransactionModal.addEventListener('click', () => this.toggleModal('transaction-modal', false));
        this.elements.transactionForm.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        
        this.elements.showAllHistoryBtn.addEventListener('click', () => this.toggleModal('history-modal', true));
        this.elements.closeHistoryModal.addEventListener('click', () => this.toggleModal('history-modal', false));
        
        // НОВЫЕ ОБРАБОТЧИКИ (ДОЛГИ)
        this.elements.addDebtBtn.addEventListener('click', () => this.toggleModal('debt-modal', true));
        this.elements.closeDebtModal.addEventListener('click', () => this.toggleModal('debt-modal', false));
        this.elements.debtForm.addEventListener('submit', (e) => this.handleDebtSubmit(e));
        this.elements.showDebtDetailsBtn.addEventListener('click', () => this.showDebtDetailsModal());
        this.elements.closeDebtDetailsModal.addEventListener('click', () => this.toggleModal('debt-details-modal', false));

        // НОВЫЕ ОБРАБОТЧИКИ (ДЕТАЛИ СБЕРЕЖЕНИЙ)
        this.elements.showSavingsDetailsBtn.addEventListener('click', () => this.showSavingsDetailsModal());
        this.elements.closeSavingsDetailsModal.addEventListener('click', () => this.toggleModal('savings-details-modal', false));
        
        // НОВЫЕ ОБРАБОТЧИКИ (ОПЛАТА ДОЛГА)
        this.elements.closePayDebtModal.addEventListener('click', () => this.toggleModal('pay-debt-modal', false));
        this.elements.payDebtForm.addEventListener('submit', (e) => this.handlePayDebtSubmit(e));

        // НОВЫЕ ОБРАБОТЧИКИ (ЗАКРЫТЫЕ КРЕДИТЫ)
        this.elements.showClosedLoansBtn.addEventListener('click', () => this.openClosedLoansModal());
        this.elements.closeClosedLoansModal.addEventListener('click', () => this.toggleModal('closed-loans-modal', false));
        
        this.setupAccountModalUI();
        this.elements.transactionCategory.addEventListener('change', (e) => this.handleCategoryChange(e));
        this.elements.budgetModelSelect.addEventListener('change', () => this.renderBudgetModels());

        // НОВЫЕ ОБРАБОТЧИКИ
        this.elements.langToggleRU.addEventListener('click', () => this.setLanguage('ru'));
        this.elements.langToggleKK.addEventListener('click', () => this.setLanguage('kk'));
    },

    toggleModal(modalId, show) {
        const modal = document.getElementById(modalId); // Модальные окна кэшировать не стоит, если они динамические
        if (show) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    },
    
    toggleDrawer(show) {
        if (show) {
            this.elements.drawerBackdrop.classList.remove('hidden');
            this.elements.drawerBackdrop.style.opacity = '1';
            this.elements.drawerContent.classList.remove('-translate-x-full');
        } else {
            this.elements.drawerBackdrop.style.opacity = '0';
            this.elements.drawerContent.classList.add('-translate-x-full');
            setTimeout(() => this.elements.drawerBackdrop.classList.add('hidden'), 300);
        }
    },

    showToast(message, isError = false) {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.className = `fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 p-4 rounded-lg shadow-lg z-50 transition-all duration-500 show ${isError ? 'bg-red-500' : 'bg-green-500'}`;
        setTimeout(() => this.elements.toast.classList.remove('show'), 3000);
    },
    
    toggleAuthTabs(showLogin) {
        this.elements.authError.textContent = ''; // Очищаем ошибки
        if (showLogin) {
            this.elements.authTabLogin.classList.add('border-blue-600', 'dark:border-blue-400', 'text-blue-600', 'dark:text-blue-400');
            this.elements.authTabLogin.classList.remove('text-gray-500', 'dark:text-gray-400');
            this.elements.authTabRegister.classList.remove('border-blue-600', 'dark:border-blue-400', 'text-blue-600', 'dark:text-blue-400');
            this.elements.authTabRegister.classList.add('text-gray-500', 'dark:text-gray-400');
            this.elements.authFormLogin.classList.remove('hidden');
            this.elements.authFormRegister.classList.add('hidden');
        } else {
            this.elements.authTabLogin.classList.remove('border-blue-600', 'dark:border-blue-400', 'text-blue-600', 'dark:text-blue-400');
            this.elements.authTabLogin.classList.add('text-gray-500', 'dark:text-gray-400');
            this.elements.authTabRegister.classList.add('border-blue-600', 'dark:border-blue-400', 'text-blue-600', 'dark:text-blue-400');
            this.elements.authTabRegister.classList.remove('text-gray-500', 'dark:text-gray-400');
            this.elements.authFormLogin.classList.add('hidden');
            this.elements.authFormRegister.classList.remove('hidden');
        }
    },


    // --- 4. ЛОГИКА БАЗЫ ДАННЫХ (Firebase RTDB) ---

    async initializeDataListeners() {

        DB.initializeDataListeners.call(this);
    },

    
    // --- 5. ОБРАБОТЧИКИ ФОРМ (Submits) ---

    async handleAccountSubmit(e) {
        e.preventDefault();
        if (!this.state.currentUserId) return;
        const name = this.elements.accountNameInput.value;
        const balance = parseFloat(document.getElementById('account-balance').value); // ID, т.к. кэшировать input.value бессмысленно
        const type = this.elements.accountTypeSelect.value;
        const color = this.elements.accountColorInput.value;
        const logoUrl = this.elements.accountLogoUrlInput.value;
        try {
            const newAccRef = push(ref(this.firebase.db, `users/${this.state.currentUserId}/accounts`));
            await set(newAccRef, { name, balance, type, color, logoUrl, createdAt: serverTimestamp() });
            this.toggleModal('account-modal', false);
            this.elements.accountForm.reset();
            this.setupAccountModalUI(); // Сброс UI модального окна
            this.showToast(this.getString('toast.accountAdded'));
        } catch (error) { console.error("Ошибка добавления счета:", error); this.showToast(this.getString('toast.accountAddedError'), true); }
    },
    
    async handleLoanSubmit(e) {
        e.preventDefault();
        if (!this.state.currentUserId) return;
        try {
            const newLoanRef = push(ref(this.firebase.db, `users/${this.state.currentUserId}/loans`));
            await set(newLoanRef, {
                name: document.getElementById('loan-name').value,
                totalAmount: parseFloat(document.getElementById('loan-total-amount').value),
                paidAmount: parseFloat(document.getElementById('loan-paid-amount').value),
                monthlyPayment: parseFloat(document.getElementById('loan-monthly-payment').value),
                paymentDate: parseInt(document.getElementById('loan-payment-date').value),
                createdAt: serverTimestamp()
            });
            this.toggleModal('loan-modal', false);
            this.elements.loanForm.reset();
            this.showToast(this.getString('toast.loanAdded'));
        } catch (error) { console.error("Ошибка добавления кредита:", error); this.showToast(this.getString('toast.loanAddedError'), true); }
    },

    // НОВАЯ ФУНКЦИЯ
    async handleDebtSubmit(e) {
        e.preventDefault();
        if (!this.state.currentUserId) return;
        try {
            const newDebtRef = push(ref(this.firebase.db, `users/${this.state.currentUserId}/debts`));
            await set(newDebtRef, {
                name: document.getElementById('debt-name').value,
                description: document.getElementById('debt-description').value,
                totalAmount: parseFloat(document.getElementById('debt-total-amount').value),
                paymentDate: document.getElementById('debt-payment-date').value,
                createdAt: serverTimestamp()
            });
            this.toggleModal('debt-modal', false);
            this.elements.debtForm.reset();
            this.showToast(this.getString('toast.debtAdded'));
        } catch (error) { console.error("Ошибка добавления долга:", error); this.showToast(this.getString('toast.debtAddedError'), true); }
    },

    async handleTransactionSubmit(e) {
        e.preventDefault();
        if (!this.state.currentUserId) return;
        
        const type = this.elements.transactionTypeInput.value;
        const description = this.elements.transactionDescriptionInput.value;
        const amount = parseFloat(this.elements.transactionAmountInput.value);
        const accountId = this.elements.transactionAccountSelect.value;
        const category = this.elements.transactionCategory.value;
        const loanId = (category === 'loan') ? this.elements.transactionLoanSelect.value : null;
        const isSavings = category === 'savings-503020' || category === 'savings-8020' || category === 'savings';
        const toAccountId = (isSavings) ? this.elements.transactionSavingsSelect.value : null;
        
        if (!type || !description || isNaN(amount) || !accountId) { this.showToast(this.getString('toast.fillFields'), true); return; }
        if (isSavings && !toAccountId) { this.showToast(this.getString('toast.selectSavingsAccount'), true); return; }
        if (isSavings && toAccountId === accountId) { this.showToast(this.getString('toast.sameAccountError'), true); return; }
        
        try {
            const newTransRef = push(ref(this.firebase.db, `users/${this.state.currentUserId}/transactions`));
            await set(newTransRef, { description, amount, type, accountId, category, createdAt: serverTimestamp(), loanId, toAccountId });
            
            const accountRef = ref(this.firebase.db, `users/${this.state.currentUserId}/accounts/${accountId}/balance`);
            const amountToUpdate = (type === 'income') ? amount : -amount;
            await runTransaction(accountRef, (currentBalance) => (currentBalance || 0) + amountToUpdate);
            
            if (type === 'expense' && category === 'loan' && loanId) {
                const loanRef = ref(this.firebase.db, `users/${this.state.currentUserId}/loans/${loanId}/paidAmount`);
                await runTransaction(loanRef, (currentPaid) => (currentPaid || 0) + amount);
            }
            
            if (type === 'expense' && isSavings && toAccountId) {
                const savingsAccountRef = ref(this.firebase.db, `users/${this.state.currentUserId}/accounts/${toAccountId}/balance`);
                await runTransaction(savingsAccountRef, (currentBalance) => (currentBalance || 0) + amount);
            }

            this.toggleModal('transaction-modal', false);
            this.elements.transactionForm.reset();
            this.elements.loanPaymentContainer.classList.add('hidden');
            this.elements.savingsTransferContainer.classList.add('hidden');
            const message = type === 'income' ? this.getString('toast.incomeAdded') : this.getString('toast.expenseAdded');
            this.showToast(message);
        } catch (error) { console.error("Ошибка добавления транзакции:", error); this.showToast(this.getString('toast.transactionError'), true); }
    },

    // НОВАЯ ФУНКЦИЯ (ОПЛАТА ДОЛГА)
    async handlePayDebtSubmit(e) {
        e.preventDefault();
        if (!this.state.currentUserId) return;
        
        const debtId = this.elements.payDebtIdInput.value;
        const amount = parseFloat(this.elements.payDebtAmountInput.value);
        const debtName = this.elements.payDebtNameInput.value;
        const accountId = this.elements.payDebtAccountSelect.value;
        
        if (!accountId) {
            this.showToast(this.getString('toast.selectPaymentAccount'), true);
            return;
        }
        
        try {
            // 1. Создаем транзакцию расхода
            const newTransRef = push(ref(this.firebase.db, `users/${this.state.currentUserId}/transactions`));
            await set(newTransRef, {
                description: `${this.getString('history.debtPaymentPrefix')} "${debtName}"`,
                amount: amount,
                type: 'expense',
                accountId: accountId,
                category: 'debt', // Новая специальная категория
                createdAt: serverTimestamp(),
                loanId: null,
                toAccountId: null
            });
            
            // 2. Списываем деньги со счета
            const accountRef = ref(this.firebase.db, `users/${this.state.currentUserId}/accounts/${accountId}/balance`);
            await runTransaction(accountRef, (currentBalance) => (currentBalance || 0) - amount);
            
            // 3. Удаляем долг
            const debtRef = ref(this.firebase.db, `users/${this.state.currentUserId}/debts/${debtId}`);
            await remove(debtRef);
            
            this.toggleModal('pay-debt-modal', false);
            this.showToast(this.getString('toast.deleteDebtSuccess'));

        } catch (error) {
            console.error("Ошибка оплаты долга:", error);
            this.showToast(this.getString('toast.deleteDebtError'), true);
        }
    },

    // --- 6. ЛОГИКА УДАЛЕНИЯ ---

    async handleDeleteAccount(accountId) {
        if (!this.state.currentUserId) return;
        
        const transRef = ref(this.firebase.db, `users/${this.state.currentUserId}/transactions`);
        const transQueryFrom = dbQuery(transRef, orderByChild("accountId"), equalTo(accountId));
        const transQueryTo = dbQuery(transRef, orderByChild("toAccountId"), equalTo(accountId));
        
        try {
            const [transSnapshotFrom, transSnapshotTo] = await Promise.all([
                get(transQueryFrom),
                get(transQueryTo)
            ]);
            
             if (transSnapshotFrom.exists() || transSnapshotTo.exists()) {
                this.showToast(this.getString('toast.deleteAccountError'), true);
                return;
            }
            
            const accountRef = ref(this.firebase.db, `users/${this.state.currentUserId}/accounts/${accountId}`);
            await remove(accountRef);
            this.showToast(this.getString('toast.deleteAccountSuccess'));
            
        } catch (error) { console.error("Ошибка удаления счета:", error); this.showToast(`${this.getString('toast.deleteAccountErrorDefault')}: ${error}.`, true); }
    },
    
    async handleDeleteLoan(loanId) {
        if (!this.state.currentUserId) return;
        
         const transRef = ref(this.firebase.db, `users/${this.state.currentUserId}/transactions`);
         const transQuery = dbQuery(transRef, orderByChild("loanId"), equalTo(loanId));
        
        try {
            const transSnapshot = await get(transQuery);
            if (transSnapshot.exists()) {
                this.showToast(this.getString('toast.deleteLoanError'), true);
                return;
            }
            
            const loanRef = ref(this.firebase.db, `users/${this.state.currentUserId}/loans/${loanId}`);
            await remove(loanRef);
            this.showToast(this.getString('toast.deleteLoanSuccess'));
            
        } catch (error) { console.error("Ошибка удаления кредита:", error); this.showToast(this.getString('toast.deleteLoanErrorDefault'), true); }
    },
    
    // ИЗМЕНЕННАЯ ФУНКЦИЯ
    async handleMarkDebtAsPaid(debt) {
        // Эта функция теперь открывает модальное окно, а не удаляет
        if (!debt) return;
        
        this.elements.payDebtIdInput.value = debt.id;
        this.elements.payDebtAmountInput.value = debt.totalAmount;
        this.elements.payDebtNameInput.value = debt.name;
        
        this.elements.payDebtInfo.textContent = `${this.getString('modal.debtName')}: ${debt.name} (${this.formatter.format(debt.totalAmount)})`;
        
        this.populatePayDebtAccountSelect();
        this.toggleModal('pay-debt-modal', true);
    },

    // --- 7. ФУНКЦИИ РЕНДЕРИНГА (UI) ---
    // 
    updateBalances() {
        let total = 0;
        let savings = 0;
        this.state.allAccounts.forEach(acc => {
            if(acc.type == 'cash' || acc.type == 'bank') {
                total += acc.balance;
            }
            
            if (acc.type === 'savings' || acc.type === 'deposit') {
                savings += acc.balance;
            }
        });
        this.elements.totalBalanceEl.textContent = this.formatter.format(total);
        this.elements.savingsBalanceEl.textContent = this.formatter.format(savings);
        
        // Вызываем новую функцию
        this.updateTotalDebtSummary(); 
    },
    
    // ИЗМЕНЕННАЯ ФУНКЦИЯ
    updateTotalDebtSummary() {
        let totalLoan = 0;
        this.state.allLoans.forEach(loan => {
            const remaining = loan.totalAmount - loan.paidAmount;
            if (remaining > 0) {
                totalLoan += remaining;
            }
        });

        let totalSimpleDebt = 0;
        this.state.allDebts.forEach(debt => {
            totalSimpleDebt += debt.totalAmount;
        });
        
        const totalCombinedDebt = totalLoan + totalSimpleDebt;
        this.elements.totalLoansBalanceEl.textContent = this.formatter.format(totalCombinedDebt);
    },
    
    // НОВАЯ ФУНКЦИЯ
    showDebtDetailsModal() {
        let totalLoan = 0;
        this.state.allLoans.forEach(loan => {
            const remaining = loan.totalAmount - loan.paidAmount;
            if (remaining > 0) totalLoan += remaining;
        });
        
        let totalSimpleDebt = 0;
        this.state.allDebts.forEach(debt => {
            totalSimpleDebt += debt.totalAmount;
        });
        
        const totalCombinedDebt = totalLoan + totalSimpleDebt;
        
        this.elements.detailsLoanDebt.textContent = this.formatter.format(totalLoan);
        this.elements.detailsSimpleDebt.textContent = this.formatter.format(totalSimpleDebt);
        this.elements.detailsTotalDebt.textContent = this.formatter.format(totalCombinedDebt);
        
        this.toggleModal('debt-details-modal', true);
    },
    
    // ИЗМЕНЕННАЯ ФУНКЦИЯ
    showSavingsDetailsModal() {
        let totalSavings = 0;
        let totalDeposits = 0;
        
        const savingsAccounts = this.state.allAccounts.filter(acc => acc.type === 'savings');
        const depositAccounts = this.state.allAccounts.filter(acc => acc.type === 'deposit');

        // 1. Суммируем и отображаем Депозиты
        depositAccounts.forEach(acc => {
            totalDeposits += acc.balance;
        });
        this.elements.detailsDeposit.textContent = this.formatter.format(totalDeposits);
        
        // 2. Очищаем и заполняем разбивку по сбережениям
        this.elements.savingsBreakdownContainer.innerHTML = '';
        if (savingsAccounts.length > 0) {
            savingsAccounts.forEach(acc => {
                totalSavings += acc.balance;
                const row = document.createElement('div');
                row.className = "flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg";
                row.innerHTML = `
                    <span class="font-medium text-gray-700 dark:text-gray-300 truncate pr-2">${acc.name}</span>
                    <span class="font-bold text-lg text-gray-900 dark:text-white">${this.formatter.format(acc.balance)}</span>
                `;
                this.elements.savingsBreakdownContainer.appendChild(row);
            });
        } else {
            this.elements.savingsBreakdownContainer.innerHTML = `<p class="text-center text-sm text-gray-500 dark:text-gray-400 p-2">${this.getString('modal.noSavingsAccountsNamed')}</p>`;
        }
        
        // 3. Считаем итого
        const totalCombined = totalSavings + totalDeposits;
        this.elements.detailsTotalSavings.textContent = this.formatter.format(totalCombined);
        
        this.toggleModal('savings-details-modal', true);
    },

    renderAccounts() {
        if (this.state.allAccounts.length === 0) {
            this.elements.noAccountsEl.classList.remove('hidden');
            this.elements.accountsSlider.innerHTML = '';
            this.elements.accountsSlider.appendChild(this.elements.noAccountsEl);
            return;
        }
        this.elements.noAccountsEl.classList.add('hidden');
        this.elements.accountsSlider.innerHTML = '';
        this.state.allAccounts.forEach(account => {
            const card = document.createElement('div');
            const colorClass = account.color || 'from-gray-500 to-gray-700';
            card.className = `slider-item bg-gradient-to-br ${colorClass} p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between h-48 relative overflow-hidden`;
            let logoHtml = '';
            if (account.logoUrl) {
                logoHtml = `
                    <div class="absolute top-4 left-4 w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center shadow">
                        <img src="${account.logoUrl}" alt="${account.name} logo" class="w-full h-full object-contain" 
                             onerror="event.target.parentElement.innerHTML = '${account.name.charAt(0)}'; event.target.parentElement.classList.add('logo-fallback');">
                    </div>`;
            }
            const typeText = { 
                bank: this.getString('account.typeBank'), 
                deposit: this.getString('account.typeDeposit'), 
                savings: this.getString('account.typeSavings'), 
                cash: this.getString('account.typeCash') 
            };
            card.innerHTML = `
                ${logoHtml}
                <button class="delete-account-btn absolute top-2 right-2 w-7 h-7 bg-black bg-opacity-20 rounded-full text-white text-xs hover:bg-opacity-40 z-10">
                    <i class="fas fa-times"></i>
                </button>
                <div class="z-0">
                    <span class="block text-sm font-medium opacity-80 ${account.logoUrl ? 'text-right' : ''}">${typeText[account.type] || this.getString('account.typeAccount')}</span>
                    <span class="block text-lg font-semibold truncate ${account.logoUrl ? 'text-right' : ''}">${account.name}</span>
                </div>
                <div class="z-0">
                    <span class="block text-xs opacity-80">${this.getString('account.balance')}</span>
                    <p class="text-3xl font-bold truncate">${this.formatter.format(account.balance)}</p>
                </div>
            `;
            card.querySelector('.delete-account-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeleteAccount(account.id);
            });
            this.elements.accountsSlider.appendChild(card);
        });
    },
    
    // ИЗМЕНЕННАЯ ФУНКЦИЯ
    renderLoans() {
        // Фильтруем только НЕВЫПЛАЧЕННЫЕ кредиты
        const activeLoans = this.state.allLoans.filter(l => l.paidAmount < l.totalAmount);

        if (activeLoans.length === 0) {
            this.elements.noLoansEl.classList.remove('hidden');
            this.elements.loansSlider.innerHTML = '';
            this.elements.loansSlider.appendChild(this.elements.noLoansEl);
            return;
        }
        this.elements.noLoansEl.classList.add('hidden');
        this.elements.loansSlider.innerHTML = '';
        activeLoans.forEach(loan => {
            const card = document.createElement('div');
            const progress = (loan.paidAmount / loan.totalAmount) * 100;
            const remainingAmount = loan.totalAmount - loan.paidAmount;
            const remainingMonths = (loan.monthlyPayment > 0) ? Math.ceil(remainingAmount / loan.monthlyPayment) : 0;
            
            let monthsText = '';
            if (remainingMonths > 0) {
                monthsText = this.getString('loan.monthsLeft', { months: remainingMonths });
            } else {
                monthsText = this.getString('loan.paidOff');
            }

            card.className = 'slider-item bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-between h-60 relative';
            card.innerHTML = `
                <button class="delete-loan-btn absolute top-2 right-2 w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 z-10">
                    <i class="fas fa-times"></i>
                </button>
                <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">${this.getString('loan.loan')}</span>
                    <span class="block text-lg font-semibold truncate text-gray-900 dark:text-white">${loan.name}</span>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                        ${this.getString('loan.paymentDayPrefix')} ${loan.paymentDate} ${this.getString('loan.paymentDaySuffix')}
                    </span>
                </div>
                <div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${progress}%"></div>
                    </div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-600 dark:text-gray-300">${this.getString('loan.paid')}</span>
                        <span class="font-semibold text-gray-900 dark:text-white">${this.formatter.format(loan.paidAmount)}</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>${this.getString('loan.total')}</span>
                        <span>${this.formatter.format(loan.totalAmount)}</span>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-2 pt-2 border-t dark:border-gray-700">
                    <span class="text-sm text-gray-600 dark:text-gray-300">${this.getString('loan.monthlyPayment')}: <br> <strong class="text-base text-gray-900 dark:text-white">${this.formatter.format(loan.monthlyPayment)}</strong></span>
                    <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">${monthsText}</span>
                </div>
            `;
            card.querySelector('.delete-loan-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeleteLoan(loan.id);
            });
            this.elements.loansSlider.appendChild(card);
        });
    },

    // НОВАЯ ФУНКЦИЯ
    renderClosedLoans() {
        const closedLoans = this.state.allLoans.filter(l => l.paidAmount >= l.totalAmount);
        
        if (closedLoans.length === 0) {
            this.elements.closedLoansContent.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 p-10">${this.getString('modal.noClosedLoans')}</p>`;
            return;
        }
        
        this.elements.closedLoansContent.innerHTML = '';
        const sortedLoans = closedLoans.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        sortedLoans.forEach(loan => {
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex items-center justify-between";
            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-800">
                        <i class="fas fa-check text-green-500"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900 dark:text-white truncate">${loan.name}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${this.getString('loan.paidOff')}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-gray-700 dark:text-gray-300">
                        ${this.formatter.format(loan.totalAmount)}
                    </p>
                </div>
            `;
            this.elements.closedLoansContent.appendChild(card);
        });
    },

    // НОВАЯ ФУНКЦИЯ
    openClosedLoansModal() {
        this.renderClosedLoans(); // Сначала рендерим, потом открываем
        this.toggleModal('closed-loans-modal', true);
    },

    // НОВАЯ ФУНКЦИЯ
    renderDebts() {
        if (this.state.allDebts.length === 0) {
            this.elements.noDebtsEl.classList.remove('hidden');
            this.elements.debtsSlider.innerHTML = '';
            this.elements.debtsSlider.appendChild(this.elements.noDebtsEl);
            return;
        }
        this.elements.noDebtsEl.classList.add('hidden');
        this.elements.debtsSlider.innerHTML = '';
        const locale = this.state.currentLang === 'kk' ? 'kk-KZ' : 'ru-RU';

        this.state.allDebts.forEach(debt => {
            const card = document.createElement('div');
            card.className = 'slider-item bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-between h-52 relative';
            
            const paymentDate = new Date(debt.paymentDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
            const isOverdue = new Date(debt.paymentDate) < new Date();
            
            card.innerHTML = `
                <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 ${isOverdue ? 'text-red-500' : ''}">
                        ${this.getString('debt.returnBy')}: ${paymentDate} ${isOverdue ? ` (${this.getString('debt.overdue')})` : ''}
                    </span>
                    <span class="block text-lg font-semibold truncate text-gray-900 dark:text-white">${debt.name}</span>
                    <p class="text-sm text-gray-600 dark:text-gray-300 truncate">${debt.description || '...'}</p>
                </div>
                <div>
                    <span class="block text-xs opacity-80 text-gray-500 dark:text-gray-400">${this.getString('debt.amount')}</span>
                    <p class="text-2xl font-bold truncate text-gray-900 dark:text-white">${this.formatter.format(debt.totalAmount)}</p>
                </div>
                <button class="mark-debt-paid-btn w-full mt-2 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 p-2 rounded-lg text-sm font-semibold hover:bg-green-200 dark:hover:bg-green-700 transition-all">
                    <i class="fas fa-check mr-1"></i> ${this.getString('debt.markAsPaid')}
                </button>
            `;
            card.querySelector('.mark-debt-paid-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMarkDebtAsPaid(debt); // <-- ИЗМЕНЕНИЕ: передаем весь объект
            });
            this.elements.debtsSlider.appendChild(card);
        });
    },

    renderHistory() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayTransactions = this.state.allTransactions.filter(t => t.createdAt >= todayStart.getTime());
        if (todayTransactions.length === 0) {
            this.elements.noHistoryEl.classList.remove('hidden');
            this.elements.historyList.innerHTML = '';
            this.elements.historyList.appendChild(this.elements.noHistoryEl);
            return;
        }
        this.elements.noHistoryEl.classList.add('hidden');
        this.elements.historyList.innerHTML = '';
        todayTransactions.forEach(trans => this.elements.historyList.appendChild(this.createTransactionElement(trans)));
    },
    
    renderAllHistory() {
        if (this.state.allTransactions.length === 0) {
            this.elements.allHistoryContent.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 p-10">${this.getString('history.noHistory')}</p>`;
            return;
        }
        this.elements.allHistoryContent.innerHTML = '';
        const locale = this.state.currentLang === 'kk' ? 'kk-KZ' : 'ru-RU';
        const grouped = this.state.allTransactions.reduce((acc, trans) => {
            const date = new Date(trans.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
            if (!acc[date]) acc[date] = [];
            acc[date].push(trans);
            return acc;
        }, {});
        const sortedDates = Object.keys(grouped);
        sortedDates.forEach(date => {
            const dateGroupEl = document.createElement('div');
            dateGroupEl.innerHTML = `<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">${date}</h3>`;
            const transactionsEl = document.createElement('div');
            transactionsEl.className = "bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden";
            grouped[date].forEach((trans, index) => {
                const transEl = this.createTransactionElement(trans);
                transEl.className = "flex items-center justify-between p-4"; 
                if (index > 0) transEl.classList.add("border-t", "dark:border-gray-700");
                transactionsEl.appendChild(transEl);
            });
            dateGroupEl.appendChild(transactionsEl);
            this.elements.allHistoryContent.appendChild(dateGroupEl);
        });
    },

    createTransactionElement(trans) {
        const element = document.createElement('div');
        const account = this.state.allAccounts.find(a => a.id === trans.accountId);
        const isIncome = trans.type === 'income';
        let description = trans.description;
        let icon = isIncome ? 'fa-arrow-up text-green-500' : 'fa-arrow-down text-red-500';
        let iconBg = isIncome ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800';
        let amountColor = isIncome ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';
        let sign = isIncome ? '+' : '-';
        
        const isSavings = trans.category === 'savings-503020' || trans.category === 'savings-8020' || trans.category === 'savings';
        const isLoan = trans.category === 'loan';
        const isDebt = trans.category === 'debt';

        if (isSavings) {
            const toAccount = this.state.allAccounts.find(a => a.id === trans.toAccountId);
            const toAccountName = toAccount ? toAccount.name : this.getString('history.savingsAccount');
            description = `${this.getString('history.transferPrefix')} "${toAccountName}"`;
            icon = 'fa-exchange-alt text-blue-500';
            iconBg = 'bg-blue-100 dark:bg-blue-800';
        } else if (isLoan) {
            // description уже установлен (напр., "Оплата кредита - ...")
            icon = 'fa-file-invoice-dollar text-purple-500';
            iconBg = 'bg-purple-100 dark:bg-purple-800';
        } else if (isDebt) {
            // description уже установлен (напр., "Оплата долга - ...")
            icon = 'fa-hand-holding-usd text-orange-500';
            iconBg = 'bg-orange-100 dark:bg-orange-800';
        }
        
        const locale = this.state.currentLang === 'kk' ? 'kk-KZ' : 'ru-RU';
        const timeString = new Date(trans.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        const accountName = account ? account.name : this.getString('history.accountDeleted');

        element.className = 'bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex items-center justify-between';
        element.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center ${iconBg}">
                    <i class="fas ${icon}"></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">${description}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${accountName} | ${timeString}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold ${amountColor}">
                    ${sign}${this.formatter.format(trans.amount)}
                </p>
            </div>
        `;
        return element;
    },

    renderBudgetModels() {
        this.state.currentBudgetModel = this.elements.budgetModelSelect.value;
        if (this.state.currentBudgetModel === 'none') {
            const msg = `<p class="text-gray-500 dark:text-gray-400">${this.getString('drawer.modelPlaceholder')}</p>`;
            this.elements.drawerModelDisplay.innerHTML = msg;
            this.elements.mainModelDisplay.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400">${this.getString('drawer.modelPlaceholderMain')}</p>`;
            return;
        }
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        let totalIncome = 0;
        const expensesByCategory = {
            'needs-503020': 0, 'wants-503020': 0, 'savings-503020': 0,
            'expenses-8020': 0, 'savings-8020': 0,
            'needs': 0, 'wants': 0, 'savings': 0, 'loan': 0, 'debt': 0, 'other': 0 // <-- Добавлена 'debt'
        };
        this.state.allTransactions.forEach(t => {
            if (t.createdAt < monthStart) return;
            if (t.type === 'income') totalIncome += t.amount;
            else if (expensesByCategory.hasOwnProperty(t.category)) expensesByCategory[t.category] += t.amount;
            else expensesByCategory['other'] += t.amount;
        });
        
        // --- ИСПРАВЛЕНИЕ ЛОГИКИ ---
        let modelHtml = '';
        
        if (this.state.currentBudgetModel === '50-30-20') {
            // Логика 50/30/20
            const needsLimit = totalIncome * 0.5;
            const wantsLimit = totalIncome * 0.3;
            const savingsLimit = totalIncome * 0.2;
            
            // Суммируем расходы для 50% (Нужды)
            const totalNeeds = (expensesByCategory['needs-503020'] || 0) + 
                               (expensesByCategory['needs'] || 0) + 
                               (expensesByCategory['loan'] || 0) + 
                               (expensesByCategory['debt'] || 0) + 
                               (expensesByCategory['other'] || 0); // Предполагаем, что 'other', 'loan', 'debt', 'needs' - это "Нужды"
            
            // Суммируем расходы для 30% (Желания)
            const totalWants = (expensesByCategory['wants-503020'] || 0) + 
                               (expensesByCategory['wants'] || 0);
                               
            // Суммируем расходы для 20% (Сбережения)
            const totalSavings = (expensesByCategory['savings-503020'] || 0) + 
                                 (expensesByCategory['savings'] || 0);

            modelHtml = `
                <h4 class="font-semibold text-gray-700 dark:text-gray-300">${this.getString('budget.monthlyIncome')}: ${this.formatter.format(totalIncome)}</h4>
                ${this.createProgressBar(this.getString('budget.needs50'), totalNeeds, needsLimit)}
                ${this.createProgressBar(this.getString('budget.wants30'), totalWants, wantsLimit)}
                ${this.createProgressBar(this.getString('budget.savings20'), totalSavings, savingsLimit)}
            `;
        } else if (this.state.currentBudgetModel === '80-20') {
            // Логика 80/20
            const expensesLimit = totalIncome * 0.8;
            const savingsLimit = totalIncome * 0.2;
            
            // Суммируем все расходы (80%)
            const totalExpenses = (expensesByCategory['expenses-8020'] || 0) +
                                  (expensesByCategory['needs'] || 0) +
                                  (expensesByCategory['wants'] || 0) +
                                  (expensesByCategory['loan'] || 0) +
                                  (expensesByCategory['debt'] || 0) +
                                  (expensesByCategory['other'] || 0); // Все, что не сбережения - это расходы

            // Суммируем все сбережения (20%)
            const totalSavings = (expensesByCategory['savings-8020'] || 0) +
                                 (expensesByCategory['savings'] || 0);
            
            modelHtml = `
                <h4 class="font-semibold text-gray-700 dark:text-gray-300">${this.getString('budget.monthlyIncome')}: ${this.formatter.format(totalIncome)}</h4>
                ${this.createProgressBar(this.getString('budget.expenses80'), totalExpenses, expensesLimit)}
                ${this.createProgressBar(this.getString('budget.savings20'), totalSavings, savingsLimit)}
            `;
        }
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
        
        this.elements.drawerModelDisplay.innerHTML = modelHtml;
        this.elements.mainModelDisplay.innerHTML = modelHtml;
    },

    createProgressBar(label, spent, limit) {
        const spentFormatted = this.formatter.format(spent);
        const limitFormatted = this.formatter.format(Math.max(0, limit));
        let percentage = (limit > 0) ? (spent / limit) * 100 : 0;
        let colorClass = 'bg-blue-600';
        if (percentage > 100) { percentage = 100; colorClass = 'bg-red-600'; }
        else if (percentage > 90) colorClass = 'bg-yellow-500';
        return `
            <div class="space-y-1">
                <div class="flex justify-between text-sm font-medium">
                    <span class="text-gray-700 dark:text-gray-300">${label}</span>
                    <span class="text-gray-500 dark:text-gray-400">${spentFormatted} / ${limitFormatted}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div class="${colorClass} h-2.5 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    },
    
    renderLoanStatus() {
        if (this.state.allLoans.length === 0) {
            this.elements.loanStatusWidget.innerHTML = '';
            return;
        }
        this.elements.loanStatusWidget.innerHTML = `<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">${this.getString('loan.statusTitle')}</h3>`;
        const now = new Date();
        const today = now.getDate();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const loanPayments = this.state.allTransactions.filter(t => t.category === 'loan' && t.createdAt >= monthStart);
        this.state.allLoans.forEach(loan => {
            const paymentDate = loan.paymentDate;
            const hasPaid = loanPayments.some(p => p.loanId === loan.id);
            let statusText = '';
            let statusColor = 'text-gray-500 dark:text-gray-400';
            let statusIcon = 'fa-clock';
            if (hasPaid) { statusText = this.getString('loan.status.paid'); statusColor = 'text-green-600 dark:text-green-500'; statusIcon = 'fa-check-circle'; }
            else if (today > paymentDate) { statusText = this.getString('loan.status.overdue'); statusColor = 'text-red-600 dark:text-red-500'; statusIcon = 'fa-exclamation-circle'; }
            else if (paymentDate - today <= 5) { statusText = this.getString('loan.status.dueSoon', { days: paymentDate - today }); statusColor = 'text-yellow-600 dark:text-yellow-500'; statusIcon = 'fa-hourglass-half'; }
            else { statusText = `${this.getString('loan.paymentDayPrefix')} ${paymentDate} ${this.getString('loan.paymentDaySuffix')}`; }
            this.elements.loanStatusWidget.innerHTML += `
                <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-gray-900 dark:text-white">${loan.name}</p>
                        <p class="text-sm ${statusColor} font-medium"><i class="fas ${statusIcon} mr-1"></i> ${statusText}</p>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-gray-900 dark:text-white">${this.formatter.format(loan.monthlyPayment)}</span>
                    </div>
                </div>
            `;
        });
    },
    
    // --- 8. Вспомогательные функции для UI (Модальные окна) ---
    
    openTransactionModal(type) {
        const isIncome = (type === 'income');
        this.elements.transactionModalTitle.textContent = isIncome ? this.getString('modal.newIncomeTitle') : this.getString('modal.newExpenseTitle');
        this.elements.submitTransactionBtn.textContent = isIncome ? this.getString('modal.addIncomeBtn') : this.getString('modal.addExpenseBtn');
        this.elements.submitTransactionBtn.className = `w-full text-white font-bold py-3 px-4 rounded-lg transition-all ${isIncome ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`;
        this.elements.transactionTypeInput.value = type;
        document.getElementById('category-container').classList.toggle('hidden', isIncome); // Этот ID кэшировать нет смысла
        this.elements.loanPaymentContainer.classList.add('hidden');
        this.elements.savingsTransferContainer.classList.add('hidden');
        this.elements.transactionAccountSelect.previousElementSibling.textContent = this.getString('modal.accountLabel');
        if (!isIncome) this.populateCategories();
        this.elements.transactionForm.reset();
        this.toggleModal('transaction-modal', true);
    },
    
    populateCategories() {
        this.elements.transactionCategory.innerHTML = '';
        if (this.state.currentBudgetModel === '50-30-20') {
            this.elements.transactionCategory.innerHTML = `
                <option value="needs-503020">${this.getString('budget.needs50')}</option>
                <option value="wants-503020">${this.getString('budget.wants30')}</option>
                <option value="savings-503020">${this.getString('budget.savings20')} (${this.getString('modal.transfer')})</option>
                <option value="loan">${this.getString('modal.loanPayment')}</option>
                <option value="other">${this.getString('modal.other')}</option>
            `;
        } else if (this.state.currentBudgetModel === '80-20') {
            this.elements.transactionCategory.innerHTML = `
                <option value="expenses-8020">${this.getString('budget.expenses80')}</option>
                <option value.style.display = "none" value="savings-8020">${this.getString('budget.savings20')} (${this.getString('modal.transfer')})</option>
                <option value="loan">${this.getString('modal.loanPayment')}</option>
                <option value="other">${this.getString('modal.other')}</option>
            `;
        } else {
             this.elements.transactionCategory.innerHTML = `
                <option value="needs">${this.getString('budget.needs')}</option>
                <option value="wants">${this.getString('budget.wants')}</option>
                <option value="savings">${this.getString('budget.savings')} (${this.getString('modal.transfer')})</option>
                <option value="loan">${this.getString('modal.loanPayment')}</option>
                <option value="other">${this.getString('modal.other')}</option>
            `;
        }
        this.elements.transactionCategory.dispatchEvent(new Event('change'));
    },
    
    handleCategoryChange(e) {
        const category = e.target.value;
        this.elements.loanPaymentContainer.classList.toggle('hidden', category !== 'loan');
        const isSavings = category === 'savings-503020' || category === 'savings-8020' || category === 'savings';
        this.elements.savingsTransferContainer.classList.toggle('hidden', !isSavings);
        if (category === 'loan') {
            this.populateLoanSelect();
            
            this.elements.transactionLoanSelect.onchange = (e) => this.handleLoanSelectChange(e);
        } else {
            this.elements.transactionLoanSelect.onchange = null;
        }
        if (isSavings) {
            this.populateSavingsSelect();
            this.elements.transactionSavingsSelect.onchange = (e) => this.handleSavingsSelectChange(e);
            this.elements.transactionAccountSelect.previousElementSibling.textContent = this.getString('modal.accountFromLabel');
        } else {
            this.elements.transactionSavingsSelect.onchange = null;
            this.elements.transactionAccountSelect.previousElementSibling.textContent = this.getString('modal.accountLabel');
        }
        if (category !== 'loan') this.resetTransactionFormPartial();
    },

    setupAccountModalUI() {
        this.elements.colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                this.elements.colorSwatches.forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                this.elements.accountColorInput.value = swatch.dataset.color;
            });
        });
        this.elements.colorSwatches[0].click();
        this.elements.accountTypeSelect.addEventListener('change', (e) => {
            this.elements.bankLogoContainer.classList.toggle('hidden', e.target.value !== 'bank');
            if (e.target.value === 'cash') this.elements.accountNameInput.value = this.getString('account.cashName');
            else if (e.target.value === 'savings' || e.target.value === 'deposit') this.elements.accountNameInput.value = this.getString('account.savingsName');
        });
        this.elements.accountTypeSelect.dispatchEvent(new Event('change'));
        this.elements.bankLogoInputs.forEach(logo => {
            logo.addEventListener('click', () => {
                this.elements.bankLogoInputs.forEach(l => l.classList.remove('selected'));
                logo.classList.add('selected');
                this.elements.accountLogoUrlInput.value = logo.dataset.bankLogoUrl;
                this.elements.accountNameInput.value = logo.dataset.bankName;
            });
        });
        this.elements.bankLogoInputs.forEach(l => l.classList.remove('selected'));
        this.elements.accountLogoUrlInput.value = '';
    },
    
    populateAccountSelect() {
        this.elements.transactionAccountSelect.innerHTML = '';
        if (this.state.allAccounts.length === 0) {
            this.elements.transactionAccountSelect.innerHTML = `<option value="">${this.getString('modal.noAccounts')}</option>`;
            return;
        }
        this.state.allAccounts.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc.id;
            option.textContent = `${acc.name} (${this.formatter.format(acc.balance)})`;
            this.elements.transactionAccountSelect.appendChild(option);
        });
    },

    populateLoanSelect() {
        this.elements.transactionLoanSelect.innerHTML = '';
        const unpaidLoans = this.state.allLoans.filter(l => l.paidAmount < l.totalAmount);
        if (unpaidLoans.length === 0) {
            this.elements.transactionLoanSelect.innerHTML = `<option value="">${this.getString('modal.noActiveLoans')}</option>`;
            return;
        }
        this.elements.transactionLoanSelect.innerHTML = `<option value="">${this.getString('modal.selectLoan')}</option>`;
        unpaidLoans.forEach(loan => {
            const option = document.createElement('option');
            option.value = loan.id;
            option.textContent = `${loan.name} (${this.formatter.format(loan.monthlyPayment)})`;
            this.elements.transactionLoanSelect.appendChild(option);
        });
    },
    
    // НОВАЯ ФУНКЦИЯ (ИСПРАВЛЕНИЕ ОШИБКИ)
    populateSavingsSelect() {
        this.elements.transactionSavingsSelect.innerHTML = '';
        // Переводить можно только на сберегательные счета
        const savingsAccounts = this.state.allAccounts.filter(a => a.type === 'savings' || a.type === 'deposit');
        
        if (savingsAccounts.length === 0) {
            this.elements.transactionSavingsSelect.innerHTML = `<option value="">${this.getString('modal.noSavingsAccounts')}</option>`;
            return;
        }
         this.elements.transactionSavingsSelect.innerHTML = `<option value="">${this.getString('modal.selectAccount')}</option>`;
        savingsAccounts.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc.id;
            option.textContent = `${acc.name} (${this.formatter.format(acc.balance)})`;
            this.elements.transactionSavingsSelect.appendChild(option);
        });
    },
    
    // НОВАЯ ФУНКЦИЯ
    populatePayDebtAccountSelect() {
        this.elements.payDebtAccountSelect.innerHTML = '';
        // Оплачивать можно только с банковских счетов или наличными
        const paymentAccounts = this.state.allAccounts.filter(a => a.type === 'bank' || a.type === 'cash');
        
        if (paymentAccounts.length === 0) {
            this.elements.payDebtAccountSelect.innerHTML = `<option value="">${this.getString('modal.noPaymentAccounts')}</option>`;
            return;
        }
         this.elements.payDebtAccountSelect.innerHTML = `<option value="">${this.getString('modal.selectAccount')}</option>`;
        paymentAccounts.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc.id;
            option.textContent = `${acc.name} (${this.formatter.format(acc.balance)})`;
            this.elements.payDebtAccountSelect.appendChild(option);
        });
    },

    handleLoanSelectChange(e) {
        const selectedLoanId = e.target.value;
        if (!selectedLoanId) { this.resetTransactionFormPartial(); return; }
        const loan = this.state.allLoans.find(l => l.id === selectedLoanId);
        if (loan) {
            // ИСПРАВЛЕНИЕ БАГА: Используем getString
            this.elements.transactionDescriptionInput.value = `${this.getString('modal.loanPaymentPrefix')} - ${loan.name}`;
            this.elements.transactionAmountInput.value = loan.monthlyPayment;
        }
    },
    
    handleSavingsSelectChange(e) {
        const selectedAccountId = e.target.value;
        if (!selectedAccountId) { this.elements.transactionDescriptionInput.value = ''; return; }
        const account = this.state.allAccounts.find(a => a.id === selectedAccountId);
        if(account) this.elements.transactionDescriptionInput.value = `${this.getString('history.transferPrefix')} "${account.name}"`;
    },
    
    resetTransactionFormPartial() {
         this.elements.transactionDescriptionInput.value = '';
         this.elements.transactionAmountInput.value = '';
    },

    // --- 9. НОВЫЕ ФУНКЦИИ ЛОКАЛИЗАЦИИ ---

    /**
     * Хелпер для безопасной установки свойств элементов,
     * которые НЕ кэшированы (вызываются через querySelector)
     */
    safeSet(selector, prop, value) {
        const el = (typeof selector === 'string') ? document.querySelector(selector) : selector;
        if (el) {
            if (prop === 'textContent') el.textContent = value;
            else if (prop === 'placeholder') el.placeholder = value;
            else if (prop === 'innerHTML') el.innerHTML = value;
        } else {
            // console.warn(`Element not found for translation: ${selector}`);
        }
    },

    /**
     * Хелпер для безопасной установки свойств кэшированных
     * элементов из App.elements
     */
    safeSetCached(element, prop, value) {
        if (element) {
            if (prop === 'textContent') element.textContent = value;
            else if (prop === 'placeholder') element.placeholder = value;
            else if (prop === 'innerHTML') element.innerHTML = value;
        } else {
            // console.warn(`Cached element is null during translation`);
        }
    },

    /**
     * Устанавливает текущий язык, сохраняет его и обновляет UI
     * @param {string} lang - 'ru' или 'kk'
     */
    setLanguage(lang) {
        if (lang === this.state.currentLang) return;
        this.state.currentLang = lang;
        localStorage.setItem('myFinLang', lang);
        
        // Обновляем форматтер
        this.formatter = this.createFormatter(lang);
        
        // Применяем язык ко всему UI
        this.applyLanguage();
    },

    /**
     * Создает и возвращает новый форматтер валют для указанного языка
     * @param {string} lang 
     */
    createFormatter(lang) {
        const locale = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
        return new Intl.NumberFormat(locale, { 
            style: 'currency', 
            currency: 'KZT',
            currencyDisplay: 'narrowSymbol',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    },

    /**
     * Получает строку из объекта переводов по ключу
     * @param {string} key - 'section.name'
     * @param {Object} [vars] - Переменные для замены (напр. {count: 5})
     */
    getString(key, vars = {}) {
        let str = key.split('.').reduce((obj, k) => obj && obj[k] ? obj[k] : null, this.translations[this.state.currentLang]);
        
        if (str === null) {
            // Fallback на русский, если ключ не найден
            str = key.split('.').reduce((obj, k) => obj && obj[k] ? obj[k] : null, this.translations['ru']);
            if (str === null) return key; // Возвращаем ключ, если ничего не найдено
        }

        // Простая замена переменных
        if (vars) {
            for (const varKey in vars) {
                str = str.replace(`{${varKey}}`, vars[varKey]);
            }
        }
        return str;
    },

    /**
     * Применяет текущий язык ко всем статическим элементам и перезагружает динамические
     */
    applyLanguage() {
        const lang = this.state.currentLang;
        const strings = this.translations[lang];

        // --- ИСПОЛЬЗУЕМ ХЕЛПЕРЫ ---
        const safeSet = this.safeSet;
        const safeSetCached = this.safeSetCached;
        
        // Обновляем заголовок страницы
        document.title = strings.pageTitle;

        // Обновляем кнопки переключения
        if (lang === 'ru') {
            if(this.elements.langToggleRU) this.elements.langToggleRU.className = "font-semibold p-2 rounded-lg text-sm w-10 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-700";
            if(this.elements.langToggleKK) this.elements.langToggleKK.className = "font-semibold p-2 rounded-lg text-sm w-10 text-gray-500 dark:text-gray-400";
        } else {
            if(this.elements.langToggleRU) this.elements.langToggleRU.className = "font-semibold p-2 rounded-lg text-sm w-10 text-gray-500 dark:text-gray-400";
            if(this.elements.langToggleKK) this.elements.langToggleKK.className = "font-semibold p-2 rounded-lg text-sm w-10 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-700";
        }

        // --- Экран авторизации ---
        if (this.elements.authContainer && this.elements.authContainer.classList.contains('hidden') === false) {
            safeSet('#auth-container h2', 'textContent', strings.appName);
            safeSet('#auth-tab-login', 'textContent', strings.auth.loginTab);
            safeSet('#auth-tab-register', 'textContent', strings.auth.registerTab);
            // Форма входа
            safeSet('label[for="login-email"]', 'textContent', strings.auth.email);
            safeSet('#login-email', 'placeholder', strings.auth.emailPlaceholder);
            safeSet('label[for="login-password"]', 'textContent', strings.auth.password);
            safeSet('#auth-form-login button', 'textContent', strings.auth.loginButton);
            // Форма регистрации
            safeSet('label[for="register-email"]', 'textContent', strings.auth.email);
            safeSet('#register-email', 'placeholder', strings.auth.emailPlaceholder);
            safeSet('label[for="register-password"]', 'textContent', strings.auth.password);
            safeSet('#register-password', 'placeholder', strings.auth.passwordPlaceholder); // <-- This was the error line
            safeSet('#auth-form-register button', 'textContent', strings.auth.registerButton);
        }

        // --- Основное приложение ---
        // (Only translate if main app elements are cached)
        if(this.elements.appTitleHeader) {
            safeSetCached(this.elements.appTitleHeader, 'textContent', strings.appName);
            safeSetCached(this.elements.totalBalanceLabel, 'textContent', strings.main.totalBalance);
            safeSetCached(this.elements.savingsLabel, 'textContent', strings.main.savings);
            safeSetCached(this.elements.totalLoanLabel, 'textContent', strings.main.totalDebt);
            safeSetCached(this.elements.mainModelPlaceholder, 'textContent', strings.drawer.modelPlaceholderMain);
            safeSetCached(this.elements.navIncomeLabel, 'textContent', strings.main.income);
            safeSetCached(this.elements.navExpenseLabel, 'textContent', strings.main.expense);
            safeSetCached(this.elements.accountsTitle, 'textContent', strings.main.accounts);
            safeSet('#add-account-btn', 'textContent', `+ ${strings.main.newAccount}`);
            safeSetCached(this.elements.loansTitle, 'textContent', strings.main.loans);
            safeSet('#add-loan-btn', 'textContent', `+ ${strings.main.newLoan}`);
            
            // НОВЫЕ СТРОКИ
            safeSetCached(this.elements.debtsSlider.previousElementSibling.querySelector('h2'), 'textContent', strings.main.debts);
            safeSet('#add-debt-btn', 'textContent', `+ ${strings.main.newDebt}`);
            safeSet('#show-debt-details-btn', 'textContent', strings.main.details);
            safeSet('#show-savings-details-btn', 'textContent', strings.main.details); // <-- НОВАЯ

            safeSetCached(this.elements.historyTitle, 'textContent', strings.main.historyToday);
            safeSetCached(this.elements.showAllHistoryBtn, 'innerHTML', `${strings.main.showAll} <i class="fas fa-arrow-right text-xs"></i>`);
            
            // Динамические плейсхолдеры
            safeSetCached(this.elements.noAccountsEl, 'textContent', strings.main.noAccounts);
            safeSetCached(this.elements.noLoansEl, 'textContent', strings.main.noLoans);
            safeSetCached(this.elements.noDebtsEl, 'textContent', strings.main.noDebts); // <-- НОВАЯ
            safeSetCached(this.elements.noHistoryEl, 'textContent', strings.main.noHistoryToday);

            // --- Модальные окна (статическая часть) ---
            safeSetCached(this.elements.historyModalTitle, 'textContent', strings.modal.allHistoryTitle);
            
            // Модальное окно счета
            safeSet('#account-modal h3', 'textContent', strings.modal.newAccountTitle);
            safeSet('label[for="account-type"]', 'textContent', strings.modal.accountType);
            safeSet('#account-type option[value="bank"]', 'textContent', strings.account.typeBank);
            safeSet('#account-type option[value="deposit"]', 'textContent', strings.account.typeDeposit);
            safeSet('#account-type option[value="savings"]', 'textContent', strings.account.typeSavings);
            safeSet('#account-type option[value="cash"]', 'textContent', strings.account.typeCash);
            safeSet('#bank-logo-container label', 'textContent', strings.modal.selectBank);
            safeSet('label[for="account-name"]', 'textContent', strings.modal.accountName);
            safeSet('label[for="account-balance"]', 'textContent', strings.modal.currentBalance);
            safeSet('label[for="color-picker"]', 'textContent', strings.modal.cardColor);
            safeSet('#account-form button', 'textContent', strings.modal.addAccountBtn);

            // Модальное окно кредита
            safeSet('#loan-modal h3', 'textContent', strings.modal.newLoanTitle);
            safeSet('label[for="loan-name"]', 'textContent', strings.modal.loanName);
            safeSet('label[for="loan-total-amount"]', 'textContent', strings.modal.loanTotalAmount);
            safeSet('label[for="loan-paid-amount"]', 'textContent', strings.modal.loanPaidAmount);
            safeSet('label[for="loan-monthly-payment"]', 'textContent', strings.modal.loanMonthlyPayment);
            safeSet('label[for="loan-payment-date"]', 'textContent', strings.modal.loanPaymentDate);
            safeSet('#loan-form button', 'textContent', strings.modal.addLoanBtn);

            // Модальное окно долга (НОВОЕ)
            safeSet('#debt-modal-title', 'textContent', strings.modal.newDebtTitle);
            safeSet('label[for="debt-name"]', 'textContent', strings.modal.debtName);
            safeSet('label[for="debt-description"]', 'textContent', strings.modal.debtDescription);
            safeSet('label[for="debt-total-amount"]', 'textContent', strings.modal.debtTotalAmount);
            safeSet('label[for="debt-payment-date"]', 'textContent', strings.modal.debtPaymentDate);
            safeSet('#debt-form button', 'textContent', strings.modal.addDebtBtn);

            // Модальное окно деталей долга (НОВОЕ)
            safeSet('#debt-details-title', 'textContent', strings.modal.debtDetailsTitle);
            safeSet('#details-loan-debt-label', 'textContent', strings.modal.totalLoanDebt);
            safeSet('#details-simple-debt-label', 'textContent', strings.modal.totalSimpleDebt);
            safeSet('#details-total-debt-label', 'textContent', strings.modal.totalCombinedDebt);

            // Модальное окно деталей сбережений (НОВОЕ)
            safeSet('#savings-details-title', 'textContent', strings.modal.savingsDetailsTitle);
            safeSet('#details-savings-label', 'textContent', strings.modal.totalSavings);
            safeSet('#details-deposit-label', 'textContent', strings.modal.totalDeposits);
            safeSet('#details-total-savings-label', 'textContent', strings.modal.totalCombinedSavings);
            
            // Модальное окно оплаты долга (НОВОЕ)
            safeSet('#pay-debt-modal-title', 'textContent', strings.modal.payDebtTitle);
            safeSet('label[for="pay-debt-account-select"]', 'textContent', strings.modal.payFromAccount);
            safeSet('#submit-pay-debt-btn', 'textContent', strings.modal.payBtn);

            // Модальное окно транзакции (статическая часть)
            safeSet('label[for="transaction-description"]', 'textContent', strings.modal.description);
            safeSet('#transaction-description', 'placeholder', strings.modal.descriptionPlaceholder);
            safeSet('label[for="transaction-amount"]', 'textContent', strings.modal.amount);
            safeSet('label[for="transaction-category"]', 'textContent', strings.modal.category);
            safeSet('label[for="transaction-loan-select"]', 'textContent', strings.modal.whichLoan);
            safeSet('label[for="transaction-savings-select"]', 'textContent', strings.modal.whichSavingsAccount);

            // --- Боковая панель (Drawer) ---
            safeSetCached(this.elements.drawerTitle, 'textContent', strings.drawer.title);
            safeSetCached(this.elements.drawerBudgetLabel, 'textContent', strings.drawer.budgetModel);
            safeSetCached(this.elements.drawerModelOptionNone, 'textContent', strings.drawer.modelOptionNone);
            safeSetCached(this.elements.drawerModelOption503020, 'textContent', strings.drawer.modelOption503020);
            safeSetCached(this.elements.drawerModelOption8020, 'textContent', strings.drawer.modelOption8020);
            if (this.elements.drawerUserLabel) {
                this.elements.drawerUserLabel.childNodes[0].nodeValue = strings.drawer.loggedInAs; // Обновляем текстовый узел
            }
            safeSetCached(this.elements.logoutButtonLabel, 'textContent', strings.drawer.logout);
        }

        // --- Перерисовка динамического контента ---
        if (this.state.currentUserId) {
            this.renderAccounts();
            this.renderLoans();
            this.renderDebts(); // <-- НОВЫЙ ВЫЗОВ
            this.renderHistory();
            this.renderAllHistory();
            this.renderBudgetModels();
            this.renderLoanStatus();
            this.populateAccountSelect();
            // Обновляем селекторы в модальном окне, если оно открыто
            if (this.elements.transactionModal && this.elements.transactionModal.classList.contains('hidden') === false) {
                this.populateCategories();
            }
        }
    },
    
    // ОБЪЕКТ ПЕРЕВОДОВ
    translations: {
        // Русский
        ru: {
            pageTitle: "MyFin - Учет финансов",
            appName: "MyFin",
            auth: {
                loginTab: "Вход",
                registerTab: "Регистрация",
                email: "Email",
                emailPlaceholder: "email@example.com",
                password: "Пароль",
                passwordPlaceholder: "Мин. 6 символов",
                loginButton: "Войти",
                registerButton: "Создать аккаунт",
                error: {
                    invalidEmail: "Неверный формат Email.",
                    userNotFound: "Пользователь не найден.",
                    wrongPassword: "Неверный пароль.",
                    emailInUse: "Этот Email уже используется.",
                    weakPassword: "Пароль слишком слабый (мин. 6 символов).",
                    invalidCredential: "Неверный Email или пароль.",
                    default: "Произошла ошибка. Попробуйте снова."
                }
            },
            main: {
                totalBalance: "Общий баланс",
                savings: "Сбережения",
                totalDebt: "Общий долг",
                income: "Доход",
                expense: "Расход",
                accounts: "Счета",
                newAccount: "Новый счет",
                loans: "Кредиты",
                newLoan: "Новый кредит",
                debts: "Долги", // <-- НОВОЕ
                newDebt: "Новый долг", // <-- НОВОЕ
                details: "Детали", // <-- НОВОЕ
                historyToday: "История (Сегодня)",
                showAll: "Все",
                noAccounts: "У вас пока нет счетов.",
                noLoans: "У вас нет активных кредитов.",
                noDebts: "У вас нет простых долгов.", // <-- НОВОЕ
                noHistoryToday: "Сегодня операций не было."
            },
            toast: {
                accountAdded: "Счет успешно добавлен!",
                accountAddedError: "Ошибка добавления счета.",
                loanAdded: "Кредит успешно добавлен!",
                loanAddedError: "Ошибка добавления кредита.",
                debtAdded: "Долг успешно добавлен!", // <-- НОВОЕ
                debtAddedError: "Ошибка добавления долга.", // <-- НОВОЕ
                fillFields: "Пожалуйста, заполните все поля.",
                selectSavingsAccount: "Пожалуйста, выберите сберегательный счет.",
                selectPaymentAccount: "Выберите счет для оплаты.", // <-- НОВОЕ
                sameAccountError: "Нельзя перевести деньги на тот же счет.",
                incomeAdded: "Доход добавлен!",
                expenseAdded: "Расход добавлен!",
                transactionError: "Ошибка добавления транзакции.",
                deleteAccountError: "Нельзя удалить счет, к которому привязаны транзакции.",
                deleteAccountSuccess: "Счет успешно удален.",
                deleteAccountErrorDefault: "Ошибка удаления счета",
                deleteLoanError: "Нельзя удалить кредит, по которому были платежи.",
                deleteLoanSuccess: "Кредит успешно удален.",
                deleteLoanErrorDefault: "Ошибка удаления кредита.",
                deleteDebtSuccess: "Долг отмечен как оплаченный.", // <-- НОВОЕ
                deleteDebtError: "Ошибка при удалении долга." // <-- НОВОЕ
            },
            account: {
                typeBank: "Банк",
                typeDeposit: "Депозит",
                typeSavings: "Сбережение",
                typeCash: "Наличный",
                typeAccount: "Счет",
                balance: "Баланс",
                cashName: "Наличные",
                savingsName: "Сберегательный счет"
            },
            debt: { // <-- НОВЫЙ БЛОК
                returnBy: "Вернуть до",
                overdue: "ПРОСРОЧЕНО",
                amount: "Сумма долга",
                markAsPaid: "Оплачено"
            },
            loan: {
                loan: "Кредит",
                paymentDayPrefix: "Платеж до",
                paymentDaySuffix: "числа",
                paid: "Оплачено",
                total: "Всего",
                monthlyPayment: "Ежемес. платеж",
                monthsLeft: "{months} мес. осталось",
                paidOff: "Выплачено",
                statusTitle: "Статус по кредитам",
                status: {
                    paid: "Оплачено в этом месяце",
                    overdue: "ПЛАТЕЖ ПРОСРОЧЕН!",
                    dueSoon: "Срок оплаты через {days} дн.",
                }
            },
            history: {
                noHistory: "История операций пуста.",
                savingsAccount: "Сбережения",
                transferPrefix: "Перевод на",
                debtPaymentPrefix: "Оплата долга:", // <-- НОВОЕ
                accountDeleted: "Счет удален"
            },
            budget: {
                monthlyIncome: "Месячный доход",
                needs50: "Нужды (50%)",
                wants30: "Желания (30%)",
                savings20: "Сбережения (20%)",
                expenses80: "Расходы (80%)",
                needs: "Нужды",
                wants: "Желания",
                savings: "Сбережения"
            },
            modal: {
                allHistoryTitle: "Вся история",
                newAccountTitle: "Новый счет",
                accountType: "Тип счета",
                selectBank: "Выберите банк",
                accountName: "Название",
                currentBalance: "Текущий баланс (₸)",
                cardColor: "Цвет карты",
                addAccountBtn: "Добавить счет",
                newLoanTitle: "Новый кредит",
                loanName: "Название",
                loanTotalAmount: "Общая сумма (₸)",
                loanPaidAmount: "Уже оплачено (₸)",
                loanMonthlyPayment: "Ежемесячный платеж (₸)",
                loanPaymentDate: "Число ежемесячного платежа",
                addLoanBtn: "Добавить кредит",
                
                // НОВЫЕ
                newDebtTitle: "Новый долг",
                debtName: "Название / Кому",
                debtDescription: "Описание",
                debtTotalAmount: "Сумма (₸)",
                debtPaymentDate: "Дата возврата",
                addDebtBtn: "Добавить долг",
                debtDetailsTitle: "Детали долга",
                totalLoanDebt: "Долг по кредитам",
                totalSimpleDebt: "Простые долги",
                totalCombinedDebt: "Итого",

                // НОВЫЕ
                savingsDetailsTitle: "Детали сбережений",
                totalSavings: "Сбережения",
                totalDeposits: "Депозиты",
                totalCombinedSavings: "Итого",
                payDebtTitle: "Оплата долга",
                payFromAccount: "С какого счета оплатить?",
                payBtn: "Оплатить",

                newIncomeTitle: "Новый Доход",
                newExpenseTitle: "Новый Расход",
                addIncomeBtn: "Добавить Доход",
                addExpenseBtn: "Добавить Расход",
                description: "Описание",
                descriptionPlaceholder: "Напр., Покупка в Magnum",
                amount: "Сумма (₸)",
                accountLabel: "Счет",
                accountFromLabel: "Счет (Откуда)",
                category: "Категория",
                whichLoan: "Какой кредит оплачиваете?",
                whichSavingsAccount: "На какой сберегательный счет?",
                transfer: "Перевод",
                loanPayment: "Оплата кредита",
                loanPaymentPrefix: "Оплата кредита", // <-- НОВОЕ (ДЛЯ БАГА)
                other: "Другое",
                noAccounts: "Сначала добавьте счет",
                noPaymentAccounts: "Нет счетов для оплаты (Банк/Наличные)", // <-- НОВОЕ
                noActiveLoans: "Нет активных кредитов",
                selectLoan: "Выберите кредит...",
                noSavingsAccounts: "Нет сберегательных счетов",
                selectAccount: "Выберите счет..."
            },
            drawer: {
                title: "Настройки",
                budgetModel: "Модель Управления",
                modelOptionNone: "Не выбрана",
                modelOption503020: "50 / 30 / 20",
                modelOption8020: "80 / 20 (Накопление)",
                modelPlaceholder: "Выберите модель, чтобы увидеть распределение.",
                modelPlaceholderMain: "Выберите модель бюджета в настройках",
                loggedInAs: "Вы вошли как: ",
                logout: "Выйти"
            }
        },
        // Казахский
        kk: {
            pageTitle: "MyFin - Қаржыны есепке алу",
            appName: "MyFin",
            auth: {
                loginTab: "Кіру",
                registerTab: "Тіркелу",
                email: "Email",
                emailPlaceholder: "email@example.com",
                password: "Құпия сөз",
                passwordPlaceholder: "Кемі 6 таңба",
                loginButton: "Кіру",
                registerButton: "Аккаунт құру",
                error: {
                    invalidEmail: "Email пішімі қате.",
                    userNotFound: "Пайдаланушы табылмады.",
                    wrongPassword: "Құпия сөз қате.",
                    emailInUse: "Бұл Email қазірдің өзінде пайдаланылуда.",
                    weakPassword: "Құпия сөз тым әлсіз (кемі 6 таңба).",
                    invalidCredential: "Email немесе құпия сөз қате.",
                    default: "Қате орын алды. Қайталап көріңіз."
                }
            },
            main: {
                totalBalance: "Жалпы баланс",
                savings: "Жинақтар",
                totalDebt: "Жалпы қарыз",
                income: "Кіріс",
                expense: "Шығыс",
                accounts: "Шоттар",
                newAccount: "Жаңа шот",
                loans: "Несиелер",
                newLoan: "Жаңа несие",
                debts: "Қарыздар", // <-- НОВОЕ
                newDebt: "Жаңа қарыз", // <-- НОВОЕ
                details: "Толығырақ", // <-- НОВОЕ
                historyToday: "Тарих (Бүгін)",
                showAll: "Барлығы",
                noAccounts: "Сізде әзірге шоттар жоқ.",
                noLoans: "Сізде белсенді несиелер жоқ.",
                noDebts: "Сізде қарапайым қарыздар жоқ.", // <-- НОВОЕ
                noHistoryToday: "Бүгін операциялар болған жоқ."
            },
            toast: {
                accountAdded: "Шот сәтті қосылды!",
                accountAddedError: "Шотты қосу қатесі.",
                loanAdded: "Несие сәтті қосылды!",
                loanAddedError: "Несиені қосу қатесі.",
                debtAdded: "Қарыз сәтті қосылды!", // <-- НОВОЕ
                debtAddedError: "Қарызды қосу қатесі.", // <-- НОВОЕ
                fillFields: "Барлық өрістерді толтырыңыз.",
                selectSavingsAccount: "Жинақ шотын таңдаңыз.",
                selectPaymentAccount: "Төлем үшін шотты таңдаңыз.", // <-- НОВОЕ
                sameAccountError: "Ақшаны сол шотқа аудару мүмкін емес.",
                incomeAdded: "Кіріс қосылды!",
                expenseAdded: "Шығыс қосылды!",
                transactionError: "Транзакцияны қосу қатесі.",
                deleteAccountError: "Транзакциялар байланыстырылған шотты жою мүмкін емес.",
                deleteAccountSuccess: "Шот сәтті жойылды.",
                deleteAccountErrorDefault: "Шотты жою қатесі",
                deleteLoanError: "Төлемдері бар несиені жою мүмкін емес.",
                deleteLoanSuccess: "Несие сәтті жойылды.",
                deleteLoanErrorDefault: "Несиені жою қатесі.",
                deleteDebtSuccess: "Қарыз төленді деп белгіленді.", // <-- НОВОЕ
                deleteDebtError: "Қарызды жою кезінде қате." // <-- НОВОЕ
            },
            account: {
                typeBank: "Банк",
                typeDeposit: "Депозит",
                typeSavings: "Жинақ",
                typeCash: "Қолма-қол ақша",
                typeAccount: "Шот",
                balance: "Баланс",
                cashName: "Қолма-қол ақша",
                savingsName: "Жинақ шоты"
            },
            debt: { // <-- НОВЫЙ БЛОК
                returnBy: "Қайтару",
                overdue: "МЕРЗІМІ ӨТКЕН",
                amount: "Қарыз сомасы",
                markAsPaid: "Төленді"
            },
            loan: {
                loan: "Несие",
                paymentDayPrefix: "Төлем",
                paymentDaySuffix: "дейін",
                paid: "Төленді",
                total: "Барлығы",
                monthlyPayment: "Айлық төлем",
                monthsLeft: "{months} ай қалды",
                paidOff: "Төленді",
                statusTitle: "Несие мәртебесі",
                status: {
                    paid: "Осы айда төленді",
                    overdue: "ТӨЛЕМ МЕРЗІМІ ӨТІП КЕТТІ!",
                    dueSoon: "Төлем мерзімі {days} күннен кейін",
                }
            },
            history: {
                noHistory: "Операциялар тарихы бос.",
                savingsAccount: "Жинақтар",
                transferPrefix: "Аударым",
                debtPaymentPrefix: "Қарызды төлеу:", // <-- НОВОЕ
                accountDeleted: "Шот жойылған"
            },
            budget: {
                monthlyIncome: "Айлық кіріс",
                needs50: "Қажеттілік (50%)",
                wants30: "Қалаулар (30%)",
                savings20: "Жинақтар (20%)",
                expenses80: "Шығыстар (80%)",
                needs: "Қажеттілік",
                wants: "Қалаулар",
                savings: "Жинақтар"
            },
            modal: {
                allHistoryTitle: "Барлық тарих",
                newAccountTitle: "Жаңа шот",
                accountType: "Шот түрі",
                selectBank: "Банкті таңдаңыз",
                accountName: "Атауы",
                currentBalance: "Ағымдағы баланс (₸)",
                cardColor: "Карта түсі",
                addAccountBtn: "Шот қосу",
                newLoanTitle: "Жаңа несие",
                loanName: "Атауы",
                loanTotalAmount: "Жалпы сома (₸)",
                loanPaidAmount: "Төленген (₸)",
                loanMonthlyPayment: "Айлық төлем (₸)",
                loanPaymentDate: "Ай сайынғы төлем күні",
                addLoanBtn: "Несие қосу",
                
                // НОВЫЕ
                newDebtTitle: "Жаңа қарыз",
                debtName: "Атауы / Кімге",
                debtDescription: "Сипаттама",
                debtTotalAmount: "Сома (₸)",
                debtPaymentDate: "Қайтару күні",
                addDebtBtn: "Қарыз қосу",
                debtDetailsTitle: "Қарыз туралы мәлімет",
                totalLoanDebt: "Несие бойынша қарыз",
                totalSimpleDebt: "Қарапайым қарыздар",
                totalCombinedDebt: "Жиыны",
                
                // НОВЫЕ
                savingsDetailsTitle: "Жинақтар туралы мәлімет",
                totalSavings: "Жинақтар",
                totalDeposits: "Депозиттер",
                totalCombinedSavings: "Жиыны",
                payDebtTitle: "Қарызды төлеу",
                payFromAccount: "Қай шоттан төлеу керек?",
                payBtn: "Төлеу",

                newIncomeTitle: "Жаңа Кіріс",
                newExpenseTitle: "Жаңа Шығыс",
                addIncomeBtn: "Кіріс қосу",
                addExpenseBtn: "Шығыс қосу",
                description: "Сипаттама",
                descriptionPlaceholder: "Мыс., Magnum-дағы сауда",
                amount: "Сома (₸)",
                accountLabel: "Шот",
                accountFromLabel: "Шот (Қайдан)",
                category: "Санат",
                whichLoan: "Қай несиені төлейсіз?",
                whichSavingsAccount: "Қай жинақ шотына?",
                transfer: "Аударым",
                loanPayment: "Несие төлемі",
                loanPaymentPrefix: "Несие төлемі", // <-- НОВОЕ (ДЛЯ БАГА)
                other: "Басқа",
                noAccounts: "Алдымен шот қосыңыз",
                noPaymentAccounts: "Төлем шоттары жоқ (Банк/Қолма-қол)", // <-- НОВОЕ
                noActiveLoans: "Белсенді несиелер жоқ",
                selectLoan: "Несиені таңдаңыз...",
                noSavingsAccounts: "Жинақ шоттары жоқ",
                selectAccount: "Шотты таңдаңыз..."
            },
            drawer: {
                title: "Баптаулар",
                budgetModel: "Басқару моделі",
                modelOptionNone: "Таңдалмаған",
                modelOption503020: "50 / 30 / 20",
                modelOption8020: "80 / 20 (Жинақтау)",
                modelPlaceholder: "Бөліністі көру үшін модельді таңдаңыз.",
                modelPlaceholderMain: "Баптаулардан бюджет моделін таңдаңыз",
                loggedInAs: "Сіз осылай кірдіңіз: ",
                logout: "Шығу"
            }
        }
    }

};

// --- Запуск приложения ---
document.addEventListener('DOMContentLoaded', () => App.init());
