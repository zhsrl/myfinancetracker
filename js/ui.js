export const UI = {
    
    // --- UI УТИЛИТЫ ---
    
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

    // --- 7. ФУНКЦИИ РЕНДЕРИНГА (UI) ---
    
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
        if (!this.elements.accountsSlider) return;
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
                // This function is in db.js but was merged into 'this' (App)
                this.handleDeleteAccount(account.id);
            });
            this.elements.accountsSlider.appendChild(card);
        });
    },
    
    renderLoans() {
        if (!this.elements.loansSlider) return;
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
                // This function is in db.js but was merged into 'this' (App)
                this.handleDeleteLoan(loan.id);
            });
            this.elements.loansSlider.appendChild(card);
        });
    },

    renderClosedLoans() {
        if (!this.elements.closedLoansContent) return;
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

    openClosedLoansModal() {
        this.renderClosedLoans(); // Сначала рендерим, потом открываем
        this.toggleModal('closed-loans-modal', true);
    },

    renderDebts() {
        if (!this.elements.debtsSlider) return;
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
                // This function is in db.js but was merged into 'this' (App)
                this.handleMarkDebtAsPaid(debt); 
            });
            this.elements.debtsSlider.appendChild(card);
        });
    },

    renderHistory() {
        if (!this.elements.historyList) return;
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
        if (!this.elements.allHistoryContent) return;
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
        if (!this.elements.budgetModelSelect) return;
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
            'needs': 0, 'wants': 0, 'savings': 0, 'loan': 0, 'debt': 0, 'other': 0
        };
        this.state.allTransactions.forEach(t => {
            if (t.createdAt < monthStart) return;
            if (t.type === 'income') totalIncome += t.amount;
            else if (expensesByCategory.hasOwnProperty(t.category)) expensesByCategory[t.category] += t.amount;
            else expensesByCategory['other'] += t.amount;
        });
        
        let modelHtml = '';
        
        if (this.state.currentBudgetModel === '50-30-20') {
            const needsLimit = totalIncome * 0.5;
            const wantsLimit = totalIncome * 0.3;
            const savingsLimit = totalIncome * 0.2;
            
            const totalNeeds = (expensesByCategory['needs-503020'] || 0) + 
                               (expensesByCategory['needs'] || 0) + 
                               (expensesByCategory['loan'] || 0) + 
                               (expensesByCategory['debt'] || 0) + 
                               (expensesByCategory['other'] || 0); 
            
            const totalWants = (expensesByCategory['wants-503020'] || 0) + 
                               (expensesByCategory['wants'] || 0);
                                
            const totalSavings = (expensesByCategory['savings-503020'] || 0) + 
                                 (expensesByCategory['savings'] || 0);

            modelHtml = `
                <h4 class="font-semibold text-gray-700 dark:text-gray-300">${this.getString('budget.monthlyIncome')}: ${this.formatter.format(totalIncome)}</h4>
                ${this.createProgressBar(this.getString('budget.needs50'), totalNeeds, needsLimit)}
                ${this.createProgressBar(this.getString('budget.wants30'), totalWants, wantsLimit)}
                ${this.createProgressBar(this.getString('budget.savings20'), totalSavings, savingsLimit)}
            `;
        } else if (this.state.currentBudgetModel === '80-20') {
            const expensesLimit = totalIncome * 0.8;
            const savingsLimit = totalIncome * 0.2;
            
            const totalExpenses = (expensesByCategory['expenses-8020'] || 0) +
                                  (expensesByCategory['needs'] || 0) +
                                  (expensesByCategory['wants'] || 0) +
                                  (expensesByCategory['loan'] || 0) +
                                  (expensesByCategory['debt'] || 0) +
                                  (expensesByCategory['other'] || 0); 

            const totalSavings = (expensesByCategory['savings-8020'] || 0) +
                                 (expensesByCategory['savings'] || 0);
            
            modelHtml = `
                <h4 class="font-semibold text-gray-700 dark:text-gray-300">${this.getString('budget.monthlyIncome')}: ${this.formatter.format(totalIncome)}</h4>
                ${this.createProgressBar(this.getString('budget.expenses80'), totalExpenses, expensesLimit)}
                ${this.createProgressBar(this.getString('budget.savings20'), totalSavings, savingsLimit)}
            `;
        }
        
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
        if (!this.elements.loanStatusWidget) return;
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
        if (!this.elements.transactionAccountSelect) return;
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
    
    populatePayDebtAccountSelect() {
        this.elements.payDebtAccountSelect.innerHTML = '';
        // Оплачивать можно только с банковских счетов или наличными
        const paymentAccounts = this.state.allAccounts.filter(a => a.type === 'bank' || a.type === 'cash' || a.type == 'deposit');
        
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
};
