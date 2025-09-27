const NOTES_KEY = "notes";
const SESSION_KEY = "sessionUser";
const user = localStorage.getItem(SESSION_KEY);
if (!user) window.location.href = "login.html";

let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || {};
if (!notes[user]) notes[user] = [];

const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const tagInput = document.getElementById("tagInput");
const noteList = document.getElementById("noteList");
const clearBtn = document.getElementById("clearNotesBtn");
const backBtn = document.getElementById("backBtn");
const logoutBtn = document.getElementById("logoutBtn");

noteForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = noteInput.value.trim();
  const tag = tagInput.value.trim() || "General";
  if (!text) return;

  notes[user].push({ text, tag });
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

  noteInput.value = "";
  tagInput.value = "";
  renderNotes();
});

function renderNotes() {
  noteList.innerHTML = "";
  notes[user].forEach((note, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>[${note.tag}]</strong> ${note.text}
      </div>
      <div>
        <button onclick="editNote(${i})" class="btn secondary">✏ Edit</button>
        <button onclick="deleteNote(${i})" class="btn danger">❌</button>
      </div>
    `;
    noteList.appendChild(li);
  });
}

function deleteNote(i) {
  notes[user].splice(i, 1);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  renderNotes();
}

function editNote(i) {
  const note = notes[user][i];
  noteInput.value = note.text;
  tagInput.value = note.tag;
  deleteNote(i); // remove old one, will re-add on save
}

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all notes?")) {
    notes[user] = [];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    renderNotes();
  }
});

backBtn.addEventListener("click", () => window.location.href = "dashboard.html");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
});

renderNotes();
