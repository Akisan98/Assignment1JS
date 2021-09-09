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
        updatePage(products[0], featureEl);
    }

    // Populate Dropdown Menu
    for (const product of products) {

        // Create Option Element, Attatch ID, Give it a Title
        const element = document.createElement("option");
        element.value = product.id;
        element.appendChild(document.createTextNode(product.title))

        // Add Option Element to HTML
        parentEl.appendChild(element);
    }
}

/**
 * Inserts / Updates Data Into Website like product information on the third card and 
 * in the center view
 * @param {Any / Product} product 
 */
function updatePage(product, parentEl) {
    
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

// OnClickEventHandlers

/**
 * Method for Handling The Loan Application by User, 
 * If they don't have exsisting loan then they can get a 
 * loan up too double of current bank account balance. 
 * If they have a loan then it will reject by displaying a 
 * prompt saying that you can't have more then one loan.
 */
function applyLoan() {

    // Check Whether User Has Loan
    if (hasActiveLoan === false) {

        // How Much Loan Do User Want
        const amountUserWant = prompt("What is your name?");
        console.log(amountUserWant)

        // Reject if Asked Amount is more then Double Current Bank Account Balance with Prompt
        if (amountUserWant > currentBalance.innerText * 2) {
            alert("Asked Amout Is More Than Current Balance Times 2")
        } else { 
            
            // Grant Loan and Make Owned Amount and RePay button Visable to User
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

/**
 * Method for Handling The Payout of Employee's Salary to Their Bank Account.
 * If they have a loan 10% of their pay will be diverted towards down-payment, 
 * while rest is deposited into their bank account.
 */
 function salaryPayout() {
    
    // Check Whether User Has Loan
    if (hasActiveLoan) { 
        let toTransfere = Number(workAccountBalance.innerText);
        const toDownPayment = toTransfere * 0.1;

        // Transfere to Fund to Bank Account With 10% Towards the Loan
        loanAmount.innerText = Number(loanAmount.innerText) - toDownPayment;
        workAccountBalance.innerText = 0;
        currentBalance.innerText = Number(currentBalance.innerText) + (toTransfere - toDownPayment);

        // Make Sure We Don't Pay Too Much on the Loan
        paidToMuch(currentBalance);
    } else {

        // If Employee is Debt Free then Transfere the Funds and Reset the Work Account to 0.
        currentBalance.innerText =  Number(currentBalance.innerText) + Number(workAccountBalance.innerText);
        workAccountBalance.innerText = 0;
    }
}

/**
 * Method for Making Down Payment on Loan by Diverting 100% of the Salary Towards the Loan
 */
function makeDownPayment() {
    
    // Check Whether User Has Loan
    if (hasActiveLoan) {
        let toTransfere = Number(workAccountBalance.innerText);

        // Transfere the Fund Towards the Down-payment of Loan and reset Work Account 
        loanAmount.innerText = Number(loanAmount.innerText) - toTransfere;
        workAccountBalance.innerText = 0;

        // Make Sure We Don't Pay Too Much on the Loan
        paidToMuch(currentBalance);
    } else {
        alert("No Active Loans Please use the Bank Button")
    }
}

/**
 * Method to Facilitate the Process of Buying the Product
 * Reduces Bank Account With Price
 */
function buyProduct() {
    const amount = Number(currentBalance.innerText);
    const askPrice = Number(askPriceText.innerText);

    // Check If User can Afford
    if (amount >= askPrice) {
        currentBalance.innerText = amount - askPrice;
        alert("You are now the proud owner of " + productTitle.innerText + "!")
    } else {
        alert("Not enough money")
    }
}

// EventListeners - Trigger, Function They Call
loanButton.addEventListener("click", applyLoan);
payButton.addEventListener("click", salaryPayout);
downPaymentButton.addEventListener("click", makeDownPayment);
buyButton.addEventListener("click", buyProduct);

/**
 * Pressing The Work Button Will Increase the Counter / Work Account Balance by 100
 */
workButton.addEventListener("click", function () {
    workAccountBalance.innerText =  Number(workAccountBalance.innerText) + 100;
});

/**
 * Changing / Selecting Item in the Dropdown Menu Will Cause Website to Update with Corresponding Information
 */
dropdownMenu.addEventListener("change", function () {
    updatePage(products[dropdownMenu.value - 1], features) // Dropdown Value Start at 1
});

// Helper Function - DRY
/**
 * Checks Whether We Have Paid Too Much on The Loan and Bounces the excess money into the users bank account
 */
 function paidToMuch(bounceBackAccount) {
    if (Number(loanAmount.innerText) <= 0) {
        bounceBackAccount.innerText = Number(bounceBackAccount.innerText) + (Number(loanAmount.innerText) * -1);
        loanAmount.innerText = 0;
        hasActiveLoan = false;
        loanDownPayment.style.display = 'none';
        downPaymentButton.style.display = 'none';
    }
}

/**
 * INIT Function that runs at startup, since it does performe only one task here, it can be replaced
 * with a direct call on getData insstead.
 */
async function init() {
    try {
        products = await getData(); // API
        setupPage(products, dropdownMenu, features);
    } catch (error) {
        console.log("Error: " + error.message);
    }
}

// Invokation of INIT
init();

