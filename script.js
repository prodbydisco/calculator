const body = document.querySelector('body');
const calculator = document.querySelector('.calculator');
const screen = document.querySelector('.screen');
const btnsLeftContainer = document.querySelector('.buttons-left');
const btnsRightContainer = document.querySelector('.buttons-right');
const cancelButton = document.querySelector('#cancel');
const deleteButton = document.querySelector('#delete');
const decimalButton = document.querySelector('.decimal');

const displayBox = document.createElement('div');
displayBox.classList.add('display-box');
displayBox.classList.add('invisible');

const buttonsLeft = [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, '.', '=' ];
const buttonsRight = [ '&divide;', 'x', '+', '-' ];

let numbers = [];
let firstNumber = null, secondNumber = null;
let operator = '';

screen.textContent = '80085'; // placeholder text for screen
screen.style.color = 'rgba(0, 0, 0, 0.2)'; // lighter colour to indicate placeholder text


// create 4 button rows for the left side
for (let i = 0; i < 12; i+=3) {
    
    const buttonRow = document.createElement('div'); // create a row
    buttonRow.classList.add('button-row');
    if (i > 6) {buttonRow.classList.add('last-row')}; // if row is last row, give it unique class
    btnsLeftContainer.appendChild(buttonRow); // add row to button section

    const buttonSlice = buttonsLeft.slice(i, i+3); // populate button rows on left side (3 items at a time)
    
    buttonSlice.map((item) => { // for each 3 of the items
        const buttonLeft = document.createElement('div'); // create a div
        
        if (item === '=') {
            buttonLeft.classList.add('compute');
            buttonLeft.onclick = compute;
        } else if (item === '.') {
            buttonLeft.classList.add('decimal');
            buttonLeft.onclick = addDecimal;
        } else {
            buttonLeft.classList.add('number');
        }; // add respective class

        buttonLeft.textContent = String(item); // populate w/text
        buttonRow.appendChild(buttonLeft); // add div to 'button-row'
    })

};

// populate button column on the right side
buttonsRight.map((item) => {
    const buttonRight = document.createElement('div');
    
    buttonRight.innerHTML = String(item);
    buttonRight.classList.add('operator');

    btnsRightContainer.appendChild(buttonRight);
});


// Click screen to copy text and show/hide alert
screen.addEventListener('click', (e) => {
    const textContent = document.getElementById("screen").innerText; // get text
    
    // if screen is clear, return error message
    if (textContent === '') {
        displayBox.textContent = 'Error. No text to copy.';
        displayBox.style.backgroundColor = 'rgb(255, 75, 75)';
    } else {
        navigator.clipboard.writeText(textContent);
        displayBox.textContent = 'Copied to clipboard.';
        displayBox.style.backgroundColor = 'rgb(250, 250, 250)';
    };

    displayBox.classList.toggle('invisible');
    body.appendChild(displayBox);

    body.classList.toggle('cursor-pointer');

    e.stopPropagation(); // stop here
    
    body.addEventListener('click', () => {
        displayBox.classList.toggle('invisible');
        body.classList.toggle('cursor-pointer');
    }, { once:true });
});



const numberButtons = document.querySelectorAll('.number');
// add number to numbers array when clicked to form one number
numberButtons.forEach((button) => {
    
    button.addEventListener('click', () => {
        if (firstNumber != null && operator === '') {
            return;
        } else {
            numbers.push(Number(button.innerText));
            updateDisplay();
        }
        
    })
});


const operatorButtons = document.querySelectorAll('.operator');
// assign respective operators for operator buttons
operatorButtons.forEach((button) => {
    let buttonText = button.innerText;
    
    button.addEventListener('click', () => {
        
        if (firstNumber != null && numbers.length > 0) {
            secondNumber = numbers.join('');
            compute();
            operator = buttonText;
        } else if (numbers.length > 0 || firstNumber != null) {
            operator = buttonText;
            
            if (firstNumber == null) firstNumber = parseFloat(numbers.join(''));
            numbers = []; // reset numbers
            
            updateDisplay();
        } else {
            return;
        }

    })
});


function updateDisplay() {
    screen.style.color = 'rgba(0, 0, 0, 0.9)';

    if (firstNumber != null) {
        (operator === '') ? 
        screen.textContent = `${firstNumber}`:
        screen.textContent = `${firstNumber} ${operator} ${numbers.join('')}`;
    } else {
        screen.textContent = numbers.join(''); // update screen;
    };
};



function addDecimal() {
    if (firstNumber != null && operator === '') {
        return;
    };

    if (numbers.length < 1) {
        numbers.push('0');
        numbers.push('.');
    } else if (numbers.indexOf('.') >= 0) {
        return;
    } else {
        numbers.push('.');
    };

    updateDisplay();
};

function cancel() {
    screen.textContent = '';
    firstNumber = null;
    secondNumber = null;
    numbers = [];
    operator = '';
};
cancelButton.addEventListener('click', cancel);


function deleteNumber() {
    if (numbers.length < 1) { // if array is empty
        return; // do nothing
    } else {
        numbers.pop(); // remove last number
        updateDisplay();
    }
};
deleteButton.addEventListener('click', deleteNumber);


function compute() {
    let calculation;

    if (numbers.length < 1) { // dont compute if value is missing
        return;
    }

    secondNumber = parseFloat(numbers.join('')); // assign number to second number

    switch(operator.toLowerCase()) {
        case '+':
            calculation = firstNumber + secondNumber;
            break;
        case '-':
            calculation = firstNumber - secondNumber;
            break;
        case '÷':
            calculation = firstNumber / secondNumber;
            break;
        case 'x':
            calculation = firstNumber * secondNumber;
            break;
        default:
            return;
    }
    firstNumber = parseFloat(calculation); // assign result to first number
    // reset for next calculation
    secondNumber = null;
    numbers = []; // reset number array
    operator = '';

    updateDisplay();
};

