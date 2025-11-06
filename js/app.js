import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// Import logical modules
import { Auth } from "./auth.js";
import { DB } from "./db.js";
import { UI } from "./ui.js";
import { Localization } from "./localization.js";

// --- Firebase Configuration ---
// IMPORTANT: This config was in your original file.
// For security, you should replace these with environment variables
// or secure new keys from your Firebase console.
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
export const App = {

    // Состояние приложения
    state: {
        currentUserId: null,
        allTransactions: [],
        allAccounts: [],
        allLoans: [],
        allDebts: [],
        currentBudgetModel: 'none',
        currentLang: 'ru',
    },

    // Сервисы Firebase
    firebase: {
        app: null,
        auth: null,
        db: null,
        accountsListener: null,
        loansListener: null,
        transactionsListener: null,
        debtsListener: null,
    },

    // Кэш DOM-элементов
    elements: {
        // All element properties (authContainer, mainAppContainer, etc.)
        // are initialized to null here.
        // (Full list omitted for brevity, but it's identical
        // to your original file's `App.elements` block)
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
            // We call createFormatter which is now in the Localization module
            this.formatter = this.createFormatter(this.state.currentLang);

            // 4. Кэшируем DOM-элементы
            this.cacheDOMElements();
            
            // 5. Привязываем обработчики событий
            this.bindEventListeners();

            // 6. Запускаем главный слушатель Auth
            // We call setupAuthListener which is now in the Auth module
            this.setupAuthListener();
            
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
        // This function is copied directly from your original file
        // (e.g., this.elements.loadingSpinner = document.getElementById('loading-spinner-container');)
        // (Full function omitted for brevity)
        this.elements.loadingSpinner = document.getElementById('loading-spinner-container'); 
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
        this.elements.totalLoansBalanceEl = document.getElementById('total-loans-balance'); 
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

        // ДОЛГИ
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

        // ДЕТАЛИ СБЕРЕЖЕНИЙ
        this.elements.showSavingsDetailsBtn = document.getElementById('show-savings-details-btn');
        this.elements.savingsDetailsModal = document.getElementById('savings-details-modal');
        this.elements.closeSavingsDetailsModal = document.getElementById('close-savings-details-modal');
        this.elements.savingsBreakdownContainer = document.getElementById('savings-breakdown-container'); 
        this.elements.detailsDeposit = document.getElementById('details-deposit');
        this.elements.detailsTotalSavings = document.getElementById('details-total-savings');
        
        // ОПЛАТА ДОЛГА
        this.elements.payDebtModal = document.getElementById('pay-debt-modal');
        this.elements.closePayDebtModal = document.getElementById('close-pay-debt-modal');
        this.elements.payDebtForm = document.getElementById('pay-debt-form');
        this.elements.payDebtInfo = document.getElementById('pay-debt-info');
        this.elements.payDebtAccountSelect = document.getElementById('pay-debt-account-select');
        this.elements.submitPayDebtBtn = document.getElementById('submit-pay-debt-btn');
        this.elements.payDebtIdInput = document.getElementById('pay-debt-id-input');
        this.elements.payDebtAmountInput = document.getElementById('pay-debt-amount-input');
        this.elements.payDebtNameInput = document.getElementById('pay-debt-name-input');
        
        // ЗАКРЫТЫЕ КРЕДИТЫ
        this.elements.showClosedLoansBtn = document.getElementById('show-closed-loans-btn');
        this.elements.closedLoansModal = document.getElementById('closed-loans-modal');
        this.elements.closeClosedLoansModal = document.getElementById('close-closed-loans-modal');
        this.elements.closedLoansContent = document.getElementById('closed-loans-content');
        
        // ЛОКАЛИЗАЦИЯ
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
        // All listeners are copied directly, but now they call functions
        // that have been merged into the App object from other modules.
        // e.g., this.handleLogin, this.handleAccountSubmit, etc.
        this.elements.authTabLogin.addEventListener('click', () => this.toggleAuthTabs(true));
        this.elements.authTabRegister.addEventListener('click', () => this.toggleAuthTabs(false));
        this.elements.authFormLogin.addEventListener('submit', (e) => this.handleLogin(e));
        this.elements.authFormRegister.addEventListener('submit', (e) => this.handleRegister(e));
        this.elements.logoutButton.addEventListener('click', () => this.handleLogout());

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
        
        // ДОЛГИ
        this.elements.addDebtBtn.addEventListener('click', () => this.toggleModal('debt-modal', true));
        this.elements.closeDebtModal.addEventListener('click', () => this.toggleModal('debt-modal', false));
        this.elements.debtForm.addEventListener('submit', (e) => this.handleDebtSubmit(e));
        this.elements.showDebtDetailsBtn.addEventListener('click', () => this.showDebtDetailsModal());
        this.elements.closeDebtDetailsModal.addEventListener('click', () => this.toggleModal('debt-details-modal', false));

        // ДЕТАЛИ СБЕРЕЖЕНИЙ
        this.elements.showSavingsDetailsBtn.addEventListener('click', () => this.showSavingsDetailsModal());
        this.elements.closeSavingsDetailsModal.addEventListener('click', () => this.toggleModal('savings-details-modal', false));
        
        // ОПЛАТА ДОЛГА
        this.elements.closePayDebtModal.addEventListener('click', () => this.toggleModal('pay-debt-modal', false));
        this.elements.payDebtForm.addEventListener('submit', (e) => this.handlePayDebtSubmit(e));

        // ЗАКРЫТЫЕ КРЕДИТЫ
        this.elements.showClosedLoansBtn.addEventListener('click', () => this.openClosedLoansModal());
        this.elements.closeClosedLoansModal.addEventListener('click', () => this.toggleModal('closed-loans-modal', false));
        
        this.setupAccountModalUI();
        this.elements.transactionCategory.addEventListener('change', (e) => this.handleCategoryChange(e));
        this.elements.budgetModelSelect.addEventListener('change', () => this.renderBudgetModels());

        // ЛОКАЛИЗАЦИЯ
        this.elements.langToggleRU.addEventListener('click', () => this.setLanguage('ru'));
        this.elements.langToggleKK.addEventListener('click', () => this.setLanguage('kk'));
    },
};

// --- СЛИЯНИЕ МОДУЛЕЙ ---
// This combines all the functions from the imported modules
// into the main App object.
Object.assign(App, Auth);
Object.assign(App, DB);
Object.assign(App, UI);
Object.assign(App, Localization);

// --- Запуск приложения ---
document.addEventListener('DOMContentLoaded', () => App.init());
