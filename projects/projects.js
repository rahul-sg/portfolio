import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener("DOMContentLoaded", async () => {
    const projects = await fetchJSON('../lib/projects.json'); // Fetch projects
    const projectsContainer = document.querySelector('.projects');
    const projectCountElement = document.getElementById("project-count");

    console.log("Project count element:", projectCountElement); // Debugging check
    console.log("Fetched Projects:", projects.length); // Ensure projects are fetched correctly

    if (!projectCountElement) {
        console.error("Error: Could not find #project-count. Check if it's in the HTML.");
        return;
    }

    if (projects && Array.isArray(projects)) {
        renderProjects(projects, projectsContainer, 'h2'); // Render projects
        projectCountElement.textContent = projects.length; // ✅ Update count dynamically
    } else {
        console.error("Error: projects is not an array", projects);
    }
});
