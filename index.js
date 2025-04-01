// Select necessary elements
const transactionForm = document.getElementById("transaction-form");
const transactionName = document.getElementById("transaction-name");
const amount = document.getElementById("amount");
const transactionType = document.getElementById("transaction-type");
const totalIncomeDisplay = document.querySelector(".totalincome");
const totalExpenseDisplay = document.querySelector(".totalexpense");
const netBalanceDisplay = document.querySelector(".netbalance");
const transactionList = document.querySelector(".list");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Retrieve stored transactions from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Function to update the UI
function updateUI() {
    // Reset totals
    let totalIncome = 0;
    let totalExpense = 0;

    // Clear transaction list
    transactionList.innerHTML = "";

    // Loop through transactions
    transactions.forEach((transaction, index) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add(transaction.type === "income" ? "income" : "expense");

        transactionDiv.innerHTML = `
            ${transaction.name} - $${transaction.amount}
            <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
        `;

        transactionList.appendChild(transactionDiv);

        // Calculate totals
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    // Update total balance
    const netBalance = totalIncome - totalExpense;

    // Display updated values
    totalIncomeDisplay.innerHTML = `Total Income: $${totalIncome}`;
    totalExpenseDisplay.innerHTML = `Total Expenses: $${totalExpense}`;
    netBalanceDisplay.innerHTML = `Net Balance: $${netBalance}`;

    // Store transactions in localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Update the chart
    updateChart(totalIncome, totalExpense);
}

// Function to edit a transaction
function editTransaction(index) {
    const transaction = transactions[index];

    // Pre-fill the form with selected transaction details
    transactionName.value = transaction.name;
    amount.value = transaction.amount;
    transactionType.value = transaction.type;

    // Remove old transaction and update UI
    transactions.splice(index, 1);
    updateUI();
}

// Function to update the chart
function updateChart(totalIncome, totalExpense) {
    let incomeExpenseChart = Chart.getChart("incomeExpenseChart");

    if (!incomeExpenseChart) {
        const ctx = document.getElementById("incomeExpenseChart").getContext("2d");
        incomeExpenseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Income", "Expenses"],
                datasets: [{
                    data: [totalIncome, totalExpense],
                    backgroundColor: ["#4caf50", "#f44336"]
                }]
            }
        });
    } else {
        incomeExpenseChart.data.datasets[0].data = [totalIncome, totalExpense];
        incomeExpenseChart.update();
    }
}

// Function to add a new transaction
transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values from input
    const name = transactionName.value.trim();
    const amt = parseFloat(amount.value);
    const type = transactionType.value;

    // Validate input
    if (name === "" || isNaN(amt) || amt <= 0) {
        alert("Please enter a valid transaction name and amount.");
        return;
    }

    // Create transaction object
    const transaction = { name, amount: amt, type };

    // Add transaction to list
    transactions.push(transaction);

    // Update UI
    updateUI();

    // Clear form inputs
    transactionForm.reset();
});

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Initialize UI on page load
updateUI();
