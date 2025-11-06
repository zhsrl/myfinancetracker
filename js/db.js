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

import { App } from './app.js';

export const DB = {

    // --- 4. ЛОГИКА БАЗЫ ДАННЫХ (Firebase RTDB) ---

    async initializeDataListeners() {
        if (!App.state.currentUserId) return;
        const userId = App.state.currentUserId;

        // Отключаем старые слушатели, если они есть
        if (App.firebase.accountsListener) App.firebase.accountsListener();
        if (App.firebase.loansListener) App.firebase.loansListener();
        if (App.firebase.transactionsListener) App.firebase.transactionsListener();
        if (App.firebase.debtsListener) App.firebase.debtsListener();

        const dataPaths = [
            { path: `users/${userId}/accounts`, stateKey: 'allAccounts', renderFunc: [App.renderAccounts, App.updateBalances, App.populateAccountSelect, App.renderLoanStatus, App.renderBudgetModels] },
            { path: `users/${userId}/loans`, stateKey: 'allLoans', renderFunc: [App.renderLoans, App.updateBalances, App.renderLoanStatus, App.renderBudgetModels] },
            { path: `users/${userId}/transactions`, stateKey: 'allTransactions', renderFunc: [App.renderHistory, App.renderAllHistory, App.renderBudgetModels, App.renderLoanStatus] },
            { path: `users/${userId}/debts`, stateKey: 'allDebts', renderFunc: [App.renderDebts, App.updateBalances] }
        ];

        const dataPromises = dataPaths.map(item => {
            return new Promise((resolve, reject) => {
                const dataRef = ref(App.firebase.db, item.path);
                
                // Устанавливаем onValue слушатель
                const listener = onValue(dataRef, (snapshot) => {
                    const data = [];
                    if (snapshot.exists()) {
                        snapshot.forEach(childSnapshot => {
                            data.push({ id: childSnapshot.key, ...childSnapshot.val() });
                        });
                    }
                    
                    // Сортировка транзакций (самые новые вверху)
                    if (item.stateKey === 'allTransactions') {
                        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    }

                    App.state[item.stateKey] = data;
                    
                    // Вызываем все связанные функции рендеринга
                    if (Array.isArray(item.renderFunc)) {
                        item.renderFunc.forEach(fn => fn.call(App));
                    } else if (typeof item.renderFunc === 'function') {
                        item.renderFunc.call(App);
                    }
                    
                    resolve(); // Разрешаем Promise после *первой* загрузки данных
                }, (error) => {
                    console.error(`Ошибка при загрузке ${item.stateKey}:`, error);
                    reject(error);
                });

                // Сохраняем ссылку на функцию-отписчик
                App.firebase[`${item.stateKey}Listener`] = listener;
            });
        });
        
        // Ждем, пока все *первичные* загрузки данных завершатся
        return Promise.all(dataPromises);
    },

    
    // --- 5. ОБРАБОТЧИКИ ФОРМ (Submits) ---

    async handleAccountSubmit(e) {
        e.preventDefault();
        if (!App.state.currentUserId) return;
        const name = App.elements.accountNameInput.value;
        const balance = parseFloat(document.getElementById('account-balance').value); // ID, т.к. кэшировать input.value бессмысленно
        const type = App.elements.accountTypeSelect.value;
        const color = App.elements.accountColorInput.value;
        const logoUrl = App.elements.accountLogoUrlInput.value;
        try {
            const newAccRef = push(ref(App.firebase.db, `users/${App.state.currentUserId}/accounts`));
            await set(newAccRef, { name, balance, type, color, logoUrl, createdAt: serverTimestamp() });
            App.toggleModal('account-modal', false);
            App.elements.accountForm.reset();
            App.setupAccountModalUI(); // Сброс UI модального окна
            App.showToast(App.getString('toast.accountAdded'));
        } catch (error) { console.error("Ошибка добавления счета:", error); App.showToast(App.getString('toast.accountAddedError'), true); }
    },
    
    async handleLoanSubmit(e) {
        e.preventDefault();
        if (!App.state.currentUserId) return;
        try {
            const newLoanRef = push(ref(App.firebase.db, `users/${App.state.currentUserId}/loans`));
            await set(newLoanRef, {
                name: document.getElementById('loan-name').value,
                totalAmount: parseFloat(document.getElementById('loan-total-amount').value),
                paidAmount: parseFloat(document.getElementById('loan-paid-amount').value),
                monthlyPayment: parseFloat(document.getElementById('loan-monthly-payment').value),
                paymentDate: parseInt(document.getElementById('loan-payment-date').value),
                createdAt: serverTimestamp()
            });
            App.toggleModal('loan-modal', false);
            App.elements.loanForm.reset();
            App.showToast(App.getString('toast.loanAdded'));
        } catch (error) { console.error("Ошибка добавления кредита:", error); App.showToast(App.getString('toast.loanAddedError'), true); }
    },

    async handleDebtSubmit(e) {
        e.preventDefault();
        if (!App.state.currentUserId) return;
        try {
            const newDebtRef = push(ref(App.firebase.db, `users/${App.state.currentUserId}/debts`));
            await set(newDebtRef, {
                name: document.getElementById('debt-name').value,
                description: document.getElementById('debt-description').value,
                totalAmount: parseFloat(document.getElementById('debt-total-amount').value),
                paymentDate: document.getElementById('debt-payment-date').value,
                createdAt: serverTimestamp()
            });
            App.toggleModal('debt-modal', false);
            App.elements.debtForm.reset();
            App.showToast(App.getString('toast.debtAdded'));
        } catch (error) { console.error("Ошибка добавления долга:", error); App.showToast(App.getString('toast.debtAddedError'), true); }
    },

    async handleTransactionSubmit(e) {
        e.preventDefault();
        if (!App.state.currentUserId) return;
        
        const type = App.elements.transactionTypeInput.value;
        const description = App.elements.transactionDescriptionInput.value;
        const amount = parseFloat(App.elements.transactionAmountInput.value);
        const accountId = App.elements.transactionAccountSelect.value;
        const category = App.elements.transactionCategory.value;
        const loanId = (category === 'loan') ? App.elements.transactionLoanSelect.value : null;
        const isSavings = category === 'savings-503020' || category === 'savings-8020' || category === 'savings';
        const toAccountId = (isSavings) ? App.elements.transactionSavingsSelect.value : null;
        
        if (!type || !description || isNaN(amount) || !accountId) { App.showToast(App.getString('toast.fillFields'), true); return; }
        if (isSavings && !toAccountId) { App.showToast(App.getString('toast.selectSavingsAccount'), true); return; }
        if (isSavings && toAccountId === accountId) { App.showToast(App.getString('toast.sameAccountError'), true); return; }
        
        try {
            const newTransRef = push(ref(App.firebase.db, `users/${App.state.currentUserId}/transactions`));
            await set(newTransRef, { description, amount, type, accountId, category, createdAt: serverTimestamp(), loanId, toAccountId });
            
            const accountRef = ref(App.firebase.db, `users/${App.state.currentUserId}/accounts/${accountId}/balance`);
            const amountToUpdate = (type === 'income') ? amount : -amount;
            await runTransaction(accountRef, (currentBalance) => (currentBalance || 0) + amountToUpdate);
            
            if (type === 'expense' && category === 'loan' && loanId) {
                const loanRef = ref(App.firebase.db, `users/${App.state.currentUserId}/loans/${loanId}/paidAmount`);
                await runTransaction(loanRef, (currentPaid) => (currentPaid || 0) + amount);
            }
            
            if (type === 'expense' && isSavings && toAccountId) {
                const savingsAccountRef = ref(App.firebase.db, `users/${App.state.currentUserId}/accounts/${toAccountId}/balance`);
                await runTransaction(savingsAccountRef, (currentBalance) => (currentBalance || 0) + amount);
            }

            App.toggleModal('transaction-modal', false);
            App.elements.transactionForm.reset();
            App.elements.loanPaymentContainer.classList.add('hidden');
            App.elements.savingsTransferContainer.classList.add('hidden');
            const message = type === 'income' ? App.getString('toast.incomeAdded') : App.getString('toast.expenseAdded');
            App.showToast(message);
        } catch (error) { console.error("Ошибка добавления транзакции:", error); App.showToast(App.getString('toast.transactionError'), true); }
    },

    async handlePayDebtSubmit(e) {
        e.preventDefault();
        if (!App.state.currentUserId) return;
        
        const debtId = App.elements.payDebtIdInput.value;
        const amount = parseFloat(App.elements.payDebtAmountInput.value);
        const debtName = App.elements.payDebtNameInput.value;
        const accountId = App.elements.payDebtAccountSelect.value;
        
        if (!accountId) {
            App.showToast(App.getString('toast.selectPaymentAccount'), true);
            return;
        }
        
        try {
            // 1. Создаем транзакцию расхода
            const newTransRef = push(ref(App.firebase.db, `users/${App.state.currentUserId}/transactions`));
            await set(newTransRef, {
                description: `${App.getString('history.debtPaymentPrefix')} "${debtName}"`,
                amount: amount,
                type: 'expense',
                accountId: accountId,
                category: 'debt', // Новая специальная категория
                createdAt: serverTimestamp(),
                loanId: null,
                toAccountId: null
            });
            
            // 2. Списываем деньги со счета
            const accountRef = ref(App.firebase.db, `users/${App.state.currentUserId}/accounts/${accountId}/balance`);
            await runTransaction(accountRef, (currentBalance) => (currentBalance || 0) - amount);
            
            // 3. Удаляем долг
            const debtRef = ref(App.firebase.db, `users/${App.state.currentUserId}/debts/${debtId}`);
            await remove(debtRef);
            
            App.toggleModal('pay-debt-modal', false);
            App.showToast(App.getString('toast.deleteDebtSuccess'));

        } catch (error) {
            console.error("Ошибка оплаты долга:", error);
            App.showToast(App.getString('toast.deleteDebtError'), true);
        }
    },

    // --- 6. ЛОГИКА УДАЛЕНИЯ ---

    async handleDeleteAccount(accountId) {
        if (!App.state.currentUserId) return;
        
        const transRef = ref(App.firebase.db, `users/${App.state.currentUserId}/transactions`);
        const transQueryFrom = dbQuery(transRef, orderByChild("accountId"), equalTo(accountId));
        const transQueryTo = dbQuery(transRef, orderByChild("toAccountId"), equalTo(accountId));
        
        try {
            const [transSnapshotFrom, transSnapshotTo] = await Promise.all([
                get(transQueryFrom),
                get(transQueryTo)
            ]);
            
             if (transSnapshotFrom.exists() || transSnapshotTo.exists()) {
                 App.showToast(App.getString('toast.deleteAccountError'), true);
                 return;
            }
            
            const accountRef = ref(App.firebase.db, `users/${App.state.currentUserId}/accounts/${accountId}`);
            await remove(accountRef);
            App.showToast(App.getString('toast.deleteAccountSuccess'));
            
        } catch (error) { console.error("Ошибка удаления счета:", error); App.showToast(`${App.getString('toast.deleteAccountErrorDefault')}: ${error}.`, true); }
    },
    
    async handleDeleteLoan(loanId) {
        if (!App.state.currentUserId) return;
        
         const transRef = ref(App.firebase.db, `users/${App.state.currentUserId}/transactions`);
         const transQuery = dbQuery(transRef, orderByChild("loanId"), equalTo(loanId));
        
        try {
            const transSnapshot = await get(transQuery);
            if (transSnapshot.exists()) {
                App.showToast(App.getString('toast.deleteLoanError'), true);
                return;
            }
            
            const loanRef = ref(App.firebase.db, `users/${App.state.currentUserId}/loans/${loanId}`);
            await remove(loanRef);
            App.showToast(App.getString('toast.deleteLoanSuccess'));
            
        } catch (error) { console.error("Ошибка удаления кредита:", error); App.showToast(App.getString('toast.deleteLoanErrorDefault'), true); }
    },
    
    async handleMarkDebtAsPaid(debt) {
        // Эта функция теперь открывает модальное окно, а не удаляет
        if (!debt) return;
        
        App.elements.payDebtIdInput.value = debt.id;
        App.elements.payDebtAmountInput.value = debt.totalAmount;
        App.elements.payDebtNameInput.value = debt.name;
        
        App.elements.payDebtInfo.textContent = `${App.getString('modal.debtName')}: ${debt.name} (${App.formatter.format(debt.totalAmount)})`;
        
        App.populatePayDebtAccountSelect();
        App.toggleModal('pay-debt-modal', true);
    },

    clearAllLocalData() {
                if (App.firebase.accountsListener) App.firebase.accountsListener();
                if (App.firebase.loansListener) App.firebase.loansListener();
                if (App.firebase.transactionsListener) App.firebase.transactionsListener();
                if (App.firebase.debtsListener) App.firebase.debtsListener(); // <-- НОВЫЙ
                App.firebase.accountsListener = null;
                App.firebase.loansListener = null;
                App.firebase.transactionsListener = null;
                App.firebase.debtsListener = null; // <-- НОВЫЙ

                App.state.allTransactions = [];
                App.state.allAccounts = [];
                App.state.allLoans = [];
                App.state.allDebts = []; // <-- НОВЫЙ
                
                App.renderAccounts();
                App.renderLoans();
                App.renderClosedLoans(); // <-- НОВЫЙ ВЫЗОВ
                App.renderDebts(); // <-- НОВЫЙ
                App.renderHistory();
                App.renderAllHistory();
                App.updateBalances();
                App.renderBudgetModels();
                App.renderLoanStatus();
                App.updateTotalDebtSummary(); // <-- ИЗМЕНЕНИЕ
                
                App.elements.drawerModelDisplay.innerHTML = `<p class="text-gray-500 dark:text-gray-400">${App.getString('drawer.modelPlaceholder')}</p>`;
                App.elements.budgetModelSelect.value = 'none';
            },
};
