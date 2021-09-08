// HTML Elements
const loanButton = document.getElementById("loanBtn");
const currentBalance = document.getElementById("currentBalance");
const loanDownPayment = document.getElementById("loanDownPay");
const loanAmount = document.getElementById("loanAmount");
const workAccountBalance = document.getElementById("workBalance");
const workButton = document.getElementById("workBtn");
const payButton = document.getElementById("payout");
const downPaymentButton = document.getElementById("payBtn");
const buyButton = document.getElementById("buyBtn");
const askPriceText = document.getElementById("askPrice");
const dropdownMenu = document.getElementById("change_chart");
const productShort = document.getElementById("productShort");
const productTitle = document.getElementById("productTitle");
const productDescription = document.getElementById("productDesc");
const productImage = document.getElementById("productImg");
const features = document.getElementById("featuresBox");

// Global Variables
let hasActiveLoan = false;
let products = [];
const baseURL = "https://noroff-komputer-store-api.herokuapp.com/"



/**
 * Fetches Data from The API and Generate Data which is used to populate the dropdown menu
 */
function getData() {
    return fetch(baseURL + "computers")
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Could not fetch the posts. 😭');
            }
            return response.json();
        })
}

/**
 * Method for Setting Up The Website With Information From API
 * Both In The Dropdown Menu But Also The Card and Center View.
 * @param {Array of Product} products 
 * @param {HTMLElement} parentEl 
 */
function setupPage(products = [], parentEl, featureEl) {
    // Fill Information in Center View
    if (products.length > 0) {
        fillPage(products[0], featureEl);
    }

    // Populate Dropdown Menu
    for (const product of products) {
        const element = document.createElement("option");
        element.value = product.id;
        element.appendChild(document.createTextNode(product.title))
        parentEl.appendChild(element);
    }
}

/**
 * Inserts / Updates Data Into Website like product information on the third card and 
 * in the center view
 * @param {Any / Product} product 
 */
function fillPage(product, parentEl) {
   
    // Removes HTML Elements from View / DOM
    // when user chooses a new item from the dropdown,
    // so both new and old elements don't appere together
    parentEl.innerHTML = '';

    // Update Elements
    productTitle.innerText = product.title;
    productDescription.innerText = product.description;
    productImage.src = baseURL + product.image;
    askPriceText.innerText = product.price;

    // Create Elements
    for (const spec of product.specs) {
        const element = document.createElement("p");
        element.textContent = spec;
        parentEl.appendChild(element);
    }
}



const handleLoanEvent = e => {
    if (hasActiveLoan === false) {
        const amountUserWant = prompt("What is your name?");
        console.log(amountUserWant)

        if (amountUserWant > currentBalance.innerText * 2) {
            alert("Asked Amout Is More Than Current Balance Times 2")
        } else {
            loanAmount.innerText = amountUserWant;
            loanDownPayment.style.display = 'flex';
            downPaymentButton.style.display = 'unset';
            currentBalance.innerText =  Number(currentBalance.innerText) + Number(amountUserWant);
            hasActiveLoan = true;
        }
    } else {
        alert("You can not have more than one active loans!")
    }
}



const handleWorkEvent = e => {
    workAccountBalance.innerText =  Number(workAccountBalance.innerText) + 100;
}



const handlePayoutEvent = e => {
    if (hasActiveLoan) {
        let toTransfere = Number(workAccountBalance.innerText);
        const toDownPayment = toTransfere * 0.1;
        loanAmount.innerText = Number(loanAmount.innerText) - toDownPayment;
        workAccountBalance.innerText = 0;
        currentBalance.innerText = Number(currentBalance.innerText) + (toTransfere - toDownPayment);

        // Some Logical Error Handling
        if (Number(loanAmount.innerText) <= 0) {
            currentBalance.innerText = Number(currentBalance.innerText) + (Number(loanAmount.innerText) * -1)
            loanAmount.innerText = 0;
            hasActiveLoan = false;
            loanDownPayment.style.display = 'none';
            downPaymentButton.style.display = 'none';
        }
    } else {
        currentBalance.innerText =  Number(currentBalance.innerText) + Number(workAccountBalance.innerText);
        workAccountBalance.innerText = 0;
    }
}



const handleDownpyamentEvent = e => {
    if (hasActiveLoan) {
        let toTransfere = Number(workAccountBalance.innerText);
        loanAmount.innerText = Number(loanAmount.innerText) - toTransfere;
        workAccountBalance.innerText = 0;

        if (Number(loanAmount.innerText) <= 0) {
            currentBalance.innerText = Number(currentBalance.innerText) + (Number(loanAmount.innerText) * -1);
            loanAmount.innerText = 0;
            hasActiveLoan = false;
            loanDownPayment.style.display = 'none';
            downPaymentButton.style.display = 'none';
        }
    } else {
        alert("No Active Loans Please use the Bank Button")
    }
}

const handleBuyEvent = e => {
    const amount = Number(currentBalance.innerText);
    const askPrice = Number(askPriceText.innerText);
    if (amount >= askPrice) {
        currentBalance.innerText = amount - askPrice;
        alert("You are now the proud owner of " + productTitle.innerText + "!")
    } else {
        alert("Not enough money")
    }
}



function doDropdown() {
    fillPage(products[dropdownMenu.value - 1], features)
}




// EventListeners
loanButton.addEventListener("click", handleLoanEvent);
workButton.addEventListener("click", handleWorkEvent);
payButton.addEventListener("click", handlePayoutEvent);
downPaymentButton.addEventListener("click", handleDownpyamentEvent);
buyButton.addEventListener("click", handleBuyEvent);
dropdownMenu.addEventListener("change", doDropdown)

/**
 * INIT Function that runs at startup, since it does performe only one task here, it can be replaced
 * with a direct call on getData insstead.
 */
async function init() {
    try {
        products = await getData();
        setupPage(products, dropdownMenu, features);
    } catch (error) {
        console.log("Error: " + error.message);
    }
}

// Invokation of INIT
init();

