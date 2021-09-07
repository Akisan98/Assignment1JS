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


const baseURL = "https://noroff-komputer-store-api.herokuapp.com/"

let products = [];

function getData() {
    try {
        fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
            .then(response => response.json())
            .then(data => products = data)
            .then(products => addProductsToMenu(products))
    } catch (error) {
        
    }
}

const addProductsToMenu = (products) => {
    products.forEach(x => {
        addProductToMenu(x);
    });
}

const addProductToMenu = (product) => {
    const element = document.createElement("option");
    element.value = product.id;
    element.appendChild(document.createTextNode(product.title))
    dropdownMenu.appendChild(element);
    
    if (products[0] == product) {
        fillPage(product);
    }
}

const fillPage = (product) => {
    while (productShort.children.length > 3) {
        productShort.lastChild.remove();
    }


    productTitle.innerText = product.title;
    productDescription.innerText = product.description;
    productImage.src = baseURL + product.image;
    askPriceText.innerText = product.price


    product.specs.forEach(x => {
        const element = document.createElement("p");
        element.textContent = x + "\n";
        productShort.appendChild(element);
    })
    //productShort.appendChild();
}


function init() {
    getData();
}

init();


let hasActiveLoan = false;

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

loanButton.addEventListener("click", handleLoanEvent);


const handleWorkEvent = e => {
    workAccountBalance.innerText =  Number(workAccountBalance.innerText) + 100;
}

workButton.addEventListener("click", handleWorkEvent);


const handlePayoutEvent = e => {
    if (hasActiveLoan) {
        let toTransfere = Number(workAccountBalance.innerText);
        const toDownPayment = toTransfere * 0.1;
        loanAmount.innerText = Number(loanAmount.innerText) - toDownPayment;
        workAccountBalance.innerText = 0;
        currentBalance.innerText = Number(currentBalance.innerText) + (toTransfere - toDownPayment);

        // Some Logical Error Handling
        if (Number(loanAmount.innerText) < 0) {
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

payButton.addEventListener("click", handlePayoutEvent);


const handleDownpyamentEvent = e => {
    if (hasActiveLoan) {
        let toTransfere = Number(workAccountBalance.innerText);
        loanAmount.innerText = Number(loanAmount.innerText) - toTransfere;
        workAccountBalance.innerText = 0;

        if (Number(loanAmount.innerText) < 0) {
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
downPaymentButton.addEventListener("click", handleDownpyamentEvent);

const handleBuyEvent = e => {
    const amount = Number(currentBalance.innerText);
    const askPrice = Number(askPriceText.innerText);
    if (amount >= askPrice) {
        currentBalance.innerText = amount - askPrice;
        alert("You Are now the new Owner!")
    } else {
        alert("Not enough money")
    }
}
buyBtn.addEventListener("click", handleBuyEvent);

function doDropdown() {
    fillPage(products[dropdownMenu.value - 1])
}

dropdownMenu.addEventListener("change", doDropdown)

