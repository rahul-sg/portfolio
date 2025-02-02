console.log("IT'S ALIVE!");

// Detect if the site is running on GitHub Pages
const isGithubPages = location.hostname === "rahul-sg.github.io";
const BASE_URL = isGithubPages ? "/portfolio" : ""; // No trailing slash

const pages = [
    { url: "/", title: "Home" },
    { url: "/projects/", title: "Projects" },
    { url: "/contact/", title: "Contact" },
    { url: "/resume/", title: "Resume" },
    { url: "https://github.com/rahul-sg", title: "GitHub" },
];

// Create navigation menu
const nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let fullPath = p.url;

    // Ensure BASE_URL is only prepended on GitHub Pages and not duplicated
    if (isGithubPages && !fullPath.startsWith(BASE_URL) && !fullPath.startsWith("http")) {
        fullPath = BASE_URL + fullPath;
    }

    const a = document.createElement("a");
    a.href = fullPath;
    a.textContent = p.title;

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

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
            console.log(response);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching or parsing JSON data:", error);
    }
}

export async function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

export function renderProjects(project, containerElement, headingLevel = "h2") {
    containerElement.innerHTML = "";

    project.forEach((item) => {
        const article = document.createElement("article");
        article.innerHTML = `
            <${headingLevel}>${item.title}</${headingLevel}>
            <img src="${item.image}" alt="${item.title}">
            <p>${item.description}</p>
            <a href="${item.link}" target="_blank">View Project</a>
        `;

        containerElement.appendChild(article);
    });
}
