'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Mini-Bank APP

// Data
const account1 = {
    owner: 'Oshioke Salaki',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2022-09-28T12:01:20.894Z',
        '2022-10-30T09:48:16.867Z',
        '2022-11-01T06:04:23.907Z',
        '2022-11-05T14:18:46.235Z',
        '2022-11-20T13:15:33.035Z',
        '2022-11-21T13:15:33.035Z',
        '2022-11-22T13:15:33.035Z',
        '2022-11-23T13:15:33.035Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account2 = {
    owner: 'Jessica Davies',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2022-09-28T12:01:20.894Z',
        '2022-10-30T09:48:16.867Z',
        '2022-11-01T06:04:23.907Z',
        '2022-11-05T14:18:46.235Z',
        '2022-11-20T13:15:33.035Z',
        '2022-11-21T13:15:33.035Z',
        '2022-11-22T13:15:33.035Z',
        '2022-11-23T13:15:33.035Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account3 = {
    owner: 'Zita Edeko',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,

    movementsDates: [
        '2022-09-28T12:01:20.894Z',
        '2022-10-30T09:48:16.867Z',
        '2022-11-01T06:04:23.907Z',
        '2022-11-05T14:18:46.235Z',
        '2022-11-20T13:15:33.035Z',
        '2022-11-21T13:15:33.035Z',
        '2022-11-22T13:15:33.035Z',
        '2022-11-23T13:15:33.035Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account4 = {
    owner: 'Casey Jones',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,

    movementsDates: [
        '2022-09-28T12:01:20.894Z',
        '2022-10-30T09:48:16.867Z',
        '2022-11-01T06:04:23.907Z',
        '2022-11-05T14:18:46.235Z',
        '2022-11-20T13:15:33.035Z',
        '2022-11-21T13:15:33.035Z',
        '2022-11-22T13:15:33.035Z',
        '2022-11-23T13:15:33.035Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementsDate = (date, locale) => {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        // const day = `${date.getDate()}`.padStart(2, '0');
        // const month = `${date.getMonth() + 1}`.padStart(2, '0');
        // const year = date.getFullYear();

        // return `${day}/${month}/${year}`;
        return new Intl.DateTimeFormat(locale).format(date);
    }
};
const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ?
        acc.movements.slice().sort((a, b) => a - b) :
        acc.movements;
    movs.forEach(function(movement, index) {
        const type = movement > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[index]);
        const displayDate = formatMovementsDate(date, acc.locale);

        const formattedMov = new Intl.NumberFormat(acc.locale, {
            style: 'currency',
            currency: acc.currency,
        }).format(movement);

        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const clacDisplayBalance = function(account) {
    account.balance = account.movements.reduce(
        (acc, current) => acc + current,
        0
    );
    const formattedMov = new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(account.balance);

    labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = function(account) {
    const incomes = account.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    const out = account.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);

    //Rule for interest: 1.2 interest is given for each deposit
    const interest = account.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * account.interestRate) / 100)
        .filter(int => int > 1)
        .reduce((acc, int) => acc + int, 0);

    labelSumIn.textContent = new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(incomes);
    labelSumOut.textContent = new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(Math.abs(out));
    labelSumInterest.textContent = new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(interest);
};

