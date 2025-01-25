console.log("IT'S ALIVE!");

const pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "contact/", title: "Contact" },
    { url: "resume/", title: "Resume" },
    { url: "https://github.com/rahul-sg", title: "GitHub" },
];

// Create navigation menu
const nav = document.createElement("nav");
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains("home");

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;

    const a = document.createElement("a");
    a.href = url;
    a.textContent = title;

    a.classList.toggle(
        "current",
        a.host === location.host && a.pathname === location.pathname
    );

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
}

// Insert theme switcher
document.body.insertAdjacentHTML(
    "afterbegin",
    `
  <label class="color-scheme">
    Theme:
    <select id="theme-select">
      <option value="auto">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

function setColorScheme(theme) {
    if (theme === "auto") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
}


document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById("theme-select");
    const savedTheme = localStorage.getItem("theme") || "auto";

    themeSelect.value = savedTheme;
    setColorScheme(savedTheme);

    themeSelect.addEventListener("input", (event) => {
        setColorScheme(event.target.value);
    });
});
