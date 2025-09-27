const USERS_KEY = "users";
const SESSION_KEY = "sessionUser";
const EXPENSE_KEY = "expenses";
const NOTES_KEY = "notes";

// ✅ Check session against stored admin credentials
const adminCreds = JSON.parse(localStorage.getItem("adminCreds") || "null");
const adminUser = localStorage.getItem(SESSION_KEY);
if (!adminCreds || adminUser !== adminCreds.username) {
  window.location.href = "login.html";
}

const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
const expenses = JSON.parse(localStorage.getItem(EXPENSE_KEY)) || {};
const notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || {};

const adminBody = document.getElementById("adminBody");
const logoutBtn = document.getElementById("logoutBtn");

const modal = document.getElementById("userModal");
const modalTitle = document.getElementById("modalTitle");
const modalExpenses = document.getElementById("modalExpenses");
const modalNotes = document.getElementById("modalNotes");
const closeModal = document.getElementById("closeModal");
const exportUserBtn = document.getElementById("exportUserBtn");

let currentUser = null;

// Render all users
function renderUsers() {
  adminBody.innerHTML = "";
  users.forEach(user => {
    const totalExpenses = (expenses[user.username] || []).reduce((sum, e) => sum + e.amount, 0);
    const notesCount = (notes[user.username] || []).length;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${totalExpenses}</td>
      <td>${notesCount}</td>
      <td>
        <button onclick="viewUser('${user.username}')" class="btn primary">👁 View</button>
        <button onclick="resetPassword('${user.username}')" class="btn secondary">🔑 Reset</button>
      </td>
    `;
    adminBody.appendChild(tr);
  });
}

// Reset password
function resetPassword(username) {
  let newPwd = prompt("Enter new password for " + username);
  if (!newPwd) return;
  const idx = users.findIndex(u => u.username === username);
  if (idx >= 0) {
    users[idx].password = newPwd;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert("Password reset for " + username);
  }
}

// View user details
function viewUser(username) {
  modal.style.display = "flex";
  modalTitle.textContent = "User: " + username;
  currentUser = username;

  modalExpenses.innerHTML = "";
  (expenses[username] || []).forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${e.amount}</td><td>${e.category}</td><td>${e.date}</td><td>${e.note}</td>`;
    modalExpenses.appendChild(tr);
  });

  modalNotes.innerHTML = "";
  (notes[username] || []).forEach(n => {
    const li = document.createElement("li");
    li.textContent = `[${n.tag}] ${n.text}`;
    modalNotes.appendChild(li);
  });
}

// Export single user
function exportUserData() {
  if (!currentUser) return;
  let csv = "Type,Amount/Note,Category/Tag,Date,NoteText\n";

  (expenses[currentUser] || []).forEach(e => {
    csv += `Expense,${e.amount},${e.category},${e.date},${e.note}\n`;
  });

  (notes[currentUser] || []).forEach(n => {
    csv += `Note,,${n.tag},,${n.text}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentUser}-data.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Export all users
function exportData() {
  let csv = "Username,Type,Amount/Note,Category/Tag,Date,NoteText\n";
  users.forEach(user => {
    (expenses[user.username] || []).forEach(e => {
      csv += `${user.username},Expense,${e.amount},${e.category},${e.date},${e.note}\n`;
    });
    (notes[user.username] || []).forEach(n => {
      csv += `${user.username},Note,,${n.tag},,${n.text}\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "smart-expense-tracker-data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Events
exportUserBtn.addEventListener("click", exportUserData);
document.getElementById("exportBtn").addEventListener("click", exportData);
closeModal.addEventListener("click", () => modal.style.display = "none");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
});

renderUsers();

