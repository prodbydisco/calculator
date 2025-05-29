const body = document.querySelector('body');
const calculator = document.querySelector('.calculator');
const screen = document.querySelector('.screen');
const btnsLeftContainer = document.querySelector('.buttons-left');
const btnsRightContainer = document.querySelector('.buttons-right');
const cancelButton = document.querySelector('#cancel');
const deleteButton = document.querySelector('#delete');
const decimalButton = document.querySelector('.decimal');

// create and style an alert box
const displayBox = document.createElement('div');
displayBox.classList.add('display-box');
displayBox.classList.add('invisible');

const buttonsLeft = [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, '.', '=' ];
const buttonsRight = [ '&divide;', 'x', '+', '-' ];
let numbers = [];
let firstNumber = null, secondNumber = null;
let operator = '';

// placeholder text for screen
screen.textContent = '80085';
screen.style.color = 'rgba(0, 0, 0, 0.2)';


// create 4 rows for the left side & populate button values using buttonsLeft
for (let i = 0; i < 12; i+=3) {

    const buttonRow = document.createElement('div');
    const buttonSlice = buttonsLeft.slice(i, i+3); // populate 3 buttons for each row

    buttonRow.classList.add('button-row');
    if (i > 6) {buttonRow.classList.add('last-row')}; // give last row unique class for reversal
    btnsLeftContainer.appendChild(buttonRow);

    
    buttonSlice.map((item) => { // for each 3, create a button (div)
        const buttonLeft = document.createElement('div');
        
        // add respective classes and functions
        if (item === '=') {

            buttonLeft.classList.add('compute');
            buttonLeft.onclick = compute;

        } else if (item === '.') {

            buttonLeft.classList.add('decimal');
            buttonLeft.onclick = addDecimal;

        } else {
            buttonLeft.classList.add('number');
        };

        buttonLeft.textContent = String(item);
        buttonRow.appendChild(buttonLeft);
    })

};

// populate operator buttons
buttonsRight.map((item) => {

    const buttonRight = document.createElement('div');
    
    buttonRight.innerHTML = String(item);
    buttonRight.classList.add('operator');

    btnsRightContainer.appendChild(buttonRight);
});


// Click screen to copy text and show/hide alert
screen.addEventListener('click', (e) => {

    const textContent = document.getElementById("screen").innerText; // get text
    
    // return alert
    if (textContent === '') {

        displayBox.textContent = 'Error. No text to copy.';
        displayBox.style.backgroundColor = 'rgb(255, 75, 75)'; // indicate error

    } else {

        navigator.clipboard.writeText(textContent);
        displayBox.textContent = 'Copied to clipboard.';
        displayBox.style.backgroundColor = 'rgb(250, 250, 250)';

    };

    // show alert box
    displayBox.classList.toggle('invisible');
    body.appendChild(displayBox);

    body.classList.toggle('cursor-pointer'); // indicate that the body is clickable

    e.stopPropagation(); // stop here to prevent calling the body listener
    
    // close the alert by clicking anywhere (body)
    body.addEventListener('click', () => {

        displayBox.classList.toggle('invisible');
        body.classList.toggle('cursor-pointer');

    }, { once:true }); // unhook after alert is hidden
});




const numberButtons = document.querySelectorAll('.number'); // buttons '0' to '9'

numberButtons.forEach((button) => { // allow user to make one number by clicking numbers

    button.addEventListener('click', () => {
        
        // disable numbers if calculation is last operation (requires operator next) 
        if (firstNumber != null && operator === '') { 
            return; 
        } else {

            numbers.push(Number(button.innerText)); 
            updateDisplay();
        }  
    });
});



const operatorButtons = document.querySelectorAll('.operator'); // divide, multiply, plus, subtract

operatorButtons.forEach((button) => { // assign respective operators for operator buttons

    let buttonText = button.innerText;
    
    // assign operator to variable for compute()
    button.addEventListener('click', () => {
        
        if (firstNumber != null && numbers.length > 0) { // use an operator to calculate two numbers
            
            secondNumber = numbers.join('');
            compute();
            
            operator = buttonText;
            updateDisplay();

        } else if (numbers.length > 0 || firstNumber != null) { // change operator from existing choice
            
            operator = buttonText;
            
            // assign number to first choice and clear number
            if (firstNumber == null) firstNumber = parseFloat(numbers.join(''));
            numbers = [];
            
            updateDisplay();

        } else {
            return;
        }
    });
});



function updateDisplay() {

    screen.style.color = 'rgba(0, 0, 0, 0.9)'; // change from placeholder text colour

    if (firstNumber != null) { // update screen depending on what variables are populated

        (operator === '') ? 
        screen.textContent = `${firstNumber}`:
        screen.textContent = `${firstNumber} ${operator} ${numbers.join('')}`;

    } else {
        screen.textContent = numbers.join('');
    };
};


function addDecimal() {

    if (firstNumber != null && operator === '') {
        return;
    };

    if (numbers.length < 1) { // if no number is selected, add '0.'
        numbers.push('0');
        numbers.push('.');
    } else if (numbers.indexOf('.') >= 0) { // disable if number already has decimal
        return;
    } else {
        numbers.push('.'); // add decimal point
    };

    updateDisplay();
};


function cancel() { // clear everything

    screen.textContent = '';
    firstNumber = null;
    secondNumber = null;
    numbers = [];
    operator = '';
};

cancelButton.addEventListener('click', cancel);


function deleteNumber() { // delete one digit or decimal

    if (numbers.length < 1) { // disable if already empty
        return;

    } else {

        numbers.pop(); // delete last digit
        updateDisplay();
    }
};

deleteButton.addEventListener('click', deleteNumber);

document.addEventListener('keydown', function(event) { // delete numbers by pressing 'backspace' on the keyboard
    
    if (event.key === 'Backspace') {

        deleteNumber();
        event.preventDefault(); // prevent the browser from navigating back
    }
});


document.addEventListener('keydown', function(event) { // keyboard functionality

    event.preventDefault();

    if (event.key === '.') addDecimal();
    if (event.key === 'Delete') cancel();
    if (event.key === 'Enter') compute();
    
    // call buttons conditionally
    numberButtons.forEach((button) => {

        if (button.innerHTML === event.key) {
            button.click();
        }
    });

    operatorButtons.forEach((button) => {
        let buttonText = button.innerHTML;

        if (event.key === buttonText) {
            button.click();

        } else if (event.key === '/' && buttonText === '÷') {
            button.click();

        } else if (event.key === '*' && buttonText === 'x') {
            button.click();

        }
    });
});


function compute() { // calculate problem
    
    let calculation;

    if (numbers.length < 1) { // dont compute if value is missing
        return;
    };

    secondNumber = parseFloat(numbers.join('')); // assign number to second choice

    switch(operator.toLowerCase()) { // calculate
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
    };

    firstNumber = parseFloat(calculation); // assign result to first number for next calculation
    
    // reset other variables for next calculation
    secondNumber = null;
    numbers = []; 
    operator = '';

    updateDisplay();
};

