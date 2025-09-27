const EXPENSE_KEY = "expenses";
const SESSION_KEY = "sessionUser";
const user = localStorage.getItem(SESSION_KEY);
if (!user) window.location.href = "login.html";

let expenses = JSON.parse(localStorage.getItem(EXPENSE_KEY)) || {};
if (!expenses[user]) expenses[user] = [];

// Elements
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const filterSelect = document.getElementById("filter");
const backBtn = document.getElementById("backBtn");
const logoutBtn = document.getElementById("logoutBtn");

let chart;

// Add Expense
expenseForm.addEventListener("submit", e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const note = document.getElementById("note").value;

  expenses[user].push({ amount, category, date, note });
  localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));

  expenseForm.reset();
  renderExpenses();
});

// Delete Expense
function deleteExpense(index) {
  expenses[user].splice(index, 1);
  localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
  renderExpenses();
}

// Filter Expenses
function getFilteredExpenses() {
  const filter = filterSelect.value;
  const all = expenses[user];

  if (filter === "thisMonth") {
    const now = new Date();
    return all.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  } else if (filter === "lastMonth") {
    const now = new Date();
    let lastMonth = now.getMonth() - 1;
    let year = now.getFullYear();
    if (lastMonth < 0) { lastMonth = 11; year--; }
    return all.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === lastMonth && d.getFullYear() === year;
    });
  }
  return all;
}

// Render Expenses + Chart
function renderExpenses() {
  const filtered = getFilteredExpenses();
  expenseList.innerHTML = "";
  filtered.forEach((e, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.amount}</td>
      <td>${e.category}</td>
      <td>${e.date}</td>
      <td>${e.note}</td>
      <td><button onclick="deleteExpense(${i})" class="btn danger">X</button></td>
    `;
    expenseList.appendChild(tr);
  });
  renderChart(filtered);
}

// Chart by Month
function renderChart(data) {
  const monthlyTotals = {};

  data.forEach(e => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    monthlyTotals[key] = (monthlyTotals[key] || 0) + e.amount;
  });

  const labels = Object.keys(monthlyTotals);
  const values = Object.values(monthlyTotals);

  if (chart) chart.destroy();
  const ctx = document.getElementById("monthChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Expenses per Month",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    }
  });
}

filterSelect.addEventListener("change", renderExpenses);
backBtn.addEventListener("click", () => window.location.href = "dashboard.html");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
});

renderExpenses();
