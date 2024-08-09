// Global variables
let cart = [];
let favourites = [];

// Function to add items to the cart table
function addToTable() {
    const tableBody = document.querySelector('#cartTable tbody');
    const totalPriceElem = document.querySelector('#totalPrice');
    let totalPrice = 0;

    // Get all form inputs
    const formElements = document.querySelectorAll('#groceryForm input');
    
    // Loop through form elements to get selected items
    formElements.forEach(input => {
        if (input.type === 'number' && input.value > 0) {
            const itemName = input.dataset.itemName;
            const price = parseFloat(input.dataset.itemPrice);
            const quantity = parseFloat(input.value);
            const itemTotalPrice = price * quantity;

            // Add to cart
            cart.push({ itemName, quantity, price: itemTotalPrice });

            // Add to table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${itemName}</td>
                <td>${quantity}</td>
                <td>$${itemTotalPrice.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);

            totalPrice += itemTotalPrice;
        }
    });

    totalPriceElem.textContent = `$${totalPrice.toFixed(2)}`;
}

// Function to handle the buy now process
function saveOrder() {
    window.location.href = 'order-details.html';
}

// Function to save the current order as favourites
function addToFavourites() {
    localStorage.setItem('favourites', JSON.stringify(cart));
}

// Function to apply favourites to the form and table
function applyFavourites() {
    const storedFavourites = JSON.parse(localStorage.getItem('favourites'));
    if (storedFavourites) {
        // Populate the form and table with favourites
        cart = storedFavourites;
        const tableBody = document.querySelector('#cartTable tbody');
        tableBody.innerHTML = '';
        let totalPrice = 0;

        storedFavourites.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
            totalPrice += item.price;
        });

        document.querySelector('#totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Handling form submission on the new page (order-details.html)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#orderForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Validate and process order
        const isValid = validateForm(form);
        if (isValid) {
            const deliveryDate = calculateDeliveryDate();
            alert(`Thank you for your purchase! Your delivery date is ${deliveryDate}`);
            // Clear cart and favourites
            cart = [];
            localStorage.removeItem('favourites');
        }
    });
});

// Example validation function
function validateForm(form) {
    const fields = form.querySelectorAll('input, select');
    return Array.from(fields).every(field => field.value.trim() !== '');
}

// Example function to calculate a delivery date
function calculateDeliveryDate() {
    const today = new Date();
    today.setDate(today.getDate() + 2); // Example: 2 days from now
    return today.toDateString();
}
