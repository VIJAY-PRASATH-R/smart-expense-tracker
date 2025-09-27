const THEME_KEY = "theme";

// Apply saved theme
function applyTheme(theme) {
  document.body.className = ""; // clear
  if (theme) document.body.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}

applyTheme(localStorage.getItem(THEME_KEY));

// Dropdown
const themeSelect = document.getElementById("themeSelect");
if (themeSelect) {
  themeSelect.value = localStorage.getItem(THEME_KEY) || "";
  themeSelect.addEventListener("change", e => {
    applyTheme(e.target.value);
  });
}
