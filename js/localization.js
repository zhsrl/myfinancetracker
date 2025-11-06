export const Localization = {

    // --- ОБЪЕКТ ПЕРЕВОДОВ ---
    // Вам нужно будет заполнить 'kk' переводы
    translations: {
        'ru': {
            pageTitle: 'MyFin - Личные Финансы',
            appName: 'MyFin',
            // Auth
            auth: {
                loginTab: 'Вход',
                registerTab: 'Регистрация',
                email: 'Электронная почта',
                emailPlaceholder: 'you@example.com',
                password: 'Пароль',
                passwordPlaceholder: '•••••••• (мин. 6 симв.)',
                loginButton: 'Войти',
                registerButton: 'Зарегистрироваться',
                errors: {
                    'auth/invalid-email': 'Некорректный email.',
                    'auth/user-not-found': 'Пользователь не найден.',
                    'auth/wrong-password': 'Неверный пароль.',
                    'auth/email-already-in-use': 'Этот email уже занят.',
                    'auth/weak-password': 'Пароль слишком слабый (мин. 6 симв.).',
                    'default': 'Произошла ошибка. Попробуйте снова.'
                }
            },
            // Main App
            main: {
                totalBalance: 'Общий баланс',
                savings: 'Сбережения',
                totalDebt: 'Общий долг',
                income: 'Доход',
                expense: 'Расход',
                accounts: 'Счета',
                newAccount: 'Новый счет',
                loans: 'Кредиты',
                newLoan: 'Новый кредит',
                debts: 'Долги',
                newDebt: 'Новый долг',
                details: 'Подробнее',
                historyToday: 'История (сегодня)',
                showAll: 'Показать всю',
                noAccounts: 'У вас пока нет счетов. Нажмите "+ Новый счет", чтобы добавить.',
                noLoans: 'У вас нет активных кредитов. Нажмите "+ Новый кредит", чтобы добавить.',
                noDebts: 'У вас нет долгов. Нажмите "+ Новый долг", чтобы добавить.',
                noHistoryToday: 'Сегодня не было транзакций.'
            },
            // Modals
            modal: {
                allHistoryTitle: 'Вся история транзакций',
                newAccountTitle: 'Новый счет',
                accountType: 'Тип счета',
                selectBank: 'Выберите банк (необязательно)',
                accountName: 'Название счета',
                currentBalance: 'Текущий баланс',
                cardColor: 'Цвет карты',
                addAccountBtn: 'Добавить счет',
                newLoanTitle: 'Новый кредит',
                loanName: 'Название кредита (напр. "Ипотека")',
                loanTotalAmount: 'Общая сумма кредита',
                loanPaidAmount: 'Уже выплачено',
                loanMonthlyPayment: 'Ежемес. платеж',
                loanPaymentDate: 'День ежемес. платежа (1-31)',
                addLoanBtn: 'Добавить кредит',
                newDebtTitle: 'Новый долг',
                debtName: 'Кому или за что',
                debtDescription: 'Описание (необязательно)',
                debtTotalAmount: 'Сумма долга',
                debtPaymentDate: 'Дата возврата',
                addDebtBtn: 'Добавить долг',
                debtDetailsTitle: 'Детализация долга',
                totalLoanDebt: 'Остаток по кредитам',
                totalSimpleDebt: 'Простые долги',
                totalCombinedDebt: 'Общий долг',
                savingsDetailsTitle: 'Детализация сбережений',
                totalSavings: 'Сберегательные счета',
                totalDeposits: 'Депозиты',
                totalCombinedSavings: 'Всего сбережений',
                noSavingsAccountsNamed: 'Нет счетов типа "Сбережения".',
                payDebtTitle: 'Оплатить долг',
                payFromAccount: 'С какого счета оплатить?',
                payBtn: 'Оплатить',
                newIncomeTitle: 'Новый доход',
                newExpenseTitle: 'Новый расход',
                addIncomeBtn: 'Добавить доход',
                addExpenseBtn: 'Добавить расход',
                description: 'Описание',
                descriptionPlaceholder: 'напр. "Зарплата"',
                amount: 'Сумма',
                accountLabel: 'Счет',
                accountFromLabel: 'Со счета',
                category: 'Категория',
                whichLoan: 'Какой кредит оплачиваете?',
                whichSavingsAccount: 'На какой счет переводите?',
                noAccounts: 'Сначала добавьте счет.',
                noPaymentAccounts: 'Нет счетов для оплаты (нужны "Банк" или "Наличные").',
                noActiveLoans: 'Нет активных кредитов.',
                selectLoan: 'Выберите кредит...',
                noSavingsAccounts: 'Нет счетов "Сбережения" или "Депозит".',
                selectAccount: 'Выберите счет...',
                transfer: 'Перевод',
                loanPayment: 'Оплата кредита',
                loanPaymentPrefix: 'Оплата кредита',
                other: 'Другое',
                noClosedLoans: 'У вас пока нет закрытых кредитов.'
            },
            // Drawer
            drawer: {
                title: 'Настройки',
                budgetModel: 'Модель бюджета',
                modelOptionNone: 'Не используется',
                modelOption503020: '50/30/20 (Нужды/Желания/Сбережения)',
                modelOption8020: '80/20 (Расходы/Сбережения)',
                modelPlaceholder: 'Выберите модель для отслеживания.',
                modelPlaceholderMain: 'Выберите модель бюджета в меню.',
                loggedInAs: 'Вы вошли как:',
                logout: 'Выйти'
            },
            // Toasts
            toast: {
                accountAdded: 'Счет успешно добавлен!',
                accountAddedError: 'Ошибка добавления счета.',
                loanAdded: 'Кредит успешно добавлен!',
                loanAddedError: 'Ошибка добавления кредита.',
                debtAdded: 'Долг успешно добавлен!',
                debtAddedError: 'Ошибка добавления долга.',
                fillFields: 'Пожалуйста, заполните все поля.',
                selectSavingsAccount: 'Выберите сберегательный счет.',
                sameAccountError: 'Нельзя перевести деньги на тот же счет.',
                incomeAdded: 'Доход добавлен!',
                expenseAdded: 'Расход добавлен!',
                transactionError: 'Ошибка добавления транзакции.',
                selectPaymentAccount: 'Выберите счет для оплаты.',
                deleteDebtSuccess: 'Долг успешно оплачен и удален!',
                deleteDebtError: 'Ошибка при оплате долга.',
                deleteAccountError: 'Нельзя удалить счет, по нему есть транзакции.',
                deleteAccountSuccess: 'Счет успешно удален.',
                deleteAccountErrorDefault: 'Ошибка удаления счета',
                deleteLoanError: 'Нельзя удалить кредит, по нему есть платежи.',
                deleteLoanSuccess: 'Кредит успешно удален.',
                deleteLoanErrorDefault: 'Ошибка удаления кредита.',
            },
            // Account
            account: {
                typeBank: 'Банковский счет',
                typeDeposit: 'Депозит',
                typeSavings: 'Сбережения',
                typeCash: 'Наличные',
                typeAccount: 'Счет',
                balance: 'Баланс',
                cashName: 'Наличные',
                savingsName: 'Сбережения'
            },
            // Loan
            loan: {
                monthsLeft: 'Осталось {months} мес.',
                paidOff: 'Выплачено',
                loan: 'Кредит',
                paymentDayPrefix: 'Платеж',
                paymentDaySuffix: 'числа',
                paid: 'Выплачено',
                total: 'Всего',
                monthlyPayment: 'Ежемес. платеж',
                statusTitle: 'Статус по кредитам',
                status: {
                    paid: 'Оплачено в этом месяце',
                    overdue: 'Просрочено!',
                    dueSoon: 'Скоро платеж (через {days} д.)'
                }
            },
            // Debt
            debt: {
                returnBy: 'Вернуть до',
                overdue: 'Просрочено',
                amount: 'Сумма',
                markAsPaid: 'Оплачено'
            },
            // History
            history: {
                noHistory: 'Транзакций пока нет.',
                savingsAccount: 'Сбер. счет',
                transferPrefix: 'Перевод на',
                accountDeleted: 'Счет удален',
                debtPaymentPrefix: 'Оплата долга'
            },
            // Budget
            budget: {
                monthlyIncome: 'Доход в этом мес.',
                needs50: '50% Нужды',
                wants30: '30% Желания',
                savings20: '20% Сбережения',
                expenses80: '80% Расходы',
                needs: 'Нужды',
                wants: 'Желания',
                savings: 'Сбережения'
            }
        },
        'kk': {
            pageTitle: 'MyFin - Жеке Қаржы',
            appName: 'MyFin',
            // Auth
            auth: {
                loginTab: 'Кіру',
                registerTab: 'Тіркелу',
                email: 'Электрондық пошта',
                emailPlaceholder: 'you@example.com',
                password: 'Құпия сөз',
                passwordPlaceholder: '•••••••• (мин. 6 белгі)',
                loginButton: 'Кіру',
                registerButton: 'Тіркелу',
                errors: {
                    'auth/invalid-email': 'Жарамсыз email.',
                    'auth/user-not-found': 'Пайдаланушы табылмады.',
                    'auth/wrong-password': 'Қате құпия сөз.',
                    'auth/email-already-in-use': 'Бұл email бос емес.',
                    'auth/weak-password': 'Құпия сөз тым әлсіз (мин. 6 белгі).',
                    'default': 'Қате орын алды. Қайталап көріңіз.'
                }
            },
            main: {
                totalBalance: 'Жалпы баланс',
                savings: 'Жинақтар',
                totalDebt: 'Жалпы қарыз',
                income: 'Кіріс',
                expense: 'Шығыс',
                accounts: 'Шоттар',
                newAccount: 'Жаңа шот',
                loans: 'Несиелер',
                newLoan: 'Жаңа несие',
                debts: 'Қарыздар',
                newDebt: 'Жаңа қарыз',
                details: 'Толығырақ',
                historyToday: 'Тарих (бүгін)',
                showAll: 'Барлығын көру',
                noAccounts: 'Сізде әлі шот жоқ. "+ Жаңа шот" басыңыз.',
                noLoans: 'Сізде белсенді несие жоқ. "+ Жаңа несие" басыңыз.',
                noDebts: 'Сізде қарыз жоқ. "+ Жаңа қарыз" басыңыз.',
                noHistoryToday: 'Бүгін транзакция болған жоқ.'
            },
            // ... (Вам нужно будет перевести все остальные ключи)
            // (Translations for modals, drawer, toasts, account, loan, debt, history, budget... omitted)
            // Example:
            modal: {
                allHistoryTitle: 'Барлық транзакциялар тарихы',
                newAccountTitle: 'Жаңа шот',
                accountType: 'Шот түрі',
                selectBank: 'Банкті таңдаңыз (міндетті емес)',
                accountName: 'Шот атауы',
                currentBalance: 'Ағымдағы қалдық',
                cardColor: 'Карта түсі',
                addAccountBtn: 'Шот қосу',
                newLoanTitle: 'Жаңа несие',
                loanName: 'Несие атауы (мысалы, "Ипотека")',
                loanTotalAmount: 'Несиенің жалпы сомасы',
                loanPaidAmount: 'Бұрыннан төленіп қойылған',
                loanMonthlyPayment: 'Ай сайынғы төлем',
                loanPaymentDate: 'Ай сайынғы төлем күні (1-31)',
                addLoanBtn: 'Несие қосу',
                newDebtTitle: 'Жаңа қарыз',
                debtName: 'Кімге немесе не үшін',
                debtСипаттамасы: 'Сипаттама (міндетті емес)',
                debtTotalAmount: 'Қарыз сомасы',
                debtPaymentDate: 'Өтеу күні',
                addDebtBtn: 'Қарыз қосу',
                debtDetailsTitle: 'Қарыз мәліметтері',
                totalLoanDebt: 'Несие қалдығы',
                totalSimpleDebt: 'Қарапайым қарыздар',
                totalCombinedDebt: 'Барлық қарыз',
                savingsDetailsTitle: 'Жинақ мәліметтері',
                totalSavings: 'Жинақ шоттары',
                totalDeposits: 'Депозиттер',
                totalCombinedSavings: 'Барлық жинақ',
                noSavingsAccountsNamed: '"Жинақ" түріндегі шоттар жоқ.',
                payDebtTitle: 'Қарызды төлеу',
                payFromAccount: 'Қай шоттан төлеуім керек?',
                payBtn: 'Төлем',
                newIncomeTitle: 'Жаңа табыс',
                newExpenseTitle: 'Жаңа шығыс',
                addIncomeBtn: 'Табыс қосу',
                addExpenseBtn: 'Шығын қосу',
                description: 'Сипаттама',
                descriptionPlaceholder: 'мысалы, "Жалақы"',
                amount: 'Сома',
                accountBelgisi: 'Шот',
                accountFromBelgisi: 'Шоттан',
                санаты: 'Санат',
                whichLoan: 'Қай несие төлеп жатырсыз?',
                whichSavingsAccount: 'Қай шотқа аударып жатырсыз?',
                noAccounts: 'Алдымен шот қосыңыз.',
                noPaymentAccounts: 'Төлем жасайтын шоттар жоқ ("Банк" немесе "Қолма-қол ақша" қажет).',
                noActiveLoans: 'Белсенді несиелер жоқ.',
                selectLoan: 'Несие таңдаңыз...',
                noSavingsAccounts: '"Жинақ" немесе "Депозит" шоттары жоқ.',
                selectAccount: 'Шот таңдаңыз...',
                transfer: 'Аударым',
                loanPayment: 'Несие төлемі',
                loanPaymentPrefix: 'Несие төлемі',
                other: 'Басқа',
                noClosedLoans: 'Сізде бар әлі жабылған несиелер жоқ',
            },
            toast: {
                accountAdded: 'Шот сәтті қосылды!',
                accountAddedError: 'Шот қосу қатесі.',
                loanAdded: 'Несие сәтті қосылды!',
                loanAddedError: 'Несие қосу қатесі.',
                debtAdded: 'Қарыз сәтті қосылды!',
                debtAddedError: 'Қарыз қосу қатесі.',
                fillFields: 'Барлық өрістерді толтырыңыз.',
                selectSavingsAccount: 'Жинақ шотын таңдаңыз.',
                sameAccountError: 'Сіз сол шотқа қаражат аудара алмайсыз.',
                incomeAdded: 'Табыс қосылды!',
                expenseAdded: 'Шығын қосылды!',
                transactionError: 'Транзакция қосу қатесі.',
                selectPaymentAccount: 'Төленетін шотты таңдаңыз.',
                deleteDebtSuccess: 'Қарыз сәтті төленді және жойылды!',
                deleteDebtError: 'Қарызды төлеу қатесі.',
                deleteAccountError: 'Шотты жою мүмкін емес, ол транзакциялары бар.',
                deleteAccountSuccess: 'Шот сәтті жойылды.',
                deleteAccountErrorDefault: 'Шотты жою кезінде қате.',
                deleteLoanError: 'Несие жойылмады, оның төлемдері бар.',
                deleteLoanSuccess: 'Несие сәтті жойылды.',
                deleteLoanErrorDefault: 'Несие жойылды.',
                
            },
            account: {
                typeBank: 'Банк шоты',
                typeDeposit: 'Депозит',
                typeSavings: 'Жинақ',
                typeCash: 'Қолма-қол ақша',
                typeAccount: 'Шот',
                balance: 'Баланс',
                cashName: 'Қолма-қол',
                savingsName: 'Жинақ'
            },
            loan: {
                monthsLeft: '{months} ай қалды',
                paidOff: 'Төленді',
                loan: 'Несие',
                paymentDayPrefix: 'Төлем',
                paymentDaySuffix: 'күні',
                paid: 'Төленді',
                total: 'Жалпы',
                monthlyPayment: 'Айлық төлем',
                statusTitle: 'Несие мәртебесі',
                status: {
                    paid: 'Осы айда төленді',
                    overdue: 'Мерзімі өтіп кетті!',
                    dueSoon: 'Төлем жақын ({days} күн)'
                }
            },
            debt: {
                returnBy: 'Қайтару',
                overdue: 'Мерзімі өтті',
                amount: 'Сома',
                markAsPaid: 'Төленді'
            },
            history: {
                noHistory: 'Транзакциялар әлі жоқ.',
                savingsAccount: 'Жинақ шоты',
                transferPrefix: 'Аударым',
                accountDeleted: 'Шот жойылды',
                debtPaymentPrefix: 'Қарызды төлеу'
            },
            budget: {
                monthlyIncome: 'Осы айдағы кіріс',
                needs50: '50% Қажеттілік',
                wants30: '30% Қалаулар',
                savings20: '20% Жинақ',
                expenses80: '80% Шығыстар',
                needs: 'Қажеттілік',
                wants: 'Қалаулар',
                savings: 'Жинақ'
            }
        }
    },


    // --- 9. ФУНКЦИИ ЛОКАЛИЗАЦИИ ---

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
        const strings = this.translations[lang] || this.translations['ru'];

        // --- ИСПОЛЬЗУЕМ ХЕЛПЕРЫ ---
        const safeSet = this.safeSet;
        const safeSetCached = this.safeSetCached;
        
        // Обновляем заголовок страницы
        document.title = this.getString('pageTitle');

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
            safeSet('#auth-container h2', 'textContent', this.getString('appName'));
            safeSet('#auth-tab-login', 'textContent', this.getString('auth.loginTab'));
            safeSet('#auth-tab-register', 'textContent', this.getString('auth.registerTab'));
            // Форма входа
            safeSet('label[for="login-email"]', 'textContent', this.getString('auth.email'));
            safeSet('#login-email', 'placeholder', this.getString('auth.emailPlaceholder'));
            safeSet('label[for="login-password"]', 'textContent', this.getString('auth.password'));
            safeSet('#auth-form-login button', 'textContent', this.getString('auth.loginButton'));
            // Форма регистрации
            safeSet('label[for="register-email"]', 'textContent', this.getString('auth.email'));
            safeSet('#register-email', 'placeholder', this.getString('auth.emailPlaceholder'));
            safeSet('label[for="register-password"]', 'textContent', this.getString('auth.password'));
            safeSet('#register-password', 'placeholder', this.getString('auth.passwordPlaceholder')); 
            safeSet('#auth-form-register button', 'textContent', this.getString('auth.registerButton'));
        }

        // --- Основное приложение ---
        // (Only translate if main app elements are cached)
        if(this.elements.appTitleHeader) {
            safeSetCached(this.elements.appTitleHeader, 'textContent', this.getString('appName'));
            safeSetCached(this.elements.totalBalanceLabel, 'textContent', this.getString('main.totalBalance'));
            safeSetCached(this.elements.savingsLabel, 'textContent', this.getString('main.savings'));
            safeSetCached(this.elements.totalLoanLabel, 'textContent', this.getString('main.totalDebt'));
            safeSetCached(this.elements.mainModelPlaceholder, 'textContent', this.getString('drawer.modelPlaceholderMain'));
            safeSetCached(this.elements.navIncomeLabel, 'textContent', this.getString('main.income'));
            safeSetCached(this.elements.navExpenseLabel, 'textContent', this.getString('main.expense'));
            safeSetCached(this.elements.accountsTitle, 'textContent', this.getString('main.accounts'));
            safeSet('#add-account-btn', 'textContent', `+ ${this.getString('main.newAccount')}`);
            safeSetCached(this.elements.loansTitle, 'textContent', this.getString('main.loans'));
            safeSet('#add-loan-btn', 'textContent', `+ ${this.getString('main.newLoan')}`);
            
            // НОВЫЕ СТРОКИ
            if (this.elements.debtsSlider) {
                safeSetCached(this.elements.debtsSlider.previousElementSibling.querySelector('h2'), 'textContent', this.getString('main.debts'));
            }
            safeSet('#add-debt-btn', 'textContent', `+ ${this.getString('main.newDebt')}`);
            safeSet('#show-debt-details-btn', 'textContent', this.getString('main.details'));
            safeSet('#show-savings-details-btn', 'textContent', this.getString('main.details')); 

            safeSetCached(this.elements.historyTitle, 'textContent', this.getString('main.historyToday'));
            safeSetCached(this.elements.showAllHistoryBtn, 'innerHTML', `${this.getString('main.showAll')} <i class="fas fa-arrow-right text-xs"></i>`);
            
            // Динамические плейсхолдеры
            safeSetCached(this.elements.noAccountsEl, 'textContent', this.getString('main.noAccounts'));
            safeSetCached(this.elements.noLoansEl, 'textContent', this.getString('main.noLoans'));
            safeSetCached(this.elements.noDebtsEl, 'textContent', this.getString('main.noDebts')); 
            safeSetCached(this.elements.noHistoryEl, 'textContent', this.getString('main.noHistoryToday'));

            // --- Модальные окна (статическая часть) ---
            safeSetCached(this.elements.historyModalTitle, 'textContent', this.getString('modal.allHistoryTitle'));
            
            // Модальное окно счета
            safeSet('#account-modal h3', 'textContent', this.getString('modal.newAccountTitle'));
            safeSet('label[for="account-type"]', 'textContent', this.getString('modal.accountType'));
            safeSet('#account-type option[value="bank"]', 'textContent', this.getString('account.typeBank'));
            safeSet('#account-type option[value="deposit"]', 'textContent', this.getString('account.typeDeposit'));
            safeSet('#account-type option[value="savings"]', 'textContent', this.getString('account.typeSavings'));
            safeSet('#account-type option[value="cash"]', 'textContent', this.getString('account.typeCash'));
            safeSet('#bank-logo-container label', 'textContent', this.getString('modal.selectBank'));
            safeSet('label[for="account-name"]', 'textContent', this.getString('modal.accountName'));
            safeSet('label[for="account-balance"]', 'textContent', this.getString('modal.currentBalance'));
            safeSet('label[for="color-picker"]', 'textContent', this.getString('modal.cardColor'));
            safeSet('#account-form button', 'textContent', this.getString('modal.addAccountBtn'));

            // Модальное окно кредита
            safeSet('#loan-modal h3', 'textContent', this.getString('modal.newLoanTitle'));
            safeSet('label[for="loan-name"]', 'textContent', this.getString('modal.loanName'));
            safeSet('label[for="loan-total-amount"]', 'textContent', this.getString('modal.loanTotalAmount'));
            safeSet('label[for="loan-paid-amount"]', 'textContent', this.getString('modal.loanPaidAmount'));
            safeSet('label[for="loan-monthly-payment"]', 'textContent', this.getString('modal.loanMonthlyPayment'));
            safeSet('label[for="loan-payment-date"]', 'textContent', this.getString('modal.loanPaymentDate'));
            safeSet('#loan-form button', 'textContent', this.getString('modal.addLoanBtn'));

            // Модальное окно долга (НОВОЕ)
            safeSet('#debt-modal-title', 'textContent', this.getString('modal.newDebtTitle'));
            safeSet('label[for="debt-name"]', 'textContent', this.getString('modal.debtName'));
            safeSet('label[for="debt-description"]', 'textContent', this.getString('modal.debtDescription'));
            safeSet('label[for="debt-total-amount"]', 'textContent', this.getString('modal.debtTotalAmount'));
            safeSet('label[for="debt-payment-date"]', 'textContent', this.getString('modal.debtPaymentDate'));
            safeSet('#debt-form button', 'textContent', this.getString('modal.addDebtBtn'));

            // Модальное окно деталей долга (НОВОЕ)
            safeSet('#debt-details-title', 'textContent', this.getString('modal.debtDetailsTitle'));
            safeSet('#details-loan-debt-label', 'textContent', this.getString('modal.totalLoanDebt'));
            safeSet('#details-simple-debt-label', 'textContent', this.getString('modal.totalSimpleDebt'));
            safeSet('#details-total-debt-label', 'textContent', this.getString('modal.totalCombinedDebt'));

            // Модальное окно деталей сбережений (НОВОЕ)
            safeSet('#savings-details-title', 'textContent', this.getString('modal.savingsDetailsTitle'));
            safeSet('#details-savings-label', 'textContent', this.getString('modal.totalSavings'));
            safeSet('#details-deposit-label', 'textContent', this.getString('modal.totalDeposits'));
            safeSet('#details-total-savings-label', 'textContent', this.getString('modal.totalCombinedSavings'));
            
            // Модальное окно оплаты долга (НОВОЕ)
            safeSet('#pay-debt-modal-title', 'textContent', this.getString('modal.payDebtTitle'));
            safeSet('label[for="pay-debt-account-select"]', 'textContent', this.getString('modal.payFromAccount'));
            safeSet('#submit-pay-debt-btn', 'textContent', this.getString('modal.payBtn'));

            // Модальное окно транзакции (статическая часть)
            safeSet('label[for="transaction-description"]', 'textContent', this.getString('modal.description'));
            safeSet('#transaction-description', 'placeholder', this.getString('modal.descriptionPlaceholder'));
            safeSet('label[for="transaction-amount"]', 'textContent', this.getString('modal.amount'));
            safeSet('label[for="transaction-category"]', 'textContent', this.getString('modal.category'));
            safeSet('label[for="transaction-loan-select"]', 'textContent', this.getString('modal.whichLoan'));
            safeSet('label[for="transaction-savings-select"]', 'textContent', this.getString('modal.whichSavingsAccount'));

            // --- Боковая панель (Drawer) ---
            safeSetCached(this.elements.drawerTitle, 'textContent', this.getString('drawer.title'));
            safeSetCached(this.elements.drawerBudgetLabel, 'textContent', this.getString('drawer.budgetModel'));
            safeSetCached(this.elements.drawerModelOptionNone, 'textContent', this.getString('drawer.modelOptionNone'));
            safeSetCached(this.elements.drawerModelOption503020, 'textContent', this.getString('drawer.modelOption503020'));
            safeSetCached(this.elements.drawerModelOption8020, 'textContent', this.getString('drawer.modelOption8020'));
            if (this.elements.drawerUserLabel) {
                this.elements.drawerUserLabel.childNodes[0].nodeValue = `${this.getString('drawer.loggedInAs')} `; // Обновляем текстовый узел
            }
            safeSetCached(this.elements.logoutButtonLabel, 'textContent', this.getString('drawer.logout'));
        }

        // --- Перерисовка динамического контента ---
        if (this.state.currentUserId) {
            this.renderAccounts();
            this.renderLoans();
            this.renderDebts(); 
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
};
