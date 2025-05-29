const body = document.querySelector('body');
const calculator = document.querySelector('.calculator');
const screen = document.querySelector('.screen');
const btnsLeftContainer = document.querySelector('.buttons-left');
const btnsRightContainer = document.querySelector('.buttons-right');

const displayBox = document.createElement('div');
displayBox.classList.add('display-box');
displayBox.classList.add('invisible');

const buttonsLeft = [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, '.', '=' ];
const buttonsRight = [ '&divide;', 'X', '+', '-' ];

let firstNumber = 0, secondNumber = 0;
let operator = '';

// create 4 button rows for the left side
for (let i = 0; i < 12; i+=3) {
    
    const buttonRow = document.createElement('div'); // create a row
    buttonRow.classList.add('button-row');
    if (i > 6) {buttonRow.classList.add('last-row')}; // if row is last row, give it unique class
    btnsLeftContainer.appendChild(buttonRow); // add row to button section

    const buttonSlice = buttonsLeft.slice(i, i+3); // populate button rows on left side (3 items at a time)
    
    buttonSlice.map((item) => { // for each 3 of the items
        const buttonLeft = document.createElement('div'); // create a div
        (item === '=') ?  buttonLeft.classList.add('operator') : buttonLeft.classList.add('number'); // add respective class
        buttonLeft.textContent = String(item); // populate w/text
        buttonRow.appendChild(buttonLeft); // add div to 'button-row'
    })

}

// populate button column on the right side
buttonsRight.map((item) => {
    const buttonRight = document.createElement('div');
    
    buttonRight.innerHTML = String(item);
    buttonRight.classList.add('operator');

    btnsRightContainer.appendChild(buttonRight);
})


// Click screen to copy text
screen.addEventListener('click', (e) => {
    const textContent = document.getElementById("screen").innerText; // get text
    navigator.clipboard.writeText(textContent);

    displayBox.classList.toggle('invisible');
    displayBox.textContent = 'Copied to clipboard.';
    body.appendChild(displayBox);

    e.stopPropagation();
    
    body.addEventListener('click', () => {
        displayBox.classList.toggle('invisible');
        console.log('activated body listener');
    }, { once:true });
});