const createUsernames = function(accounts) {
    accounts.forEach(account => {
        account.username = account.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsernames(accounts);

const updateUI = function(account) {
    //Display movements
    displayMovements(account);
    //Display balance
    clacDisplayBalance(account);
    //Display summary
    calcDisplaySummary(account);
};

const startLogOutTimer = () => {
    const tick = () => {
        //In each call, print the remaining time to UI
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;

        //When 0 seconds, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        }
        //decrease time by 1s
        time--;
    };
    //set time to 5 minutes
    let time = 300;
    //call the timer every second
    tick();
    const timer = setInterval(tick, 1000);

    return timer;
};

let currentAccount, timer;

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function(e) {
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );

    if (currentAccount && currentAccount.pin === inputLoginPin.value * 1) {
        //Display UI and message
        labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
        containerApp.style.opacity = 1;

        //curent date and time
        const now = new Date();
        // const day = `${now.getDate()}`.padStart(2, '0');
        // const month = `${now.getMonth() + 1}`.padStart(2, '0');
        // const year = now.getFullYear();
        // const hour = `${now.getHours()}`.padStart(2, '0');
        // const min = `${now.getMinutes()}`.padStart(2, '0');
        // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        };

        // const locale = navigator.language;
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);

        //clear input feild
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        inputLoginUsername.blur();

        if (timer) clearInterval(timer);
        timer = startLogOutTimer();

        updateUI(currentAccount);
    }
    e.preventDefault();
});

btnTransfer.addEventListener('click', e => {
    const amount = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(
        acc => acc.username === inputTransferTo.value
    );

    inputTransferAmount.value = '';
    inputTransferTo.value = '';

    if (
        receiverAccount &&
        amount > 0 &&
        amount <= currentAccount.balance &&
        receiverAccount.username !== currentAccount.username
    ) {
        receiverAccount.movements.push(amount);
        currentAccount.movements.push(amount * -1);

        //ADD TRANSFER DATE
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAccount.movementsDates.push(new Date().toISOString());
        //UPDATE UI
        updateUI(currentAccount);

        //reset timer
        clearInterval(timer);
        timer = startLogOutTimer();
    }

    e.preventDefault();
});

btnLoan.addEventListener('click', e => {
    const amount = Math.floor(inputLoanAmount.value);

    if (
        amount > 0 &&
        currentAccount.movements.some(deposit => deposit >= 0.1 * amount)
    ) {
        setTimeout(() => {
            currentAccount.movements.push(amount);

            //ADD LOAN DATE
            currentAccount.movementsDates.push(new Date().toISOString());

            //UPDATE UI
            updateUI(currentAccount);

            //reset timer
            clearInterval(timer);
            timer = startLogOutTimer();
        }, 2500);
    }

    inputLoanAmount.value = '';
    e.preventDefault();
});

btnClose.addEventListener('click', e => {
    if (
        inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            account => account.username === currentAccount.username
        );
        accounts.splice(index, 1);

        //Hide UI
        containerApp.style.opacity = 0;

        console.log(accounts);
    }

    inputCloseUsername.value = '';
    inputClosePin.value = '';
    e.preventDefault();
});

let sorted = false;
btnSort.addEventListener('click', e => {
    displayMovements(currentAccount, !sorted);

    sorted = !sorted;

    e.preventDefault();
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const overallBalance = accounts
    .map(account => account.movements)
    .flat()
    .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

movements.sort((a, b) => (a > b ? -1 : 1));

console.log(movements);

const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recommendedFood = dog.weight ** 0.75 * 28));

console.log(dogs);

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(
    `Sarah dog is ${
    sarahDog.curFood > sarahDog.recommendedFood
      ? 'eating too much'
      : 'eating to little'
  }`
);

const ownersEatTooMuch = dogs
    .filter(dog => dog.curFood > dog.recommendedFood)
    .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
    .filter(dog => dog.curFood < dog.recommendedFood)
    .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle.join(' and ').concat("'s dogs eat too little"));
console.log(ownersEatTooMuch.join(' and ').concat("'s dogs eat too much"));

const exact = dogs.some(dog => dog.curFood === dog.recommendedFood);

console.log(exact);

const checkEating = dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1;

const okay = dogs.some(dog => checkEating(dog));

console.log(okay);

const okayAmount = dogs.filter(dog => checkEating(dog));

const sortedDogs = dogs.slice();

console.log(okayAmount);

labelBalance.addEventListener('click', function() {
    [...document.querySelectorAll('.movements__row')].forEach(function(row, i) {
        if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    });
});

// setInterval(() => {
//     const now = new Date();
//     console.log(now);
// }, 1000);